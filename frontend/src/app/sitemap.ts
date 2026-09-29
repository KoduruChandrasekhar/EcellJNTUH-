import type { MetadataRoute } from "next";
import { getAllEventSlugs, getEvents, getSiteConfig, getTeamTerms } from "@/lib/data";

/**
 * Every indexable URL, discovered from the data layer rather than listed by hand — a new
 * event or a new committee term appears here without anyone remembering to add it.
 *
 * `lastModified` is only claimed where something real backs it up (an event's own date).
 * Stamping every page with today's date would tell crawlers the whole site changed daily,
 * which is both untrue and counterproductive.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, eventSlugs, events, terms] = await Promise.all([
    getSiteConfig(),
    getAllEventSlugs(),
    getEvents(),
    getTeamTerms(),
  ]);

  const url = (path: string) => new URL(path, site.url).href;
  const lastModified = new Map(events.map((event) => [event.slug, new Date(event.startsAt)]));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), priority: 1, changeFrequency: "weekly" },
    { url: url("/events"), priority: 0.9, changeFrequency: "weekly" },
    { url: url("/about"), priority: 0.7, changeFrequency: "monthly" },
    { url: url("/team"), priority: 0.7, changeFrequency: "monthly" },
    { url: url("/initiatives"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/gallery"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/sponsors"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/join"), priority: 0.6, changeFrequency: "monthly" },
    { url: url("/contact"), priority: 0.5, changeFrequency: "yearly" },
    { url: url("/privacy"), priority: 0.2, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes,
    ...eventSlugs.map((slug) => ({
      url: url(`/events/${slug}`),
      lastModified: lastModified.get(slug),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...terms.map((term) => ({
      url: url(`/team/${term}`),
      priority: 0.4,
      changeFrequency: "yearly" as const,
    })),
  ];
}
