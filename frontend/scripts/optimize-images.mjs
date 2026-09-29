/**
 * Convert everything in assets-source/ to WebP at sensible widths and write it into
 * public/images/, then print the width/height you paste into the content files.
 *
 * Folder in assets-source decides the target width:
 *
 *   ../assets-source/events/foo.jpg  ->  public/images/events/foo.webp   (1200px)
 *   ../assets-source/team/bar.png    ->  public/images/team/bar.webp     ( 600px)
 *   ../assets-source/gallery/baz.jpg ->  public/images/gallery/baz.webp  (1600px)
 *
 * Usage:  pnpm optimize-images
 */
import { readdir, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// assets-source lives at the repo root, one level above frontend/ — the originals are
// not part of the deployed app and Vercel never needs to see them.
const SOURCE = path.join("..", "assets-source");
const OUT = path.join("public", "images");

/** Max width per folder. Anything not listed falls back to 1200. */
const WIDTHS = {
  events: 1200,
  team: 600,
  gallery: 1600,
  initiatives: 1200,
  partners: 400,
  brand: 512,
};

/** The brief's ceilings: nothing over 200 KB, and a hero/LCP image under 120 KB. */
const MAX_KB = 200;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // folder doesn't exist yet
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(jpe?g|png|webp|avif|tiff?)$/i.test(entry.name)) yield full;
  }
}

/**
 * Step the quality down until the file fits the budget. Re-encoding a few times at build
 * time is cheap; shipping a 300 KB photo to a phone on college Wi-Fi is not.
 */
async function encodeWithinBudget(pipeline, maxBytes) {
  for (const quality of [82, 74, 66, 58, 50, 42]) {
    const buffer = await pipeline.clone().webp({ quality, effort: 5 }).toBuffer();
    if (buffer.length <= maxBytes) return { buffer, quality };
  }
  const buffer = await pipeline.clone().webp({ quality: 38, effort: 6 }).toBuffer();
  return { buffer, quality: 38 };
}

let count = 0;
const rows = [];

for await (const file of walk(SOURCE)) {
  const relative = path.relative(SOURCE, file);
  const folder = relative.split(path.sep)[0];
  const width = WIDTHS[folder] ?? 1200;

  const destination = path.join(OUT, relative).replace(/\.[^.]+$/, ".webp");
  await mkdir(path.dirname(destination), { recursive: true });

  // `withoutEnlargement` means a small source is never upscaled into a blurry mess.
  const pipeline = sharp(file)
    .rotate() // honour EXIF orientation, then strip it
    .resize({ width, withoutEnlargement: true });

  const { buffer, quality } = await encodeWithinBudget(pipeline, MAX_KB * 1024);
  await sharp(buffer).toFile(destination);

  const meta = await sharp(buffer).metadata();
  const { size } = await stat(destination);

  rows.push({
    src: "/" + path.relative("public", destination).split(path.sep).join("/"),
    w: meta.width,
    h: meta.height,
    kb: size / 1024,
    quality,
  });
  count += 1;
}

if (count === 0) {
  console.log(`\nNothing to do — put source images in ${SOURCE}/<events|team|gallery|…>/ first.\n`);
} else {
  console.log(
    `\nOptimised ${count} image${count === 1 ? "" : "s"}. Paste these into src/content/:\n`,
  );
  for (const r of rows) {
    console.log(`  { src: "${r.src}", width: ${r.w}, height: ${r.h}, alt: "…" }`);
    console.log(`      ${r.kb.toFixed(0)} KB at quality ${r.quality}\n`);
  }
}
