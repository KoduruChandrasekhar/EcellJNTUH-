import type { Metadata } from "next";
import { ChevronDivider, ChevronTick } from "@/components/brand/ChevronPair";
import { MarkWatermark } from "@/components/brand/MarkWatermark";
import { CrossGrid } from "@/components/brand/CrossGrid";
import { InkPanel } from "@/components/brand/DottedFrame";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { WireGlobe } from "@/components/brand/WireGlobe";
import { ParallaxLayer, ScrollProgress } from "@/components/motion/Scroll";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { Spotlight } from "@/components/motion/Pointer";
import { Timeline } from "@/components/sections/Timeline";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAbout, getEventBySlug, getSiteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who E-Cell, JNTU Hyderabad is, where it came from, and what it is trying to build on campus.",
};

export default async function AboutPage() {
  const [about, site, ethos] = await Promise.all([
    getAbout(),
    getSiteConfig(),
    getEventBySlug("ethos-2026"),
  ]);

  return (
    <>
      {/* A long page, so the reader gets a progress bar. */}
      <ScrollProgress />

      <section className="container-site section-y relative overflow-hidden">
        <ParallaxLayer
          distance={30}
          className="pointer-events-none absolute -top-10 -right-24 size-72 opacity-25 md:size-[26rem] md:opacity-40"
        >
          <WireGlobe />
        </ParallaxLayer>

        <Reveal>
          <SectionEyebrow>Who we are</SectionEyebrow>
          <SplitHeadline
            as="h1"
            size="display"
            solid="Innovate, connect,"
            outline="Elevate"
            accent="yellow"
            className="mt-3 max-w-3xl"
          />
        </Reveal>

        <Reveal delay={100}>
          {/* The club's own words. Edited only for flow — see about.ts. */}
          <p className="text-body mt-8 max-w-2xl text-xl leading-relaxed text-balance">
            {about.intro}
          </p>
          {about.alsoKnownAs ? (
            <p className="text-body-3 mt-4 max-w-2xl text-sm">{about.alsoKnownAs}</p>
          ) : null}
        </Reveal>
      </section>

      <ChevronDivider className="container-site" />

      {/* ---- vision / mission ---- */}
      <section className="container-site section-y">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full p-7">
              <SectionEyebrow>Vision</SectionEyebrow>
              <p className="text-body mt-4 text-lg leading-relaxed">{about.vision}</p>
            </Card>
          </Reveal>
          <Reveal delay={90}>
            <Card className="h-full p-7">
              <SectionEyebrow>Mission</SectionEyebrow>
              <p className="text-body mt-4 text-lg leading-relaxed">{about.mission}</p>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="mt-6">
            <InkPanel>
              <p className="font-condensed text-(length:--text-heading) tracking-(--tracking-wide-label) uppercase">
                What we do
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {about.objectives.map((objective) => (
                  <li key={objective} className="flex items-start gap-3 text-sm leading-relaxed">
                    <ChevronTick tone="yellow" size={15} className="mt-1" />
                    {objective}
                  </li>
                ))}
              </ul>
            </InkPanel>
          </div>
        </Reveal>
      </section>

      {/* ---- ETHOS feature ---- */}
      {ethos ? (
        <section data-accent="eco" className="band-charcoal relative overflow-hidden">
          <Spotlight />
          <div className="container-site section-y relative">
            <Reveal>
              <SectionEyebrow className="text-brand-yellow">Our flagship</SectionEyebrow>
              <SplitHeadline solid="Ethos" outline="Every year" accent="yellow" className="mt-3" />
            </Reveal>

            <Reveal delay={90}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed opacity-90">
                {ethos.shortDescription}
              </p>
              <p className="mt-4 max-w-2xl opacity-75">
                The first edition was conceptualised and executed within a week, and still drew 150+
                students. The second took on sustainability, with an industry jury and teams from
                across Telangana.
              </p>

              <ButtonLink href={`/events/${ethos.slug}`} variant="primary" className="mt-8">
                Read the ETHOS 2026 story
              </ButtonLink>
            </Reveal>
          </div>

          <CrossGrid
            cols={4}
            rows={2}
            className="text-brand-yellow pointer-events-none absolute right-6 bottom-6 opacity-20"
          />
        </section>
      ) : null}

      {/* ---- timeline ---- */}
      <section className="container-site section-y">
        <Reveal>
          <SectionEyebrow>How we got here</SectionEyebrow>
          <SplitHeadline solid="The" outline="Timeline" className="mt-3" />
        </Reveal>

        <Timeline milestones={about.milestones} className="mt-12" />
      </section>

      {/* ---- CTA ---- */}
      <section className="container-site pb-(--spacing-section)">
        <Reveal>
          <div className="border-line relative overflow-hidden rounded-(--radius-panel) border-[1.5px] p-8 text-center md:p-12">
            <MarkWatermark />
            <p className="font-condensed text-(length:--text-heading) tracking-(--tracking-wide-label) uppercase">
              Want in?
            </p>
            <p className="text-body-2 mx-auto mt-3 max-w-md">
              {site.shortName} runs on students who want to build something bigger than a resume
              line.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/join">Join the team</ButtonLink>
              <ButtonLink href="/team" variant="secondary">
                Meet the team
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
