/**
 * Mirror the club's latest Instagram posts into src/content/instagram.ts.
 *
 * Why mirror rather than fetch in the browser:
 *   - The access token must never reach the client, so the call has to happen here.
 *   - Instagram's CDN URLs are signed and expire within days, so storing the URL would
 *     leave broken images. Each one is downloaded and optimised into public/ instead.
 *
 * The result is an ordinary content file, validated by the same Zod schema as everything
 * else, so a malformed API response fails the build loudly rather than shipping blanks.
 *
 * Usage:  IG_ACCESS_TOKEN=... IG_USER_ID=... node scripts/sync-instagram.mjs
 * Exit 0 with no changes is normal and means nothing new was posted.
 */
import { writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TOKEN = process.env.IG_ACCESS_TOKEN;
const USER_ID = process.env.IG_USER_ID;
const LIMIT = Number(process.env.IG_POST_LIMIT ?? 4);
const API = "https://graph.instagram.com/v26.0";

const OUT_DIR = path.join("public", "images", "instagram");
const CONTENT_FILE = path.join("src", "content", "instagram.ts");
/** Matches the site's other imagery: nothing over 200 KB, 1200px wide is plenty. */
const MAX_WIDTH = 1200;

if (!TOKEN || !USER_ID) {
  console.error("Missing IG_ACCESS_TOKEN or IG_USER_ID. Nothing to do.");
  process.exit(1);
}

/** Instagram returns "+0000"; the schema wants a real ISO offset. */
const toIso = (stamp) => stamp.replace(/([+-]\d{2})(\d{2})$/, "$1:$2");

/** Captions carry hashtag walls and newlines; neither belongs in alt text. */
function cleanCaption(caption) {
  if (!caption) return undefined;
  const text = caption
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !/^#/.test(line))
    .join(" ")
    .replace(/#\w+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.slice(0, 300) : undefined;
}

async function api(url) {
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) {
    const message = body?.error?.message ?? res.statusText;
    throw new Error(`Instagram API ${res.status}: ${message}`);
  }
  return body;
}

const fields = [
  "id",
  "caption",
  "media_type",
  "media_url",
  "thumbnail_url",
  "permalink",
  "timestamp",
].join(",");

console.log("Fetching the latest posts…");
const { data } = await api(
  `${API}/${USER_ID}/media?fields=${fields}&limit=${LIMIT}&access_token=${TOKEN}`,
);

await mkdir(OUT_DIR, { recursive: true });

const posts = [];
for (const item of data ?? []) {
  // A video's media_url is the MP4; thumbnail_url is the still we actually want.
  const source = item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
  if (!source) {
    console.warn(`  skipped ${item.id} — no image URL on the response`);
    continue;
  }

  const file = `${item.id}.webp`;
  try {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`download failed: ${res.status}`);
    const input = Buffer.from(await res.arrayBuffer());

    const out = await sharp(input)
      .resize(MAX_WIDTH, MAX_WIDTH, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    const meta = await sharp(out).metadata();
    await writeFile(path.join(OUT_DIR, file), out);

    posts.push({
      id: item.id,
      permalink: item.permalink,
      caption: cleanCaption(item.caption),
      mediaType: item.media_type,
      image: `/images/instagram/${file}`,
      width: meta.width,
      height: meta.height,
      postedAt: toIso(item.timestamp),
    });
    console.log(`  ${file}  ${meta.width}x${meta.height}  ${Math.round(out.length / 1024)} KB`);
  } catch (error) {
    // One bad post must not lose the other eleven.
    console.warn(`  skipped ${item.id} — ${error.message}`);
  }
}

if (posts.length === 0) {
  console.error("No posts could be fetched. Leaving the existing feed untouched.");
  process.exit(1);
}

// Drop images for posts that have aged out, so public/ tracks the feed instead of growing.
const keep = new Set(posts.map((p) => path.basename(p.image)));
for (const existing of await readdir(OUT_DIR)) {
  if (!keep.has(existing)) {
    await unlink(path.join(OUT_DIR, existing));
    console.log(`  removed ${existing} (no longer in the feed)`);
  }
}

const body = `import { instagramPostSchema, parseContent } from "./schema";
import { z } from "zod";

/**
 * The club's Instagram feed, mirrored onto the site.
 *
 * **This file is generated — do not edit it by hand.** \`scripts/sync-instagram.mjs\`
 * rewrites it wholesale, and a GitHub Action runs that script every ten minutes.
 * Anything typed here is lost on the next sync.
 *
 * See docs/INSTAGRAM_FEED.md for the setup and how the token is refreshed.
 */
export const instagramPosts = parseContent(
  z.array(instagramPostSchema),
  ${JSON.stringify(posts, null, 2).replace(/\n/g, "\n  ")},
  "instagram.ts",
);

/** When the sync last ran. ISO, set by the script. */
export const instagramSyncedAt: string | null = ${JSON.stringify(new Date().toISOString())};
`;

await writeFile(CONTENT_FILE, body);
console.log(`\nWrote ${posts.length} posts to ${CONTENT_FILE}.`);
