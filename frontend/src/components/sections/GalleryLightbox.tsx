"use client";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  albumTitle: string;
  date: string;
};

/**
 * The fullscreen photo viewer.
 *
 * Loaded only on first click (see GalleryBrowser), so the ~30 KB library never reaches
 * visitors who just scroll the grid. The library supplies keyboard navigation, swipe
 * gestures and focus management, which is exactly the part that is painful to hand-roll.
 */
export function GalleryLightbox({
  photos,
  index,
  onClose,
  formatDate,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  formatDate: (iso: string) => string;
}) {
  return (
    <Lightbox
      open
      close={onClose}
      index={index}
      slides={photos.map((photo) => ({
        src: photo.src,
        alt: photo.alt,
        width: photo.width,
        height: photo.height,
        title: photo.albumTitle,
        description: `${photo.alt} — ${formatDate(photo.date)}`,
      }))}
      animation={{ fade: 260, swipe: 400 }}
      controller={{ closeOnBackdropClick: true }}
      styles={{ container: { backgroundColor: "rgba(11, 11, 11, 0.94)" } }}
    />
  );
}
