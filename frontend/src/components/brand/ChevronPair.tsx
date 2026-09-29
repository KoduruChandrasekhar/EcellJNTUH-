import { cn } from "@/lib/utils";

/**
 * The logo idea reduced to a motif: a yellow chevron pointing right and a blue chevron
 * pointing left, meeting in the middle. Two sides coming together — which is what E-Cell
 * is for. Used as a section divider, a list bullet, a button arrow and a scroll cue.
 *
 * Drawn as plain SVG strokes in the brand colours. This is a decorative mark, deliberately
 * NOT a reconstruction of the logo — the logo itself is only ever `mark.png`.
 */
export function ChevronPair({
  size = 20,
  gap = 2,
  className,
}: {
  size?: number;
  /** Distance between the two chevrons; 0 has them touching. */
  gap?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex items-center", className)}
      style={{ gap, height: size }}
    >
      <svg viewBox="0 0 12 20" fill="none" style={{ height: size, width: size * 0.6 }}>
        <path
          d="M3 3 L9 10 L3 17"
          stroke="var(--color-brand-yellow)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg viewBox="0 0 12 20" fill="none" style={{ height: size, width: size * 0.6 }}>
        <path
          d="M9 3 L3 10 L9 17"
          stroke="var(--color-brand-blue)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/** A single chevron in one brand colour — list bullets and button arrows. */
export function ChevronTick({
  tone = "yellow",
  direction = "right",
  size = 16,
  className,
}: {
  tone?: "yellow" | "blue";
  direction?: "right" | "left";
  size?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 20"
      fill="none"
      style={{ height: size, width: size * 0.6 }}
      className={cn("shrink-0", className)}
    >
      <path
        d={direction === "right" ? "M3 3 L9 10 L3 17" : "M9 3 L3 10 L9 17"}
        stroke={tone === "yellow" ? "var(--color-brand-yellow)" : "var(--color-brand-blue)"}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A full-width divider: a hairline rule interrupted by the chevron pair. */
export function ChevronDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4", className)}>
      <span className="bg-line-soft h-px flex-1" />
      <ChevronPair size={22} />
      <span className="bg-line-soft h-px flex-1" />
    </div>
  );
}
