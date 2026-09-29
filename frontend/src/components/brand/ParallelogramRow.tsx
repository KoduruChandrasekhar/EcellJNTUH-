import { cn } from "@/lib/utils";

/**
 * The row of slanted bars from the ETHOS posts — some filled, some outline, read like a
 * progress bar. Used as a section divider.
 *
 * `filled` says how many of the leading bars are solid.
 */
export function ParallelogramRow({
  count = 6,
  filled = 4,
  className,
}: {
  count?: number;
  filled?: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("flex items-center gap-1.5", className)}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            "block h-5 w-3.5 -skew-x-[20deg] border-[1.5px] border-current md:h-7 md:w-5",
            i < filled ? "bg-current" : "bg-transparent",
          )}
        />
      ))}
    </div>
  );
}
