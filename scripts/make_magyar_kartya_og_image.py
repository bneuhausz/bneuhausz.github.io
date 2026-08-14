"""Generate the logo and Open Graph image for the Magyar kartya web page.

Outputs (into public/images):
  magyar-kartya-logo.png   512x512   RGBA PNG  (page hero + apps index tile)
  magyar-kartya-og.png    1200x630   24-bit PNG  (og:image / twitter:image)

Both come from the app's own launcher icon (magyar_kartya/assets/icon/icon_full.png,
itself GENERATED from the deck's suit symbols by tool/generate_icon.dart) — so the
site can never drift from the cards. The OG image sets that icon as a rounded tile
on a deeper felt-green field, with the wordmark and the three game names beside it.
Supersampled then downscaled (LANCZOS) for crisp edges. Run from the website repo:
    py -3 scripts/make_magyar_kartya_og_image.py
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT_DIR = os.path.join(REPO, "public", "images")

# The app repo is a sibling checkout of this one.
ICON_SRC = os.path.join(
    os.path.dirname(REPO), "magyar_kartya", "assets", "icon", "icon_full.png"
)

# Palette — sampled from the launcher icon.
FELT = (46, 107, 69)        # the icon's field, and the app's splash colour
FELT_DEEP = (27, 66, 43)    # OG background, darker so the icon reads as a tile
CREAM = (250, 243, 225)     # wordmark
GOLD = (224, 167, 54)       # the tok (bell) suit — accent + tile hairline
TAG = (206, 224, 210)       # tagline, a green-tinted cream
DOMAIN = (139, 178, 152)    # muted green for the domain footer


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
# index round it off in CSS, exactly like the two sibling app logos.
# ---------------------------------------------------------------------------
logo_path = os.path.join(OUT_DIR, "magyar-kartya-logo.png")
icon.resize((512, 512), Image.LANCZOS).save(logo_path, optimize=True)
print(f"wrote {logo_path}  512x512")

# ---------------------------------------------------------------------------
# Open Graph image: 1200x630, no alpha. Icon tile left, wordmark + games right.
# ---------------------------------------------------------------------------
W, H, SS = 1200, 630, 3
w, h = W * SS, H * SS
og = Image.new("RGBA", (w, h), FELT_DEEP + (255,))

# A soft felt glow behind the tile, so the flat background has some depth.
glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gx, gy, gr = w * 0.235, h * 0.49, w * 0.20
gd.ellipse([gx - gr, gy - gr, gx + gr, gy + gr], fill=FELT + (110,))
og.alpha_composite(glow.filter(ImageFilter.GaussianBlur(SS * 60)))

# The icon as a rounded tile with a drop shadow and a thin gold edge.
tile_px = int(w * 0.285)
tile = rounded(icon.resize((tile_px, tile_px), Image.LANCZOS), int(tile_px * 0.22))
tx, ty = int(gx - tile_px / 2), int(gy - tile_px / 2)

shadow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
ImageDraw.Draw(shadow).rounded_rectangle(
    [tx, ty, tx + tile_px, ty + tile_px],
    radius=int(tile_px * 0.22), fill=(0, 0, 0, 105),
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

# Title — auto-shrink to fit.
title = "Magyar kártya"
tsize = int(104 * SS)
title_font = load_font(tsize)
while draw.textlength(title, font=title_font) > max_w and tsize > 20 * SS:
    tsize -= 2 * SS
    title_font = load_font(tsize)

# The three games get their own line, in gold: they are the product.
games = "Zsírozás · Snapszer · Makaó"
gsize = int(42 * SS)
games_font = load_font(gsize)
while draw.textlength(games, font=games_font) > max_w and gsize > 12 * SS:
    gsize -= 1 * SS
    games_font = load_font(gsize)

tag = "Offline kártyajátékok a gép ellen"
ssize = int(34 * SS)
tag_font = load_font(ssize, bold=False)
while draw.textlength(tag, font=tag_font) > max_w and ssize > 12 * SS:
    ssize -= 1 * SS
    tag_font = load_font(ssize, bold=False)

draw.text((text_x, h * 0.39), title, font=title_font,
          fill=CREAM + (255,), anchor="lm")
draw.text((text_x, h * 0.565), games, font=games_font,
          fill=GOLD + (255,), anchor="lm")
draw.text((text_x, h * 0.665), tag, font=tag_font,
          fill=TAG + (255,), anchor="lm")

# Domain footer, bottom-right — reinforces the brand in feed previews.
domain_font = load_font(int(24 * SS), bold=False)
draw.text((w - w * 0.05, h - h * 0.08), "bneuhausz.dev",
          font=domain_font, fill=DOMAIN + (255,), anchor="rm")

og = og.convert("RGB").resize((W, H), Image.LANCZOS)  # RGB = no transparency
og_path = os.path.join(OUT_DIR, "magyar-kartya-og.png")
og.save(og_path, optimize=True)
print(f"wrote {og_path}  {W}x{H}")
