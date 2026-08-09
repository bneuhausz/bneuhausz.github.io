"""Generate the Open Graph / social-share image for the SzoKincs web page.

Output:
  szokincs-og.png  1200x630  24-bit PNG  (og:image / twitter:image)

Reuses the app icon's design language (store/play_icon_512.png in the app repo):
warm cream field, a 2x2 grid of rounded teal tiles with one gold circle,
"SzóKincs" wordmark + Hungarian tagline. Supersampled then downscaled (LANCZOS)
for crisp edges. Run from the website repo:
    py -3 scripts/make_szokincs_og_image.py
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(os.path.dirname(HERE), "public", "images")
OUT_NAME = "szokincs-og.png"

# Palette — sampled from the app icon.
CREAM = (250, 243, 225)
TEAL = (46, 113, 129)        # top-left tile
TEAL_LIGHT = (63, 132, 148)  # bottom-left tile
TEAL_DARK = (31, 78, 92)     # bottom-right tile, also the title color
GOLD = (240, 184, 67)        # top-right circle
TAG = (46, 113, 129)         # tagline
DOMAIN = (110, 143, 152)     # muted teal for the domain footer


def draw_mark(base, cx, cy, mark_w, ss):
    """The 2x2 icon mark centered at (cx, cy), mark_w wide. Mirrors the icon:
    three rounded squares (teal shades) and a gold circle top-right."""
    m = mark_w
    tile = m * 0.44          # tile edge
    gap = m - 2 * tile       # spacing between the two columns/rows
    r = tile * 0.30          # corner radius

    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    ld = ImageDraw.Draw(layer)

    def cell(col, row):
        x0 = cx - m / 2 + col * (tile + gap)
        y0 = cy - m / 2 + row * (tile + gap)
        return [x0, y0, x0 + tile, y0 + tile]

    for (col, row, color, circle) in (
        (0, 0, TEAL, False),
        (1, 0, GOLD, True),
        (0, 1, TEAL_LIGHT, False),
        (1, 1, TEAL_DARK, False),
    ):
        box = cell(col, row)
        if circle:
            sd.ellipse(box, fill=(0, 0, 0, 70))
            ld.ellipse(box, fill=color + (255,))
        else:
            sd.rounded_rectangle(box, radius=r, fill=(0, 0, 0, 70))
            ld.rounded_rectangle(box, radius=r, fill=color + (255,))

    shadow = shadow.filter(ImageFilter.GaussianBlur(ss * 5))
    base.alpha_composite(shadow, (0, int(ss * 5)))
    base.alpha_composite(layer)


def load_font(size):
    for name in ("segoeuib.ttf", "seguisb.ttf", "arialbd.ttf",
                 "C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf",
                 "DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


def load_font_regular(size):
    for name in ("segoeui.ttf", "arial.ttf",
                 "C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf",
                 "DejaVuSans.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    return ImageFont.load_default()


# ---------------------------------------------------------------------------
# Open Graph image: 1200x630, no alpha. Icon mark left, wordmark + tagline right.
# ---------------------------------------------------------------------------
W, H, SS = 1200, 630, 3
w, h = W * SS, H * SS
og = Image.new("RGBA", (w, h), CREAM + (255,))

draw_mark(og, w * 0.235, h * 0.49, w * 0.245, SS)

draw = ImageDraw.Draw(og)
text_x = w * 0.415
max_w = w - text_x - w * 0.05  # keep a right margin

# Title — auto-shrink to fit.
title = "SzóKincs"
tsize = int(120 * SS)
title_font = load_font(tsize)
while draw.textlength(title, font=title_font) > max_w and tsize > 20:
    tsize -= 2 * SS
    title_font = load_font(tsize)

# Tagline, two balanced lines.
tag1, tag2 = "Magyar szókereső játék —", "SZ, GY és DZS egy mezőben"
gsize = int(38 * SS)
tag_font = load_font_regular(gsize)
while (max(draw.textlength(tag1, font=tag_font),
           draw.textlength(tag2, font=tag_font)) > max_w and gsize > 12):
    gsize -= 1 * SS
    tag_font = load_font_regular(gsize)

draw.text((text_x, h * 0.40), title, font=title_font,
          fill=TEAL_DARK + (255,), anchor="lm")
draw.text((text_x, h * 0.575), tag1, font=tag_font,
          fill=TAG + (255,), anchor="lm")
draw.text((text_x, h * 0.665), tag2, font=tag_font,
          fill=TAG + (255,), anchor="lm")

# Domain footer, bottom-right — reinforces the brand in feed previews.
domain_font = load_font_regular(int(24 * SS))
draw.text((w - w * 0.05, h - h * 0.08), "bneuhausz.dev",
          font=domain_font, fill=DOMAIN + (255,), anchor="rm")

og = og.convert("RGB").resize((W, H), Image.LANCZOS)  # RGB = no transparency
out_path = os.path.join(OUT_DIR, OUT_NAME)
og.save(out_path, optimize=True)
print(f"wrote {out_path}  {W}x{H}")
