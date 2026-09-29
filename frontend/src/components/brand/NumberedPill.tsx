import { cn } from "@/lib/utils";

/**
 * The long eco-green pill cards from "What to expect?" — an oversized 01 / 02 at one end,
 * caps title and short description at the other, alternating which side the number sits on.
 */
export function NumberedPill({
  index,
  title,
  description,
  side = "left",
  className,
}: {
  index: number;
  title: string;
  description: string;
  side?: "left" | "right";
  className?: string;
}) {
  const number = String(index).padStart(2, "0");

  return (
    <div
      className={cn(
        "bg-eco flex items-center gap-4 rounded-(--radius-pill) px-6 py-5 text-white md:gap-6 md:px-8",
        side === "right" && "flex-row-reverse text-right",
        className,
      )}
    >
      <span aria-hidden className="font-display shrink-0 text-4xl leading-none md:text-6xl">
        {number}
      </span>
      <div className="min-w-0">
        <h3 className="font-condensed text-(length:--text-subheading) font-semibold tracking-(--tracking-wide-label) text-white uppercase">
          {title}
        </h3>
        <p className="mt-1 text-sm leading-snug text-white/90">{description}</p>
      </div>
    </div>
  );
}
