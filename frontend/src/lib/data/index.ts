import { about } from "@/content/about";
import { events } from "@/content/events";
import { gallery } from "@/content/gallery";
import { initiatives } from "@/content/initiatives";
import { join } from "@/content/join";
import { partners } from "@/content/partners";
import { site } from "@/content/site";
import { sponsors } from "@/content/sponsors";
import { currentTerm, team, teamComplete } from "@/content/team";
import type { EventItem, TeamCategory, TeamMember } from "@/content/schema";
import { isPast } from "@/lib/dates";

/**
 * The data access layer — and the seam for the backend phase.
 *
 * Pages never import from `src/content/` directly; they call these functions. Today the
 * functions read the typed files in `src/content/`. When Supabase arrives, only this file
 * changes and every page keeps working.
 *
 * They're `async` for that reason: the signatures already match what a database call will
 * look like, so no page needs rewriting later.
 */

const byDateDescending = (a: EventItem, b: EventItem) =>
  Date.parse(b.startsAt) - Date.parse(a.startsAt);

/** Top-level events only — ETHOS sessions are reached through their parent. */
const isTopLevel = (event: EventItem) => !event.parentSlug;

export async function getSiteConfig() {
  return site;
}

/**
 * Every figure the events data can prove, derived rather than typed.
 *
 * `participation` on an event comes straight from the club's own post-event reports, so
 * summing it gives a number nobody has to vouch for by memory — and one that grows on its
 * own as each new report is added. These back both the homepage stat band and the reach
 * figures on /sponsors, so the two can never disagree.
 */
function derivedTotals() {
  const topLevel = events.filter(isTopLevel);
  const reported = events.filter((event) => event.participation);

  return {
    eventsHosted: topLevel.length,
    // Sub-sessions are excluded: their attendees are already counted in the parent.
    studentsReached: reported
      .filter(isTopLevel)
      .reduce((total, event) => total + (event.participation?.participants ?? 0), 0),
    // The widest single event, not a sum — the same college turning up twice isn't two.
    colleges: Math.max(0, ...reported.map((event) => event.participation?.colleges ?? 0)),
    // Speakers and jurors are named people; the same person on two panels counts once.
    peopleHosted: new Set(
      events.flatMap((event) => [...(event.speakers ?? []), ...(event.jury ?? [])]).map((p) => p.name),
    ).size,
  };
}

/**
 * Site stats, computed from the events data rather than typed into site.ts, so the
 * numbers can never drift out of date.
 */
export async function getStats() {
  const totals = derivedTotals();
  // Ordered so the two counts that happen to be equal today aren't adjacent — side by
  // side they read as a rendering bug rather than a coincidence.
  return [
    { label: "Events hosted", value: totals.eventsHosted, approximate: false },
    { label: "Students reached", value: totals.studentsReached, suffix: "+", approximate: true },
    { label: "Colleges represented", value: totals.colleges, suffix: "+", approximate: true },
    { label: "Speakers and jury hosted", value: totals.peopleHosted, approximate: false },
    ...site.stats,
  ];
}

export async function getEvents(): Promise<EventItem[]> {
  return [...events].filter(isTopLevel).sort(byDateDescending);
}

export async function getEventBySlug(slug: string): Promise<EventItem | undefined> {
  return events.find((event) => event.slug === slug);
}

/** The sessions belonging to a parent event, in running order. */
export async function getSubEvents(parentSlug: string): Promise<EventItem[]> {
  return events
    .filter((event) => event.parentSlug === parentSlug)
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
}

/**
 * Upcoming events, soonest first.
 *
 * `limit` exists so the Home page can ask for three without the other two hundred being
 * serialised into its payload — the brief's rule about keeping per-page data small.
 */
export async function getUpcomingEvents(limit?: number): Promise<EventItem[]> {
  const upcoming = events
    .filter(isTopLevel)
    .filter((event) => !isPast(event))
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));

  return limit ? upcoming.slice(0, limit) : upcoming;
}

export async function getPastEvents(limit?: number): Promise<EventItem[]> {
  const past = events
    .filter(isTopLevel)
    .filter((event) => isPast(event))
    .sort(byDateDescending);
  return limit ? past.slice(0, limit) : past;
}

/**
 * The club's flagship, always — ETHOS, whether or not it is the next thing happening.
 *
 * Kept separate from `getFeaturedEvent` deliberately: once a nearer event exists, the hero
 * CTA should point at that, but the "Our flagship" section must still be about ETHOS.
 * Collapsing the two would relabel whatever happens to be next as the flagship.
 */
