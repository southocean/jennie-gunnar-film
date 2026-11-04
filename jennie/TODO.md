# TODO / Known issues

## 1. Thumbnails were hard square-crops that cut the subject out  — RESOLVED (2026-08-03)

**Root cause:** the affected originals are iPhone HEICs stored as a grid of 512x512 tiles.
The derivation used `ffmpeg -map 0:v:0`, which selected **tile #0** (one small square
fragment) instead of the full stitched image (e.g. 2316x3088). That fragment was then
scaled to 1024x1024, so the derivative was a meaningless square.

**Fix applied:** all 244 photo derivatives were re-generated from the originals in the
`Downloads/Wedding clip-*` folders using a two-step decode that pulls the full primary
image, then resizes to 1024px on the long edge preserving aspect ratio (no crop):
```
ffmpeg -i "<original>" -frames:v 1 -update 1 full.png        # full stitched image
ffmpeg -i full.png -vf "scale=1024:1024:force_original_aspect_ratio=decrease" out.jpg
```
Orientation flags in `assets/img_base.js` and the `JM` array were recomputed from the new
files. The modal hero (`.mhero`) now uses `object-fit:contain` on a dark background, so the
**whole photo is shown** (grid thumbnails keep a center `cover` crop, which is now a sensible
crop of the full image rather than a crop-of-a-crop).

## 2. Four photos/clips are cloud-only (not in the folder)  — needs the files
Jennie's doc references these but they are not in either `Downloads/Wedding clip-*` folder
(they were still in Google Drive / not downloaded). They are flagged with `⟨...⟩` in the
relevant Jennie's-story beat captions:
- `IMG_1014.HEIC` — the nail-painting photo ("he asked her to be his girlfriend")
- `IMG_0889.HEIC` — Drottningholm Palace couple selfie (first castle)
- `Zombie 4.MOV` — zombie-walk street clip
- `VN 8.MOV` — Ninh Binh boat clip (conical hat)

Drop these into the media folder and they can be ingested and slotted into their beats.
