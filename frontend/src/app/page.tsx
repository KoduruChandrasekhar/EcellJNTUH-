import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { ChevronDivider, ChevronPair, ChevronTick } from "@/components/brand/ChevronPair";
import { CrossGrid } from "@/components/brand/CrossGrid";
import { MarkWatermark } from "@/components/brand/MarkWatermark";
import { NumberedPill } from "@/components/brand/NumberedPill";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { InstagramIcon, LinkedinIcon } from "@/components/brand/SocialIcons";
import { CountUp } from "@/components/motion/CountUp";
import { Marquee } from "@/components/motion/Marquee";
import { Magnetic, Spotlight, Tilt } from "@/components/motion/Pointer";
import { Reveal } from "@/components/motion/Reveal";
import { LiveWordmark } from "@/components/motion/LiveWordmark";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { Typewriter } from "@/components/motion/Typewriter";
import { Countdown } from "@/components/sections/Countdown";
import { EventCard } from "@/components/sections/EventCard";
import { HeroComposition } from "@/components/sections/HeroComposition";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { NextEventChip } from "@/components/sections/NextEventChip";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getFeaturedEvent,
  getFlagshipEvent,
  getGallery,
  getInitiatives,
  getPartners,
  getInstagramFeed,
  getPastEvents,
  getSiteConfig,
  getStats,
  getSubEvents,
  getUpcomingEvents,
} from "@/lib/data";
import { isPast } from "@/lib/dates";

