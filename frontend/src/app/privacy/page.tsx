import type { Metadata } from "next";
import { Headline } from "@/components/brand/Headline";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { getSiteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How this site handles your data — which is: it doesn't.",
};

export default async function PrivacyPage() {
  const site = await getSiteConfig();

  return (
    <div className="container-site section-y max-w-2xl">
      <Reveal>
        <SectionEyebrow>The short version</SectionEyebrow>
        <Headline as="h1" solid="Privacy" size="title" className="mt-3" />
      </Reveal>

      <Reveal delay={80}>
        <div className="text-body-2 mt-8 flex flex-col gap-5 leading-relaxed">
          <p>
            This site does not collect your personal data. There are no accounts, no logins and no
            comment boxes, so there is nothing for us to store about you.
          </p>
          <p>
            <strong className="text-body font-semibold">Cookies.</strong> We set no tracking
            cookies. Your theme preference (light or dark) is kept in your own browser&apos;s
            storage and never leaves your device.
          </p>
          <p>
            <strong className="text-body font-semibold">Analytics.</strong> If page analytics are
            enabled, they are cookieless and aggregate — visit counts and page paths, never
            individual people.
          </p>
          <p>
            <strong className="text-body font-semibold">Registrations.</strong> Event sign-ups and
            applications happen on external forms, usually Google Forms. Once you follow one of
            those links you are on their service, covered by their privacy policy, not ours.
          </p>
          <p>
            <strong className="text-body font-semibold">Embedded maps.</strong> The map on the
            contact page only loads when you click it, so Google receives nothing from you unless
            you ask for the map.
          </p>
          <p>
            Questions about any of this? Reach us through the{" "}
            <a href="/contact" className="text-brand-blue underline underline-offset-4">
              contact page
            </a>
            .
          </p>
          <p className="text-body-3 text-sm">Last updated: {new Date().getFullYear()}.</p>
          <p className="text-body-3 text-sm">{site.name}</p>
        </div>
      </Reveal>
    </div>
  );
}
