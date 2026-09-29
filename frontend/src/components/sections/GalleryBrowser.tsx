"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { CrossGrid } from "@/components/brand/CrossGrid";
import { Card } from "@/components/ui/card";
import type { GalleryAlbum } from "@/content/schema";
import { formatDate } from "@/lib/dates";
import { cn } from "@/lib/utils";

/**
 * The lightbox is the heaviest thing on this page and most visitors never open it, so it
 * is split into its own chunk and only fetched on the first click.
 */
const Lightbox = dynamic(() => import("./GalleryLightbox").then((m) => m.GalleryLightbox), {
  ssr: false,
});

/**
 * Album filter over a masonry grid.
 *
 * The grid is CSS columns rather than a JS masonry library: the browser does the packing,
 * so there is no layout pass to run on resize and nothing to ship.
 */
export function GalleryBrowser({ albums }: { albums: GalleryAlbum[] }) {
  const [album, setAlbum] = useState<string>("all");
  const [openAt, setOpenAt] = useState<number | null>(null);

  // A flat list across the selected albums — the lightbox indexes into this.
  const photos = useMemo(() => {
    const selected = album === "all" ? albums : albums.filter((a) => a.slug === album);
    return selected.flatMap((a) =>
      a.images.map((image) => ({ ...image, albumTitle: a.title, date: a.date })),
    );
  }, [albums, album]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Chip active={album === "all"} onClick={() => setAlbum("all")}>
          All photos
        </Chip>
        {albums.map((a) => (
          <Chip key={a.slug} active={album === a.slug} onClick={() => setAlbum(a.slug)}>
            {a.title}
          </Chip>
        ))}
      </div>

      <p aria-live="polite" className="text-body-3 mt-4 text-sm">
        {photos.length} {photos.length === 1 ? "photo" : "photos"}
      </p>

      {photos.length > 0 ? (
        <ul className="mt-6 gap-4 [column-count:1] sm:[column-count:2] lg:[column-count:3]">
          {photos.map((photo, i) => (
            <li key={photo.src} className="mb-4 break-inside-avoid">
              <button
                type="button"
                onClick={() => setOpenAt(i)}
                className="photo-pop border-line block w-full overflow-hidden rounded-(--radius-card) border-[1.5px]"
                aria-label={`Open photo: ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
                  // Everything below the fold loads lazily; `image-in` fades each one
                  // in as it decodes so the grid fills rather than popping.
                  loading={i < 3 ? "eager" : "lazy"}
                  className="image-in h-auto w-full"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Card surface="sunken" className="mt-6 flex flex-col items-center px-6 py-14 text-center">
          <CrossGrid cols={5} rows={1} className="text-body-3 opacity-30" />
          <p className="font-condensed mt-6 text-(length:--text-heading) uppercase">
            No photos here yet
          </p>
          <p className="text-body-2 mt-2 max-w-sm text-sm">
            Photos from this event are still being collected.
          </p>
        </Card>
      )}

      {openAt !== null ? (
        <Lightbox
          photos={photos}
          index={openAt}
          onClose={() => setOpenAt(null)}
          formatDate={formatDate}
        />
      ) : null}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "font-condensed inline-flex min-h-11 items-center rounded-(--radius-pill) border-[1.5px] px-4 text-sm tracking-(--tracking-wide-label) uppercase",
        "transition-colors duration-(--duration-fast)",
        active
          ? "bg-ink text-brand-yellow border-ink dark:bg-chalk dark:text-ink dark:border-chalk"
          : "border-line text-body-2 hover:border-brand-blue hover:text-brand-blue",
      )}
    >
      {children}
    </button>
  );
}
