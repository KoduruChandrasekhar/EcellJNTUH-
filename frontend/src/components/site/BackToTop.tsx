"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Appears once you've scrolled past a screen.
 *
 * The scroll position is read inside `requestAnimationFrame` rather than on every scroll
 * event — the brief forbids unthrottled scroll listeners because they run on the main
 * thread and make scrolling stutter on cheap phones.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setShow(window.scrollY > window.innerHeight);
        frame = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="bg-ink text-brand-yellow dark:bg-chalk dark:text-ink shadow-hard-sm fixed right-5 bottom-5 z-(--z-index-sticky) grid size-12 place-items-center rounded-(--radius-pill) transition-transform duration-(--duration-base) hover:-translate-y-0.5"
    >
      <ArrowUp aria-hidden className="size-5" />
    </button>
  );
}
