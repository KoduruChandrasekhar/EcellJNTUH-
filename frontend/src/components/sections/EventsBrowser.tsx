"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { EventCard } from "@/components/sections/EventCard";
import { Reveal } from "@/components/motion/Reveal";
import { CrossGrid } from "@/components/brand/CrossGrid";
import { ExternalButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EventCategory, EventItem } from "@/content/schema";
import { isPast } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/labels";

/**
 * Upcoming / Past tabs, category chips and a search box over the event grid.
 *
 * Filtering happens on the client over a list the server already rendered, so the first
 * paint is complete HTML and no request is made when you change a filter.
 *
 * The reflow used to run through `<ViewTransition>`, but a view transition blocks input
 * for its whole duration — so every chip press felt like a quarter-second of lag before
 * anything happened. Filters need to feel instant, so the grid now swaps immediately and
 * the new cards fade in via CSS, which costs nothing and never delays the click.
 */

type Tab = "upcoming" | "past";

export function EventsBrowser({ events }: { events: EventItem[] }) {
  const [tab, setTab] = useState<Tab>(() =>
    events.some((event) => !isPast(event)) ? "upcoming" : "past",
  );
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [query, setQuery] = useState("");

  // Only categories that actually occur get a chip — no dead filters.
  const categories = useMemo(() => {
    const present = new Set(events.map((event) => event.category));
    return (Object.keys(CATEGORY_LABELS) as EventCategory[]).filter((c) => present.has(c));
  }, [events]);

  const counts = useMemo(
    () => ({
      upcoming: events.filter((event) => !isPast(event)).length,
      past: events.filter((event) => isPast(event)).length,
    }),
    [events],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return events
      .filter((event) => (tab === "upcoming" ? !isPast(event) : isPast(event)))
      .filter((event) => category === "all" || event.category === category)
      .filter((event) => {
        if (!needle) return true;
        return (
          event.title.toLowerCase().includes(needle) ||
          event.shortDescription.toLowerCase().includes(needle) ||
          event.venue.toLowerCase().includes(needle) ||
          (event.theme?.toLowerCase().includes(needle) ?? false)
        );
      })
      .sort((a, b) =>
        tab === "upcoming"
          ? Date.parse(a.startsAt) - Date.parse(b.startsAt)
          : Date.parse(b.startsAt) - Date.parse(a.startsAt),
      );
  }, [events, tab, category, query]);

  return (
    <div>
      {/* ---- tabs ---- */}
      <div
        role="tablist"
        aria-label="Event timing"
        className="border-line-soft flex gap-1 border-b"
      >
        {(["upcoming", "past"] as const).map((value) => {
          const selected = tab === value;
          return (
            <button
              key={value}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setTab(value)}
              className={cn(
                "font-condensed relative -mb-px min-h-11 px-5 text-base tracking-(--tracking-wide-label) uppercase",
                "transition-colors duration-(--duration-fast)",
                selected ? "text-body" : "text-body-3 hover:text-body",
              )}
            >
              {value}
              <span className="text-body-3 ml-2 text-xs">{counts[value]}</span>
              {selected ? (
                <span
                  aria-hidden
                  className="bg-brand-yellow absolute inset-x-3 -bottom-px h-[3px] rounded-full"
                />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* ---- filters ---- */}
      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </Chip>
          {categories.map((value) => (
            <Chip key={value} active={category === value} onClick={() => setCategory(value)}>
              {CATEGORY_LABELS[value]}
            </Chip>
          ))}
        </div>

        <div className="relative lg:w-72">
          <Search
            aria-hidden
            className="text-body-3 pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events"
            aria-label="Search events"
            className="border-line bg-surface-3 text-body placeholder:text-body-3 h-11 w-full rounded-(--radius-pill) border-[1.5px] pr-10 pl-10 text-sm"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="text-body-3 hover:text-body absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full"
            >
              <X aria-hidden className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Announced politely so screen-reader users hear the result count change. */}
      <p aria-live="polite" className="text-body-3 mt-4 text-sm">
        {filtered.length} {filtered.length === 1 ? "event" : "events"}
      </p>

      {/* ---- grid ---- */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event, i) => (
            // Keyed by slug so React reuses the DOM node for a card that survives the
            // filter change, and only genuinely new cards animate in.
            <div
              key={event.slug}
              className="card-in"
              style={{ animationDelay: `${Math.min(i, 6) * 35}ms` }}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <Reveal>
          <Card surface="sunken" className="mt-6 flex flex-col items-center px-6 py-14 text-center">
            <CrossGrid cols={5} rows={1} className="text-body-3 opacity-30" />
            <p className="font-condensed mt-6 text-(length:--text-heading) uppercase">
              {tab === "upcoming" ? "Next event dropping soon" : "Nothing matches that"}
            </p>
            <p className="text-body-2 mt-2 max-w-sm text-sm">
              {tab === "upcoming"
                ? "Nothing on the calendar right now. Follow us on Instagram — that's where it lands first."
                : "Try a different category, or clear the search."}
            </p>
            {tab === "upcoming" ? (
              <ExternalButtonLink
                href="https://www.instagram.com/ecell_jntuh/"
                variant="secondary"
                size="sm"
                className="mt-6"
              >
                Follow on Instagram
              </ExternalButtonLink>
            ) : null}
          </Card>
        </Reveal>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "font-condensed inline-flex min-h-11 items-center rounded-(--radius-pill) border-[1.5px] px-4 text-sm tracking-(--tracking-wide-label) uppercase",
        "transition-colors duration-(--duration-fast)",
        active
          ? "bg-ink text-brand-yellow border-ink dark:bg-chalk dark:text-ink dark:border-chalk"
          : "border-line text-body-2 hover:border-brand-blue hover:text-brand-blue",
      )}
    >
      {children}
    </button>
  );
}
