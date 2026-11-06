"use client";

import { Fragment } from "react";
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
  /**
   * Grouped by word, not by letter.
   *
   * Every letter is its own inline-block so it can ride the wave, which also makes each
   * one a legal line-break opportunity: "E-Cell JNTUH" could wrap to "E-CELL JNTU / H" in
   * a narrow column. Holding each word in a nowrap span keeps breaks at the spaces, where
   * they belong, at any width.
   *
   * The running index carries across words so the wave crosses the whole wordmark rather
   * than restarting at each one.
   */
  const words = text.split(" ");
  let index = -1;

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>

      <span aria-hidden className="inline-block">
        {words.map((word, w) => (
          <Fragment key={`${word}-${w}`}>
            {/* A real space between the word spans, not inside one: it has to render as a
                gap AND stay the single place the line may break. Inside the nowrap span
                it did neither — it collapsed, and "E-Cell JNTUH" ran together. */}
            {w > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((char, c) => {
                index += 1;
                return (
                  <span
                    key={`${char}-${c}`}
                    className="wordmark-letter inline-block"
                    // Each letter starts its wave slightly later than the one before, which
                    // is what turns a row of bobbing letters into a travelling wave.
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}
