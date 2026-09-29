"use client";

import { cn } from "@/lib/utils";
import { useInView } from "./useInView";

/**
 * The ETHOS posters' red dotted frames and connector lines, drawing themselves in when
 * scrolled to.
 *
 * `stroke-dashoffset` is one of the few properties outside transform/opacity that the
 * brief allows, because it animates the stroke without triggering layout.
 *
 * The dash pattern doubles as the dotted look: a long gap between short dashes reads as
 * dots, and animating the offset from the full path length to zero draws them on.
 */
export function DrawFrame({
  children,
  tone = "red",
  className,
}: {
  children: React.ReactNode;
  tone?: "red" | "accent" | "ink";
  className?: string;
}) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.2 });

  const stroke =
    tone === "red"
      ? "var(--color-signal-red)"
      : tone === "accent"
        ? "var(--color-accent)"
        : "var(--line)";

  return (
    <div ref={ref} className={cn("draw-line relative", className)}>
      {/* The frame is an SVG overlay so the dashes can be animated; the content sits
          above it untouched. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="18"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeDasharray="3 9"
          strokeLinecap="round"
          pathLength={1000}
          style={{ strokeDasharray: "3 9", strokeDashoffset: 0 }}
        />
      </svg>

      <div className="relative p-5 md:p-7">{children}</div>
    </div>
  );
}

/**
 * A single line that draws itself downward — the About page timeline spine.
 *
 * Unlike the frame this one really does animate `stroke-dashoffset` from full to zero,
 * so the line appears to grow as you scroll past it.
 */
export function DrawSpine({ className }: { className?: string }) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.05 });

  return (
    <div ref={ref} aria-hidden className={cn("draw-line absolute inset-y-0 w-px", className)}>
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1 100">
        {/* dasharray === the path length, so offsetting by the same amount hides it
            completely; the shared .draw-line rule animates the offset back to zero. */}
        <line
          x1="0.5"
          y1="0"
          x2="0.5"
          y2="100"
          stroke="var(--line-soft)"
          strokeWidth="1"
          strokeDasharray="100"
          strokeDashoffset="100"
        />
      </svg>
    </div>
  );
}
