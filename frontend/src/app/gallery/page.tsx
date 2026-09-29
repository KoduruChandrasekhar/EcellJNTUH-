import type { Metadata } from "next";
import { CrossGrid } from "@/components/brand/CrossGrid";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeadline } from "@/components/motion/SplitHeadline";
import { GalleryBrowser } from "@/components/sections/GalleryBrowser";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getGallery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs from E-Cell JNTU Hyderabad events.",
};

export default async function GalleryPage() {
  const albums = await getGallery();

  return (
    <div className="container-site section-y">
      <Reveal>
        <SectionEyebrow>In the room</SectionEyebrow>
        <SplitHeadline as="h1" solid="The" outline="Gallery" accent="yellow" className="mt-3" />
        <p className="text-body-2 mt-6 max-w-xl text-balance">
          What our events actually look like — full rooms, live pitches and the moment the jury
          starts asking questions.
        </p>
      </Reveal>

      <div className="mt-12">
        {albums.length > 0 ? (
          <GalleryBrowser albums={albums} />
        ) : (
          /* Designed empty state rather than a blank page. */
          <Card surface="sunken" className="flex flex-col items-center px-6 py-16 text-center">
            <CrossGrid cols={5} rows={2} className="text-body-3 opacity-25" />
            <p className="font-condensed mt-6 text-(length:--text-heading) uppercase">
              Photos coming soon
            </p>
            <p className="text-body-2 mt-2 max-w-sm text-sm">
              We are collecting photography from our events. In the meantime, the event pages have
              the full story.
            </p>
            <ButtonLink href="/events" variant="secondary" size="sm" className="mt-6">
              Browse events
            </ButtonLink>
          </Card>
        )}
      </div>
    </div>
  );
}
