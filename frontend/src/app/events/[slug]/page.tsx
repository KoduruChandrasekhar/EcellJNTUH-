import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { InkPanel } from "@/components/brand/DottedFrame";
import { NumberedPill } from "@/components/brand/NumberedPill";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { WireTorus } from "@/components/brand/WireGlobe";
import { DrawFrame } from "@/components/motion/DrawLine";
import { Countdown } from "@/components/sections/Countdown";
import { EventActions } from "@/components/sections/EventActions";
import { RegistrationSection } from "@/components/sections/RegistrationSection";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollProgress } from "@/components/motion/Scroll";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { BreadcrumbSchema, EventSchema } from "@/components/site/StructuredData";
import type { EventParticipation, EventResult } from "@/content/schema";
import {
  getAdjacentEvents,
  getAllEventSlugs,
  getEventBySlug,
  getSiteConfig,
  getSubEvents,
} from "@/lib/data";
import { formatDate, formatDateTime, formatMonthYear, isPast, formatTimeRange } from "@/lib/dates";
import { buildICS, googleCalendarUrl } from "@/lib/ics";

/** Every event, parents and sessions alike, gets a static page at build time. */
export async function generateStaticParams() {
  const slugs = await getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Route params arrive as a promise in Next 16, so they are awaited before use.
export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };

  return {
    title: event.title,
    description: event.shortDescription,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      type: "article",
      title: event.title,
      description: event.shortDescription,
      url: `/events/${event.slug}`,
      // No `images` here on purpose: opengraph-image.tsx in this segment generates a
      // landscape card with the event's title, date and venue on it. A poster is portrait,
      // and social platforms centre-crop it into an unreadable sliver.
    },
    twitter: { card: "summary_large_image", title: event.title, description: event.shortDescription },
  };
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  // An unknown slug falls through to the branded 404.
  if (!event) notFound();

  const [site, sessions, adjacent, parent] = await Promise.all([
    getSiteConfig(),
    getSubEvents(event.slug),
    getAdjacentEvents(event.slug),
    event.parentSlug ? getEventBySlug(event.parentSlug) : Promise.resolve(undefined),
  ]);

  const upcoming = !isPast(event);
  const url = `${site.url}/events/${event.slug}`;

  return (
    <div data-accent={event.accent}>
      <EventSchema event={event} site={site} />
      <BreadcrumbSchema
        site={site}
        trail={[
          { name: "Home", path: "/" },
          { name: "Events", path: "/events" },
          // A session sits under its parent event, which is how the page itself reads.
          ...(parent ? [{ name: parent.title, path: `/events/${parent.slug}` }] : []),
          { name: event.title, path: `/events/${event.slug}` },
        ]}
      />
      <ScrollProgress />

      {/* ---- hero ---- */}
      <section className="bg-surface-2 border-line-soft relative overflow-hidden border-b">
        <div
          aria-hidden
          className="text-accent pointer-events-none absolute -top-8 -right-16 size-64 opacity-20 md:size-96"
        >
          <WireTorus />
        </div>

        <div className="container-site section-y relative">
          {parent ? (
            <Reveal>
              <Link
                href={`/events/${parent.slug}`}
                className="text-body-3 hover:text-brand-blue mb-5 inline-flex items-center gap-2 text-sm transition-colors"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Part of {parent.title.split("—")[0]?.trim()}
              </Link>
            </Reveal>
          ) : null}

          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">{event.category.replace("-", " ")}</Badge>
              {event.theme ? <Badge>{event.theme}</Badge> : null}
              {event.dateApproximate ? <Badge tone="neutral">Date to be confirmed</Badge> : null}
            </div>

            <SplitHeadline
              as="h1"
              size="display"
              solid={event.title.split("—")[0]?.trim() ?? event.title}
              outline={event.title.split("—")[1]?.trim()}
              accent="yellow"
              className="mt-4 max-w-4xl"
            />

            {event.tagline ? (
              <p className="text-signal-red font-condensed mt-5 text-lg tracking-(--tracking-wide-label) uppercase">
                {event.tagline}
              </p>
            ) : null}
          </Reveal>

          <Reveal delay={90}>
            <dl className="text-body-2 mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Date</dt>
                <CalendarDays aria-hidden className="text-accent size-4" />
                <dd>
                  {event.dateApproximate
                    ? `${formatMonthYear(event.startsAt)} (to be confirmed)`
                    : formatDateTime(event.startsAt)}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Venue</dt>
                <MapPin aria-hidden className="text-accent size-4" />
                <dd>{event.venue}</dd>
              </div>
              {event.teamSize ? (
                <div className="flex items-center gap-2">
                  <dt className="sr-only">Team size</dt>
                  <Users aria-hidden className="text-accent size-4" />
                  <dd>
                    Teams of {event.teamSize.min}–{event.teamSize.max}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Reveal>

          {upcoming ? (
            <Reveal delay={140}>
              <div className="mt-8">
                <Countdown target={event.startsAt} />
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <div className="container-site section-y grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* ---- main column ---- */}
        <div className="flex flex-col gap-14">
          {event.poster ? (
            <Reveal>
              <div className="border-line overflow-hidden rounded-(--radius-card) border-[1.5px]">
                <Image
                  src={event.poster}
                  alt={event.posterAlt ?? ""}
                  width={1600}
                  height={1200}
                  sizes="(min-width: 1024px) 720px, 92vw"
                  priority
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          ) : null}

          <Reveal>
            <div className="prose-ecell">
              {/* react-markdown renders to React elements, never raw HTML — so content
                  can't inject markup into the page. */}
              <Markdown
                components={{
                  p: ({ children }) => (
                    <p className="text-body-2 mb-4 leading-relaxed">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-body font-semibold">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-body-2 mb-4 flex list-disc flex-col gap-2 pl-5">
                      {children}
                    </ul>
                  ),
                }}
              >
                {event.description}
              </Markdown>
            </div>
          </Reveal>

          {event.highlights?.length ? (
            <section>
              <Reveal>
                <SectionEyebrow>What to expect</SectionEyebrow>
              </Reveal>
              <div className="mt-6 flex flex-col gap-4">
                {event.highlights.map((highlight, i) => (
                  <Reveal key={highlight.title} delay={i * 80}>
                    <NumberedPill
                      index={i + 1}
                      side={i % 2 === 1 ? "right" : "left"}
                      title={highlight.title}
                      description={highlight.description}
                    />
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}

          {event.rounds?.length ? (
            <section>
              <Reveal>
                <SectionEyebrow>How it ran</SectionEyebrow>
              </Reveal>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {event.rounds.map((round) => (
                  <Reveal key={round.name}>
                    <DrawFrame tone="accent" className="h-full">
                      <p className="font-display text-accent text-2xl uppercase">{round.name}</p>
                      <p className="text-body-3 mt-1 text-xs tracking-(--tracking-wide-label) uppercase">
                        {round.mode}
                      </p>
                      <p className="text-body-2 mt-3 text-sm leading-relaxed">
                        {round.description}
                      </p>
                      {round.deadline ? (
                        <p className="text-signal-red mt-4 text-sm font-semibold">
                          Deadline: {formatDateTime(round.deadline)}
                        </p>
                      ) : null}
                    </DrawFrame>
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}

          {sessions.length > 0 ? (
            <section>
              <Reveal>
                <SectionEyebrow>Sessions</SectionEyebrow>
              </Reveal>
              <ul className="mt-6 flex flex-col gap-3">
                {sessions.map((session, i) => (
                  <Reveal as="li" key={session.slug} delay={i * 60}>
                    <Link href={`/events/${session.slug}`} className="group block">
                      <Card interactive className="flex items-start gap-4 p-5">
                        <ChevronTick
                          tone="yellow"
                          size={18}
                          className="mt-1 transition-transform group-hover:translate-x-1"
                        />
                        <span>
                          <span className="font-condensed block text-base uppercase">
                            {session.title}
                          </span>
                          <span className="text-body-3 mt-1 block text-sm">
                            {session.shortDescription}
                          </span>
                        </span>
                      </Card>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </section>
          ) : null}

          {event.speakers?.length ? (
            <PeopleSection title="Speakers" people={event.speakers} />
          ) : null}
          {event.jury?.length ? <PeopleSection title="Jury" people={event.jury} /> : null}

          {event.results?.length ? (
            <section>
              <Reveal>
                <SectionEyebrow>Results</SectionEyebrow>
              </Reveal>
              <Podium results={event.results} />
            </section>
          ) : null}

          {event.participation ? (
            <ParticipationSection participation={event.participation} />
          ) : null}

          {event.takeaways?.length ? (
            <section>
              <Reveal>
                <SectionEyebrow>What we took away</SectionEyebrow>
              </Reveal>
              <ul className="mt-6 flex flex-col gap-3">
                {event.takeaways.map((takeaway, i) => (
                  <Reveal as="li" key={takeaway} delay={i * 60} className="flex items-start gap-3">
                    <ChevronTick tone="yellow" size={16} className="mt-1.5 shrink-0" />
                    <span className="text-body-2 text-sm leading-relaxed">{takeaway}</span>
                  </Reveal>
                ))}
              </ul>
            </section>
          ) : null}

          {event.faq?.length ? (
            <section>
              <Reveal>
                <SectionEyebrow>Questions</SectionEyebrow>
              </Reveal>
              <div className="mt-6 flex flex-col gap-3">
                {event.faq.map((item) => (
                  <Reveal key={item.q}>
                    {/* Native <details> gives keyboard support and works without JS. */}
                    <details className="border-line bg-surface-3 group rounded-(--radius-card) border-[1.5px] p-5">
                      <summary className="font-condensed cursor-pointer list-none text-base uppercase">
                        {item.q}
                      </summary>
                      <p className="text-body-2 mt-3 text-sm leading-relaxed">{item.a}</p>
                    </details>
                  </Reveal>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* ---- sidebar ---- */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
          <Reveal>
            <RegistrationSection event={event} gallerySlug={event.gallerySlug} />
          </Reveal>

          {!event.dateApproximate ? (
            <Reveal delay={60}>
              <div className="border-line bg-surface-3 rounded-(--radius-card) border-[1.5px] p-5">
                <p className="text-body-3 text-xs tracking-(--tracking-eyebrow) uppercase">
                  {upcoming ? "When" : "It happened on"}
                </p>
                <p className="font-condensed mt-2 text-(length:--text-heading) uppercase">
                  {formatDate(event.startsAt)}
                </p>
                <p className="text-body-2 mt-1 text-sm">
                  {formatTimeRange(event.startsAt, event.endsAt)}
                </p>
              </div>
            </Reveal>
          ) : null}

          {event.eligibility ? (
            <Reveal delay={90}>
              <InkPanel>
                <p className="font-condensed text-sm tracking-(--tracking-wide-label) uppercase">
                  Who could enter
                </p>
                <p className="mt-2 text-sm opacity-90">{event.eligibility}</p>
              </InkPanel>
            </Reveal>
          ) : null}

          <Reveal delay={120}>
            <div>
              <p className="text-body-3 mb-3 text-xs tracking-(--tracking-eyebrow) uppercase">
                Share this event
              </p>
              <EventActions
                title={event.title}
                url={url}
                icsContent={buildICS(event, site.url)}
                googleUrl={googleCalendarUrl(event, site.url)}
              />
            </div>
          </Reveal>
        </aside>
      </div>

      {/* ---- prev / next ---- */}
      <nav aria-label="Other events" className="container-site pt-8 pb-(--spacing-section)">
        <div className="border-line-soft grid gap-4 border-t pt-8 sm:grid-cols-2">
          {adjacent.previous ? (
            <Link href={`/events/${adjacent.previous.slug}`} className="group">
              <p className="text-body-3 flex items-center gap-2 text-xs tracking-(--tracking-eyebrow) uppercase">
                <ArrowLeft aria-hidden className="size-3.5" />
                Earlier
              </p>
              <p className="font-condensed group-hover:text-brand-blue mt-2 text-base uppercase transition-colors">
                {adjacent.previous.title}
              </p>
              <p className="text-body-3 mt-1 text-xs">{formatDate(adjacent.previous.startsAt)}</p>
            </Link>
          ) : (
            <span />
          )}

          {adjacent.next ? (
            <Link href={`/events/${adjacent.next.slug}`} className="group sm:text-right">
              <p className="text-body-3 flex items-center gap-2 text-xs tracking-(--tracking-eyebrow) uppercase sm:justify-end">
                Later
                <ArrowRight aria-hidden className="size-3.5" />
              </p>
              <p className="font-condensed group-hover:text-brand-blue mt-2 text-base uppercase transition-colors">
                {adjacent.next.title}
              </p>
              <p className="text-body-3 mt-1 text-xs">{formatDate(adjacent.next.startsAt)}</p>
            </Link>
          ) : null}
        </div>

        <ButtonLink href="/events" variant="secondary" size="sm" className="mt-8">
          All events
        </ButtonLink>
      </nav>
    </div>
  );
}

/* ---------------------------------------------------------------- helpers */

function PeopleSection({
  title,
  people,
}: {
  title: string;
  people: NonNullable<Awaited<ReturnType<typeof getEventBySlug>>>["speakers"];
}) {
  if (!people?.length) return null;

  return (
    <section>
      <Reveal>
        <SectionEyebrow>{title}</SectionEyebrow>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {people.map((person, i) => (
          <Reveal key={person.name} delay={i * 60}>
            <Card className="h-full p-5">
              <p className="font-condensed text-base uppercase">{person.name}</p>
              <p className="text-body-3 mt-1.5 text-sm leading-relaxed">{person.role}</p>
              {person.linkedin ? (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue mt-3 inline-block text-sm underline underline-offset-4"
                >
                  LinkedIn
                </a>
              ) : null}
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/**
 * The winners' podium. Rendered 3rd, 2nd, 1st so the CSS stagger rises in that order —
 * the reveal builds to the winner rather than starting with them.
 *
 * Ties are ordinary: two teams can share position 2, and they simply get two blocks of
 * the same height. Notes ("Also won Audience Favourite") go in a list underneath rather
 * than inside the blocks, which are too narrow for a sentence at 360px.
 */
function Podium({ results }: { results: EventResult[] }) {
  const ordered = [...results].sort((a, b) => b.position - a.position);
  const heights: Record<number, string> = { 1: "h-32", 2: "h-24", 3: "h-20" };
  const annotated = ordered.filter((r) => r.note);

  return (
    <Reveal>
      <div className="podium-rise mt-6 flex items-end justify-center gap-2 sm:gap-5">
        {ordered.map((result, i) => (
          <div
            key={result.teamName}
            style={{ "--i": i } as React.CSSProperties}
            className="flex w-full max-w-40 flex-col items-center"
          >
            <p className="font-condensed mb-2 text-center text-sm uppercase">{result.teamName}</p>
            <div
              className={`border-line bg-accent text-accent-contrast grid w-full place-items-center rounded-t-(--radius-card) border-[1.5px] ${heights[result.position] ?? "h-16"}`}
            >
              <span className="font-display text-3xl leading-none">{result.position}</span>
            </div>
          </div>
        ))}
      </div>

      {annotated.length > 0 ? (
        <dl className="text-body-3 mx-auto mt-6 flex max-w-xl flex-col gap-2 text-sm">
          {annotated.map((result) => (
            <div key={result.teamName} className="flex flex-wrap gap-x-2">
              <dt className="font-condensed text-body-2 uppercase">{result.teamName}</dt>
              <dd className="flex-1 basis-40">{result.note}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Reveal>
  );
}

/**
 * Turnout, from the club's own event reports. The figures are the reports' own rounded
 * ones, so they are labelled with a "+" rather than presented as an exact headcount.
 */
function ParticipationSection({ participation }: { participation: EventParticipation }) {
  const stats = [
    { value: participation.participants, label: "Participants" },
    { value: participation.colleges, label: "Colleges" },
    { value: participation.teamsEntered, label: "Teams entered" },
    { value: participation.teamsShortlisted, label: "Teams in the finale" },
  ].filter((stat): stat is { value: number; label: string } => stat.value !== undefined);

  if (stats.length === 0) return null;

  return (
    <section>
      <Reveal>
        <SectionEyebrow>By the numbers</SectionEyebrow>
      </Reveal>
      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 60}>
            <Card surface="sunken" className="h-full px-4 py-5">
              <dd className="font-display text-accent text-3xl leading-none">
                {stat.value}
                {participation.approximate ? "+" : ""}
              </dd>
              <dt className="text-body-3 mt-2 text-xs tracking-(--tracking-wide-label) uppercase">
                {stat.label}
              </dt>
            </Card>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
