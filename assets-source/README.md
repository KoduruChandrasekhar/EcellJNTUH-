# assets-source

Drop **original, full-resolution** images here (posters, team photos, gallery photos).

`pnpm optimize-images` (script added in Stage 2) reads this folder, converts everything to
WebP at sensible widths, writes the results into `public/images/`, and prints the
width/height values you paste into the content files.

Nothing in here is served to visitors — only `public/images/` is.
