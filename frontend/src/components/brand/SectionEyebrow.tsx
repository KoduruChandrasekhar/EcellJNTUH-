import { cn } from "@/lib/utils";

/**
 * The small wide-font label above a section heading — the posters' "PRESENTS", "FOR",
 * "INTRODUCING". Navy on paper, sky on night.
 */
export function SectionEyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-wide text-navy dark:text-sky text-(length:--text-eyebrow) font-bold tracking-(--tracking-eyebrow) uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
