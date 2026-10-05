import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard } from "@/lib/og/card";
import { getAllEventSlugs, getEventBySlug } from "@/lib/data";
import { formatDate, formatMonthYear } from "@/lib/dates";
import { categoryLabel } from "@/lib/labels";

export const alt = "E-Cell JNTUH event";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Every event's card is generated at build time, not on request: the slugs are known, so
 * listing them here makes each one a static file on the CDN. Shared links never wait for
 * a render.
 */
export function generateStaticParams() {
  return getAllEventSlugs().then((slugs) => slugs.map((slug) => ({ slug })));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return new ImageResponse(<OgCard eyebrow="E-Cell JNTUH" title="Event" />, size);
  }

  // An unconfirmed date shows as "August 2026" rather than inventing a day — the same
  // rule the event page itself follows.
  const date = event.dateApproximate ? formatMonthYear(event.startsAt) : formatDate(event.startsAt);

  return new ImageResponse(
    <OgCard
      eyebrow={categoryLabel(event.category)}
      title={event.title}
      meta={event.venue ? `${date} · ${event.venue}` : date}
    />,
    size,
  );
}
