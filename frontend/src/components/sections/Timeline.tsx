import Link from "next/link";
import { DrawSpine } from "@/components/motion/DrawLine";
import { Reveal } from "@/components/motion/Reveal";
import type { About } from "@/content/schema";
import { formatDate, formatMonthYear } from "@/lib/dates";
import { cn } from "@/lib/utils";

/**
 * The milestones timeline.
 *
 * A single spine draws itself downward as you scroll past, with each milestone revealing
 * beside it. Milestones the club hasn't dated precisely show only the month and say so,
 * rather than presenting a guessed day as fact.
 */
export function Timeline({
  milestones,
  className,
}: {
  milestones: About["milestones"];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {/* The spine sits behind the markers on the left. */}
      <DrawSpine className="left-[7px] md:left-[9px]" />

      <ol className="flex flex-col gap-10">
        {milestones.map((milestone, i) => (
          <Reveal as="li" key={milestone.title} delay={i * 50} className="relative pl-8 md:pl-12">
            <span
              aria-hidden
              className="border-line bg-brand-yellow absolute top-1.5 left-0 size-4 rounded-full border-2 md:size-5"
            />

            <p className="text-body-3 font-wide text-xs tracking-(--tracking-eyebrow) uppercase">
              {milestone.dateApproximate ? (
                <>
                  {formatMonthYear(milestone.date)}
                  <span className="ml-2 normal-case opacity-70">(date to be confirmed)</span>
                </>
              ) : (
                formatDate(milestone.date)
              )}
            </p>

            <h3 className="font-condensed mt-2 text-(length:--text-heading) uppercase">
              {milestone.eventSlug ? (
                <Link
                  href={`/events/${milestone.eventSlug}`}
                  className="hover:text-brand-blue transition-colors"
                >
                  {milestone.title}
                </Link>
              ) : (
                milestone.title
              )}
            </h3>

            <p className="text-body-2 mt-2 max-w-xl text-sm leading-relaxed">
              {milestone.description}
            </p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
