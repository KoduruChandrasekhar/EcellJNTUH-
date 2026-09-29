import type { Metadata } from "next";
import Link from "next/link";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { NumberedPill } from "@/components/brand/NumberedPill";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { Tilt } from "@/components/motion/Pointer";
import { Card } from "@/components/ui/card";
import { getInitiatives } from "@/lib/data";

export const metadata: Metadata = {
  title: "Initiatives",
  description:
    "The three things E-Cell JNTU Hyderabad runs: the ETHOS flagship, competitions, and workshops and speaker sessions.",
};

export default async function InitiativesPage() {
  const initiatives = await getInitiatives();

  return (
    <div className="container-site section-y">
      <Reveal>
        <SectionEyebrow>What we run</SectionEyebrow>
        <SplitHeadline as="h1" solid="Our" outline="Initiatives" accent="yellow" className="mt-3" />
        <p className="text-body-2 mt-6 max-w-xl text-balance">
          Three strands, one idea: give students somewhere low-risk to practise the things
          entrepreneurship actually demands.
        </p>
      </Reveal>

      <div className="mt-12 flex flex-col gap-5">
        {initiatives.map((initiative, i) => (
          <Reveal key={initiative.slug} delay={i * 90}>
            <Link href={`/initiatives/${initiative.slug}`} className="group block">
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

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {initiatives.map((initiative, i) => (
          <Reveal key={initiative.slug} delay={i * 80}>
            <Tilt>
              <Card interactive className="relative h-full p-6">
                <h2 className="font-condensed text-(length:--text-heading) uppercase">
                  <Link
                    href={`/initiatives/${initiative.slug}`}
                    className="after:absolute after:inset-0"
                  >
                    {initiative.title}
                  </Link>
                </h2>
                <p className="text-body-3 mt-2 text-xs tracking-(--tracking-wide-label) uppercase">
                  {initiative.eventSlugs.length} events
                </p>
                <p className="text-body-2 mt-3 text-sm leading-relaxed">{initiative.purpose}</p>
                <ChevronTick tone="yellow" size={18} className="mt-5" />
              </Card>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
