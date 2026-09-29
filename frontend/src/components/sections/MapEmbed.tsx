"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { Button, ExternalButtonLink } from "@/components/ui/button";
import { Mark } from "@/components/site/Lockup";

/**
 * A click-to-load map.
 *
 * A Google Maps iframe pulls in several hundred kilobytes and hands Google your IP the
 * moment the page renders. This shows a styled placeholder instead and only creates the
 * iframe once you ask for it — faster for everyone, and nothing is sent to Google unless
 * the visitor chooses it (which is also what the privacy page promises).
 */
export function MapEmbed({
  embedUrl,
  mapUrl,
  address,
}: {
  embedUrl?: string;
  mapUrl?: string;
  address: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="border-line bg-surface-2 relative aspect-[4/3] overflow-hidden rounded-(--radius-card) border-[1.5px]">
      {loaded && embedUrl ? (
        <iframe
          src={embedUrl}
          title={`Map showing ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          {/* The logo mark as a faint watermark — the criss-cross pattern that was here
              read as visual noise behind the text. */}
          <Mark size={240} className="pointer-events-none absolute opacity-[0.06] select-none" />
          <div>
            <MapPin aria-hidden className="text-brand-blue mx-auto size-8" />
            <p className="font-condensed mt-4 text-(length:--text-heading) uppercase">
              Find us on campus
            </p>
            <p className="text-body-2 mx-auto mt-2 max-w-xs text-sm">{address}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {embedUrl ? (
                <Button size="sm" onClick={() => setLoaded(true)}>
                  Load the map
                </Button>
              ) : null}
              {mapUrl ? (
                <ExternalButtonLink href={mapUrl} variant="secondary" size="sm">
                  Open in Google Maps
                </ExternalButtonLink>
              ) : null}
            </div>

            <p className="text-body-3 mt-4 text-xs">The map only loads when you ask for it.</p>
          </div>
        </div>
      )}
    </div>
  );
}
