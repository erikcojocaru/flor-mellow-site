#!/usr/bin/env python3
"""Regenerate the product list for Google (schema.org ItemList in catalog.html).

The list is rebuilt from the product cards that are visible in catalog.html
(cards inside <!-- HIDDEN ... --> comments are skipped). Each entry gets the
product name, its main photo (data-img) and its link (catalog.html#slug).

Run it after adding, hiding, renaming a product or changing its main photo:

    python tools/update-seo.py           # update catalog.html
    python tools/update-seo.py --check   # only report; exit code 1 if out of date
"""
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

SITE = "https://www.flormellow.ro"
ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "catalog.html"
LD_RE = re.compile(r'(<script type="application/ld\+json">)(.*?)(</script>)', re.S)


def opening_tags(text, start_marker='<article class="product-card'):
    """Yield complete <article ...> opening tags, respecting quoted attribute values."""
    pos = 0
    while True:
        i = text.find(start_marker, pos)
        if i < 0:
            return
        quote_char = None
        for j in range(i, len(text)):
            c = text[j]
            if quote_char:
                if c == quote_char:
                    quote_char = None
            elif c in "\"'":
                quote_char = c
            elif c == ">":
                yield text[i:j + 1]
                pos = j + 1
                break
        else:
            return


def attr(tag, name):
    m = re.search(r'\s' + re.escape(name) + r'="([^"]*)"', tag)
    return html.unescape(m.group(1)) if m else None


def visible_products(page):
    page = re.sub(r"<!--.*?-->", "", page, flags=re.S)
    products, seen = [], set()
    for tag in opening_tags(page):
        slug = attr(tag, "data-slug") or attr(tag, "id")
        title, img = attr(tag, "data-title"), attr(tag, "data-img")
        if not (slug and title and img):
            sys.exit(f"Card without data-slug/data-title/data-img: {tag[:120]}...")
        if slug in seen:
            sys.exit(f"Duplicate slug: {slug}")
        seen.add(slug)
        if not (ROOT / img).is_file():
            print(f"WARNING: main photo not found for {title}: {img}")
        products.append((slug, title, img))
    return products


def build_item_list(products):
    return {
        "@type": "ItemList",
        "numberOfItems": len(products),
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i,
                "url": f"{SITE}/catalog.html#{slug}",
                "name": title,
                "image": f"{SITE}/{quote(img, safe='/')}",
            }
            for i, (slug, title, img) in enumerate(products, start=1)
        ],
    }


def main():
    check_only = "--check" in sys.argv
    page = CATALOG.read_bytes().decode("utf-8")
    products = visible_products(page)

    for m in LD_RE.finditer(page):
        data = json.loads(m.group(2))
        nodes = data if isinstance(data, list) else [data]
        target = next((n for n in nodes if n.get("@type") == "CollectionPage"), None)
        if target is None:
            continue
        old_names = [e.get("name") for e in target.get("mainEntity", {}).get("itemListElement", [])]
        target["mainEntity"] = build_item_list(products)
        new_json = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
        updated = page[:m.start(2)] + new_json + page[m.end(2):]
        break
    else:
        sys.exit("No CollectionPage JSON-LD block found in catalog.html")

    new_names = [p[1] for p in products]
    added = [n for n in new_names if n not in old_names]
    removed = [n for n in old_names if n not in new_names]
    print(f"Visible products: {len(products)} (list had {len(old_names)})")
    if added:
        print("  added:   " + ", ".join(added))
    if removed:
        print("  removed: " + ", ".join(removed))

    if updated == page:
        print("catalog.html is already up to date.")
        return
    if check_only:
        print("catalog.html is OUT OF DATE - run: python tools/update-seo.py")
        sys.exit(1)
    CATALOG.write_bytes(updated.encode("utf-8"))
    print("catalog.html updated.")


if __name__ == "__main__":
    main()
