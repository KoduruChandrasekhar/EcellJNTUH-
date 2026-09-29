import { cn } from "@/lib/utils";

/**
 * The red dotted rounded frame that rings the key block on the ETHOS posters.
 * Uses the accent colour, so an event page recolours it by setting `data-accent`.
 */
export function DottedFrame({
  children,
  className,
  tone = "red",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "red" | "accent" | "ink";
}) {
  return (
    <div
      className={cn(
        "rounded-(--radius-panel) border-2 border-dotted p-5 md:p-7",
        tone === "red" && "border-signal-red",
        tone === "accent" && "border-accent",
        tone === "ink" && "border-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The dark grain-textured panel holding white body copy, with a thin dotted inner border.
 */
export function InkPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-panel text-on-panel relative rounded-(--radius-panel) p-5 md:p-7",
        "ring-signal-red/40 ring-1 ring-inset",
        className,
      )}
    >
      {children}
    </div>
  );
}
