# Jennie & Gunnar — Wedding Film Story Builder

A tiny static site for collaboratively shaping a wedding film from ~56 video clips and ~208 photos.

- **Story Builder** — a content pool (left) you drag into a vertical timeline (right). Each row is an emotional *beat* with an editable caption and a duration; the header tracks total runtime vs a ~2 min target. Drag to reorder.
- **Content Analysis** — every clip and photo with notes and a star rating (click stars to change).
- Everything autosaves to your browser. **Export story** downloads a small JSON; the other person can **Import** it. That's how we pass the cut back and forth.

Media in `media/` are web-friendly derivatives (video posters + hover frames, compressed photo thumbnails) — the full-resolution originals are not stored here.

Built as plain HTML/CSS/JS (no build step). Drag-and-drop via [SortableJS](https://sortablejs.github.io/Sortable/), vendored locally.
