import os, re, json, sys
from PIL import Image, ImageOps

# Source = the synced "Jennies facebook" folder. Pass it as the first arg, else defaults to Downloads.
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.expanduser("~"), "Downloads", "Jennies facebook")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "media", "fb")
IMG_EXT = (".jpg",".jpeg",".png")

def slug(name):
    s = name.lower()
    s = re.sub(r"[()]", "", s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s

manifest = {}
total = 0
os.makedirs(OUT, exist_ok=True)
for folder in sorted(os.listdir(SRC)):
    fpath = os.path.join(SRC, folder)
    if not os.path.isdir(fpath): continue
    imgs = [f for f in sorted(os.listdir(fpath)) if f.lower().endswith(IMG_EXT)]
    if not imgs: continue
    sl = slug(folder)
    outdir = os.path.join(OUT, sl)
    os.makedirs(outdir, exist_ok=True)
    files = []
    for f in imgs:
        try:
            im = Image.open(os.path.join(fpath, f))
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((240, 240))
            outname = os.path.splitext(f)[0] + ".jpg"
            im.save(os.path.join(outdir, outname), "JPEG", quality=72)
            files.append(outname); total += 1
        except Exception as e:
            print("skip", f, e)
    manifest[folder] = {"slug": sl, "files": files}
    print(f"{folder:<34} -> media/fb/{sl}/  ({len(files)})")

js = "/* LOCAL-ONLY thumbnail manifest for FB photo stacks. Git-ignored - not pushed (public repo). */\nwindow.FB_STACKS = " + json.dumps(manifest, ensure_ascii=False, indent=1) + ";\n"
open(os.path.join(REPO, "assets", "fb_stacks.js"), "w", encoding="utf-8").write(js)
print("TOTAL thumbnails:", total, "| folders:", len(manifest))
