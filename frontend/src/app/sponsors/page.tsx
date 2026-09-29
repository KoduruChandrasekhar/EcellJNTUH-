import type { Metadata } from "next";
import { Download } from "lucide-react";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { CrossGrid } from "@/components/brand/CrossGrid";
import { NumberedPill } from "@/components/brand/NumberedPill";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { CountUp } from "@/components/motion/CountUp";
import { Marquee } from "@/components/motion/Marquee";
import { Magnetic, Tilt } from "@/components/motion/Pointer";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { Card } from "@/components/ui/card";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { getPartners, getSiteConfig, getSponsors } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sponsors",
  description:
    "Partner with E-Cell JNTU Hyderabad — reach engineering students across Telangana through ETHOS and our competitions.",
};

/** Prefilled so enquiries arrive already labelled. */
const MAIL_SUBJECT = encodeURIComponent("Sponsorship enquiry – E-Cell JNTUH");

export default async function SponsorsPage() {
  const [sponsors, site, partners] = await Promise.all([
    getSponsors(),
    getSiteConfig(),
    getPartners(),
  ]);

  const contactHref = site.email
    ? `mailto:${site.email}?subject=${MAIL_SUBJECT}`
    : (site.socials.linkedin ?? "/contact");

  return (
    <>
      {/* ---- hero ---- */}
      <section className="container-site section-y relative overflow-hidden">
        <CrossGrid
          cols={4}
          rows={2}
          className="text-brand-blue pointer-events-none absolute top-0 right-0 opacity-20"
        />
        <SectionEyebrow>Partner with us</SectionEyebrow>
        <SplitHeadline
          as="h1"
          size="display"
          solid="Partner with E-Cell JNTUH"
          outline="Back the next generation"
          accent="yellow"
          className="mt-3 max-w-4xl"
        />
        <p className="text-body-2 mt-7 max-w-2xl text-lg text-balance">{sponsors.intro}</p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Magnetic>
            <ExternalButtonLink href={contactHref} size="lg">
              Become a sponsor
            </ExternalButtonLink>
          </Magnetic>
          {sponsors.brochureUrl ? (
            <ExternalButtonLink href={sponsors.brochureUrl} variant="secondary" size="lg">
              <Download aria-hidden className="size-4" />
              Download the brochure
            </ExternalButtonLink>
          ) : null}
        </div>
      </section>

      {/* ---- reach: yellow band ---- */}
      <section className="band-yellow">
        <div className="container-site py-14">
          <SectionEyebrow className="!text-ink">Our reach</SectionEyebrow>
          <dl className="mt-8 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {sponsors.reach.map((stat, i) => (
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
          {/* Honesty beats a bigger number: unconfirmed figures are labelled as such. */}
          <p className="mt-8 text-xs opacity-70">
            Figures marked ~ are estimates pending confirmation by the club. Ask us for the verified
            numbers before committing to anything.
          </p>
        </div>
      </section>

      {/* ---- why partner ---- */}
      <section className="container-site section-y">
        <Reveal>
          <SectionEyebrow>Why partner</SectionEyebrow>
          <SplitHeadline solid="What you get" outline="Out of it" className="mt-3" />
        </Reveal>

        <div className="mt-10 flex flex-col gap-4">
          {sponsors.whyPartner.map((item, i) => (
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

      {/* ---- tiers ---- */}
      <section className="bg-surface-2 border-line-soft section-y border-y">
        <div className="container-site">
          <Reveal>
            <SectionEyebrow>Opportunities</SectionEyebrow>
            <SplitHeadline solid="Sponsorship" outline="Tiers" accent="blue" className="mt-3" />
            <p className="text-body-3 mt-4 max-w-xl text-sm">
              {/* TODO: tiers and benefits are placeholders until the club's deck is final. */}
              Indicative tiers. We tailor packages to what you actually want out of it — talk to us
              and we will put a proposal together.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {sponsors.tiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 70}>
                <Tilt max={4}>
                  <Card className="flex h-full flex-col p-6">
                    <h3 className="font-condensed text-(length:--text-heading) uppercase">
                      {tier.name}
                    </h3>
                    <p className="text-body-3 mt-2 text-sm">{tier.summary}</p>

                    <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                      {tier.benefits.map((benefit) => (
                        <li key={benefit} className="text-body-2 flex items-start gap-2 text-sm">
                          <ChevronTick tone="yellow" size={14} className="mt-1" />
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    <p className="text-body-3 border-line-soft mt-6 border-t pt-4 text-xs tracking-(--tracking-wide-label) uppercase">
                      Contact us for details
                    </p>
                  </Card>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- deliverables ---- */}
      <section className="container-site section-y">
        <Reveal>
          <SectionEyebrow>Every package includes</SectionEyebrow>
        </Reveal>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.whatYouGet.map((item, i) => (
            <Reveal as="li" key={item} delay={i * 50}>
              <div className="border-line-soft bg-surface-3 flex items-start gap-3 rounded-(--radius-card) border p-4">
                <ChevronTick tone="blue" size={15} className="mt-0.5" />
                <span className="text-body-2 text-sm">{item}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---- past collaborators ---- */}
      {partners.length > 0 ? (
        <section className="border-line-soft border-y py-12">
          <div className="container-site">
            <SectionEyebrow className="text-center">Past collaborators</SectionEyebrow>
          </div>
          {/* TODO: real logos pending approval — styled wordmarks until then. */}
          <Marquee durationSeconds={34} className="mt-6">
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

      {/* ---- contact: blue band ---- */}
      <section className="band-blue">
        <div className="container-site py-16 text-center">
          <SplitHeadline solid="Let's talk" outline="Numbers" align="center" className="mx-auto" />
          <p className="mx-auto mt-5 max-w-md opacity-90">
            Tell us what you want out of it and we will come back with a proposal.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Magnetic>
              <ExternalButtonLink href={contactHref} size="lg">
                {site.email ? "Email us" : "Message us"}
              </ExternalButtonLink>
            </Magnetic>
            {sponsors.enquiryFormUrl ? (
              <ExternalButtonLink href={sponsors.enquiryFormUrl} variant="secondary" size="lg">
                Fill the enquiry form
              </ExternalButtonLink>
            ) : (
              <ButtonLink href="/contact" variant="secondary" size="lg">
                Other ways to reach us
              </ButtonLink>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
