import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { EventCard } from "@/components/sections/EventCard";
import { ButtonLink } from "@/components/ui/button";
import { getInitiativeBySlug, getInitiativeEvents, getInitiatives } from "@/lib/data";

/** Builds a static page per initiative at build time. */
export async function generateStaticParams() {
  const initiatives = await getInitiatives();
  return initiatives.map((initiative) => ({ slug: initiative.slug }));
}

// Route params arrive as a promise in Next 16, so they are awaited before use.
export async function generateMetadata({
  params,
}: PageProps<"/initiatives/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const initiative = await getInitiativeBySlug(slug);
  if (!initiative) return { title: "Not found" };

  return { title: initiative.title, description: initiative.summary };
}

export default async function InitiativePage({ params }: PageProps<"/initiatives/[slug]">) {
  const { slug } = await params;
  const initiative = await getInitiativeBySlug(slug);

  if (!initiative) notFound();

  const events = await getInitiativeEvents(slug);

  return (
    <div className="container-site section-y">
      <Reveal>
        <SectionEyebrow>Initiative</SectionEyebrow>
        <SplitHeadline as="h1" solid={initiative.title} accent="yellow" className="mt-3" />
        <p className="text-body-2 mt-6 max-w-2xl text-lg text-balance">{initiative.summary}</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <p className="text-body-2 leading-relaxed">{initiative.description}</p>
          <div className="border-line-soft border-t pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <p className="text-body-3 text-xs tracking-(--tracking-eyebrow) uppercase">Purpose</p>
            <p className="text-body mt-3 font-medium">{initiative.purpose}</p>
          </div>
        </div>
      </Reveal>

      <section className="mt-16">
        <Reveal>
          <h2 className="font-condensed border-line border-b pb-3 text-(length:--text-heading) tracking-(--tracking-wide-label) uppercase">
            Events under {initiative.title}
          </h2>
        </Reveal>

        {events.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.slug} delay={i * 70}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-body-2 mt-8">No events recorded under this initiative yet.</p>
        )}
      </section>

      <Reveal>
        <div className="mt-14 flex flex-wrap gap-3">
          <ButtonLink href="/initiatives" variant="secondary">
            All initiatives
          </ButtonLink>
          <ButtonLink href="/events" variant="ghost">
            <ChevronTick tone="blue" size={14} />
            Browse every event
          </ButtonLink>
        </div>
      </Reveal>
    </div>
  );
}
