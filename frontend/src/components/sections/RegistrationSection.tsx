import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import type { EventItem } from "@/content/schema";
import { formatDateTime, getEventStatus, statusLabel } from "@/lib/dates";

/**
 * The single place registration is rendered.
 *
 * Every state an event can be in is handled here — open, closing soon, closed, completed,
 * or no registration at all — so no page has to reason about it. When the backend phase
 * adds an on-site form, `registration.mode === "internal"` becomes another branch in this
 * one component and nothing else changes.
 */
export function RegistrationSection({
  event,
  gallerySlug,
}: {
  event: EventItem;
  gallerySlug?: string;
}) {
  const status = getEventStatus(event);
  const completed = status === "completed";

  /* ---- no registration configured ---- */
  if (event.registration.mode === "none") {
    return (
      <div className="border-line bg-surface-3 rounded-(--radius-card) border-[1.5px] p-6">
        <Badge tone={completed ? "done" : "neutral"}>{statusLabel[status]}</Badge>

        {event.registration.note ? (
          <p className="text-body-2 mt-4 text-sm">{event.registration.note}</p>
        ) : null}

        {completed && gallerySlug ? (
          <ButtonLink href="/gallery" variant="secondary" size="sm" className="mt-5">
            See the photos
          </ButtonLink>
        ) : null}
      </div>
    );
  }

  /* ---- external form ---- */
  const { url, closesAt, label } = event.registration;
  const closed = status === "registrations-closed" || completed;

  // Show which service the link opens, derived from the URL rather than assumed.
  let host = "an external form";
  try {
    const parsed = new URL(url);
    host = parsed.hostname.replace(/^www\./, "");
    if (host.includes("google")) host = "Google Forms";
  } catch {
    /* validated as https by the schema, so this should not happen */
  }

  return (
    <div className="border-line bg-surface-3 rounded-(--radius-card) border-[1.5px] p-6">
      <Badge
        tone={
          status === "registrations-open"
            ? "open"
            : status === "closing-soon"
              ? "soon"
              : status === "live"
                ? "live"
                : closed
                  ? "closed"
                  : "neutral"
        }
      >
        {statusLabel[status]}
      </Badge>

      {closed ? (
        <>
          <p className="text-body-2 mt-4 text-sm">
            {completed ? "This event has finished." : "Registrations for this event have closed."}
          </p>
          {/* Deliberately not a link: a dead form is worse than no button. */}
          <span
            aria-disabled
            className="border-line-soft text-body-3 mt-5 inline-flex min-h-11 cursor-not-allowed items-center rounded-(--radius-pill) border-[1.5px] px-6 text-sm opacity-60"
          >
            Registrations closed
          </span>

          {gallerySlug ? (
            <div className="mt-4">
              <Link
                href="/gallery"
                className="text-brand-blue text-sm underline underline-offset-4"
              >
                See the photos from this event
              </Link>
            </div>
          ) : null}
        </>
      ) : (
        <>
          {closesAt ? (
            <p className="text-body-2 mt-4 text-sm">
              Registration closes {formatDateTime(closesAt)}
            </p>
          ) : null}

          <ExternalButtonLink href={url} size="lg" className="mt-5">
            {label ?? "Register now"}
          </ExternalButtonLink>

          <p className="text-body-3 mt-3 text-xs">Opens {host} in a new tab.</p>
        </>
      )}
    </div>
  );
}
