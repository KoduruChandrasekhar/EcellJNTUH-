"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Types a word out character by character, pauses, deletes it, and moves to the next —
 * with a blinking cursor.
 *
 * Two things keep this from causing layout shift, which a naive typewriter always does:
 *
 *  - the box is sized by the longest word, rendered invisibly underneath, so the line
 *    never reflows as characters appear and disappear;
 *  - the server renders the first word in full, so the pre-hydration paint already shows
 *    real text rather than an empty gap.
 *
 * Under `prefers-reduced-motion` it simply shows the first word and never animates.
 */
const TYPE_MS = 90;
const DELETE_MS = 45;
const HOLD_MS = 1600;

export function Typewriter({ words, className }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(words[0]?.length ?? 0);
  const [deleting, setDeleting] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Only start animating once we know motion is welcome. Until then the first word stays
  // fully typed, which is also exactly what the server rendered.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = setTimeout(() => setAnimate(true), HOLD_MS);
    return () => clearTimeout(start);
  }, []);

  useEffect(() => {
    if (!animate || words.length < 2) return;

    const word = words[index] ?? "";
    const atEnd = !deleting && length === word.length;
    const atStart = deleting && length === 0;

    // Every state change happens inside the timer rather than in the effect body.
    // Updating state synchronously here would re-run the effect immediately and cascade,
    // which is both a wasted render and what the lint rule is guarding against.
    const delay = atEnd ? HOLD_MS : deleting ? DELETE_MS : TYPE_MS;

    const tick = setTimeout(() => {
      if (atEnd) {
        setDeleting(true);
      } else if (atStart) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setLength((n) => n + (deleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(tick);
  }, [animate, deleting, index, length, words]);

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? "");
  const visible = (words[index] ?? "").slice(0, length);

  return (
    <span className={cn("relative inline-grid align-bottom", className)}>
      {/* Reserves the width of the longest word so nothing reflows mid-type. */}
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">
        {longest}
      </span>

      <span className="col-start-1 row-start-1 whitespace-nowrap">
        {/* The full first word is the accessible text; the typing is decoration. */}
        <span className="sr-only">{words[0]}</span>
        <span aria-hidden>{visible}</span>
        <span aria-hidden className="type-caret" />
      </span>
    </span>
  );
}
