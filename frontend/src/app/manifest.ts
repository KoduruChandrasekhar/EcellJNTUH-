import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/lib/data";

/**
 * The web app manifest, so the site installs to a phone home screen with the club's own
 * logo and paper background rather than a browser default.
 *
 * `theme_color` is the paper token, not the dark plate: it tints the browser chrome, and
 * matching the page background is what stops the seam at the top of the viewport.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteConfig();

  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ECE9E2",
    theme_color: "#ECE9E2",
    icons: [
      { src: "/images/brand/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/images/brand/logo.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
