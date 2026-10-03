#!/usr/bin/env python3
"""Expand <pic .../> shortcodes in src/index.src.html into responsive <picture> markup → index.html.

Shortcode:
  <pic name="zakat-tall" alt="…" sizes="(min-width: 900px) 40vw, 90vw"
       class="…" eager credit="https://www.pexels.com/photo/…"
       desk="hero-tall" deskmedia="(min-width: 900px)" />

- Widths / intrinsic size are read from assets/img/opt/<name>-<w>.{avif,webp,jpg}.
- `credit` is written into a data-source attribute + HTML comment so every image keeps its source.
- `desk` adds art-directed <source>s for large screens.
Run from the project root:  python3 tools/build_html.py
"""
import hashlib
import re
import shlex
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OPT = ROOT / "assets/img/opt"


def variants(name):
    widths = sorted({int(p.stem.rsplit("-", 1)[1]) for p in OPT.glob(f"{name}-*.webp")})
    if not widths:
        raise SystemExit(f"no variants for {name}")
    jpg = sorted(OPT.glob(f"{name}-*.jpg"))[0]
    w, h = Image.open(jpg).size
    return widths, jpg.name, w, h


def srcset(name, widths, ext):
    return ", ".join(f"assets/img/opt/{name}-{w}.{ext} {w}w" for w in widths)


def attrs(tag):
    body = tag[len("<pic"):].rstrip("/>").strip()
    out = {}
    for tok in shlex.split(body):
        k, _, v = tok.partition("=")
        out[k] = v if _ else True
    return out


def render(m):
    a = attrs(m.group(0))
    name = a["name"]
    widths, jpg, w, h = variants(name)
    sizes = a.get("sizes", "100vw")
    eager = "eager" in a
    lines = []
    if a.get("credit"):
        lines.append(f"<!-- image source: {a['credit']} -->")
    lines.append("<picture>")
    if a.get("desk"):
        dn = a["desk"]
        dw, _, _, _ = variants(dn)
        media = a.get("deskmedia", "(min-width: 900px)")
        dsizes = a.get("desksizes", sizes)
        lines.append(f'  <source media="{media}" type="image/avif" srcset="{srcset(dn, dw, "avif")}" sizes="{dsizes}">')
        lines.append(f'  <source media="{media}" type="image/webp" srcset="{srcset(dn, dw, "webp")}" sizes="{dsizes}">')
    lines.append(f'  <source type="image/avif" srcset="{srcset(name, widths, "avif")}" sizes="{sizes}">')
    lines.append(f'  <source type="image/webp" srcset="{srcset(name, widths, "webp")}" sizes="{sizes}">')
    img = [f'src="assets/img/opt/{jpg}"', f'width="{w}"', f'height="{h}"', f'alt="{a.get("alt", "")}"']
    if a.get("alten"):
        img.append(f'data-alt-en="{a["alten"]}"')
    if a.get("class"):
        img.append(f'class="{a["class"]}"')
    img.append('loading="eager" fetchpriority="high"' if eager else 'loading="lazy"')
    img.append('decoding="async"')
    if a.get("credit"):
        img.append(f'data-source="{a["credit"]}"')
    lines.append(f'  <img {" ".join(img)}>')
    lines.append("</picture>")
    indent = re.match(r"[ \t]*", m.string[m.string.rfind("\n", 0, m.start()) + 1:]).group(0)
    return ("\n" + indent).join(lines)


def bust(m):
    """Append a content hash so CDNs / browsers never mix old and new CSS/JS."""
    attr, path = m.group(1), m.group(2)
    digest = hashlib.md5((ROOT / path).read_bytes()).hexdigest()[:10]
    return f'{attr}="{path}?v={digest}"'


PAGES = [
    # (source, output, path prefix to the site root)
    (ROOT / "src/index.src.html", ROOT / "index.html", ""),
    (ROOT / "src/fak-korba.src.html", ROOT / "fak-korba/index.html", "../"),
]

for src, out, prefix in PAGES:
    if not src.exists():
        continue
    html = src.read_text(encoding="utf-8")
    html = re.sub(r"<pic\b[^>]*/>", render, html)
    html = re.sub(r'(href|src)="(assets/(?:css|js)/[\w.-]+\.(?:css|js))"', bust, html)
    if prefix:
        # Root-relative asset paths → relative to the page's folder (also inside srcset lists).
        html = re.sub(r'(?<=[\s"(,])assets/', prefix + "assets/", html)
    banner = f"<!-- GENERATED from {src.relative_to(ROOT)} by tools/build_html.py — edit the source, not this file. -->\n"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html.replace("<!doctype html>\n", "<!doctype html>\n" + banner, 1), encoding="utf-8")
    print(f"wrote {out.relative_to(ROOT)} ({len(html):,} chars)")
