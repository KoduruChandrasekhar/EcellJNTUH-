"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-driven motion.
 *
 * Both components here read the scroll position inside `requestAnimationFrame` and write
 * the result straight to the DOM node. Nothing goes through React state: a state update
 * per scroll frame would re-render the tree sixty times a second.
 */

/**
 * A thin yellow-to-blue bar across the top of long pages showing how far you have read.
 * It scales rather than resizes, because `transform` is compositor work and `width` is not.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    let frame = 0;

    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-(--z-index-loader) h-[3px]">
      <div
        ref={ref}
        className="from-brand-yellow to-brand-blue h-full w-full origin-left scale-x-0 bg-gradient-to-r"
      />
    </div>
  );
}

/**
 * Gentle scroll parallax for decorative motifs only — never for text, or anything you
 * need to read or click.
 *
 * Travel is capped so nothing drifts far enough to look broken. Skipped under reduced
 * motion, and on touch devices where it would cost battery for no hover context.
 */
export function ParallaxLayer({
  children,
  distance = 40,
  className,
}: {
  children: React.ReactNode;
  /** Maximum travel in px across the scroll range. The brief caps this at about 40px. */
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;

    const update = () => {
      const rect = element.getBoundingClientRect();
      // -1 when just below the fold, +1 when just above it.
      const progress = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
      const offset = Math.max(-1, Math.min(1, progress)) * distance;
      element.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [distance]);

  return (
    <div ref={ref} aria-hidden className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
