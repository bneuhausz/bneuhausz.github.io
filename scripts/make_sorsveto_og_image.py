"""Generate the logo and Open Graph image for the Sorsvető web page.

Outputs (into public/images):
  sorsveto-logo.png   512x512   RGBA PNG  (page hero + apps index tile)
  sorsveto-og.png    1200x630   24-bit PNG  (og:image / twitter:image)

Both come from the app's own launcher icon (ciganykartya/assets/icon/icon_full.png,
itself GENERATED from tool/generate_icon.dart by tool/export_icon_test.dart) — so
the site can never drift from the launcher. The OG image sets that icon as a
rounded tile on a deeper plum field, with the wordmark, the three things the app
does, and the folk names of the deck beside it. Supersampled then downscaled
(LANCZOS) for crisp edges. Run from the website repo:
    py -3 scripts/make_sorsveto_og_image.py

The brand is spelled `Sorsvető` here: this page is Hungarian-facing (the
listing spells it `Sorsveto` for German and English readers — see the app's
store/play_listing.md and plan 4).
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT_DIR = os.path.join(REPO, "public", "images")

# The app repo is a sibling checkout of this one.
ICON_SRC = os.path.join(
    os.path.dirname(REPO), "ciganykartya", "assets", "icon", "icon_full.png"
)

# Palette — the deck's own (tool/generate_cards.dart `classic`, lib/src/core/app_theme.dart).
PLUM = (74, 30, 99)          # the card back's field, and the icon's
PLUM_DEEP = (46, 18, 62)     # OG background, darker so the icon reads as a tile
LINEN = (233, 224, 208)      # the app's ground — the wordmark
GOLD = (201, 162, 74)        # the deck's gold: the line that says what it does
LILAC = (184, 147, 204)      # the back's lattice — the folk names
DOMAIN = (150, 122, 165)     # muted plum for the domain footer


def load_font(size, bold=True):
    names = (
        ("segoeuib.ttf", "seguisb.ttf", "arialbd.ttf",
         "C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf",
         "DejaVuSans-Bold.ttf")
        if bold else
        ("segoeui.ttf", "arial.ttf",
         "C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf",
         "DejaVuSans.ttf")
    )
    for name in names:
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def rounded(img, radius):
    """The image masked to a rounded square (an app-tile silhouette)."""
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, img.size[0] - 1, img.size[1] - 1], radius=radius, fill=255
    )
    out = img.convert("RGBA")
    out.putalpha(mask)
    return out


icon = Image.open(ICON_SRC).convert("RGBA")

# ---------------------------------------------------------------------------
# Logo: 512x512, the launcher icon itself. Kept square — the page and the apps
# index round it off in CSS, exactly like the sibling app logos.
# ---------------------------------------------------------------------------
logo_path = os.path.join(OUT_DIR, "sorsveto-logo.png")
icon.resize((512, 512), Image.LANCZOS).save(logo_path, optimize=True)
print(f"wrote {logo_path}  512x512")

# ---------------------------------------------------------------------------
# Open Graph image: 1200x630, no alpha. Icon tile left, wordmark + lines right.
# ---------------------------------------------------------------------------
W, H, SS = 1200, 630, 3
w, h = W * SS, H * SS
og = Image.new("RGBA", (w, h), PLUM_DEEP + (255,))

# A soft plum glow behind the tile, so the flat background has some depth.
glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gx, gy, gr = w * 0.235, h * 0.49, w * 0.20
gd.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=PLUM + (140,))
og.alpha_composite(glow.filter(ImageFilter.GaussianBlur(SS * 60)))

# The icon as a rounded tile with a drop shadow and a thin gold edge.
tile_px = int(w * 0.285)
tile = rounded(icon.resize((tile_px, tile_px), Image.LANCZOS), int(tile_px * 0.22))
tx, ty = int(gx - tile_px / 2), int(gy - tile_px / 2)

shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
ImageDraw.Draw(shadow).rounded_rectangle(
    [tx, ty, tx + tile_px, ty + tile_px],
    radius=int(tile_px * 0.22), fill=(0, 0, 0, 115),
)
og.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(SS * 9)), (0, int(SS * 7)))
og.alpha_composite(tile, (tx, ty))

edge = Image.new("RGBA", (w, h), (0, 0, 0, 0))
ImageDraw.Draw(edge).rounded_rectangle(
    [tx, ty, tx + tile_px, ty + tile_px],
    radius=int(tile_px * 0.22), outline=GOLD + (120,), width=int(SS * 2),
)
og.alpha_composite(edge)

draw = ImageDraw.Draw(og)
text_x = w * 0.435
max_w = w - text_x - w * 0.05  # keep a right margin


def fitted(text, size, bold=True):
    """Auto-shrink until the line fits the text column."""
    px = int(size * SS)
    font = load_font(px, bold=bold)
    while draw.textlength(text, font=font) > max_w and px > 12 * SS:
        px -= 2 * SS
        font = load_font(px, bold=bold)
    return font


title = "Sorsvető"
what = "Napi lap · Terítések · Napló"          # what the app does, in gold
names = "cigánykártya · Wahrsagekarten"        # the deck, by its folk names

draw.text((text_x, h * 0.39), title, font=fitted(title, 104),
          fill=LINEN + (255,), anchor="lm")
draw.text((text_x, h * 0.565), what, font=fitted(what, 44),
          fill=GOLD + (255,), anchor="lm")
draw.text((text_x, h * 0.665), names, font=fitted(names, 34, bold=False),
          fill=LILAC + (255,), anchor="lm")

# Domain footer, bottom-right — reinforces the brand in feed previews.
domain_font = load_font(int(24 * SS), bold=False)
draw.text((w - w * 0.05, h - h * 0.08), "bneuhausz.dev",
          font=domain_font, fill=DOMAIN + (255,), anchor="rm")

og = og.convert("RGB").resize((W, H), Image.LANCZOS)  # RGB = no transparency
og_path = os.path.join(OUT_DIR, "sorsveto-og.png")
og.save(og_path, optimize=True)
print(f"wrote {og_path}  {W}x{H}")
