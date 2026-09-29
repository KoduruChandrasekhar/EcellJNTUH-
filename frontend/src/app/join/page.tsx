import type { Metadata } from "next";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { CrossGrid } from "@/components/brand/CrossGrid";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Marquee } from "@/components/motion/Marquee";
import { Magnetic } from "@/components/motion/Pointer";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { NumberedPill } from "@/components/brand/NumberedPill";
import { Badge } from "@/components/ui/badge";
import { ExternalButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getJoin, getSiteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Join us",
  description:
    "Join the E-Cell JNTU Hyderabad organising committee — real events, real budgets, real deadlines.",
};

export default async function JoinPage() {
  const [join, site] = await Promise.all([getJoin(), getSiteConfig()]);

  return (
    <div data-accent="sky">
      <section className="container-site section-y relative overflow-hidden">
        <CrossGrid
          cols={4}
          rows={2}
          className="text-sky pointer-events-none absolute top-0 right-0 opacity-25"
        />
        <SectionEyebrow>Open roles</SectionEyebrow>
        <SplitHeadline
          as="h1"
          size="display"
          solid="Run the room,"
          outline="Don't just sit in it"
          accent="blue"
          className="mt-3"
        />
        <p className="text-body-2 mt-6 max-w-xl text-lg text-balance">{join.intro}</p>

        <div className="mt-9">
          {site.recruitmentOpen && site.joinFormUrl ? (
            <Magnetic>
              <ExternalButtonLink href={site.joinFormUrl} size="lg">
                Apply now
              </ExternalButtonLink>
            </Magnetic>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <Badge tone="closed">Applications are closed</Badge>
              <ExternalButtonLink
                href={site.socials.instagram ?? "https://www.instagram.com/ecell_jntuh/"}
                variant="secondary"
              >
                Follow for the next round
              </ExternalButtonLink>
            </div>
          )}
        </div>
      </section>

      <section aria-hidden className="border-line-soft border-y py-4">
        <Marquee durationSeconds={30}>
          {["Build", "Pitch", "Organise", "Design", "Lead"].map((word, i) => (
            <span key={i} className="flex items-center">
              <span className="font-display text-body-3 px-6 text-2xl uppercase md:text-4xl">
                {word}
              </span>
              <ChevronTick tone={i % 2 ? "blue" : "yellow"} size={18} />
            </span>
          ))}
        </Marquee>
      </section>

      <section className="container-site section-y">
        <Reveal>
          <SectionEyebrow>Why join</SectionEyebrow>
        </Reveal>
        <div className="mt-8 flex flex-col gap-4">
          {join.whyJoin.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <NumberedPill
                index={i + 1}
                side={i % 2 === 1 ? "right" : "left"}
                title={item.title}
                description={item.description}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-site section-y border-line-soft border-t">
        <Reveal>
          <SectionEyebrow>Open roles</SectionEyebrow>
          <p className="text-body-3 mt-3 text-sm">
            {/* TODO: confirm the live roles with the committee before recruitment opens. */}
            Indicative roles — the exact list is confirmed when applications open.
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {join.roles.map((role, i) => (
            <Reveal key={role.title} delay={i * 70}>
              <Card className="h-full p-6">
                <h2 className="font-condensed text-(length:--text-heading) uppercase">
                  {role.title}
                </h2>
                <p className="text-body-2 mt-2 text-sm">{role.description}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {role.requirements.map((req) => (
                    <li key={req} className="text-body-2 flex items-start gap-2 text-sm">
                      <ChevronTick tone="blue" size={14} className="mt-1" />
                      {req}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
