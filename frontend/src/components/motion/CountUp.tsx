"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from zero to `value` the first time the number scrolls into view.
 *
 * The server renders the final number, so the statistic is correct even before (or
 * without) JavaScript, and the layout never shifts. The animation only replaces what's
 * already there.
 */
export function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const duration = 1100;
        const start = performance.now();

        const tick = (time: number) => {
          const progress = Math.min(1, (time - start) / duration);
          // Ease-out cubic: fast at first, settling into the final number.
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };

        setDisplay(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
