"use client";

import { CalendarPlus, Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { InstagramIcon, LinkedinIcon, XIcon } from "@/components/brand/SocialIcons";
import { cn } from "@/lib/utils";

/**
 * Share and add-to-calendar actions for an event page.
 *
 * On phones that support it, the native share sheet is offered first — it is the control
 * people already know and it reaches every app they have. Everything else falls back to
 * explicit per-network links plus copy-to-clipboard, so the feature never simply vanishes.
 *
 * The .ics is generated at build time and handed over as a data URL, so downloading a
 * calendar file needs no API route on a static site.
 */
export function EventActions({
  title,
  url,
  icsContent,
  googleUrl,
}: {
  title: string;
  url: string;
  icsContent: string;
  googleUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const shareText = `${title} — E-Cell JNTUH`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);

  const icsHref = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the per-network links still work.
    }
  };

  const nativeShare = async () => {
    // `navigator.share` only exists on some browsers, so it is feature-detected rather
    // than assumed.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: shareText, url });
        return;
      } catch {
        // The user dismissed the sheet — not an error worth surfacing.
        return;
      }
    }
    void copy();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={nativeShare} className={actionClass} aria-label="Share">
        <Share2 aria-hidden className="size-4" />
        Share
      </button>

      <a
        href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={actionClass}
        aria-label="Share on WhatsApp"
      >
        WhatsApp
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconActionClass}
        aria-label="Share on LinkedIn"
      >
        <LinkedinIcon className="size-4" />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={iconActionClass}
        aria-label="Share on X"
      >
        <XIcon className="size-4" />
      </a>

      <a
        href="https://www.instagram.com/ecell_jntuh/"
        target="_blank"
        rel="noopener noreferrer"
        className={iconActionClass}
        aria-label="E-Cell JNTUH on Instagram"
      >
        <InstagramIcon className="size-4" />
      </a>

      <button type="button" onClick={copy} className={actionClass} aria-label="Copy link">
        {copied ? (
          <Check aria-hidden className="text-eco size-4" />
        ) : (
          <Copy aria-hidden className="size-4" />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>

      {/* ---- calendar ---- */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setCalendarOpen((open) => !open)}
          aria-expanded={calendarOpen}
          className={actionClass}
        >
          <CalendarPlus aria-hidden className="size-4" />
          Add to calendar
        </button>

        {calendarOpen ? (
          <div className="border-line bg-surface-3 shadow-hard-sm absolute top-full left-0 z-(--z-index-sticky) mt-2 flex w-52 flex-col rounded-(--radius-card) border-[1.5px] p-1">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-surface-2 rounded-sm px-3 py-2.5 text-sm"
            >
              Google Calendar
            </a>
            <a
              href={icsHref}
              download={`${title.replace(/[^\w]+/g, "-").toLowerCase()}.ics`}
              className="hover:bg-surface-2 rounded-sm px-3 py-2.5 text-sm"
            >
              Download .ics file
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}

const actionClass = cn(
  "border-line text-body-2 hover:border-brand-blue hover:text-brand-blue",
  "inline-flex min-h-11 items-center gap-2 rounded-(--radius-pill) border-[1.5px] px-4 text-sm",
  "transition-colors duration-(--duration-fast)",
);

const iconActionClass = cn(
  "border-line text-body-2 hover:border-brand-blue hover:text-brand-blue",
  "grid size-11 place-items-center rounded-(--radius-pill) border-[1.5px]",
  "transition-colors duration-(--duration-fast)",
);
