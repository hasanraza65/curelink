"""
Prepare the hero slider backgrounds.

The supplied files are 1.5–1.9 MB ultra-wide PNGs. As hero backgrounds they are
the largest thing on the homepage and the LCP element, so they are resized,
converted to WebP with a JPEG fallback, and emitted at two widths so phones do
not download a 2000px-wide banner.

Sources live in assets/img/slider/ and are moved to _originals/slider/ so the
originals stay with the project without shipping in the deploy folder.

Run from the project root:  python tools/prepare-slider.py
"""
import os
import pathlib
import shutil

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC_DIR = ROOT / 'assets' / 'img' / 'slider'
KEEP = ROOT / '_originals' / 'slider'
OUT = SRC_DIR

# order is the order they appear in the slider
SLIDES = [
    ('df5f4fca-3864-40ea-8540-b680fa51dcc3.png', 'slide-1'),
    ('slide-2-oraflogo-gel.png', 'slide-2'),
    ('slide-3-fittydent-pack.png', 'slide-3'),
]

WIDTHS = [(2000, ''), (1100, '@sm')]


def kb(p):
    return f'{os.path.getsize(p) / 1024:6.0f} KB'


def main():
    KEEP.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)

    for src_name, stem in SLIDES:
        src = SRC_DIR / src_name
        kept = KEEP / src_name
        if not src.exists() and kept.exists():
            src = kept                      # already moved on a previous run
        if not src.exists():
            print(f'  MISSING: {src_name}')
            continue

        im = Image.open(src).convert('RGB')
        print(f'{stem}  from {im.size[0]}x{im.size[1]}')

        for width, suffix in WIDTHS:
            w = min(width, im.width)
            h = round(im.height * w / im.width)
            r = im.resize((w, h), Image.LANCZOS)
            wp = OUT / f'{stem}{suffix}.webp'
            jp = OUT / f'{stem}{suffix}.jpg'
            r.save(wp, quality=78, method=6)
            r.save(jp, quality=80, optimize=True, progressive=True)
            print(f'   {w}x{h}   webp {kb(wp)}   jpg {kb(jp)}')

        if src != kept and not kept.exists():
            shutil.move(str(src), str(kept))

    # clear any leftover source PNGs from the deploy folder
    for f in SRC_DIR.glob('*.png'):
        shutil.move(str(f), str(KEEP / f.name))

    print('\n  originals kept in _originals/slider/')


if __name__ == '__main__':
    main()
