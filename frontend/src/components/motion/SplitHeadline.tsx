"use client";

import { cn } from "@/lib/utils";
import { useInView } from "./useInView";

/**
 * A headline whose words rise in one after another, with the outlined second line drawing
 * its stroke in behind them.
 *
 * Splitting happens on *words*, not letters: a screen reader reading fifty separate
 * letter spans is unusable. The visible text stays one continuous string for assistive
 * tech, and only the visual layer is chopped up.
 */
type SplitSize = "hero" | "display" | "title";

const sizeClass: Record<SplitSize, string> = {
  hero: "text-(length:--text-hero)",
  display: "text-(length:--text-display)",
  title: "text-(length:--text-title)",
};

export function SplitHeadline({
  solid,
  outline,
  as: Tag = "h2",
  size = "display",
  accent = "none",
  align = "left",
  className,
}: {
  solid: string;
  outline?: string;
  as?: "h1" | "h2" | "h3";
  size?: SplitSize;
  accent?: "none" | "yellow" | "blue";
  align?: "left" | "center";
  className?: string;
}) {
  const ref = useInView<HTMLHeadingElement>({ threshold: 0.25 });

  const outlineClass =
    accent === "yellow"
      ? "outline-yellow"
      : accent === "blue"
        ? "accent-blue"
        : size === "hero"
          ? "text-outline-thick"
          : "text-outline";

  return (
    <Tag
      ref={ref}
      className={cn(
        "font-display leading-(--leading-display) tracking-(--tracking-display) uppercase",
        sizeClass[size],
        align === "center" && "text-center",
        className,
      )}
    >
      {/* The whole headline as one string for assistive tech. */}
      <span className="sr-only">
        {solid}
        {outline ? ` ${outline}` : ""}
      </span>

      <span aria-hidden className="rise-in block">
        {solid.split(" ").map((word, i) => (
          <span key={`${word}-${i}`} style={{ "--i": i } as React.CSSProperties}>
            {word}
            {i < solid.split(" ").length - 1 ? "\u00A0" : ""}
          </span>
        ))}
      </span>

      {outline ? (
        <span aria-hidden className={cn("stroke-wipe block", outlineClass)}>
          {outline}
        </span>
      ) : null}
    </Tag>
  );
}
