import { cn } from "@/lib/utils";

/**
 * The scattered "×" marks that fill empty corners of the posters.
 */
export function CrossGrid({
  cols = 4,
  rows = 2,
  className,
}: {
  cols?: number;
  rows?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("grid w-fit gap-3 md:gap-4", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: cols * rows }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4 md:h-5 md:w-5" fill="none">
          <path
            d="M4 4 L20 20 M20 4 L4 20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  );
}

/** A single × — used inline as a separator. */
export function CrossMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("h-4 w-4", className)} fill="none">
      <path
        d="M4 4 L20 20 M20 4 L4 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
