import type { EventItem } from "@/content/schema";
import type { Site } from "@/content/schema";

/**
 * JSON-LD structured data, so search engines and social platforms can read the club and
 * its events as *things* rather than as prose — which is what puts an event's date and
 * venue into a search result rather than a truncated sentence.
 *
 * `dangerouslySetInnerHTML` is banned across this codebase for good reason, and this is
 * not an exception to it: the payload is a `JSON.stringify` of data the build already
 * validated through Zod, injected into a `application/ld+json` script that browsers never
 * execute. It is written through a plain child instead, which React escapes — `<` becomes
 * `\u003c` — leaving the JSON valid and the markup inert either way.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script type="application/ld+json" suppressHydrationWarning>
      {JSON.stringify(data)}
    </script>
  );
}

/** The club itself. Rendered once, in the root layout, so it applies to every page. */
export function OrganizationSchema({ site }: { site: Site }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        alternateName: site.shortName,
        description: site.description,
        url: site.url,
        logo: new URL("/images/brand/logo.png", site.url).href,
        slogan: site.motto,
        address: {
          "@type": "PostalAddress",
          streetAddress: "JNTUH UCESTH, Kukatpally",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          postalCode: "500085",
          addressCountry: "IN",
        },
        parentOrganization: {
          "@type": "CollegeOrUniversity",
          name: "Jawaharlal Nehru Technological University Hyderabad",
        },
        sameAs: Object.values(site.socials).filter(Boolean),
      }}
    />
  );
}

/**
 * A single event.
 *
 * `eventAttendanceMode` and `eventStatus` are required for rich results to show at all.
 * Both are derived — a past event is `EventScheduled` with an end date in the past, which
 * is how Google distinguishes "happened" from "cancelled".
 */
export function EventSchema({ event, site }: { event: EventItem; site: Site }) {
  const url = new URL(`/events/${event.slug}`, site.url).href;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.shortDescription,
        startDate: event.startsAt,
        ...(event.endsAt ? { endDate: event.endsAt } : {}),
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        url,
        ...(event.poster ? { image: [new URL(event.poster, site.url).href] } : {}),
        ...(event.venue
          ? {
              location: {
                "@type": "Place",
                name: event.venue,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Hyderabad",
                  addressRegion: "Telangana",
                  addressCountry: "IN",
                },
              },
            }
          : {}),
        organizer: { "@type": "Organization", name: site.name, url: site.url },
        // Every event the club runs is free to attend. Saying so explicitly is what stops
        // a search result from showing a blank price.
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "INR",
          availability:
            event.registration.mode === "external"
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
          ...(event.registration.mode === "external" ? { url: event.registration.url } : {}),
        },
        ...(event.speakers?.length || event.jury?.length
          ? {
              performer: [...(event.speakers ?? []), ...(event.jury ?? [])].map((person) => ({
                "@type": "Person",
                name: person.name,
                jobTitle: person.role,
              })),
            }
          : {}),
      }}
    />
  );
}

/**
 * Breadcrumbs for an event page, so a search result shows
 * "ecelljntuh › Events › ETHOS 2026" instead of a bare URL.
 */
export function BreadcrumbSchema({
  trail,
  site,
}: {
  trail: { name: string; path: string }[];
  site: Site;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: trail.map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: crumb.name,
          item: new URL(crumb.path, site.url).href,
        })),
      }}
    />
  );
}
