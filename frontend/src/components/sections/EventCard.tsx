import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import type { EventItem } from "@/content/schema";
import { formatDate, getEventStatus } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/labels";


/**
 * One event card, used on the Home page and the Events page — there is only ever one
 * EventCard in the codebase.
 *
 * A server component: the only client part is the status badge, which has to re-check
 * the clock.
 */
export function EventCard({ event, className }: { event: EventItem; className?: string }) {
  const status = getEventStatus(event);

  return (
    // `relative` anchors the title link's stretched overlay to the whole card, so a click
    // anywhere on it — poster, text or badges — opens the event.
    <Card
      interactive
      className={cn("group relative flex cursor-pointer flex-col overflow-hidden", className)}
    >
      <div
        data-accent={event.accent}
        className="bg-surface-2 relative aspect-[4/3] w-full overflow-hidden"
      >
        {event.poster ? (
          <Image
            src={event.poster}
            alt={event.posterAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out-brand) group-hover:scale-[1.03]"
          />
        ) : (
          /* No poster yet — a brand-styled block rather than a broken image. */
          <div className="bg-accent/12 absolute inset-0 grid place-items-center p-6">
            <span className="font-display text-accent/70 text-center text-3xl leading-none uppercase">
              {event.title.split("—")[0]?.trim()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{categoryLabel(event.category)}</Badge>
          <StatusBadge event={event} initialStatus={status} />
        </div>

        <h3 className="font-condensed mt-3 text-(length:--text-heading) leading-tight uppercase">
          <Link
            href={`/events/${event.slug}`}
            className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none"
          >
            {event.title}
          </Link>
        </h3>

        <p className="text-body-2 mt-2 line-clamp-3 text-sm">{event.shortDescription}</p>

        <dl className="text-body-3 mt-4 flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <dt className="sr-only">Date</dt>
            <CalendarDays aria-hidden className="size-3.5 shrink-0" />
            <dd>{formatDate(event.startsAt)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Venue</dt>
            <MapPin aria-hidden className="size-3.5 shrink-0" />
            <dd className="truncate">{event.venue}</dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
