import Image from "next/image";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/button";
import type { GalleryAlbum } from "@/content/schema";

/**
 * An event's own photographs, on its own page.
 *
 * Deliberately not the `GalleryBrowser` — that one is a client component with album
 * filters and a lazy-loaded lightbox, none of which makes sense for a single album. This
 * is a server component and ships no JavaScript; visitors who want to open a photo full
 * size follow the button to /gallery, where the lightbox already lives.
 *
 * Shows at most six so a well-photographed event can't push the rest of the page out of
 * reach on a phone.
 */
const MAX_SHOWN = 6;

export function EventPhotos({ album }: { album: GalleryAlbum }) {
  if (album.images.length === 0) return null;

  const shown = album.images.slice(0, MAX_SHOWN);
  const remaining = album.images.length - shown.length;

  return (
    <section>
      <Reveal>
        <SectionEyebrow>Photos</SectionEyebrow>
      </Reveal>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {shown.map((photo, i) => (
          <Reveal as="li" key={photo.src} delay={i * 60}>
            <div className="border-line bg-surface-3 relative aspect-4/3 overflow-hidden rounded-(--radius-card) border-[1.5px]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 300px, 45vw"
                className="image-in object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal>
        <ButtonLink href="/gallery" variant="secondary" size="sm" className="mt-6">
          {remaining > 0 ? `See all ${album.images.length} photos` : "See them full size"}
        </ButtonLink>
      </Reveal>
    </section>
  );
}
