"""
Studio retouch pipeline for Cure Link product photography.

Design constraint: the ITEM must not change. No generative fill, no inpainting,
no geometry edits, no label reconstruction. Everything here is a global tonal /
colour / sharpening operation of the kind a retoucher applies in Capture One or
Lightroom, plus a synthetic contact shadow composited *underneath* the subject.
"""
import os, glob, math
import numpy as np
from PIL import Image, ImageFilter

import pathlib
HERE = pathlib.Path(__file__).resolve().parent.parent
SRC = str(HERE / 'assets' / 'img' / 'products')
OUT = SRC  # in place, originals kept in _raw
RAW = str(HERE / '_originals' / 'products')

# per-image treatment strength. phone-shot pharma packs need the full pass;
# the fittydent files are already clean manufacturer renders -> feather touch.
PROFILE = {
    'b-kalsin-tablet':            dict(wb=1.0, contrast=0.42, vib=0.30, sharp=0.85, shadow=0.20, hi=0.55, cast=0.85),
    'fasto-b-syrup':              dict(wb=1.0, contrast=0.40, vib=0.28, sharp=0.85, shadow=0.19, hi=0.40, cast=0.80),
    'relox-s-syrup':              dict(wb=1.0, contrast=0.40, vib=0.26, sharp=0.85, shadow=0.19, hi=0.40, cast=0.95),
    'oraflogo-gel':               dict(wb=0.7, contrast=0.30, vib=0.22, sharp=0.70, shadow=0.17, hi=0.30, cast=0.45),
    'curedent-denture-brush':     dict(wb=0.6, contrast=0.28, vib=0.20, sharp=0.65, shadow=0.16, hi=0.25, cast=0.40),
    'curedent-mouthwash':         dict(wb=0.6, contrast=0.28, vib=0.20, sharp=0.65, shadow=0.16, hi=0.25, cast=0.40),
    'fittydent-super-adhesive':   dict(wb=0.0, contrast=0.14, vib=0.10, sharp=0.38, shadow=0.15, hi=0.15, cast=0.0),
    'fittydent-cushions':         dict(wb=0.0, contrast=0.14, vib=0.10, sharp=0.38, shadow=0.15, hi=0.15, cast=0.0),
    'fittydent-cleansing-tablets':dict(wb=0.0, contrast=0.14, vib=0.10, sharp=0.38, shadow=0.15, hi=0.15, cast=0.0),
}
TARGET = 1200


def edge_extend(rgb, a, iters=14):
    """Bleed subject colour into the transparent margin so no black halo is
    dragged into the edges by resampling."""
    out = rgb.copy()
    mask = a > 0.02
    for _ in range(iters):
        if mask.all():
            break
        m = mask.astype(np.float32)
        num = np.zeros_like(out)
        den = np.zeros_like(m)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (1, -1), (-1, 1), (-1, -1)):
            num += np.roll(np.roll(out * m[..., None], dy, 0), dx, 1)
            den += np.roll(np.roll(m, dy, 0), dx, 1)
        grow = (~mask) & (den > 0)
        safe = np.where(den > 0, den, 1)[..., None]
        out = np.where(grow[..., None], num / safe, out)
        mask = mask | grow
    return out


def white_balance(rgb, a, amount):
    """Neutralise the flash colour cast by mapping the brightest subject tones
    (the white card stock) back to neutral. Gain is clamped so brand colours
    cannot drift."""
    if amount <= 0:
        return rgb
    sel = a > 0.85
    if sel.sum() < 500:
        return rgb
    px = rgb[sel]
    luma = px @ np.array([0.2126, 0.7152, 0.0722])
    hi = px[luma >= np.percentile(luma, 88)]
    if len(hi) < 100:
        return rgb
    mean = hi.mean(0)
    target = mean.mean()
    gain = np.clip(target / np.maximum(mean, 1e-4), 0.86, 1.16)
    gain = 1.0 + (gain - 1.0) * amount
    return np.clip(rgb * gain, 0, 1)


def levels(rgb, a, contrast, hi_recover):
    """Set black/white point on the subject, roll off blown flash highlights,
    then apply a gentle filmic S-curve."""
    sel = a > 0.85
    if sel.sum() < 500:
        return rgb
    luma = (rgb @ np.array([0.2126, 0.7152, 0.0722]))[sel]
    lo = np.percentile(luma, 0.4)
    hi = np.percentile(luma, 99.6)
    if hi - lo > 0.05:
        rgb = np.clip((rgb - lo) / (hi - lo), 0, 1)

    # highlight rolloff: compress the top end so specular hotspots regain shape
    if hi_recover > 0:
        l = rgb @ np.array([0.2126, 0.7152, 0.0722])
        knee = 0.72
        over = np.clip((l - knee) / (1 - knee), 0, 1)
        comp = 1.0 - hi_recover * 0.30 * (over ** 1.6)
        rgb = np.clip(rgb * comp[..., None], 0, 1)
        rgb = np.clip((rgb - rgb.min()) / max(rgb.max() - rgb.min(), 1e-6), 0, 1)

    # S-curve around mid grey
    if contrast > 0:
        k = 1.0 + contrast * 1.9
        rgb = np.clip(1.0 / (1.0 + np.exp(-k * (rgb - 0.5))), 0, 1)
        f0 = 1.0 / (1.0 + math.exp(k * 0.5))
        f1 = 1.0 / (1.0 + math.exp(-k * 0.5))
        rgb = np.clip((rgb - f0) / (f1 - f0), 0, 1)
    return rgb


