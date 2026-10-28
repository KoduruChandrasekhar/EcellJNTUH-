import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Card } from "@/components/ui/card";
import type { CaseStudy } from "@/content/schema";
import { formatMonthYear } from "@/lib/dates";

/**
 * The club's business breakdowns.
 *
 * Only the month is shown, not the day: these are evergreen reading, and a precise date
 * makes an eighteen-month-old piece look stale when it isn't.
 *
 * Each card links out to the full carousel on Instagram, so the whole card is the target
 * via a stretched link — the same pattern as EventCard. Server component, no client JS.
 */
export function CaseStudies({ studies }: { studies: CaseStudy[] }) {
  if (studies.length === 0) return null;

  return (
    <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {studies.map((study, i) => (
        <Reveal as="li" key={study.id} delay={i * 70}>
          <Card interactive className="group relative flex h-full flex-col overflow-hidden">
            <div className="bg-surface-3 relative aspect-square overflow-hidden">
              <Image
                src={study.image}
                alt={study.imageAlt}
                width={study.width}
                height={study.height}
                sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 92vw"
                className="h-full w-full object-cover transition-transform duration-(--duration-slow) group-hover:scale-[1.04]"
                loading="lazy"
              />
            </div>

            <div className="flex flex-1 flex-col p-5">
              <p className="text-brand-blue text-xs font-semibold tracking-(--tracking-wide-label) uppercase">
                {study.subject}
              </p>
              <h3 className="font-condensed mt-2 text-base uppercase">
                <a
                  href={study.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none"
                >
                  {study.title}
                </a>
              </h3>
              <p className="text-body-2 mt-2 line-clamp-4 text-sm leading-relaxed">
                {study.summary}
              </p>

              <p className="text-body-3 mt-auto flex items-center gap-1.5 pt-4 text-xs tracking-(--tracking-wide-label) uppercase">
                {formatMonthYear(study.publishedAt)}
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </p>
            </div>
          </Card>
        </Reveal>
      ))}
    </ul>
  );
}
