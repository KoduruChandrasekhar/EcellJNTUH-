"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Pointer-driven motion: tilt, magnetic pull and a cursor spotlight.
 *
 * All of it is gated on `(pointer: fine)`. A touchscreen has no hover, so these would
 * only fire during scroll — cost with no payoff. All of it also bails out under reduced
 * motion, and all of it writes transforms directly rather than through React state.
 */
function usePointerEffect(apply: (element: HTMLElement, e: PointerEvent, rect: DOMRect) => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let latest: PointerEvent | null = null;

    const paint = () => {
      if (latest) apply(element, latest, element.getBoundingClientRect());
      frame = 0;
    };

    const onMove = (e: PointerEvent) => {
      latest = e;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      element.style.transform = "";
    };

    element.addEventListener("pointermove", onMove);
    element.addEventListener("pointerleave", onLeave);

    return () => {
      element.removeEventListener("pointermove", onMove);
      element.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [apply]);

  return ref;
}

/** A card that tips very slightly toward the cursor. */
export function Tilt({
  children,
  max = 5,
  className,
}: {
  children: React.ReactNode;
  /** Maximum rotation in degrees. Kept small — this should be felt, not noticed. */
  max?: number;
  className?: string;
}) {
  const apply = useCallback(
    (element: HTMLElement, e: PointerEvent, rect: DOMRect) => {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      element.style.transform = `perspective(900px) rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg)`;
    },
    [max],
  );

  const ref = usePointerEffect(apply);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-transform duration-(--duration-base) will-change-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** A button that leans toward the cursor as it approaches. */
export function Magnetic({
  children,
  strength = 0.22,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const apply = useCallback(
    (element: HTMLElement, e: PointerEvent, rect: DOMRect) => {
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      element.style.transform = `translate3d(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px, 0)`;
    },
    [strength],
  );

  const ref = usePointerEffect(apply);

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex transition-transform duration-(--duration-base) will-change-transform",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A soft glow following the cursor across dark sections. Deliberately very subtle — it
 * hints at depth rather than announcing itself. Listens on its parent, so it lights the
 * whole section rather than just its own box.
 */
export function Spotlight({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const parent = element?.parentElement;
    if (!element || !parent) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const paint = () => {
      element.style.setProperty("--spot-x", `${x}px`);
      element.style.setProperty("--spot-y", `${y}px`);
      frame = 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onEnter = () => (element.style.opacity = "1");
    const onLeave = () => (element.style.opacity = "0");

    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerenter", onEnter);
    parent.addEventListener("pointerleave", onLeave);

    return () => {
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerenter", onEnter);
      parent.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500",
        className,
      )}
      style={{
        background:
          "radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in srgb, var(--color-brand-blue) 18%, transparent), transparent 70%)",
      }}
    />
  );
}
