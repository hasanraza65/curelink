"""
Normalise the partner monograms for the "Official Distributors & Global
Partners" strip.

The five logos arrive in four different formats, at four different sizes, most
of them on a solid white rectangle. Dropped into a row as-is they read as five
mismatched boxes rather than one set, so each one is:

  1. keyed — the white surround is made transparent, so the logo sits on the
     page background instead of on its own white card;
  2. trimmed to its own ink, discarding the whitespace baked into the file;
  3. scaled to a common *optical* height rather than a common box height.

Step 3 is the one that matters. Fittydent is a chunky two-line wordmark,
Medicinalis a thin single-line one, Arber a square glyph. Scaling all three to
the same pixel height makes Medicinalis look tiny and Arber enormous. Each logo
therefore carries its own scale factor, tuned by eye against the others.

The Y&R file is an SVG; it is rasterised through headless Chrome because there
is no SVG library in this project's toolchain.

Run from the project root:  python tools/prepare-logos.py
"""
import os
import pathlib
import subprocess
import tempfile
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / '_originals' / 'logos'
OUT = ROOT / 'assets' / 'img' / 'partners'

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'

# target height of the tallest logo, at 2x for retina
BASE_H = 176

# stem -> (source file, optical scale relative to BASE_H)
LOGOS = [
    ('fittydent',   'logo_fittydent.png',                          0.86),
    ('medicinalis', 'medicinalis-gmbh-logo-png_seeklogo-508136.png', 0.62),
    ('y-and-r',     'y-r-logo-svg-vector.svg',                     0.92),
    ('unica-group', 'jofer-logo-empresas-unica-group.png',         0.78),
    ('arber-pharma', 'images.jfif',                                1.00),
]


def rasterise_svg(path, px=900):
    """Render an SVG to PNG via headless Chrome — no SVG library needed."""
    with tempfile.TemporaryDirectory() as td:
        page = pathlib.Path(td) / 'page.html'
        shot = pathlib.Path(td) / 'out.png'
        page.write_text(
            '<!doctype html><meta charset="utf-8">'
            '<style>html,body{margin:0;background:#fff}img{display:block;width:%dpx}</style>'
            '<img src="%s">' % (px, path.resolve().as_uri()),
            encoding='utf-8',
        )
        subprocess.run(
            [CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars',
             '--force-device-scale-factor=1', f'--window-size={px},{px}',
             '--default-background-color=FFFFFFFF',
             '--virtual-time-budget=6000', f'--screenshot={shot}', str(page)],
            capture_output=True, check=False,
        )
        return Image.open(shot).convert('RGB').copy()


def key_white(im, tol=14):
    """Flood-fill the white surround to transparent, from the border inwards."""
    im = im.convert('RGBA')
    rgb = np.asarray(im).astype(np.int16)[..., :3]
    h, w = rgb.shape[:2]
    close = (np.abs(rgb - 255).max(-1) <= tol)

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
    alpha = Image.fromarray(out[..., 3]).filter(ImageFilter.GaussianBlur(0.5))
    out[..., 3] = np.asarray(alpha)
    return Image.fromarray(out, 'RGBA')


def trim(im, thresh=8):
    a = np.asarray(im.convert('RGBA'))[..., 3]
    rows = np.where(a.max(1) > thresh)[0]
    cols = np.where(a.max(0) > thresh)[0]
    if not len(rows) or not len(cols):
        return im
    return im.crop((cols[0], rows[0], cols[-1] + 1, rows[-1] + 1))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    print('Partner monograms -> assets/img/partners/')
    for stem, name, scale in LOGOS:
        src = SRC / name
        if not src.exists():
            print(f'  MISSING: {name}')
            continue

        im = rasterise_svg(src) if src.suffix.lower() == '.svg' else Image.open(src)
        im = trim(key_white(im))

        target = max(round(BASE_H * scale), 1)
        w = max(round(im.width * target / im.height), 1)
        im = im.resize((w, target), Image.LANCZOS)

        png, wp = OUT / f'{stem}.png', OUT / f'{stem}.webp'
        im.save(png, optimize=True)
        im.save(wp, quality=92, method=6)
        print(f'  {stem:<14} {im.size[0]:>4}x{im.size[1]:<4} '
              f'png {os.path.getsize(png) / 1024:5.0f} KB  webp {os.path.getsize(wp) / 1024:5.0f} KB')


if __name__ == '__main__':
    main()
