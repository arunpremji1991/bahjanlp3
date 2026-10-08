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
    # ---- AI-generated illustrative images (Higgsfield · gpt_image_2_5, 8 Oct 2026) ----
    "ai-hero-tall":        ("ai-hero_hf-4712dc5c_mirrored.png", None, [600, 900, 1300]),
    "ai-hero-wide":        ("ai-hero_hf-4712dc5c_mirrored.png", (0, 560, 2048, 1925), [640, 960, 1400]),
    "ai-basket-prep":      ("ai-basket-prep_hf-90010611.png", None, [480, 800, 1200]),
    "ai-zakat-family":     ("ai-zakat-family_hf-1bf62ef5.png", None, [480, 800, 1200]),
    "ai-reflection":       ("ai-reflection_hf-d97666f6.png", None, [480, 800, 1200]),
    "ai-basket-delivery":  ("ai-basket-delivery_hf-1f3e032d.png", None, [400, 640, 960]),
    "ai-iftar-family":     ("ai-iftar-family_hf-5cc75d4e.png", None, [640, 1000, 1600]),
    "ai-meals":            ("ai-meals_hf-519a45de.png", None, [480, 800, 1200]),
    "ai-grandfather":      ("ai-grandfather_hf-f522c09a.png", None, [640, 1000, 1400]),
    "ai-community":        ("ai-community_hf-d8f5da95.png", None, [480, 800, 1200]),
    "ai-water":            ("ai-water_hf-9a7cdc36.png", None, [400, 640, 960]),
    "ai-final-wide":       ("ai-final-family_hf-d64ff173.png", (0, 460, 2048, 1612), [800, 1400]),
    "ai-final-tall":       ("ai-final-family_hf-d64ff173.png", None, [560, 900]),
    # Eid variant hero (Pexels 7249766)
    "eid-wide":       ("eid-dates_pexels-7249766.jpg", (0, 560, 1333, 1449), [640, 960, 1333]),
    "eid-tall":       ("eid-dates_pexels-7249766.jpg", (0, 250, 1333, 1916), [560, 840, 1066]),
    # Fak Korba page (Pexels 29810534 / 26775361 / 29702438) — anonymous silhouettes / hands only
    "fk-hero-tall":   ("fk-hero_pexels-29810534.jpg", (0, 100, 2000, 2600), [560, 840, 1200]),
    "fk-hero-wide":   ("fk-hero_pexels-29810534.jpg", (0, 600, 2000, 2480), [640, 960, 1400]),
    "fk-hands":       ("fk-hands_pexels-26775361.jpg", None, [640, 1000, 1400]),
    "fk-final-wide":  ("fk-final_pexels-29702438.jpg", (0, 880, 2000, 2005), [800, 1400]),
    "fk-final-tall":  ("fk-final_pexels-29702438.jpg", (0, 300, 2000, 2800), [560, 900]),
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
