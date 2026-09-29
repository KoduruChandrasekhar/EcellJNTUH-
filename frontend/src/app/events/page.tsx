import type { Metadata } from "next";
import { Headline } from "@/components/brand/Headline";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { EventsBrowser } from "@/components/sections/EventsBrowser";
import { getEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Every competition, workshop and speaker session E-Cell JNTU Hyderabad has run, and what is coming next.",
};

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container-site section-y">
      <Reveal>
        <SectionEyebrow>What we run</SectionEyebrow>
        <Headline as="h1" solid="Our" outline="Events" accent="yellow" className="mt-3" />
        <p className="text-body-2 mt-6 max-w-xl text-balance">
          Competitions where you have to commit to a decision, workshops on the things degrees skip,
          and speakers who have actually done it.
        </p>
      </Reveal>

      <div className="mt-12">
        <EventsBrowser events={events} />
      </div>
    </div>
  );
}
