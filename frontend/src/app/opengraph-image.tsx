import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og/card";
import { getSiteConfig } from "@/lib/data";

export const alt = "E-Cell, JNTU Hyderabad — Innovate, Connect, Elevate";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * The card every page falls back to. Route segments that want their own — /events/[slug] —
 * put an opengraph-image of their own alongside their page.
 */
export default async function Image() {
  const site = await getSiteConfig();

  return new ImageResponse(
    <OgCard eyebrow="Entrepreneurship Cell" title="JNTU Hyderabad" meta={site.heroIntro} />,
    size,
  );
}