def vibrance(rgb, amount):
    """Saturation weighted toward already-dull pixels, so saturated brand reds
    and greens are not pushed into clipping."""
    if amount <= 0:
        return rgb
    l = (rgb @ np.array([0.2126, 0.7152, 0.0722]))[..., None]
    sat = np.abs(rgb - l).max(-1, keepdims=True)
    w = 1.0 - np.clip(sat * 1.8, 0, 1)
    return np.clip(l + (rgb - l) * (1.0 + amount * w), 0, 1)


def gauss(arr, r):
    im = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), np.float32) / 255.0


def sharpen(rgb, amount):
    """Two-scale unsharp mask: a fine pass for edge acuity and a broad pass for
    micro-contrast / 'pop'. Mirrors a capture-sharpening + clarity stack."""
    if amount <= 0:
        return rgb
    fine = np.clip(rgb + (rgb - gauss(rgb, 1.1)) * (1.15 * amount), 0, 1)
    broad = np.clip(fine + (fine - gauss(fine, 5.5)) * (0.42 * amount), 0, 1)
    return broad


def neutral_cast(rgb, a, amount):
    """Pull the colour cast out of near-neutral surfaces (white card stock)
    while leaving saturated brand colour untouched. Weighting by inverse
    saturation is what keeps the green Relox wordmark and red Cure Link dot
    exactly as photographed."""
    if amount <= 0:
        return rgb
    sel = a > 0.85
    if sel.sum() < 500:
        return rgb
    l = rgb @ np.array([0.2126, 0.7152, 0.0722])
    sat = rgb.max(-1) - rgb.min(-1)
    # sample mid/high-key, low-saturation pixels: the card stock
    ref = sel & (sat < 0.16) & (l > 0.42)
    if ref.sum() < 300:
        return rgb
    mean = rgb[ref].mean(0)
    gain = np.clip(mean.mean() / np.maximum(mean, 1e-4), 0.82, 1.20)
    gain = 1.0 + (gain - 1.0) * amount
    corrected = np.clip(rgb * gain, 0, 1)
    # blend per-pixel: full correction on neutrals, none on saturated colour
    w = np.clip(1.0 - sat * 3.2, 0, 1)[..., None]
    return np.clip(rgb * (1 - w) + corrected * w, 0, 1)


def contact_shadow(size, alpha, strength):
    """Synthetic soft shadow beneath the subject footprint — composited under
    the product, never over it. Kept low-opacity and tightly bound to the
    footprint so it reads as a softbox contact shadow, not a drop shadow."""
    w, h = size
    ys = np.where(alpha.max(1) > 0.35)[0]
    xs = np.where(alpha.max(0) > 0.35)[0]
    if len(ys) == 0 or len(xs) == 0:
        return None
    bottom, left, right = ys[-1], xs[0], xs[-1]
    cx = (left + right) / 2.0
    half = max((right - left) / 2.0, 1.0)

    # elliptical pool anchored on the footprint, slightly narrower than the base
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ry = max(h * 0.028, 5.0)
    rx = half * 0.94
    d = ((xx - cx) / rx) ** 2 + ((yy - (bottom - ry * 0.35)) / ry) ** 2
    sh = np.exp(-d * 1.9).astype(np.float32)

    # modulate by the actual base profile so wide/narrow bases ground correctly
    foot = alpha[max(bottom - int(h * 0.05), 0): bottom + 1, :]
    if foot.size:
        prof = foot.max(0)
        prof = np.asarray(Image.fromarray((prof[None, :] * 255).astype(np.uint8))
                          .filter(ImageFilter.GaussianBlur(w * 0.02)), np.float32)[0] / 255.0
        sh *= np.clip(prof + 0.25, 0, 1)[None, :]

    sh = np.asarray(
        Image.fromarray((np.clip(sh, 0, 1) * 255).astype(np.uint8))
        .filter(ImageFilter.GaussianBlur(max(w, h) * 0.016)), np.float32) / 255.0
    return np.clip(sh * strength, 0, 1)


