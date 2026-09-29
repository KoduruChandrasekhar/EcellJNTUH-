import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { InstagramIcon, LinkedinIcon } from "@/components/brand/SocialIcons";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { Card } from "@/components/ui/card";
import { ExternalButtonLink } from "@/components/ui/button";
import { getSiteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with E-Cell, JNTU Hyderabad.",
};

/** Where to send people who arrive here with a specific need. */
const ROUTES = [
  {
    href: "/sponsors",
    title: "Sponsor an event",
    description: "Put your brand in front of student founders across Telangana.",
  },
  {
    href: "/join",
    title: "Join the committee",
    description: "Run the events rather than just attending them.",
  },
  {
    href: "/events",
    title: "Attend an event",
    description: "See what is coming up and what we have already run.",
  },
];

export default async function ContactPage() {
  const site = await getSiteConfig();

  return (
    <div className="container-site section-y">
      <Reveal>
        <SectionEyebrow>Say hello</SectionEyebrow>
        <SplitHeadline as="h1" solid="Get in" outline="Touch" accent="blue" className="mt-3" />
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-6">
          <Reveal>
            <Card className="p-6">
              <h2 className="font-condensed text-(length:--text-heading) uppercase">Reach us</h2>

              <ul className="mt-5 flex flex-col gap-4 text-sm">
                <li className="flex gap-3">
                  <Mail aria-hidden className="text-brand-blue mt-0.5 size-5 shrink-0" />
                  {site.email ? (
                    <a
                      href={`mailto:${site.email}`}
                      className="text-body-2 hover:text-brand-blue underline underline-offset-4"
                    >
                      {site.email}
                    </a>
                  ) : (
                    /* No invented address — the club has not confirmed one yet. */
                    <span className="text-body-3">
                      Official email coming soon — reach us on Instagram or LinkedIn meanwhile.
                    </span>
                  )}
                </li>
                <li className="flex gap-3">
                  <MapPin aria-hidden className="text-brand-blue mt-0.5 size-5 shrink-0" />
                  <span className="text-body-2">{site.address}</span>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                {site.socials.instagram ? (
                  <ExternalButtonLink href={site.socials.instagram} variant="secondary" size="sm">
                    <InstagramIcon className="size-4" />
                    Instagram
                  </ExternalButtonLink>
                ) : null}
                {site.socials.linkedin ? (
                  <ExternalButtonLink href={site.socials.linkedin} variant="secondary" size="sm">
                    <LinkedinIcon className="size-4" />
                    LinkedIn
                  </ExternalButtonLink>
                ) : null}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={80}>
            <Card surface="sunken" className="p-6">
              <h2 className="font-condensed text-(length:--text-heading) uppercase">
                What can we help with?
              </h2>
              <ul className="mt-4 flex flex-col gap-1">
                {ROUTES.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      className="group hover:bg-surface-3 -mx-2 flex items-start gap-3 rounded-(--radius-card) px-2 py-3 transition-colors"
                    >
                      <ChevronTick
                        tone="yellow"
                        size={16}
                        className="mt-1 transition-transform group-hover:translate-x-1"
                      />
                      <span>
                        <span className="font-condensed block text-base uppercase">
                          {route.title}
                        </span>
                        <span className="text-body-3 block text-sm">{route.description}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <MapEmbed embedUrl={site.mapEmbedUrl} mapUrl={site.mapUrl} address={site.address} />
        </Reveal>
      </div>
    </div>
  );
}
