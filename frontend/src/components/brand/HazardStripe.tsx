import { cn } from "@/lib/utils";

/**
 * Diagonal hazard band. A repeating-linear-gradient rather than an image, so it scales to
 * any width for free.
 */
export function HazardStripe({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("h-3 w-full", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(-45deg, currentColor 0 8px, transparent 8px 16px)",
      }}
    />
  );
}
