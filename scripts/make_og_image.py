"""Generate the Open Graph / social-share image for the Lift Recorder web page.

Output:
  lift-recorder-og.png  1200x630  24-bit PNG  (og:image / twitter:image)

Reuses the exact launcher-icon design language (see assets/icon/make_icon.py and
make_release_assets.py): deep-purple diagonal gradient, white barbell, red record
dot, "Lift Recorder" wordmark + tagline. Supersampled then downscaled (LANCZOS)
for crisp edges.

It writes straight into the website repo's public/images so the page can consume
the result with no manual copy. The same script is kept in both repos and works
from either: run from this app repo it targets the sibling bneuhausz.github.io;
run from a copy inside the website repo it targets that repo's own public/images.
If neither is found it falls back to writing next to the script. Re-run any time:
    python plans/release/assets/make_og_image.py   # from the app repo
    python scripts/make_og_image.py                # from the website repo
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_NAME = "lift-recorder-og.png"


def resolve_out_dir(start):
    """Return the website repo's public/images, wherever this script lives.

    Works whether the script sits in the app repo (writes to the sibling
    bneuhausz.github.io) or is copied into the website repo itself (writes to its
    own public/images). Falls back to the script's own folder.
    """
    # Copied into the website repo: walk up to a repo root that has public/images.
    d = start
    for _ in range(6):
        cand = os.path.join(d, "public", "images")
        if os.path.isdir(cand):
            return cand
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    # Living in the app repo: sibling website repo next to the app repo root.
    sibling = os.path.abspath(
        os.path.join(start, "..", "..", "..", "..",
                     "bneuhausz.github.io", "public", "images"))
    if os.path.isdir(sibling):
        return sibling
    return start


OUT_DIR = resolve_out_dir(HERE)

# Brand palette — identical to assets/icon/make_icon.py
C0 = (126, 87, 194)   # deepPurple 300  #7E57C2  top-left
C1 = (69, 39, 160)    # deepPurple 800  #4527A0  bottom-right
WHITE = (255, 255, 255)
REC = (255, 59, 48)    # bright red record dot
TAG = (235, 230, 250)  # soft lavender-white for the tagline
DOMAIN = (206, 196, 232)  # muted lavender for the domain footer


def lerp(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient(width, height):
    """Diagonal gradient, computed small then upscaled (it's smooth)."""
    g = 256
    small = Image.new("RGB", (g, g))
    px = small.load()
    for y in range(g):
        for x in range(g):
            t = (x + y) / (2 * (g - 1))
            px[x, y] = lerp(C0, C1, t)
    return small.resize((width, height), Image.BILINEAR).convert("RGBA")


def rrect(draw, cx, cy, w, h, fill):
    r = min(w, h) * 0.32
    draw.rounded_rectangle(
        [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], radius=r, fill=fill)


def draw_barbell(base, cx, cy, mark_w, ss, fill=WHITE, rec=REC, with_shadow=True):
    """Horizontal barbell + rec dot centered at (cx, cy). Mirrors make_icon.py."""
    m = mark_w

    def paint(draw, color, rec_color):
        rrect(draw, cx, cy, m * 0.40, m * 0.09, color)              # grip bar
        for s in (-1, 1):
            rrect(draw, cx + s * m * 0.235, cy, m * 0.075, m * 0.34, color)  # inner plate
            rrect(draw, cx + s * m * 0.335, cy, m * 0.090, m * 0.46, color)  # outer plate
            rrect(draw, cx + s * m * 0.430, cy, m * 0.060, m * 0.17, color)  # end cap
        dx, dy, dr = cx + m * 0.33, cy - m * 0.34, m * 0.078       # record dot
        draw.ellipse([dx - dr, dy - dr, dx + dr, dy + dr], fill=rec_color)

    if with_shadow:
        shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        paint(sd, (0, 0, 0, 110), (0, 0, 0, 110))
        shadow = shadow.filter(ImageFilter.GaussianBlur(ss * 7))
        base.alpha_composite(shadow, (0, int(ss * 6)))

    layer = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    paint(ld, fill + (255,), rec + (255,))
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


def text_w(draw, text, font):
    return draw.textlength(text, font=font)


def shadow_text(base, xy, text, font, fill, anchor, ss):
    """White text with a soft dark shadow for legibility on the gradient."""
    sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.text((xy[0], xy[1] + ss * 2), text, font=font, fill=(0, 0, 0, 130), anchor=anchor)
    sh = sh.filter(ImageFilter.GaussianBlur(ss * 2))
    base.alpha_composite(sh)
    ImageDraw.Draw(base).text(xy, text, font=font, fill=fill + (255,), anchor=anchor)


# ---------------------------------------------------------------------------
# Open Graph image: 1200x630, no alpha. Barbell left, wordmark + tagline right.
# ---------------------------------------------------------------------------
W, H, SS = 1200, 630, 3
w, h = W * SS, H * SS
og = gradient(w, h)

# Barbell mark, left side, vertically centered.
draw_barbell(og, w * 0.245, h * 0.485, w * 0.285, SS)

draw = ImageDraw.Draw(og)
text_x = w * 0.415
max_w = w - text_x - w * 0.05  # keep a right margin

# Title — auto-shrink to fit.
title = "Lift Recorder"
tsize = int(112 * SS)
title_font = load_font(tsize)
while text_w(draw, title, title_font) > max_w and tsize > 20:
    tsize -= 2 * SS
    title_font = load_font(tsize)

# Tagline, two balanced lines.
tag1, tag2 = "Record your lifts without", "pausing your music"
gsize = int(38 * SS)
tag_font = load_font_regular(gsize)
while (max(text_w(draw, tag1, tag_font), text_w(draw, tag2, tag_font)) > max_w
       and gsize > 12):
    gsize -= 1 * SS
    tag_font = load_font_regular(gsize)

# Title + tagline block, optically centered a touch above the middle.
shadow_text(og, (text_x, h * 0.40), title, title_font, WHITE, "lm", SS)
shadow_text(og, (text_x, h * 0.575), tag1, tag_font, TAG, "lm", SS)
shadow_text(og, (text_x, h * 0.665), tag2, tag_font, TAG, "lm", SS)

# Domain footer, bottom-right — reinforces the brand in feed previews.
domain_font = load_font_regular(int(24 * SS))
shadow_text(og, (w - w * 0.05, h - h * 0.08), "bneuhausz.dev",
            domain_font, DOMAIN, "rm", SS)

og = og.convert("RGB").resize((W, H), Image.LANCZOS)  # RGB = no transparency
out_path = os.path.join(OUT_DIR, OUT_NAME)
og.save(out_path, optimize=True)
print(f"wrote {out_path}  {W}x{H}")
