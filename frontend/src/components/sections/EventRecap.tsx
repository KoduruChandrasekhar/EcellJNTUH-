import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/badge";
import type { EventItem, GalleryAlbum } from "@/content/schema";
import { formatDate } from "@/lib/dates";

/**
 * "What just happened" — the last couple of events, with photographs and the short version.
 *
 * Distinct from the Recent Events rail above it, which is a list you browse. This is the
 * story: a few pictures, who won, one line on what it was. Somebody who has never heard of
 * the club should be able to tell what we actually do from this block alone.
 *
 * A server component — the photo grid is CSS, so it ships no JavaScript.
 */
export function EventRecap({ recaps }: { recaps: { event: EventItem; album: GalleryAlbum }[] }) {
  if (recaps.length === 0) return null;

  return (
    <div className="mt-10 flex flex-col gap-14">
      {recaps.map(({ event, album }, index) => {
        // Three photos reads as a glimpse; more becomes the gallery, which already exists.
        const photos = album.images.slice(0, 3);
        const winner = event.results?.find((r) => r.position === 1);

        return (
          <Reveal key={event.slug} delay={index * 80}>
            <article className="grid grid-cols-1 gap-7 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              {/* One large photo with two stacked beside it, so the block has a focal
                  point rather than reading as three equal thumbnails. */}
              <div className="grid grid-cols-3 grid-rows-2 gap-2.5">
                {photos.map((photo, i) => (
                  <div
                    key={photo.src}
                    className={`border-line bg-surface-3 relative overflow-hidden rounded-(--radius-card) border-[1.5px] ${
                      i === 0 ? "col-span-2 row-span-2" : ""
                    }`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes={
                        i === 0
                          ? "(min-width: 1024px) 420px, 60vw"
                          : "(min-width: 1024px) 210px, 30vw"
                      }
                      className="image-in h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>

              <div>
                <p className="text-body-3 text-xs tracking-(--tracking-wide-label) uppercase">
                  {formatDate(event.startsAt)}
                </p>
                <h3 className="font-condensed mt-2 text-(length:--text-heading) uppercase">
                  {event.title}
                </h3>
                <p className="text-body-2 mt-3 text-sm leading-relaxed">{event.shortDescription}</p>

                {winner ? (
                  <p className="text-body-2 mt-4 flex items-center gap-2 text-sm">
                    <Trophy aria-hidden className="text-accent size-4 shrink-0" />
                    <span>
                      Won by <strong className="font-semibold">{winner.teamName}</strong>
                    </span>
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2">
                  {event.participation?.participants ? (
                    <Badge tone="neutral">{event.participation.participants}+ took part</Badge>
                  ) : null}
                  <Badge tone="neutral">{album.images.length} photos</Badge>
                </div>

                <Link
                  href={`/events/${event.slug}`}
                  className="text-brand-blue group mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                >
                  How it went
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
