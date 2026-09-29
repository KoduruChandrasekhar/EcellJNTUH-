"use client";

import { cn } from "@/lib/utils";

/**
 * The hero wordmark, alive: every letter rides a slow wave, and a brand-coloured sheen
 * sweeps across the whole word every few seconds.
 *
 * Split per letter for the wave, but the readable text is a single `sr-only` string —
 * a screen reader announcing fifty separate letters is unusable. The letter spans are
 * `aria-hidden`, so assistive tech hears the word once and sighted users get the motion.
 *
 * Each letter is `inline-block` with its own width, so the wave moves glyphs without any
 * reflow. Colour is animated too — paint-only, no layout — and the palette is theme-aware
 * so the word never drops below AA contrast (notably: no yellow text on light paper).
 *
 * Deliberately NOT combined with a `background-clip: text` sheen: a transformed child
 * breaks the parent's clipped background, and the letters render invisible.
 */
export function LiveWordmark({ text, className }: { text: string; className?: string }) {
  const letters = [...text];

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>

      <span aria-hidden className="inline-block">
        {letters.map((char, i) => (
          <span
            key={`${char}-${i}`}
            className="wordmark-letter inline-block"
            // Each letter starts its wave slightly later than the one before, which is
            // what turns a row of bobbing letters into a travelling wave.
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {/* A space has no glyph to animate, so it keeps its width explicitly. */}
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </span>
  );
}
