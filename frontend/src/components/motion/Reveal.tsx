"use client";

import { cn } from "@/lib/utils";
import { useInView } from "./useInView";

/**
 * Fades and lifts its children into view the first time they are scrolled to.
 *
 * The animation itself is CSS (`.reveal` in globals.css), which also means it fails safe:
 * the rule only applies inside `@media (scripting: enabled)`, so if JavaScript is blocked
 * or broken the content is simply visible rather than the page being blank.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Stagger, in ms, for items appearing as a group. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  // One ref type covers every element this can render as.
  const ref = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("reveal", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
