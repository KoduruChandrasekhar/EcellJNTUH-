import { instagramPostSchema, parseContent } from "./schema";
import { z } from "zod";

/**
 * The club's Instagram feed, mirrored onto the site.
 *
 * **This file is normally generated** — `scripts/sync-instagram.mjs` rewrites it wholesale
 * and a GitHub Action runs that script every ten minutes.
 *
 * The entries below were seeded by hand, because the Instagram access token does not exist
 * yet (see docs/INSTAGRAM_FEED.md for what the social team needs to do). They are in the
 * exact shape the script produces, so the first real sync replaces them cleanly and
 * nothing here needs unpicking. Until then the homepage shows real posts rather than a
 * fallback.
 *
 * Images are local copies, not Instagram URLs: the CDN links are signed and expire within
 * days, so a stored URL would turn into a broken image.
 */
export const instagramPosts = parseContent(
  z.array(instagramPostSchema),
  [
    {
      id: "DewZ1bsmRu4",
      permalink: "https://www.instagram.com/p/DewZ1bsmRu4/",
      caption:
        "Continuing our unicorn startup series with the story, strategy and business behind CRED.",
      mediaType: "CAROUSEL_ALBUM",
      image: "/images/instagram/DewZ1bsmRu4.webp",
      width: 516,
      height: 640,
      postedAt: "2026-10-21T12:00:00+05:30",
    },
    {
      id: "Deec8snN3b_",
      permalink: "https://www.instagram.com/reel/Deec8snN3b_/",
      caption: "And just like that… Grand Bid Prix takes the chequered flag.",
      mediaType: "VIDEO",
      image: "/images/instagram/Deec8snN3b_.webp",
      width: 360,
      height: 640,
      postedAt: "2026-10-14T12:00:00+05:30",
    },
    {
      id: "DecBQ66mQS4",
      permalink: "https://www.instagram.com/p/DecBQ66mQS4/",
      caption:
        "The bids were bold, the competition was fierce. Congratulations to our top three teams.",
      mediaType: "CAROUSEL_ALBUM",
      image: "/images/instagram/DecBQ66mQS4.webp",
      width: 485,
      height: 640,
      postedAt: "2026-10-13T12:00:00+05:30",
    },
    {
      id: "DeZUJ45NI8f",
      permalink: "https://www.instagram.com/reel/DeZUJ45NI8f/",
      caption: "Bidding fast, driving faster. That's a wrap on Grand Bid Prix.",
      mediaType: "VIDEO",
      image: "/images/instagram/DeZUJ45NI8f.webp",
      width: 640,
      height: 360,
      postedAt: "2026-10-12T12:00:00+05:30",
    },
  ],
  "instagram.ts",
);

/**
 * When the sync last ran. Null while the feed is hand-seeded — the script sets a real
 * timestamp, so this staying null is how you can tell the automation has never run.
 */
export const instagramSyncedAt: string | null = null;
