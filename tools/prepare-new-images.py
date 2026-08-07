"""
Normalise the client-supplied AI imagery into the site's asset pipeline.

Two kinds of file come in:

  * model images  — lifestyle shots of a person holding the product, solid
                    background, portrait. These become `assets/img/products/model/`.
  * packshots     — replacement product renders. Some arrive with a solid white
                    background rather than an alpha channel, so the background is
                    keyed out by flood-filling inwards from the border. Keying by
                    colour alone would eat the white cartons themselves.

Everything is trimmed to content, capped at 1200px on the long edge and written
as WebP with a PNG/JPEG fallback, matching the rest of the site's images.

Sources live in _originals/supplied/ so they are never uploaded with the site.
Run from the project root:  python tools/prepare-new-images.py
"""
import os
import pathlib
from collections import deque

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
PROD = ROOT / 'assets' / 'img' / 'products'
MODEL_OUT = PROD / 'model'
SUPPLIED = ROOT / '_originals' / 'supplied'
BACKUP = ROOT / '_originals' / 'retouched'

MAX_EDGE = 1200
MODEL_EDGE = 1100

# slug-stem -> supplied model image
MODELS = {
    'fittydent-super-adhesive':    SUPPLIED / 'fittydent super a dhesive  modal image.png',
    'fittydent-cushions':          SUPPLIED / 'fittydent cushions modal image v3.png',
    'fittydent-cleansing-tablets': SUPPLIED / 'cleansing tablet modal image.png',
    'curedent-denture-brush':      SUPPLIED / 'denture brush modal image v2.png',
    'curedent-mouthwash':          SUPPLIED / 'curedent-mouthwash modal image.png',
    'b-kalsin-tablet':             SUPPLIED / 'b kalsin tablet modal image v2.png',
    'fasto-b-syrup':               SUPPLIED / 'fasto-b-syrup modal image.png',
    'relox-s-syrup':               SUPPLIED / 'relox s syrup modal image v2.png',
    # Supplied as WebP rather than PNG, and landscape rather than portrait —
    # .featsplit__media takes the image at its natural proportions, so no crop
    # is needed.
    'oraflogo-gel':                SUPPLIED / 'oraflogo gel modal image v2.webp',
    'the-smile-strong':            SUPPLIED / 'the smile strong modal image.png',
    'inkjet-printer':              SUPPLIED / 'inkjet modal image.png',
    'oraflogo-oral-solution':      SUPPLIED / 'oraflogo oral solution modal image.png',
}

# slug-stem -> supplied replacement packshot
PACKSHOTS = {
    'b-kalsin-tablet':    SUPPLIED / 'b-kalsin-tablet.png',
    'curedent-mouthwash': SUPPLIED / 'curedent-mouthwash.png',
    'fasto-b-syrup':      SUPPLIED / 'fasto-b-syrup.png',
    'relox-s-syrup':      SUPPLIED / 'relox-s-syrup.png',
    'the-smile-strong':   SUPPLIED / 'the smile strong.png',
    # Replacement render, supplied already cut out — keying is skipped.
    # (An entry may be a path, or (path, keying tolerance).)
    'oraflogo-oral-solution': SUPPLIED / 'oraflogo oral solution packshot.png',
    # Background (247-254) and the carton's white front face (246-255) overlap,
    # so the key relies on the flood fill staying inside the box outline rather
    # than on a brightness threshold. Verified at tol 8: face intact, drop
    # shadow removed.
    'a4-paper':           SUPPLIED / 'a4-paper packshot.png',
    # supplied already cut out, so keying is skipped automatically
    'inkjet-printer':     SUPPLIED / 'inkjet-img.png',
    'oraflogo-gel':           SUPPLIED / 'oraflogo-gel-pack.png',
    'curedent-denture-brush': SUPPLIED / 'curedent-denture-brush-pack.png',
}


