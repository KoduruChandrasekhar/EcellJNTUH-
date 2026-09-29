"use client";

import { useEffect, useRef } from "react";

/**
 * Sets `data-visible="true"` on an element the first time it scrolls into view.
 *
 * One shared IntersectionObserver hook behind every scroll-triggered animation on the
 * site — no component registers a scroll listener, because scroll handlers run on the main
 * thread on every pixel and are the usual cause of stutter on cheap phones.
 *
 * It writes the attribute directly rather than going through React state: the CSS reacts
 * to the attribute, so there is nothing for React to re-render.
 */
export function useInView<T extends HTMLElement>(options?: {
  threshold?: number;
  rootMargin?: string;
  /** Re-hide when it leaves again. Off by default — entrances happen once. */
  repeat?: boolean;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        // Reveal when it comes into view — or when it is *already above* the viewport.
        //
        // That second case matters: observers only attach once React hydrates. If the
        // visitor scrolled quickly, or the browser restored a previous scroll position,
        // a section can be past the fold before it is ever observed — and since an
        // entrance only fires on intersect, it would stay invisible forever. Checking
        // the bounding box catches exactly that.
        const alreadyScrolledPast = entry.boundingClientRect.bottom < 0;

        if (entry.isIntersecting || alreadyScrolledPast) {
          element.dataset.visible = "true";
          if (!options?.repeat) observer.disconnect();
        } else if (options?.repeat) {
          element.dataset.visible = "false";
        }
      },
      {
        threshold: options?.threshold ?? 0.15,
        rootMargin: options?.rootMargin ?? "0px 0px -8% 0px",
      },
    );

    // Before observing, handle the case the observer structurally cannot report.
    //
    // IntersectionObserver only notifies on threshold *crossings*. If the element was
    // already scrolled past before this effect ran — a restored scroll position, a jump to
    // an anchor, or simply scrolling faster than hydration — it goes from non-intersecting
    // to non-intersecting with no crossing, so no callback ever fires and the content would
    // stay hidden permanently. A single rect read at mount closes that hole.
    const rect = element.getBoundingClientRect();
    if (rect.bottom < 0) {
      element.dataset.visible = "true";
      if (!options?.repeat) return;
    }

    observer.observe(element);
    return () => observer.disconnect();
  }, [options?.threshold, options?.rootMargin, options?.repeat]);

  return ref;
}