export default async function HomePage() {
  // Every one of these is a data-layer call — the page reads no content file directly.
  const [site, stats, featured, flagship, upcoming, past, initiatives, partners, albums, feed] =
    await Promise.all([
      getSiteConfig(),
      getStats(),
      getFeaturedEvent(),
      getFlagshipEvent(),
      getUpcomingEvents(3),
      getPastEvents(6),
      getInitiatives(),
      getPartners(),
      getGallery(),
      getInstagramFeed(4),
    ]);

  const sessions = flagship ? await getSubEvents(flagship.slug) : [];
  const featuredIsAhead = featured ? !isPast(featured) : false;
  const flagshipIsAhead = flagship ? !isPast(flagship) : false;
  const photos = albums.flatMap((album) => album.images).slice(0, 8);
  const withPosters = past.filter((event) => event.poster);

  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      {/* overflow-x-clip: the hero's decorative rings rotate, and a rotated square has a
          bounding box ~1.41x its own width, which pushed the document sideways between
          roughly 1000px and 1280px. `clip` rather than `hidden` so no scroll container is
          created and sticky positioning inside still works. */}
      <section className="-mt-20 flex min-h-dvh items-center overflow-x-clip md:-mt-24">
        <div className="container-site grid w-full grid-cols-1 gap-12 pt-28 pb-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-8 lg:pt-24">
          <div>
            {featured && featuredIsAhead ? (
              <div className="mb-6">
                <NextEventChip
                  slug={featured.slug}
                  title={featured.title.split("—")[0]?.trim() ?? featured.title}
                  startsAt={featured.startsAt}
                />
              </div>
            ) : null}

            <SectionEyebrow>{site.tagline}</SectionEyebrow>

            {/* The wordmark waves and cycles colour; the outlined line below types out its
                final word. */}
            <div className="mt-4">
              <h1 className="font-display text-(length:--text-hero) leading-(--leading-display) tracking-(--tracking-display) uppercase">
                <LiveWordmark text={site.shortName} />
              </h1>
              <p className="font-display text-outline-thick text-body text-(length:--text-hero) leading-(--leading-display) tracking-(--tracking-display) uppercase">
                Build what&apos;s <Typewriter words={["next", "bold", "real", "yours"]} />
              </p>
            </div>

            <p className="text-body-2 mt-7 max-w-lg text-lg text-balance">{site.heroIntro}</p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic>
                {featured ? (
                  <ButtonLink href={`/events/${featured.slug}`} size="lg">
                    {featuredIsAhead ? "Register for " : "Explore "}
                    {featured.title.split("—")[0]?.trim()}
                  </ButtonLink>
                ) : (
                  <ButtonLink href="/events" size="lg">
                    Explore our events
                  </ButtonLink>
                )}
              </Magnetic>
              <ButtonLink href="/sponsors" variant="secondary" size="lg">
                Partner with us
              </ButtonLink>
            </div>
          </div>

          {/* On mobile the composition drops below the text and shrinks. */}
          <div className="order-last flex justify-center">
            <div className="w-[min(20rem,72vw)] lg:w-full lg:max-w-lg">
              <HeroComposition />
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden className="container-site mb-10 flex justify-center lg:mb-16">
        <span className="scroll-cue text-body-3 flex flex-col items-center gap-1 text-xs tracking-(--tracking-eyebrow) uppercase">
          Scroll
          <ArrowDown className="size-4" />
        </span>
      </div>

      {/* ---------------------------------------------------- stats: yellow */}
      <section className="band-yellow">
        <div className="container-site py-14">
          <SectionEyebrow className="!text-navy">By the numbers</SectionEyebrow>
          <dl className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 70}>
                <div className="border-ink/25 border-t pt-4">
                  <dd className="font-wide text-4xl leading-none font-bold md:text-5xl">
                    {stat.approximate ? <span aria-hidden>~</span> : null}
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </dd>
                  <dt className="mt-3 text-sm font-medium">{stat.label}</dt>
                </div>
              </Reveal>
            ))}
          </dl>
          <p className="mt-8 text-xs opacity-70">Figures marked ~ are approximate.</p>
        </div>
      </section>

      {/* ------------------------------------------------- ETHOS: charcoal */}
      {flagship ? (
        <section data-accent={flagship.accent} className="band-charcoal relative overflow-hidden">
          <Spotlight />
          <div className="container-site section-y relative">
            <Reveal>
              <SectionEyebrow className="!text-brand-yellow">Our flagship</SectionEyebrow>
              <SplitHeadline
                solid={flagship.title.split("—")[0]?.trim() ?? flagship.title}
                outline={flagship.title.split("—")[1]?.trim()}
                accent="yellow"
                className="mt-3"
              />
              {flagship.tagline ? (
                <p className="font-condensed mt-5 text-lg tracking-(--tracking-wide-label) text-white/70 uppercase">
                  {flagship.tagline}
                </p>
              ) : null}
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
              <Reveal delay={80}>
                <p className="text-lg leading-relaxed opacity-90">{flagship.shortDescription}</p>
                {flagship.theme ? (
                  <p className="mt-4 text-sm opacity-70">
                    Theme: <strong className="font-semibold">{flagship.theme}</strong>
                  </p>
                ) : null}

                {sessions.length > 0 ? (
                  <ul className="mt-7 flex flex-col gap-2">
                    {sessions.map((session) => (
                      <li key={session.slug}>
                        <Link
                          href={`/events/${session.slug}`}
                          className="group flex items-start gap-2 text-sm opacity-80 transition-opacity hover:opacity-100"
                        >
                          <ChevronTick
                            tone="yellow"
                            size={14}
                            className="mt-1 transition-transform group-hover:translate-x-1"
                          />
                          {session.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <ButtonLink href={`/events/${flagship.slug}`} className="mt-8">
                  {flagshipIsAhead ? "Event details" : "Read the full story"}
                </ButtonLink>
              </Reveal>

              <Reveal delay={150}>
                {flagshipIsAhead ? (
                  <div>
                    <p className="font-condensed text-(length:--text-heading) uppercase">
                      Counting down
                    </p>
                    <div className="mt-5">
                      <Countdown target={flagship.startsAt} />
                    </div>
                  </div>
                ) : (
                  <>
                    {flagship.results?.length ? (
                      <div>
                        <p className="font-condensed text-(length:--text-heading) uppercase">
                          How it finished
                        </p>
                        <ol className="mt-5 flex flex-col gap-2">
                          {flagship.results.map((result) => (
                            <li
                              key={result.teamName}
                              className="flex items-center gap-4 rounded-(--radius-card) bg-white/5 px-4 py-3"
                            >
                              <span className="font-display text-brand-yellow text-2xl leading-none">
                                {result.position}
                              </span>
                              <span className="font-medium">{result.teamName}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}

                    <p className="mt-7 text-sm opacity-70">
                      Next edition coming soon — follow us for the announcement.
                    </p>
                  </>
                )}
              </Reveal>
            </div>
          </div>

          <CrossGrid
            cols={4}
            rows={2}
            className="text-brand-yellow pointer-events-none absolute right-6 bottom-6 opacity-20"
          />
        </section>
      ) : null}

      {/* ------------------------------------------------- upcoming events */}
      <section className="container-site section-y">
        <Reveal>
          <SectionEyebrow>What&apos;s next</SectionEyebrow>
          <SplitHeadline solid="Upcoming" outline="Events" size="title" className="mt-3" />
        </Reveal>

        {upcoming.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event, i) => (
              <Reveal key={event.slug} delay={i * 80}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        ) : (
          /* Designed empty state — never a blank area. */
          <Reveal delay={80}>
            <Card
              surface="sunken"
              className="relative mt-10 flex flex-col items-center overflow-hidden px-6 py-14 text-center"
            >
              <MarkWatermark size={220} />
              <ChevronPair size={30} />
              <p className="font-condensed mt-6 text-(length:--text-heading) uppercase">
                Next event dropping soon
              </p>
              <p className="text-body-2 mt-2 max-w-sm text-sm">
                Nothing on the calendar right now. Follow us on Instagram — that&apos;s where it
                lands first.
              </p>
              <ExternalButtonLink
                href={site.socials.instagram ?? "https://www.instagram.com/ecell_jntuh/"}
                variant="secondary"
                size="sm"
                className="mt-6"
              >
                Follow on Instagram
              </ExternalButtonLink>
            </Card>
          </Reveal>
        )}
      </section>

      {/* --------------------------------------------------- recent events */}
      {past.length > 0 ? (
        <section className="bg-surface-2 border-line-soft section-y overflow-x-clip border-y">
          {/* overflow-x-clip above: the rail deliberately breaks out of the container with
              -mx-4 so cards run to the screen edge. `clip` stops that becoming sideways
              page scroll, without creating a scroll container the way `hidden` would. */}
          <div className="container-site">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <SectionEyebrow>Where we&apos;ve been</SectionEyebrow>
                  <SplitHeadline solid="Recent" outline="Events" size="title" className="mt-3" />
                </div>
                <ButtonLink href="/events" variant="secondary" size="sm">
                  All events
                </ButtonLink>
              </div>
            </Reveal>

            {/* Scroll-snap rail on phones, staggered grid from md up.
                The rail reveals as one unit rather than per card: a card scrolled out of
                view *horizontally* never intersects the viewport, so per-card reveals left
                them permanently invisible for anyone who didn't swipe. */}
            <Reveal>
              <ul className="snap-rail -mx-4 mt-10 flex gap-5 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
                {past.map((event) => (
                  <li key={event.slug} className="w-[78vw] shrink-0 sm:w-[58vw] md:w-auto">
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ----------------------------------------------------- initiatives */}
      <section className="container-site section-y">
        <Reveal>
          <SectionEyebrow>What we do</SectionEyebrow>
          <SplitHeadline solid="Three" outline="Ways in" size="title" className="mt-3" />
        </Reveal>

        <div className="mt-10 flex flex-col gap-4">
          {initiatives.map((initiative, i) => (
            <Reveal key={initiative.slug} delay={i * 80}>
              <Link href={`/initiatives/${initiative.slug}`} className="block">
                <NumberedPill
                  index={i + 1}
                  side={i % 2 === 1 ? "right" : "left"}
                  title={initiative.title}
                  description={initiative.summary}
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------- gallery strip */}
      {photos.length > 0 ? (
        <section className="section-y border-line-soft border-y">
          <div className="container-site">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <SectionEyebrow>In the room</SectionEyebrow>
                  <SplitHeadline solid="Gallery" size="title" className="mt-3" />
                </div>
                <ButtonLink href="/gallery" variant="secondary" size="sm">
                  Open gallery
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Marquee durationSeconds={46} className="mt-4 py-8">
            {photos.map((photo) => (
              <Link
                key={photo.src}
                href="/gallery"
                className="photo-pop border-line mx-2 block h-44 w-64 shrink-0 overflow-hidden rounded-(--radius-card) border-[1.5px] md:h-56 md:w-80"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="320px"
                  className="h-full w-full object-cover"
                />
              </Link>
            ))}
          </Marquee>
        </section>
      ) : null}

      {/* -------------------------------------------------------- partners */}
      {partners.length > 0 ? (
        <section className="py-12">
          <div className="container-site">
            <SectionEyebrow className="text-center">Collaborators</SectionEyebrow>
          </div>
          <Marquee durationSeconds={36} className="mt-6">
            {partners.map((partner) => (
              <span
                key={partner.id}
                className="border-line text-body-2 font-condensed mx-3 rounded-(--radius-pill) border-[1.5px] px-6 py-3 text-sm tracking-(--tracking-wide-label) whitespace-nowrap uppercase"
              >
                {partner.name}
              </span>
            ))}
          </Marquee>
        </section>
      ) : null}

      {/* --------------------------------------------------- sponsors: blue */}
      <section className="band-blue">
        <div className="container-site py-16">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <SplitHeadline
                solid="Put your brand in front of"
                outline="Telangana's student founders"
                className="max-w-3xl"
              />
              <p className="mt-5 max-w-xl opacity-90">
                Our events are intercollegiate — teams travel in from across the state. Sponsor one
                and you are in the room with them.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Magnetic>
                <ButtonLink href="/sponsors" size="lg">
                  Become a sponsor
                </ButtonLink>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- follow us */}
      <section className="container-site section-y">
        <Reveal>
          <SectionEyebrow>Follow along</SectionEyebrow>
          <SplitHeadline solid="See it" outline="As it happens" size="title" className="mt-3" />
          <p className="text-body-2 mt-5 max-w-lg">
            {feed.posts.length > 0
              ? "Straight from @ecell_jntuh — pulled in automatically, served from our own images, with no embed script loading in your browser."
              : "Every event lands on Instagram first. These are our own posters, served from our own images — no embed script, so nothing third-party loads in your browser."}
          </p>
        </Reveal>

        {/* The live feed when it has synced, event posters when it hasn't. Empty is a real
            state, not a failure: the section has to look finished before the Instagram
            credentials exist, and has to survive the API going down afterwards. */}
        {feed.posts.length > 0 ? (
          <Reveal>
            <InstagramFeed posts={feed.posts} />
          </Reveal>
        ) : (
          <ul className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {withPosters.slice(0, 4).map((event, i) => (
              <Reveal as="li" key={event.slug} delay={i * 70}>
                <Tilt max={6}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="border-line block aspect-square overflow-hidden rounded-(--radius-card) border-[1.5px]"
                  >
                    <Image
                      src={event.poster!}
                      alt={event.posterAlt ?? event.title}
                      width={600}
                      height={600}
                      sizes="(min-width: 1024px) 280px, 45vw"
                      className="h-full w-full object-cover"
                    />
                  </Link>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {site.socials.instagram ? (
            <ExternalButtonLink href={site.socials.instagram} variant="secondary">
              <InstagramIcon className="size-4" />
              Instagram
            </ExternalButtonLink>
          ) : null}
          {site.socials.linkedin ? (
            <ExternalButtonLink href={site.socials.linkedin} variant="secondary">
              <LinkedinIcon className="size-4" />
              LinkedIn
            </ExternalButtonLink>
          ) : null}
        </div>
      </section>

      <ChevronDivider className="container-site" />
    </>
  );
}