def trim_to_content(img, margin=0.035, thresh=6):
    """Crop an RGBA image to its visible content plus a proportional margin."""
    a = np.asarray(img)[..., 3]
    rows = np.where(a.max(1) > thresh)[0]
    cols = np.where(a.max(0) > thresh)[0]
    if len(rows) == 0 or len(cols) == 0:
        return img
    top, bottom = rows[0], rows[-1] + 1
    left, right = cols[0], cols[-1] + 1
    pad = int(round(max(bottom - top, right - left) * margin))
    top = max(top - pad, 0)
    left = max(left - pad, 0)
    bottom = min(bottom + pad, img.height)
    right = min(right + pad, img.width)
    return img.crop((left, top, right, bottom))


def process(path):
    name = os.path.splitext(os.path.basename(path))[0]
    p = PROFILE.get(name)
    if not p:
        print(f'  skip (no profile): {name}')
        return
    # always work from the pristine original, never a previous output
    raw_path = os.path.join(RAW, name + '.png')
    src_path = raw_path if os.path.exists(raw_path) else path
    if not os.path.exists(raw_path):
        os.makedirs(RAW, exist_ok=True)
        Image.open(path).save(raw_path)

    im = Image.open(src_path).convert('RGBA')
    arr = np.asarray(im, np.float32) / 255.0
    rgb, a = arr[..., :3], arr[..., 3]

    rgb = edge_extend(rgb, a)
    rgb = white_balance(rgb, a, p['wb'])
    rgb = neutral_cast(rgb, a, p['cast'])
    rgb = levels(rgb, a, p['contrast'], p['hi'])
    rgb = vibrance(rgb, p['vib'])

    # upscale before sharpening so the sharpen lands at output resolution
    h, w = a.shape
    scale = TARGET / max(w, h)
    if abs(scale - 1.0) > 0.01:
        nw, nh = max(int(round(w * scale)), 1), max(int(round(h * scale)), 1)
        rgb = np.asarray(Image.fromarray((rgb * 255).astype(np.uint8))
                         .resize((nw, nh), Image.LANCZOS), np.float32) / 255.0
        a = np.asarray(Image.fromarray((a * 255).astype(np.uint8))
                       .resize((nw, nh), Image.LANCZOS), np.float32) / 255.0
        h, w = nh, nw

    rgb = sharpen(rgb, p['sharp'])

    # tighten the matte: remove the semi-transparent grey fringe left by the
    # original background removal
    a = np.clip((a - 0.10) / 0.82, 0, 1)

    # pad so the shadow has room to fall
    pad_b = int(h * 0.07)
    pad_x = int(w * 0.03)
    W, H = w + pad_x * 2, h + pad_b + int(h * 0.02)
    canvas_rgb = np.ones((H, W, 3), np.float32)
    canvas_a = np.zeros((H, W), np.float32)
    oy, ox = int(h * 0.02), pad_x
    canvas_rgb[oy:oy + h, ox:ox + w] = rgb
    canvas_a[oy:oy + h, ox:ox + w] = a

    sh = contact_shadow((W, H), canvas_a, p['shadow'])
    if sh is not None:
        # shadow darkens a neutral layer beneath the subject
        sh_rgb = np.full((H, W, 3), 0.16, np.float32)
        out_a = canvas_a + sh * (1 - canvas_a)
        out_a = np.clip(out_a, 0, 1)
        num = canvas_rgb * canvas_a[..., None] + sh_rgb * (sh * (1 - canvas_a))[..., None]
        out_rgb = num / np.maximum(out_a, 1e-5)[..., None]
    else:
        out_rgb, out_a = canvas_rgb, canvas_a

    final = np.dstack([np.clip(out_rgb, 0, 1), np.clip(out_a, 0, 1)])
    img = Image.fromarray((final * 255).astype(np.uint8), 'RGBA')

    # Trim to content.
    # The source files carry a lot of empty margin, and every card renders the
    # image with `object-fit: contain`, so that margin was being reproduced as
    # dead space inside the card — the product ended up floating small in a
    # large frame. Cropping to the alpha bounding box plus one consistent margin
    # makes every product fill its frame to the same degree.
    img = trim_to_content(img, margin=0.035)

    os.makedirs(RAW, exist_ok=True)
    if not os.path.exists(os.path.join(RAW, name + '.png')):
        Image.open(path).save(os.path.join(RAW, name + '.png'))

    img.save(os.path.join(OUT, name + '.png'), optimize=True)
    img.save(os.path.join(OUT, name + '.webp'), quality=88, method=6)
    print(f'  {name:30s} -> {img.size}  png={os.path.getsize(os.path.join(OUT,name+".png"))//1024}KB '
          f'webp={os.path.getsize(os.path.join(OUT,name+".webp"))//1024}KB')


if __name__ == '__main__':
    print('Retouching product photography...')
    for f in sorted(glob.glob(os.path.join(SRC, '*.png'))):
        if os.sep + '_raw' + os.sep in f:
            continue
        process(f)
    print('done.')
