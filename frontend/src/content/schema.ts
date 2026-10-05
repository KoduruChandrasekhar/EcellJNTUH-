import { z } from "zod";

/**
 * Every content file is checked against these schemas when the site builds. A typo — a
 * missing field, a bad date, a link that isn't https, a duplicate slug — stops the build
 * with a message naming the file and field, instead of shipping something broken.
 *
 * Zod also *infers* the TypeScript types, so the shape is written once here and the rest
 * of the codebase gets full type safety for free (see the `z.infer` exports at the bottom).
 */

/** External links must be https — no http, no javascript:, no protocol-relative URLs. */
const httpsUrl = z
  .string()
  .url("must be a full URL, e.g. https://example.com")
  .refine((u) => u.startsWith("https://"), "must start with https://");

/** ISO datetime carrying an explicit offset, e.g. "2026-08-07T10:30:00+05:30". */
const isoDateTime = z
  .string()
  .refine(
    (v) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?([+-]\d{2}:\d{2}|Z)$/.test(v),
    "must be an ISO datetime with an offset, e.g. 2026-08-07T10:30:00+05:30",
  )
  .refine((v) => !Number.isNaN(Date.parse(v)), "is not a real date");

/** A path under /public — stored with a leading slash so it can be used directly in src. */
const publicPath = z.string().startsWith("/", "must start with / (a path under public/)");

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be kebab-case, e.g. ethos-2026");

/* ------------------------------------------------------------------ site */

export const socialsSchema = z.object({
  instagram: httpsUrl.optional(),
  linkedin: httpsUrl.optional(),
  x: httpsUrl.optional(),
  youtube: httpsUrl.optional(),
});

export const statSchema = z.object({
  label: z.string().min(1),
  value: z.number().int().nonnegative(),
  suffix: z.string().optional(),
  /** Marks a number the club hasn't confirmed, so the UI can show it as approximate. */
  approximate: z.boolean().default(false),
});

export const siteSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  tagline: z.string().min(1),
  motto: z.string().min(1),
  /** Used for SEO and link previews — descriptive, not punchy. */
  description: z.string().min(1).max(200),
  /** The Home hero line. Short and energetic; the SEO copy lives in `description`. */
  heroIntro: z.string().min(1).max(180),
  url: httpsUrl,
  email: z.string().email().optional(),
  address: z.string().min(1),
  mapUrl: httpsUrl.optional(),
  mapEmbedUrl: httpsUrl.optional(),
  socials: socialsSchema,
  stats: z.array(statSchema),
  featuredEventSlug: slug.optional(),
  recruitmentOpen: z.boolean(),
  joinFormUrl: httpsUrl.optional(),
  contactFormUrl: httpsUrl.optional(),
});

/* ----------------------------------------------------------------- events */

export const eventCategorySchema = z.enum([
  "summit",
  "workshop",
  "speaker-session",
  "competition",
  "quiz",
  "recruitment",
  "other",
]);

export const accentSchema = z.enum([
  "ink",
  "yellow",
  "blue",
  "eco",
  "red",
  "navy",
  "sky",
  "mint",
  "purple",
]);

const personSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photo: publicPath.optional(),
  linkedin: httpsUrl.optional(),
});

/**
 * A discriminated union: TypeScript narrows on `mode`, so reading `url` is only allowed
 * once you've checked `mode === "external"`. The backend phase adds an `"internal"` member
 * here and every call site is forced to handle it.
 */
export const registrationSchema = z.discriminatedUnion("mode", [
  z.object({
    mode: z.literal("external"),
    url: httpsUrl,
    closesAt: isoDateTime.optional(),
    label: z.string().optional(),
  }),
  z.object({
    mode: z.literal("none"),
    note: z.string().optional(),
  }),
]);

