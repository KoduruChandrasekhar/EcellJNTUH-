import type { EventItem } from "@/content/schema";

const HOUR = 60 * 60 * 1000;

/**
 * Escape the characters iCalendar treats as structural. Backslash must be replaced first,
 * or the escapes added afterwards would be escaped again.
 */
function escapeText(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

/** iCalendar wants UTC basic format: 20260807T050000Z */
function toICSDate(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function endOf(event: EventItem): string {
  // Events without an explicit end are assumed to run three hours, matching the status logic.
  return event.endsAt ?? new Date(Date.parse(event.startsAt) + 3 * HOUR).toISOString();
}

/**
 * Build an .ics calendar file for an event.
 *
 * Returned as a string so it can be generated at build time and handed over as a data URL
 * — no API route, no request, and it still works on a fully static site.
 */
export function buildICS(event: EventItem, siteUrl: string): string {
  // CRLF endings are required by RFC 5545; LF alone breaks some calendar apps.
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//E-Cell JNTUH//Events//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${event.slug}@ecelljntuh`,
    `DTSTAMP:${toICSDate(new Date(0).toISOString())}`,
    `DTSTART:${toICSDate(event.startsAt)}`,
    `DTEND:${toICSDate(endOf(event))}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.shortDescription)}`,
    `LOCATION:${escapeText(event.venue)}`,
    `URL:${siteUrl}/events/${event.slug}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** A Google Calendar "add event" link, for people who would rather not download a file. */
export function googleCalendarUrl(event: EventItem, siteUrl: string): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toICSDate(event.startsAt)}/${toICSDate(endOf(event))}`,
    details: `${event.shortDescription}\n\n${siteUrl}/events/${event.slug}`,
    location: event.venue,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
