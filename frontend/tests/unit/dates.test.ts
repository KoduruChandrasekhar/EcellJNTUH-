import { describe, expect, it } from "vitest";
import { countdownParts, formatDateTime, getEventStatus, isPast } from "@/lib/dates";

/**
 * Status drives every badge on the site, so it gets tested against a fixed "now" rather
 * than the real clock — otherwise these tests would change meaning over time.
 */

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const NOW = Date.parse("2026-06-01T12:00:00+05:30");

const future = (ms: number) => new Date(NOW + ms).toISOString();
const past = (ms: number) => new Date(NOW - ms).toISOString();

describe("formatDateTime", () => {
  it("always formats in IST, whatever the machine timezone", () => {
    // 05:00 UTC is 10:30 IST.
    expect(formatDateTime("2026-08-07T05:00:00Z")).toBe("7 Aug 2026 · 10:30 AM IST");
  });
});

describe("getEventStatus", () => {
  const openRegistration = { mode: "external" as const, url: "https://example.com/form" };

  it("reports completed once the end time has passed", () => {
    const event = {
      startsAt: past(2 * DAY),
      endsAt: past(DAY),
      registration: { mode: "none" as const },
    };
    expect(getEventStatus(event, NOW)).toBe("completed");
  });

  it("assumes a 3 hour run when endsAt is missing", () => {
    const stillOn = { startsAt: past(2 * HOUR), registration: { mode: "none" as const } };
    expect(getEventStatus(stillOn, NOW)).toBe("live");

    const over = { startsAt: past(4 * HOUR), registration: { mode: "none" as const } };
    expect(getEventStatus(over, NOW)).toBe("completed");
  });

  it("reports live while the event is running", () => {
    const event = {
      startsAt: past(HOUR),
      endsAt: future(HOUR),
      registration: { mode: "none" as const },
    };
    expect(getEventStatus(event, NOW)).toBe("live");
  });

  it("reports upcoming when there is no registration link", () => {
    const event = { startsAt: future(10 * DAY), registration: { mode: "none" as const } };
    expect(getEventStatus(event, NOW)).toBe("upcoming");
  });

  it("reports registrations open when a form is live with no deadline", () => {
    const event = { startsAt: future(10 * DAY), registration: openRegistration };
    expect(getEventStatus(event, NOW)).toBe("registrations-open");
  });

  it("switches to closing soon inside the 48 hour window", () => {
    const event = {
      startsAt: future(10 * DAY),
      registration: { ...openRegistration, closesAt: future(47 * HOUR) },
    };
    expect(getEventStatus(event, NOW)).toBe("closing-soon");
  });

  it("stays open just outside the 48 hour window", () => {
    const event = {
      startsAt: future(10 * DAY),
      registration: { ...openRegistration, closesAt: future(49 * HOUR) },
    };
    expect(getEventStatus(event, NOW)).toBe("registrations-open");
  });

  it("reports closed once the deadline passes, even though the event is ahead", () => {
    const event = {
      startsAt: future(5 * DAY),
      registration: { ...openRegistration, closesAt: past(HOUR) },
    };
    expect(getEventStatus(event, NOW)).toBe("registrations-closed");
  });
});

describe("isPast", () => {
  it("is false during the event and true after it", () => {
    expect(isPast({ startsAt: past(HOUR), endsAt: future(HOUR) }, NOW)).toBe(false);
    expect(isPast({ startsAt: past(2 * DAY), endsAt: past(DAY) }, NOW)).toBe(true);
  });
});

describe("countdownParts", () => {
  it("splits the remaining time", () => {
    const parts = countdownParts(future(2 * DAY + 3 * HOUR + 4 * 60 * 1000), NOW);
    expect(parts).toMatchObject({ days: 2, hours: 3, minutes: 4 });
  });

  it("clamps to zero rather than counting negative", () => {
    expect(countdownParts(past(DAY), NOW)).toMatchObject({ total: 0, days: 0, hours: 0 });
  });
});