export const eventSchema = z
  .object({
    slug,
    title: z.string().min(1),
    shortDescription: z.string().min(1).max(160),
    description: z.string().min(1),
    category: eventCategorySchema,
    tagline: z.string().optional(),
    theme: z.string().optional(),
    accent: accentSchema.default("ink"),
    eligibility: z.string().optional(),
    teamSize: z
      .object({ min: z.number().int().positive(), max: z.number().int().positive() })
      .optional(),
    rounds: z
      .array(
        z.object({
          name: z.string().min(1),
          mode: z.enum(["online", "on-campus"]),
          description: z.string().min(1),
          deadline: isoDateTime.optional(),
        }),
      )
      .optional(),
    highlights: z
      .array(z.object({ title: z.string().min(1), description: z.string().min(1) }))
      .optional(),
    results: z
      .array(
        z.object({
          position: z.number().int().positive(),
          teamName: z.string().min(1),
          /** For ties, special awards ("Audience Favourite") — anything the rank alone misses. */
          note: z.string().min(1).optional(),
        }),
      )
      .optional(),
    jury: z.array(personSchema).optional(),
    speakers: z.array(personSchema).optional(),
    /**
     * Turnout, taken from the club's own event reports. `approximate` marks figures the
     * report itself hedged ("~150-170", "120+") so the page can show them as estimates
     * rather than presenting a rounded number as an exact count.
     */
    participation: z
      .object({
        participants: z.number().int().positive().optional(),
        colleges: z.number().int().positive().optional(),
        teamsEntered: z.number().int().positive().optional(),
        teamsShortlisted: z.number().int().positive().optional(),
        approximate: z.boolean().default(true),
      })
      .optional(),
    /** Anything the club wants on record that isn't a standard field. */
    takeaways: z.array(z.string().min(1)).optional(),
    parentSlug: slug.optional(),
    poster: publicPath.optional(),
    posterAlt: z.string().optional(),
    startsAt: isoDateTime,
    endsAt: isoDateTime.optional(),
    /**
     * The club hasn't confirmed the exact day. The date is still needed for ordering, but
     * the UI shows only the month and flags it, rather than presenting a guess as fact.
     */
    dateApproximate: z.boolean().default(false),
    /**
     * The day is confirmed but the start time isn't — the usual state for an event the
     * moment it's announced. `startsAt` still needs a time to be a valid instant, so the
     * UI suppresses it rather than printing a number nobody chose. Without this the page
     * would quietly present a placeholder time as fact.
     */
    timeTbc: z.boolean().default(false),
    venue: z.string().min(1),
    mapUrl: httpsUrl.optional(),
    partners: z.array(z.string()).optional(),
    registration: registrationSchema,
    agenda: z
      .array(
        z.object({
          time: z.string().min(1),
          title: z.string().min(1),
          description: z.string().optional(),
        }),
      )
      .optional(),
    faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).optional(),
    featured: z.boolean().default(false),
    gallerySlug: slug.optional(),
  })
  .refine((e) => !e.poster || e.posterAlt, {
    message: "posterAlt is required whenever poster is set",
    path: ["posterAlt"],
  })
  .refine((e) => !e.endsAt || Date.parse(e.endsAt) >= Date.parse(e.startsAt), {
    message: "endsAt cannot be before startsAt",
    path: ["endsAt"],
  });

/* ------------------------------------------------------------------- team */

export const teamCategorySchema = z.enum(["core", "lead", "member"]);

export const teamMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  position: z.string().min(1),
  category: teamCategorySchema,
  term: z.string().regex(/^\d{4}-\d{2}$/, "must look like 2026-27"),
  photo: publicPath.optional(),
  linkedin: httpsUrl.optional(),
  order: z.number().int().nonnegative(),
});

/* ------------------------------------------------------------ instagram */

/**
 * One post mirrored from the club's Instagram.
 *
 * `image` is a path under /public, not an Instagram URL, and that is deliberate: Instagram's
 * CDN links are signed and expire within days, so a stored URL would turn into a broken
 * image. The sync script downloads each one, optimises it through the same sharp pipeline
 * as every other image on the site, and records the local path here.
 *
 * Captions are kept but are not required — the feed renders images only by default, and the
 * caption is used for alt text, which is the one place it genuinely has to exist.
 */
export const instagramPostSchema = z.object({
  id: z.string().min(1),
  permalink: httpsUrl,
  /** The club's own caption, trimmed. Used for alt text and the accessible link name. */
  caption: z.string().optional(),
  /** CAROUSEL_ALBUM and VIDEO both render a single still; the badge tells them apart. */
  mediaType: z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
  image: publicPath,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  postedAt: isoDateTime,
});

