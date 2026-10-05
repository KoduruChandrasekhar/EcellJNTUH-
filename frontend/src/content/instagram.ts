import { instagramPostSchema, parseContent } from "./schema";
import { z } from "zod";

/**
 * The club's Instagram feed, mirrored onto the site.
 *
 * **This file is generated — do not edit it by hand.** `scripts/sync-instagram.mjs`
 * rewrites it wholesale from the Instagram Graph API, and a GitHub Action runs that script
 * every ten minutes. Anything typed here is lost on the next sync.
 *
 * It starts empty, and empty is a supported state: the feed section falls back to event
 * posters until the first sync runs, so the site is complete before the credentials exist.
 *
 * See docs/INSTAGRAM_FEED.md for the setup and how the token is refreshed.
 */
export const instagramPosts = parseContent(z.array(instagramPostSchema), [], "instagram.ts");

/** When the sync last ran, or null before the first run. ISO, set by the script. */
export const instagramSyncedAt: string | null = null;
