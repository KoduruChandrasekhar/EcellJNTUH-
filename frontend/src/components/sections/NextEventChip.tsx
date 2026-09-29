"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { countdownParts } from "@/lib/dates";

/**
 * A live "next event" pill for the hero — the one piece of the page that visibly ticks.
 *
 * The server renders the label and a stable dash for the numbers, and the client fills in
 * the live values on mount. That avoids a hydration mismatch (the server has no idea what
 * time it is for the visitor) and keeps the pill the same size throughout, so nothing
 * shifts when the real countdown appears.
 *
 * It removes itself once the event has started.
 */
export function NextEventChip({
  slug,
  title,
  startsAt,
}: {
  slug: string;
  title: string;
  startsAt: string;
}) {
  const [parts, setParts] = useState<ReturnType<typeof countdownParts> | null>(null);

  useEffect(() => {
    const update = () => setParts(countdownParts(startsAt));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startsAt]);

  if (parts && parts.total <= 0) return null;

  const value = (n: number | undefined) => (n === undefined ? "--" : String(n).padStart(2, "0"));

  return (
    <Link
      href={`/events/${slug}`}
      className="border-line bg-surface-3 hover:border-brand-yellow group inline-flex items-center gap-3 rounded-(--radius-pill) border-[1.5px] py-1.5 pr-4 pl-1.5 transition-colors duration-(--duration-fast)"
    >
      <span className="bg-brand-yellow text-ink font-condensed rounded-(--radius-pill) px-3 py-1 text-xs tracking-(--tracking-wide-label) uppercase">
        <span
          aria-hidden
          className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-current"
        />
        Next up
      </span>

      <span className="text-body text-sm font-medium">{title}</span>

      <span className="text-body-3 font-wide text-xs tabular-nums">
        {value(parts?.days)}d {value(parts?.hours)}h {value(parts?.minutes)}m{" "}
        {value(parts?.seconds)}s
      </span>

      <ChevronTick
        tone="yellow"
        size={14}
        className="transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}
