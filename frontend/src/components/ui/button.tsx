import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { cn } from "@/lib/utils";

/**
 * `cva` collects a component's variants in one place: a base class string, then what each
 * variant adds. Every button on the site shares this one definition.
 *
 * Colour rules (build brief, Part 3): primary is a yellow fill with ink text — yellow is
 * never used as text on paper, only as a fill. Secondary is an outline that fills blue on
 * hover. Focus rings are blue everywhere, handled globally in globals.css.
 */
const buttonVariants = cva(
  [
    "group inline-flex items-center justify-center gap-2 rounded-(--radius-pill) font-body font-semibold",
    "whitespace-nowrap transition-[transform,box-shadow,background-color,color,border-color]",
    "duration-(--duration-base) ease-(--ease-out-brand)",
    // Every button clears the 44px tap-target floor.
    "min-h-11",
    "disabled:pointer-events-none disabled:opacity-50",
    // The poster "lift": the button rises and its hard shadow appears underneath.
    "hover:-translate-x-px hover:-translate-y-px active:translate-x-0 active:translate-y-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-brand-yellow text-ink hover:shadow-hard-sm",
        secondary:
          "border-[1.5px] border-line text-body hover:bg-brand-blue hover:border-brand-blue hover:text-white",
        ink: "bg-ink text-paper-3 dark:bg-chalk dark:text-ink hover:shadow-hard-sm",
        accent: "bg-accent text-accent-contrast hover:shadow-hard-sm",
        ghost: "text-body hover:text-brand-blue",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant,
  size,
  className,
  ...props
}: ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/**
 * Internal navigation. `next/link` prefetches the target, so the next page is instant.
 * The chevron nudges forward on hover — the logo motif doing double duty as an arrow.
 */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  showChevron = true,
}: ButtonBaseProps & { href: string; showChevron?: boolean }) {
  return (
    <Link href={href} className={cn(buttonVariants({ variant, size }), className)}>
      {children}
      {showChevron ? (
        <ChevronTick
          tone={variant === "secondary" || variant === "ghost" ? "blue" : "yellow"}
          size={14}
          className="transition-transform duration-(--duration-base) group-hover:translate-x-1"
        />
      ) : null}
    </Link>
  );
}

/**
 * Off-site links (Google Forms, Instagram). Always opens in a new tab with
 * `rel="noopener noreferrer"`, which stops the opened page reaching back into ours, and
 * always shows the outbound arrow so the jump is never a surprise.
 */
export function ExternalButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: ButtonBaseProps & { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {children}
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-(--duration-base) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </a>
  );
}
