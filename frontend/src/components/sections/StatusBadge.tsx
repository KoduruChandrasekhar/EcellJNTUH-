"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { getEventStatus, statusLabel, type EventStatus } from "@/lib/dates";

const tone: Record<EventStatus, React.ComponentProps<typeof Badge>["tone"]> = {
  upcoming: "neutral",
  "registrations-open": "open",
  "closing-soon": "soon",
  "registrations-closed": "closed",
  live: "live",
  completed: "done",
};

/**
 * The status badge on every event card and hero.
 *
 * Pages are statically generated, so a badge baked in at build time would still say
 * "Upcoming" days after the event if nobody redeployed. This renders the build-time
 * status first (so the HTML is never empty or wrong for crawlers), then re-checks against
 * the visitor's clock on mount and every minute after.
 */
export function StatusBadge({
  event,
  initialStatus,
}: {
  event: {
    startsAt: string;
    endsAt?: string;
    registration: { mode: "external"; closesAt?: string } | { mode: "none" };
  };
  initialStatus: EventStatus;
}) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const update = () => setStatus(getEventStatus(event, Date.now()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [event]);

  return (
    <Badge tone={tone[status]}>
      {status === "live" ? (
        <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-current" />
      ) : null}
      {statusLabel[status]}
    </Badge>
  );
}
