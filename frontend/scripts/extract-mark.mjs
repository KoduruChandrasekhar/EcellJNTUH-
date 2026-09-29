/**
 * Crop the chevron mark out of the official logo and give it a transparent background.
 *
 * The logo is NOT redrawn — this only crops and re-mattes the supplied artwork, so the
 * shape stays exactly as the club drew it.
 *
 * Two problems to solve:
 *
 * 1. Finding the mark. The logo also contains white "E-CELL / JNTU Hyderabad" text, so
 *    "anything that isn't black" would grab the text too. Instead we look for *saturated*
 *    pixels — yellow, blue and green all have a wide gap between their strongest and
 *    weakest channel, while white and grey have almost none. That isolates the mark.
 *
 * 2. Removing the black. The artwork is anti-aliased against black, so simply keying out
 *    pure black leaves a dark fringe. Because the matte is black, the original pixel is
 *    already `colour x alpha`, so recovering alpha from the brightest channel and dividing
 *    the colour back out ("un-premultiplying") gives clean edges.
 *
 * Usage:  pnpm extract-mark
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCE = path.join("docs", "reference", "logo-official.png");
const OUT_DIR = path.join("public", "images", "brand");
const BASE_SIZE = 512;

/** A pixel belongs to the mark when its channels differ this much (i.e. it has a hue). */
const SATURATION_THRESHOLD = 45;
/** Ignore near-black noise entirely. */
const MIN_BRIGHTNESS = 28;

const image = sharp(SOURCE);
const { width, height } = await image.metadata();
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
const channels = info.channels;

/* ---------- 1. locate the mark ---------- */

let minX = width;
let minY = height;
let maxX = -1;
let maxY = -1;

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    if (max < MIN_BRIGHTNESS) continue;
    if (max - min < SATURATION_THRESHOLD) continue; // white text and grey are skipped

    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
}

if (maxX < 0) throw new Error(`No coloured mark found in ${SOURCE}`);

// A little breathing room, then square it up so the mark never distorts.
const pad = Math.round(Math.max(maxX - minX, maxY - minY) * 0.04);
const cx = (minX + maxX) / 2;
const cy = (minY + maxY) / 2;
const side = Math.max(maxX - minX, maxY - minY) + pad * 2;

const left = Math.max(0, Math.round(cx - side / 2));
const top = Math.max(0, Math.round(cy - side / 2));
const cropW = Math.min(width - left, Math.round(side));
const cropH = Math.min(height - top, Math.round(side));

console.log(`Mark found at ${minX},${minY} → ${maxX},${maxY}`);
console.log(`Cropping ${cropW}x${cropH} from ${left},${top}`);

/* ---------- 2. black matte -> alpha ---------- */

const cropped = await sharp(SOURCE)
  .extract({ left, top, width: cropW, height: cropH })
  .resize(BASE_SIZE * 2, BASE_SIZE * 2, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 1 },
  })
  .raw()
  .toBuffer({ resolveWithObject: true });

const src = cropped.data;
const px = cropped.info.width * cropped.info.height;
const out = Buffer.alloc(px * 4);

for (let p = 0; p < px; p += 1) {
  const i = p * cropped.info.channels;
  const r = src[i];
  const g = src[i + 1];
  const b = src[i + 2];

  const alpha = Math.max(r, g, b);
  const o = p * 4;

  // Anything this faint is background. Zeroing the colour too matters: leftover RGB in
  // fully transparent pixels is invisible but still costs a lot of bytes to compress.
  if (alpha <= 8) {
    out[o] = out[o + 1] = out[o + 2] = out[o + 3] = 0;
    continue;
  }

  // Un-premultiply: recover the colour the pixel had before it was blended onto black.
  const scale = 255 / alpha;
  out[o] = Math.min(255, Math.round(r * scale));
  out[o + 1] = Math.min(255, Math.round(g * scale));
  out[o + 2] = Math.min(255, Math.round(b * scale));
  out[o + 3] = alpha;
}

await mkdir(OUT_DIR, { recursive: true });

const transparent = sharp(out, {
  raw: { width: cropped.info.width, height: cropped.info.height, channels: 4 },
});

// @2x first (the un-premultiplied buffer is already at 2x), then the base size.
const pngOptions = { palette: true, colours: 64, compressionLevel: 9, effort: 10 };

await transparent.clone().png(pngOptions).toFile(path.join(OUT_DIR, "mark@2x.png"));
await transparent
  .clone()
  .resize(BASE_SIZE, BASE_SIZE)
  .png(pngOptions)
  .toFile(path.join(OUT_DIR, "mark.png"));

for (const name of ["mark.png", "mark@2x.png"]) {
  const file = path.join(OUT_DIR, name);
  const meta = await sharp(file).metadata();
  const { size } = await stat(file); // on-disk size, not a re-encode
  console.log(`  ${name}  ${meta.width}x${meta.height}  ${(size / 1024).toFixed(0)} KB`);
}
