import { Mark } from "@/components/site/Lockup";

/**
 * The right half of the hero: the chevron mark held inside a pair of slowly counter-
 * rotating rings, with the logo's yellow and blue picked out in the arcs.
 *
 * Deliberately just the mark and the geometry — no event photos. Floating poster cards
 * competed with the headline and made the composition read as clutter rather than a logo.
 *
 * Entirely decorative, so it is hidden from assistive tech: everything it conveys is
 * already said by the headline beside it.
 */
export function HeroComposition() {
  return (
    <div aria-hidden className="relative aspect-square w-full max-w-md">
      {/* Outer ring — blue, turning one way. */}
      <div className="ring-spin-slow absolute inset-0">
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
          <circle
            cx="100"
            cy="100"
            r="92"
            stroke="var(--color-brand-blue)"
            strokeWidth="0.75"
            strokeOpacity="0.55"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          {/* A single heavier arc so the rotation is legible rather than a static ring. */}
          <path
            d="M 100 8 A 92 92 0 0 1 178 58"
            stroke="var(--color-brand-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Middle ring — yellow, turning the other way. */}
      <div className="ring-spin-reverse absolute inset-[11%]">
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
          <circle
            cx="100"
            cy="100"
            r="88"
            stroke="var(--color-brand-yellow)"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
          <path
            d="M 12 100 A 88 88 0 0 0 66 181"
            stroke="var(--color-brand-yellow)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Inner static ring, giving the mark something to sit against. */}
      <div className="absolute inset-[26%]">
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
          <circle
            cx="100"
            cy="100"
            r="96"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-line-soft"
          />
        </svg>
      </div>

      {/* The mark, centred and glowing faintly so it reads as the focal point. */}
      <div className="absolute inset-0 grid place-items-center">
        <Mark size={132} className="mark-glow" />
      </div>
    </div>
  );
}
