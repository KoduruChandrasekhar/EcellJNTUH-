import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-(--radius-pill) px-3 py-1 font-condensed text-xs font-semibold uppercase tracking-(--tracking-wide-label)",
  {
    variants: {
      tone: {
        neutral: "border-[1.5px] border-line text-body",
        live: "bg-signal-red text-white",
        open: "bg-eco text-white",
        soon: "bg-brand-yellow text-ink",
        closed: "bg-surface-2 text-body-3 border-[1.5px] border-line-soft",
        done: "border-[1.5px] border-line-soft text-body-3",
        accent: "bg-accent text-accent-contrast",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  tone,
  className,
  children,
}: VariantProps<typeof badgeVariants> & { className?: string; children: React.ReactNode }) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>;
}
