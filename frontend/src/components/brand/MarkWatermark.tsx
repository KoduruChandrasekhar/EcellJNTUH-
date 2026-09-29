import { Mark } from "@/components/site/Lockup";
import { cn } from "@/lib/utils";

/**
 * The logo mark as a very faint background watermark.
 *
 * Replaces the criss-cross "chevron field" pattern that used to sit behind call-to-action
 * panels — at low opacity that pattern read as visual noise rather than as brand, and it
 * made the text sitting on top harder to read.
 */
export function MarkWatermark({ size = 280, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute -right-8 -bottom-10 opacity-[0.07] select-none",
        className,
      )}
    >
      <Mark size={size} />
    </span>
  );
}
