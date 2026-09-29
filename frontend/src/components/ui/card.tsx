import { cn } from "@/lib/utils";

/**
 * One card style for the whole site: a paper surface, a 1.5px ink border, and a hard
 * offset shadow that snaps in on hover — the poster/sticker feel, never a soft blur.
 */
export function Card({
  children,
  className,
  interactive = false,
  surface = "raised",
}: {
  children: React.ReactNode;
  className?: string;
  /** Adds the hover lift. Use on cards that are links. */
  interactive?: boolean;
  surface?: "raised" | "sunken";
}) {
  return (
    <div
      className={cn(
        "border-line rounded-(--radius-card) border-[1.5px]",
        surface === "raised" ? "bg-surface-3" : "bg-surface-2",
        interactive && [
          // Shadow only, deliberately no translate. Lifting the card moves its edges out
          // from under the pointer, which un-hovers it, which resets it — and the card
          // visibly shakes. The hard offset shadow gives the poster/sticker lift without
          // ever moving the hit area.
          "transition-[box-shadow,border-color] duration-(--duration-base) ease-(--ease-out-brand)",
          "hover:shadow-hard focus-within:shadow-hard",
        ],
        className,
      )}
    >
      {children}
    </div>
  );
}
