"""Regenerate the 1-bit dither masks used by the plate.

Usage:  python3 scripts/make-dither.py [source] [--cell 3]
Needs:  pip install pillow numpy

Writes public/assets/plate-dither-lit.png  (opaque where the painting is LIGHT  -> used in dark mode)
       public/assets/plate-dither-ink.png  (opaque where the painting is DARK   -> used in light mode)
Both are white RGBA with the dither in the alpha channel; the page colours them with CSS mask-image.
Also writes public/assets/plate-original.webp, the undithered painting revealed on hover.
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parent.parent

BAYER8 = np.array([
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21],
]) / 64 + 1 / 128


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source", nargs="?", default=str(ROOT / "scripts/source/the-librarian.jpg"))
    ap.add_argument("--cell", type=int, default=3, help="size of one dither dot in output px")
    args = ap.parse_args()

    im = Image.open(args.source).convert("RGB")
    w, h = im.size
    g = ImageOps.autocontrast(im.convert("L"), cutoff=1)
    g = ImageEnhance.Contrast(g).enhance(1.25)
    small = g.resize((w // args.cell, h // args.cell), Image.LANCZOS)
    a = (np.asarray(small).astype(float) / 255) ** 0.9

    sh, sw = a.shape
    threshold = np.tile(BAYER8, (sh // 8 + 1, sw // 8 + 1))[:sh, :sw]
    lit = a > threshold

    out = ROOT / "public/assets"
    out.mkdir(parents=True, exist_ok=True)
    for name, mask in (("plate-dither-lit.png", lit), ("plate-dither-ink.png", ~lit)):
        rgba = np.zeros((sh, sw, 4), np.uint8)
        rgba[..., :3] = 255
        rgba[..., 3] = mask * 255
        Image.fromarray(rgba).resize((sw * args.cell, sh * args.cell), Image.NEAREST).save(out / name, optimize=True)
        print("wrote", out / name)

    im.save(out / "plate-original.webp", quality=80, method=6)
    print("wrote", out / "plate-original.webp")


if __name__ == "__main__":
    main()
