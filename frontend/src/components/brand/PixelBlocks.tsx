import { cn } from "@/lib/utils";

/**
 * The checker/pixel cluster from the "Dilemma Decoded" D. Deterministic rather than
 * random so server and client render identical markup (a random pattern would cause a
 * hydration mismatch).
 */
export function PixelBlocks({
  cols = 5,
  rows = 5,
  className,
}: {
  cols?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("grid w-fit gap-0.5", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: cols * rows }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        // Checkerboard, thinning out toward the bottom-right for a dissolving edge.
        const on = (col + row) % 2 === 0 && col + row < cols + rows - 3;
        return (
          <span
            key={i}
            className={cn("block size-2 md:size-2.5", on ? "bg-current" : "bg-transparent")}
          />
        );
      })}
    </div>
  );
}
