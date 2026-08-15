"""Copy each app's Play Store art onto the site's app pages.

For every app in APPS, reads from the sibling app checkout (next to this repo):
  * the 1024x500 feature graphic       → public/images/<slug>/feature-graphic.png
  * a hand-picked subset of screenshots → public/images/<slug>/screenshot-N.<ext>

Screenshots are downscaled to SHOT_WIDTH px wide (LANCZOS): the pages show
them ~250 CSS px wide, so 540 covers a 2x display and keeps each file small.
UI shots stay PNG (crisp text); the photographic Lift Recorder shots stay JPEG.
The feature graphics are copied as-is.

The store art is the source of truth and lives in the app repos (generated
there — see each app's store/play_listing.md); this script is how the site
follows it. Re-run whenever an app re-shoots. From the website repo:
    py -3 scripts/sync_app_store_images.py
"""
import os
import shutil
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
WORK = os.path.dirname(REPO)  # the folder holding every sibling checkout
OUT_ROOT = os.path.join(REPO, "public", "images")

SHOT_WIDTH = 540

# slug → (app repo folder, feature graphic, [screenshots in page order]).
# Paths are relative to the app repo. The picks follow each app's own
# store shot-list: the first shots were chosen to sell the app on their own.
APPS = {
    "lift-recorder": (
        "lift_recorder",
        "plans/release/assets/feature_graphic.png",
        [
            "plans/release/assets/store_screenshot_1_camera.jpg",
            "plans/release/assets/store_screenshot_2_recording.jpg",
            "plans/release/assets/store_screenshot_3_clips.jpg",
            "plans/release/assets/store_screenshot_5_trim.jpg",
        ],
    ),
    "szokincs": (
        "szo_kincs",
        "store/feature_graphic_1024x500.png",
        [
            "store/screenshots/01_home.png",
            "store/screenshots/02_temak.png",
            "store/screenshots/03_jatek.png",
            "store/screenshots/05_eredmenyek.png",
        ],
    ),
    "magyar-kartya": (
        "magyar_kartya",
        "store/feature_graphic_1024x500.png",
        [
            "store/screenshots/01_makao.png",
            "store/screenshots/02_zsir.png",
            "store/screenshots/03_snapszer.png",
            "store/screenshots/05_tell_kronika.png",
        ],
    ),
    "afa-kalkulator": (
        "afa_kalkulator",
        "store/feature_graphic_1024x500.png",
        [
            "store/screenshots/01_calculator.png",
            "store/screenshots/06_widget.png",
            "store/screenshots/02_gross_to_net.png",
            "store/screenshots/04_guide.png",
        ],
    ),
}


def sync(slug, repo_dir, feature, shots):
    src_root = os.path.join(WORK, repo_dir)
    out_dir = os.path.join(OUT_ROOT, slug)
    os.makedirs(out_dir, exist_ok=True)

    fg_src = os.path.join(src_root, feature)
    fg_out = os.path.join(out_dir, "feature-graphic.png")
    Image.open(fg_src).convert("RGB").save(fg_out, optimize=True)
    print(f"wrote {os.path.relpath(fg_out, REPO)}")

    for i, rel in enumerate(shots, start=1):
        src = os.path.join(src_root, rel)
        img = Image.open(src)
        w, h = img.size
        scaled = img.resize((SHOT_WIDTH, round(h * SHOT_WIDTH / w)), Image.LANCZOS)
        if src.lower().endswith((".jpg", ".jpeg")):
            out = os.path.join(out_dir, f"screenshot-{i}.jpg")
            scaled.convert("RGB").save(out, quality=85, optimize=True)
        else:
            out = os.path.join(out_dir, f"screenshot-{i}.png")
            scaled.convert("RGB").save(out, optimize=True)
        print(f"wrote {os.path.relpath(out, REPO)}  {scaled.size[0]}x{scaled.size[1]}")


if __name__ == "__main__":
    for slug, (repo_dir, feature, shots) in APPS.items():
        sync(slug, repo_dir, feature, shots)