/* ------------------------------------------------------- initiatives etc. */

export const initiativeSchema = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().min(1).max(200),
  description: z.string().min(1),
  purpose: z.string().min(1),
  /** Events belonging to this initiative. Validated against events.ts by the test suite. */
  eventSlugs: z.array(slug).default([]),
  image: publicPath.optional(),
  imageAlt: z.string().optional(),
  order: z.number().int().nonnegative(),
});

export const galleryAlbumSchema = z.object({
  slug,
  title: z.string().min(1),
  eventSlug: slug.optional(),
  date: isoDateTime,
  cover: publicPath,
  images: z
    .array(
      z.object({
        src: publicPath,
        alt: z.string().min(1, "every image needs alt text"),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      }),
    )
    .min(1),
});

export const partnerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  logo: publicPath.optional(),
  url: httpsUrl.optional(),
  order: z.number().int().nonnegative(),
});

export const sponsorTierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1),
  benefits: z.array(z.string().min(1)).min(1),
  order: z.number().int().nonnegative(),
});

export const reachStatSchema = z.object({
  label: z.string().min(1),
  value: z.number().int().nonnegative(),
  suffix: z.string().optional(),
  /** Every sponsorship figure is unconfirmed until the club supplies real numbers. */
  approximate: z.boolean().default(true),
});

export const sponsorsSchema = z.object({
  intro: z.string().min(1),
  whyPartner: z
    .array(z.object({ title: z.string().min(1), description: z.string().min(1) }))
    .min(1),
  reach: z.array(reachStatSchema),
  tiers: z.array(sponsorTierSchema).min(1),
  whatYouGet: z.array(z.string().min(1)).min(1),
  /** Hidden entirely when unset — no dead download button. */
  brochureUrl: publicPath.optional(),
  enquiryFormUrl: httpsUrl.optional(),
});

export const aboutSchema = z.object({
  intro: z.string().min(1),
  alsoKnownAs: z.string().optional(),
  vision: z.string().min(1),
  mission: z.string().min(1),
  objectives: z.array(z.string().min(1)).min(1),
  milestones: z
    .array(
      z.object({
        date: isoDateTime,
        title: z.string().min(1),
        description: z.string().min(1),
        dateApproximate: z.boolean().default(false),
        /** Links the milestone to its event page when one exists. */
        eventSlug: slug.optional(),
      }),
    )
    .min(1),
});

export const joinSchema = z.object({
  intro: z.string().min(1),
  whyJoin: z.array(z.object({ title: z.string().min(1), description: z.string().min(1) })).min(1),
  roles: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        requirements: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

/* ------------------------------------------------------------------ types */

export type Site = z.infer<typeof siteSchema>;
export type Stat = z.infer<typeof statSchema>;
export type EventItem = z.infer<typeof eventSchema>;
export type EventCategory = z.infer<typeof eventCategorySchema>;
export type EventResult = NonNullable<EventItem["results"]>[number];
export type EventParticipation = NonNullable<EventItem["participation"]>;
export type Accent = z.infer<typeof accentSchema>;
export type Registration = z.infer<typeof registrationSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamCategory = z.infer<typeof teamCategorySchema>;
export type Initiative = z.infer<typeof initiativeSchema>;
export type InstagramPost = z.infer<typeof instagramPostSchema>;
export type GalleryAlbum = z.infer<typeof galleryAlbumSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type About = z.infer<typeof aboutSchema>;
export type Sponsors = z.infer<typeof sponsorsSchema>;
export type SponsorTier = z.infer<typeof sponsorTierSchema>;
export type Join = z.infer<typeof joinSchema>;

/**
 * Parse a content file and, if it fails, throw an error that names the file and the exact
 * field. Without this you get Zod's raw dump, which is hard to act on.
 */
export function parseContent<T extends z.ZodTypeAny>(
  schema: T,
  value: unknown,
  file: string,
): z.infer<T> {
  const result = schema.safeParse(value);
  if (result.success) return result.data;

  const problems = result.error.issues
    .map((issue) => `  • ${issue.path.join(".") || "(root)"} — ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid content in src/content/${file}:\n${problems}\n`);
}