export async function getFlagshipEvent(): Promise<EventItem | undefined> {
  const { featuredEventSlug } = site;
  if (!featuredEventSlug) return undefined;
  return events.find((event) => event.slug === featuredEventSlug);
}

/**
 * The event the hero CTA points at: whatever is happening next, falling back to the
 * configured flagship and then to the most recent event.
 */
export async function getFeaturedEvent(): Promise<EventItem | undefined> {
  const [nextUp] = await getUpcomingEvents(1);
  if (nextUp) return nextUp;

  const { featuredEventSlug } = site;
  if (featuredEventSlug) {
    const configured = events.find((event) => event.slug === featuredEventSlug);
    if (configured) return configured;
  }

  const [mostRecent] = await getPastEvents(1);
  return mostRecent;
}

/** Every term that has members, newest first — drives the Team page term switcher. */
export async function getTeamTerms(): Promise<string[]> {
  return [...new Set(team.map((member) => member.term))].sort().reverse();
}

export async function getTeam(term: string = currentTerm): Promise<TeamMember[]> {
  return team.filter((member) => member.term === term).sort((a, b) => a.order - b.order);
}

/**
 * The team grouped for display. Categories with nobody in them are dropped entirely, so
 * the page never renders an empty heading.
 */
export async function getTeamByCategory(
  term: string = currentTerm,
): Promise<{ category: TeamCategory; label: string; members: TeamMember[] }[]> {
  const members = await getTeam(term);

  const groups: { category: TeamCategory; label: string }[] = [
    { category: "core", label: "Core team" },
    { category: "lead", label: "Heads and leads" },
    { category: "member", label: "Members" },
  ];

  return groups
    .map((group) => ({
      ...group,
      members: members.filter((member) => member.category === group.category),
    }))
    .filter((group) => group.members.length > 0);
}

export async function getTeamMeta() {
  return { currentTerm, teamComplete };
}

export async function getInitiatives() {
  return [...initiatives].sort((a, b) => a.order - b.order);
}

export async function getInitiativeBySlug(slug: string) {
  return initiatives.find((initiative) => initiative.slug === slug);
}

/** An initiative together with its events, newest first. */
export async function getInitiativeEvents(slug: string): Promise<EventItem[]> {
  const initiative = initiatives.find((i) => i.slug === slug);
  if (!initiative) return [];

  return initiative.eventSlugs
    .map((eventSlug) => events.find((event) => event.slug === eventSlug))
    .filter((event): event is EventItem => Boolean(event))
    .sort(byDateDescending);
}

export async function getGallery() {
  return [...gallery].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export async function getGalleryAlbum(slug: string) {
  return gallery.find((album) => album.slug === slug);
}

export async function getPartners() {
  return [...partners].sort((a, b) => a.order - b.order);
}

export async function getAbout() {
  // Sorted here rather than trusting the order things were typed in: a corrected date
  // (ETHOS 2025 moved three months once its event report surfaced) should reorder the
  // timeline on its own, not silently leave it wrong.
  return {
    ...about,
    milestones: [...about.milestones].sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export async function getJoin() {
  return join;
}

export async function getSponsors() {
  // Three of the four reach figures are derived from the events data, so the sponsors page
  // can't quote a stale or invented number at somebody deciding whether to spend money.
  // Only the follower count is still a placeholder, and it stays flagged as an estimate.
  const totals = derivedTotals();
  const computed: Record<string, number> = {
    "Events hosted": totals.eventsHosted,
    "Students reached": totals.studentsReached,
    "Colleges represented": totals.colleges,
  };

  return {
    ...sponsors,
    reach: sponsors.reach.map((stat) =>
      stat.label in computed ? { ...stat, value: computed[stat.label]! } : stat,
    ),
  };
}

/**
 * The event immediately before and after this one by date, for prev/next navigation.
 * Sub-sessions navigate within their parent's sessions; top-level events within the
 * top-level list.
 */
export async function getAdjacentEvents(slug: string) {
  const event = events.find((e) => e.slug === slug);
  if (!event) return { previous: undefined, next: undefined };

  const siblings = event.parentSlug
    ? events.filter((e) => e.parentSlug === event.parentSlug)
    : events.filter(isTopLevel);

  const ordered = [...siblings].sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const index = ordered.findIndex((e) => e.slug === slug);

  return { previous: ordered[index - 1], next: ordered[index + 1] };
}

/** Every slug that needs a page built — parents and sessions alike. */
export async function getAllEventSlugs(): Promise<string[]> {
  return events.map((event) => event.slug);
}
