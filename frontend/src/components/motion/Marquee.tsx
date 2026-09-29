"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * An endlessly scrolling row, used for straplines and partner names.
 *
 * The children are rendered twice: once visible, once as an aria-hidden duplicate. The
 * track slides exactly half its width, so the second copy lands where the first began and
 * the loop is seamless.
 *
 * The animation is CSS, so this costs no JavaScript to run — the only script is a small
 * IntersectionObserver that pauses the loop when it scrolls out of view, and a
 * visibilitychange listener that pauses it when the tab is hidden. An animation nobody can
 * see should not be spending a phone's battery.
 */
export function Marquee({
  children,
  durationSeconds = 32,
  reverse = false,
  className,
}: {
  children: React.ReactNode;
  durationSeconds?: number;
  /** Run right-to-left instead, for the second row of a two-row ticker. */
  reverse?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        element.dataset.paused = entry?.isIntersecting ? "false" : "true";
      },
      { threshold: 0 },
    );
    observer.observe(element);

    const onVisibility = () => {
      if (document.hidden) element.dataset.paused = "true";
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-paused="false"
      className={cn("marquee relative overflow-hidden", className)}
      style={{ "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties}
    >
      <div className="marquee-track" data-direction={reverse ? "reverse" : "forward"}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </div>

      {/* Fade the edges so items enter and leave rather than being chopped off. */}
      <div
        aria-hidden
        className="from-surface pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r to-transparent"
      />
      <div
        aria-hidden
        className="from-surface pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l to-transparent"
      />
    </div>
  );
}
