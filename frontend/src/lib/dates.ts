const TIME_ZONE = "Asia/Kolkata";

/**
 * All dates are formatted in IST regardless of where the build runs or where the visitor
 * is — an event at 10:30 AM in Hyderabad should read "10:30 AM IST" to everyone.
 *
 * `Intl.DateTimeFormat` is built into the runtime, so no date library is needed.
 */
const dateOnly = new Intl.DateTimeFormat("en-IN", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "short",
  year: "numeric",
});

const timeOnly = new Intl.DateTimeFormat("en-IN", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** "7 Aug 2026" */
export function formatDate(iso: string): string {
  return dateOnly.format(new Date(iso));
}

/** "7 Aug 2026 · 10:30 AM IST" — the site-wide long form. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${dateOnly.format(d)} · ${timeOnly.format(d).toUpperCase()} IST`;
}

/** "10:30 AM – 5:00 PM IST", or just the start time when no end is recorded. */
export function formatTimeRange(startIso: string, endIso?: string): string {
  const start = timeOnly.format(new Date(startIso)).toUpperCase();
  if (!endIso) return `${start} IST`;
  return `${start} – ${timeOnly.format(new Date(endIso)).toUpperCase()} IST`;
}

/**
 * "Feb 2025" — for dates the club hasn't confirmed to the day. Showing a month is honest;
 * showing a guessed day would read as fact.
 */
export function formatMonthYear(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: TIME_ZONE,
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/* ------------------------------------------------------------------ status */

export type EventStatus =
  | "upcoming"
  | "registrations-open"
  | "closing-soon"
  | "registrations-closed"
  | "live"
  | "completed";

const HOUR = 60 * 60 * 1000;
const CLOSING_SOON_WINDOW = 48 * HOUR;

/**
 * Status is always computed from dates, never stored — so a card can't claim "Upcoming"
 * days after the event just because nobody rebuilt the site.
 *
 * `now` is a parameter rather than a call to `Date.now()` inside, which makes this
 * testable and lets client components re-check it on a timer.
 */
export function getEventStatus(
  event: {
    startsAt: string;
    endsAt?: string;
    registration: { mode: "external"; closesAt?: string } | { mode: "none" };
  },
  now: number = Date.now(),
): EventStatus {
  const start = Date.parse(event.startsAt);
  const end = event.endsAt ? Date.parse(event.endsAt) : start + 3 * HOUR;

  if (now > end) return "completed";
  if (now >= start) return "live";

  if (event.registration.mode === "external") {
    const { closesAt } = event.registration;
    if (!closesAt) return "registrations-open";

    const closes = Date.parse(closesAt);
    if (now > closes) return "registrations-closed";
    if (closes - now <= CLOSING_SOON_WINDOW) return "closing-soon";
    return "registrations-open";
  }

  return "upcoming";
}

/** Human label for a status. One definition, used by every badge on the site. */
export const statusLabel: Record<EventStatus, string> = {
  upcoming: "Upcoming",
  "registrations-open": "Registrations open",
  "closing-soon": "Closing soon",
  "registrations-closed": "Registrations closed",
  live: "Happening now",
  completed: "Completed",
};

export function isPast(event: { startsAt: string; endsAt?: string }, now = Date.now()): boolean {
  const end = event.endsAt ? Date.parse(event.endsAt) : Date.parse(event.startsAt) + 3 * HOUR;
  return now > end;
}

/** Remaining time broken into parts, for countdowns. Clamped at zero. */
export function countdownParts(targetIso: string, now: number = Date.now()) {
  const diff = Math.max(0, Date.parse(targetIso) - now);
  return {
    total: diff,
    days: Math.floor(diff / (24 * HOUR)),
    hours: Math.floor((diff % (24 * HOUR)) / HOUR),
    minutes: Math.floor((diff % HOUR) / (60 * 1000)),
    seconds: Math.floor((diff % (60 * 1000)) / 1000),
  };
}
