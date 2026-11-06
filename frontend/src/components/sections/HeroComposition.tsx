import { ChevronPair } from "@/components/brand/ChevronPair";
import { PixelBlocks } from "@/components/brand/PixelBlocks";
import { WireGlobe } from "@/components/brand/WireGlobe";
import { Mark } from "@/components/site/Lockup";

/**
 * The right half of the hero: the chevron mark held inside a set of counter-rotating
 * rings, with the logo's yellow and blue picked out in the arcs.
 *
 * Deliberately the mark and geometry — no event photographs. A photo here competed with
 * the headline and read as clutter rather than a logo.
 *
 * The furniture around the rings is lifted from the posters in docs/reference so the hero
 * speaks the same language as the rest of the brand: a cropped wireframe globe behind, a
 * ticked dial, orbiting markers, and a chevron-and-barcode cluster at the corner.
 *
 * All of it is SVG and CSS keyframes, so it costs nothing in JavaScript. Entirely
 * decorative, so hidden from assistive tech: the headline beside it says everything.
 */
export function HeroComposition() {
  return (
    <div aria-hidden className="relative aspect-square w-full max-w-md">
      {/* A soft plate so the mark sits on something rather than floating on the page. */}
      <div className="bg-brand-blue/6 absolute inset-[12%] rounded-full blur-2xl" />

      {/* The poster globe, pushed right back. */}
      <WireGlobe className="text-ink-3/20 absolute inset-[2%]" />

      {/* Outer ring — blue, turning one way, with a marker riding the rim. */}
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
          <circle cx="100" cy="8" r="3.2" fill="var(--color-brand-blue)" />
        </svg>
      </div>

      {/* A ticked dial between the rings — the instrument face that makes the whole
          composition read as engineered rather than ornamental. */}
      <div className="ring-spin-reverse absolute inset-[6%]">
        <svg viewBox="0 0 200 200" fill="none" className="h-full w-full">
          <circle
            cx="100"
            cy="100"
            r="94"
            stroke="currentColor"
            className="text-ink-3/30"
            strokeWidth="6"
            strokeDasharray="0.75 11"
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
          <circle cx="12" cy="100" r="3.2" fill="var(--color-brand-yellow)" />
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
          {/* Four registration crosses at the quarters, as on the posters' × grids. */}
          {[
            [100, 4],
            [196, 100],
            [100, 196],
            [4, 100],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`} stroke="currentColor" strokeWidth="1.5" className="text-ink-3/45">
              <line x1={x - 4} y1={y} x2={x + 4} y2={y} />
              <line x1={x} y1={y - 4} x2={x} y2={y + 4} />
            </g>
          ))}
        </svg>
      </div>

      {/* The mark, centred and glowing faintly so it reads as the focal point. */}
      <div className="absolute inset-0 grid place-items-center">
        <Mark size={132} className="mark-glow" />
      </div>

      {/* Printed-poster furniture at the corner. */}
      <div className="absolute right-[2%] -bottom-2 flex items-end gap-2.5">
        <PixelBlocks cols={8} rows={2} className="text-ink-3/40" />
        <ChevronPair size={22} gap={-3} className="opacity-75" />
      </div>
    </div>
  );
}
