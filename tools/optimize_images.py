#!/usr/bin/env python3
"""Crop + export responsive AVIF / WebP / JPEG variants for the landing page.

Originals live in assets/img/src/ (git-ignored, keep a copy). Output goes to assets/img/opt/.
Run from the project root:  python3 tools/optimize_images.py
Requires Pillow with AVIF + WebP support.

Every crop box is (left, top, right, bottom) in source pixels; None = full frame.
Sources: see SOURCES.md (Pexels IDs are also in the source filenames).
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/img/src"
BAH = ROOT / "assets/img"          # official Bahjah images (already small)
OUT = ROOT / "assets/img/opt"
OUT.mkdir(parents=True, exist_ok=True)

# name: (source file, crop box, widths)
JOBS = {
    # Hero — hands breaking bread at iftar time (Pexels 7129737)
    "hero-wide":      ("hero-iftar_pexels-7129737.jpg", None, [640, 960, 1400]),
    "hero-tall":      ("hero-iftar_pexels-7129737.jpg", (640, 0, 1706, 1333), [560, 840, 1066]),
    # Eid variant hero (Pexels 7249766)
    "eid-wide":       ("eid-dates_pexels-7249766.jpg", (0, 560, 1333, 1449), [640, 960, 1333]),
    "eid-tall":       ("eid-dates_pexels-7249766.jpg", (0, 250, 1333, 1916), [560, 840, 1066]),
    # Zakat — dates + Mushaf page (Pexels 7427851)
    "zakat-tall":     ("zakat-dates-quran_pexels-7427851.jpg", (360, 0, 1426, 1333), [480, 800, 1066]),
    "zakat-wide":     ("zakat-dates-quran_pexels-7427851.jpg", None, [640, 960]),
    # Zakat calculator texture — mosque arch window only, person cropped out (Pexels 8164713)
    "arch":           ("mosque-arch_pexels-8164713.jpg", (470, 10, 1290, 660), [480, 800]),
    # Ramadan basket — iftar table (Pexels 20488448) + groceries (Pexels 8805171)
    "ramadan-wide":   ("ramadan-table_pexels-20488448.jpg", None, [640, 1000, 1600]),
    "groceries-tall": ("ramadan-groceries_pexels-8805171.jpg", (0, 280, 1333, 1946), [400, 640]),
    # Kaffarat — packing meals (Pexels 6995260)
    "kaffarat-wide":  ("kaffarat-meals_pexels-6995260.jpg", None, [640, 1000, 1400]),
    # Sadaqah — volunteers packing food (Pexels 6995201)
    "sadaqah-wide":   ("sadaqah-packing_pexels-6995201.jpg", None, [640, 1000, 1400]),
    # Water project tile (Pexels 6642422)
    "water-tall":     ("water_pexels-6642422.jpg", (0, 120, 1334, 1788), [400, 640]),
    # Final CTA background — shared table (Pexels 21856018)
    "final-wide":     ("sharing-table_pexels-21856018.jpg", (0, 280, 1600, 1180), [800, 1400]),
    "final-tall":     ("sharing-table_pexels-21856018.jpg", None, [560, 900]),
}

# Official Bahjah images (from Bahjah's Jood profile) — converted only, no crop.
BAHJAH = {
    "bahjah-kids": ("school-supplies.jpg", [345]),
    "bahjah-sponsorship": ("sponsorship.jpg", [300]),
    "bahjah-hardship": ("hardship.jpg", [345]),
    "bahjah-renovation": ("renovation.jpg", [345]),
}


def export(im, name, widths):
    for w in widths:
        w = min(w, im.width)
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS) if w != im.width else im
        r.save(OUT / f"{name}-{w}.avif", "AVIF", quality=52, speed=6)
        r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=74, method=6)
    # JPEG fallback at the middle size
    w = min(widths[len(widths) // 2], im.width)
    r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    r.save(OUT / f"{name}-{w}.jpg", "JPEG", quality=76, optimize=True, progressive=True)


for name, (src, box, widths) in JOBS.items():
    im = Image.open(SRC / src).convert("RGB")
    if box:
        im = im.crop(box)
    export(im, name, widths)
    print(f"{name:16s} {im.size}")

for name, (src, widths) in BAHJAH.items():
    im = Image.open(BAH / src).convert("RGB")
    export(im, name, widths)
    print(f"{name:16s} {im.size}")

# Open Graph image (1200x630): official Bahjah logo + official Bahjah photo on ivory.
og = Image.new("RGB", (1200, 630), (250, 246, 239))
logo = Image.open(BAH / "bahjah-logo.jpg").convert("RGB")
logo.thumbnail((440, 440))
og.paste(logo, (1200 - 80 - logo.width, (630 - logo.height) // 2))
kids = Image.open(BAH / "school-supplies.jpg").convert("RGB")
kids = kids.resize((round(kids.width * 630 / kids.height), 630), Image.LANCZOS)
og.paste(kids.crop((0, 0, min(kids.width, 620), 630)), (0, 0))
og.save(OUT / "og-image.jpg", "JPEG", quality=84, optimize=True)
print("og-image         (1200, 630)")