def key_out_background(im, tol=8):
    """Turn a solid light background transparent.

    Flood-fills inward from the image border so only background connected to the
    edge is removed — white areas *inside* the product (which is mostly white
    card stock) are untouched.

    The tolerance has to stay tight: on these renders the background sits at 254
    and the carton's own white face at 243, so anything above ~10 leaks straight
    through the edge of the box and dissolves the front panel.
    """
    im = im.convert('RGBA')
    a = np.asarray(im).astype(np.int16)
    rgb = a[..., :3]
    h, w = rgb.shape[:2]

    # reference colour sampled from the four corners
    corners = np.concatenate([rgb[0, :8], rgb[-1, :8], rgb[:8, 0], rgb[:8, -1]])
    ref = corners.reshape(-1, 3).mean(0)

    close = (np.abs(rgb - ref).max(-1) <= tol)
    if not close[0, 0] and not close[-1, -1]:
        return im  # background is not a flat colour; leave it alone

    seen = np.zeros((h, w), bool)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if close[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if close[y, x] and not seen[y, x]:
                seen[y, x] = True
                q.append((y, x))

    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not seen[ny, nx] and close[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))

    out = np.asarray(im).copy()
    out[..., 3] = np.where(seen, 0, out[..., 3])

    # feather the cut by one pixel so the matte edge is not aliased
    alpha = Image.fromarray(out[..., 3])
    from PIL import ImageFilter
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))
    out[..., 3] = np.asarray(alpha)
    return Image.fromarray(out, 'RGBA')


def trim(im, margin=0.035, thresh=6):
    a = np.asarray(im.convert('RGBA'))[..., 3]
    rows = np.where(a.max(1) > thresh)[0]
    cols = np.where(a.max(0) > thresh)[0]
    if not len(rows) or not len(cols):
        return im
    t, b = rows[0], rows[-1] + 1
    l, r = cols[0], cols[-1] + 1
    pad = int(round(max(b - t, r - l) * margin))
    return im.crop((max(l - pad, 0), max(t - pad, 0),
                    min(r + pad, im.width), min(b + pad, im.height)))


def fit(im, edge):
    if max(im.size) <= edge:
        return im
    s = edge / max(im.size)
    return im.resize((max(round(im.width * s), 1), max(round(im.height * s), 1)), Image.LANCZOS)


def kb(p):
    return f'{os.path.getsize(p) / 1024:6.0f} KB'


def main():
    MODEL_OUT.mkdir(parents=True, exist_ok=True)
    BACKUP.mkdir(parents=True, exist_ok=True)

    print('Model images -> assets/img/products/model/')
    for stem, src in MODELS.items():
        if not src.exists():
            print(f'  MISSING: {src.name}')
            continue
        im = fit(Image.open(src).convert('RGB'), MODEL_EDGE)
        wp = MODEL_OUT / f'{stem}.webp'
        jp = MODEL_OUT / f'{stem}.jpg'
        im.save(wp, quality=80, method=6)
        im.save(jp, quality=82, optimize=True, progressive=True)
        print(f'  {stem:<30} {im.size[0]}x{im.size[1]}  webp {kb(wp)}  jpg {kb(jp)}')

    print('\nReplacement packshots -> assets/img/products/')
    for stem, entry in PACKSHOTS.items():
        src, tol = entry if isinstance(entry, tuple) else (entry, 8)
        if not src.exists():
            print(f'  MISSING: {src.name}')
            continue
        # keep the previous (retouched-from-photo) version so it can be restored
        for ext in ('png', 'webp'):
            cur = PROD / f'{stem}.{ext}'
            bak = BACKUP / f'{stem}.{ext}'
            if cur.exists() and not bak.exists():
                bak.write_bytes(cur.read_bytes())

        im = Image.open(src)
        if im.mode != 'RGBA' or np.asarray(im.convert('RGBA'))[..., 3].min() > 250:
            im = key_out_background(im, tol=tol)
        im = fit(trim(im.convert('RGBA')), MAX_EDGE)
        png = PROD / f'{stem}.png'
        wp = PROD / f'{stem}.webp'
        im.save(png, optimize=True)
        im.save(wp, quality=88, method=6)
        print(f'  {stem:<30} {im.size[0]}x{im.size[1]}  png {kb(png)}  webp {kb(wp)}')

    print('\nPrevious packshots preserved in _originals/retouched/')


if __name__ == '__main__':
    main()
