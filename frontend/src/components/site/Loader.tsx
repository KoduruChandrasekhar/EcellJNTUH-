"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Mark } from "./Lockup";

/**
 * The intro overlay: the E-Cell logo centred on a dark plate — no spinner, no circle.
 *
 * It must never hold up the page. The real content is already rendered and interactive
 * underneath; this is purely a fading sheet on top, and it is hard-capped at 800 ms
 * (500 ms visible + 300 ms fade). Nothing here blocks paint, hydration or input.
 *
 * Everything is CSS keyframes rather than an animation library, because this renders in
 * the root layout — any import it makes is paid for on every route.
 *
 * Shows once per browser session, dismissible with a click or any key, and skipped
 * entirely under `prefers-reduced-motion`.
 */
const SESSION_KEY = "ecell:intro-seen";
const VISIBLE_MS = 500;

type Phase = "hidden" | "visible" | "leaving";

export function Loader() {
  const [phase, setPhase] = useState<Phase>("hidden");

  const dismiss = useCallback(() => {
    setPhase((current) => (current === "visible" ? "leaving" : current));
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout> | undefined;

    // Decided on the next frame rather than in the effect body: sessionStorage is a
    // browser-only API, and this keeps the update out of the render pass React is flushing.
    const frame = requestAnimationFrame(() => {
      // sessionStorage throws in some privacy modes, so never let it break the page.
      let seen = false;
      try {
        seen = sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        seen = false;
      }
      if (seen) return;

      setPhase("visible");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }

      timer = setTimeout(() => setPhase("leaving"), VISIBLE_MS);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "visible") return;
    window.addEventListener("keydown", dismiss);
    window.addEventListener("pointerdown", dismiss);
    return () => {
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, [phase, dismiss]);

  if (phase === "hidden") return null;

  return (
    <div
      aria-hidden
      onAnimationEnd={(e) => {
        if (e.animationName === "loader-out") setPhase("hidden");
      }}
      className={cn(
        // pointer-events-none: the overlay must never eat a click. The page underneath is
        // already interactive, and the window listener still dismisses the overlay.
        "bg-night pointer-events-none fixed inset-0 z-(--z-index-loader) grid place-items-center",
        phase === "leaving" && "loader-leaving",
      )}
    >
      {/* Deliberately not `priority`: the LCP element belongs to the page underneath,
          and this image must not compete with it for bandwidth. */}
      <div className="loader-logo">
        <Mark size={132} />
      </div>
    </div>
  );
}
