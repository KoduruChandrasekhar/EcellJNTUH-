import { cn } from "@/lib/utils";

type HeadlineSize = "hero" | "display" | "title";

const sizeClass: Record<HeadlineSize, string> = {
  hero: "text-(length:--text-hero)",
  display: "text-(length:--text-display)",
  title: "text-(length:--text-title)",
};

type HeadlineProps = {
  /** The heavy, filled line. */
  solid: string;
  /** The stroke-only line beneath it — the club's signature pairing. */
  outline?: string;
  /** Rendered element. One <h1> per page, so section headlines pass "h2". */
  as?: "h1" | "h2" | "h3" | "div";
  size?: HeadlineSize;
  align?: "left" | "center";
  /**
   * Picks a brand colour up in the outlined line, so every big headline carries some of
   * the logo rather than being pure ink. "yellow" strokes the outline in brand yellow;
   * "blue" fills it solid blue. Default keeps the ink outline.
   */
  accent?: "none" | "yellow" | "blue";
  className?: string;
};

/**
 * The poster headline: one solid line of condensed caps with an outlined line under it
 * ("BEYOND THE BOARDROOM" over "WORKSHOP AND SPEAKER SESSION").
 *
 * Both lines live inside a single heading element so screen readers announce one
 * continuous title rather than two fragments.
 */
export function Headline({
  solid,
  outline,
  as: Tag = "h2",
  size = "display",
  align = "left",
  accent = "none",
  className,
}: HeadlineProps) {
  return (
    <Tag
      className={cn(
        "font-display leading-(--leading-display) tracking-(--tracking-display) uppercase",
        sizeClass[size],
        align === "center" && "text-center",
        className,
      )}
    >
      <span className="block">{solid}</span>
      {outline ? (
        <span
          className={cn(
            "block",
            accent === "yellow"
              ? "outline-yellow"
              : accent === "blue"
                ? "accent-blue"
                : size === "hero"
                  ? "text-outline-thick"
                  : "text-outline",
          )}
        >
          {outline}
        </span>
      ) : null}
    </Tag>
  );
}
