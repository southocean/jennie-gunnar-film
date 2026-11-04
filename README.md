# Wedding video workshop

A tiny static site for planning friends' wedding videos. Each couple is its own project, with its own footage, story, edit plan and saved edits:

- [`jennie/`](jennie/) - **Jennie & Gunnar**: ~56 clips + ~208 photos, cut to our own song (Gravity). Tabs: Story Builder, Content Analysis, The song, Edit plan, How this works, Watch the cuts.
- [`emma/`](emma/) - **Emma**: 43 clips + 121 photos from the Helsinki trip (2-4 Oct 2026), cut to an existing track. No song tab.

The root page lists the projects. One password unlocks the whole workshop for the browser session.

## How it fits together

- `assets/` is the shared engine: `app.js` (story builder, analysis, edit plan, song map), `styles.css`, `gate.js`, SortableJS (vendored).
- Each project folder has its own `index.html`, data and `media/` (web derivatives only: video posters + hover frames, compressed photo thumbnails; originals are never stored here).
- Saved state is per project (`jennie_story_v8`, `emma_story_v1` in localStorage), so editing one never touches the other. **Export story** downloads a small JSON; the other person **Import**s it.
- Jennie: `jennie/data.js` + `jennie/img_base.js`. Local-only, git-ignored: `jennie/media/fb/` + `jennie/fb_stacks.js` (made by `tools/gen_fb_thumbs.py`).
- Emma: `emma/inventory.js` + `emma/story.js` are generated from the planning folder `Emma-wedding-video/tools/` (`inventory.js`, `story_build.js`). Edit them there. `emma/media/song.mp3` is local-only and git-ignored (someone else's track), so the player in the edit plan only works on the planning computer.

Plain HTML/CSS/JS, no build step. Bump `?v=NN` on the script/style tags when deploying.
