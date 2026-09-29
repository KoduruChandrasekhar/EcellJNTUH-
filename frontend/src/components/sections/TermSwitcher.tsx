import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Switches the Team page between committee terms.
 *
 * Plain links to real routes rather than client state, so every past committee stays
 * linkable, shareable and prerendered — and the switcher costs no JavaScript.
 */
export function TermSwitcher({
  terms,
  active,
  currentTerm,
  className,
}: {
  terms: string[];
  active: string;
  currentTerm: string;
  className?: string;
}) {
  return (
    <nav aria-label="Committee term" className={cn("flex flex-wrap gap-2", className)}>
      {terms.map((term) => {
        const isActive = term === active;
        // The current term lives at /team; past terms get their own path.
        const href = term === currentTerm ? "/team" : `/team/${term}`;

        return (
          <Link
            key={term}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "font-condensed inline-flex min-h-11 items-center rounded-(--radius-pill) border-[1.5px] px-5 text-sm tracking-(--tracking-wide-label) uppercase",
              "transition-colors duration-(--duration-fast)",
              isActive
                ? "bg-ink text-brand-yellow border-ink dark:bg-chalk dark:text-ink dark:border-chalk"
                : "border-line text-body-2 hover:bg-surface-2",
            )}
          >
            {term}
          </Link>
        );
      })}
    </nav>
  );
}
