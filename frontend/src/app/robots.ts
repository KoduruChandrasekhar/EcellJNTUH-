import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/data";

/**
 * Generated rather than a static public/robots.txt so the sitemap URL follows the
 * canonical domain in site.ts — one place to change when the real domain is registered.
 *
 * /styleguide is excluded: it's a developer reference, not a page anyone should reach
 * from a search result.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteConfig();

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/styleguide"] },
    sitemap: new URL("/sitemap.xml", site.url).href,
    host: site.url,
  };
}
