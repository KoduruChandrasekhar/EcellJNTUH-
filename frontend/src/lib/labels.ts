import type { EventCategory } from "@/content/schema";

/**
 * Display names for event categories.
 *
 * One map, because there were three: the card said "Event", the events filter said
 * "Other", and the event page printed the raw slug — so the 2026 Unveil page showed a
 * badge reading "other". A category is a piece of vocabulary the whole site shares, so it
 * is spelled in exactly one place.
 */
export const CATEGORY_LABELS: Record<EventCategory, string> = {
  summit: "Summit",
  workshop: "Workshop",
  "speaker-session": "Speaker session",
  competition: "Competition",
  quiz: "Quiz",
  recruitment: "Recruitment",
  other: "Event",
};

export function categoryLabel(category: EventCategory) {
  return CATEGORY_LABELS[category];
}
