import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { events } from "@/content/events";
import { gallery } from "@/content/gallery";
import { initiatives } from "@/content/initiatives";
import { partners } from "@/content/partners";
import { site } from "@/content/site";
import { sponsors } from "@/content/sponsors";
import { about } from "@/content/about";
import { team } from "@/content/team";

/**
 * Importing a content file runs its Zod schema, so a malformed field fails this suite
 * — and the build — before it can reach a page.
 *
 * These tests cover the things a schema can't check on its own: cross-file references,
 * uniqueness, and whether an image path actually points at a file on disk.
 */

const publicFile = (p: string) => path.join(process.cwd(), "public", p);

describe("events", () => {
  it("has unique slugs", () => {
    const slugs = events.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("only points parentSlug at an event that exists", () => {
    const slugs = new Set(events.map((e) => e.slug));
    for (const event of events) {
      if (event.parentSlug) {
        expect(slugs, `${event.slug} → ${event.parentSlug}`).toContain(event.parentSlug);
      }
    }
  });

  it("never nests a sub-event under another sub-event", () => {
    const parents = new Map(events.map((e) => [e.slug, e.parentSlug]));
    for (const event of events) {
      if (event.parentSlug) expect(parents.get(event.parentSlug)).toBeUndefined();
    }
  });

  it("only references partners that exist", () => {
    const ids = new Set(partners.map((p) => p.id));
    for (const event of events) {
      for (const id of event.partners ?? []) {
        expect(ids, `${event.slug} → ${id}`).toContain(id);
      }
    }
  });

  it("only references gallery albums that exist", () => {
    const slugs = new Set(gallery.map((a) => a.slug));
    for (const event of events) {
      if (event.gallerySlug) expect(slugs).toContain(event.gallerySlug);
    }
  });

  it("has poster files that exist on disk", () => {
    for (const event of events) {
      if (event.poster) {
        expect(existsSync(publicFile(event.poster)), `${event.slug}: ${event.poster}`).toBe(true);
      }
    }
  });
});

describe("team", () => {
  it("has unique ids", () => {
    const ids = team.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has photo files that exist on disk", () => {
    for (const member of team) {
      if (member.photo) {
        expect(existsSync(publicFile(member.photo)), `${member.id}: ${member.photo}`).toBe(true);
      }
    }
  });
});

describe("gallery", () => {
  it("has unique album slugs", () => {
    const slugs = gallery.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has image files that exist on disk", () => {
    for (const album of gallery) {
      expect(existsSync(publicFile(album.cover)), `${album.slug} cover`).toBe(true);
      for (const image of album.images) {
        expect(existsSync(publicFile(image.src)), `${album.slug}: ${image.src}`).toBe(true);
      }
    }
  });

  it("links albums to real events", () => {
    const slugs = new Set(events.map((e) => e.slug));
    for (const album of gallery) {
      if (album.eventSlug) expect(slugs).toContain(album.eventSlug);
    }
  });
});

describe("initiatives and partners", () => {
  it("have unique identifiers", () => {
    expect(new Set(initiatives.map((i) => i.slug)).size).toBe(initiatives.length);
    expect(new Set(partners.map((p) => p.id)).size).toBe(partners.length);
  });

  it("only reference events that exist", () => {
    const slugs = new Set(events.map((e) => e.slug));
    for (const initiative of initiatives) {
      for (const slug of initiative.eventSlugs) {
        expect(slugs, `${initiative.slug} -> ${slug}`).toContain(slug);
      }
    }
  });
});

describe("about", () => {
  it("only links milestones to events that exist", () => {
    const slugs = new Set(events.map((e) => e.slug));
    for (const milestone of about.milestones) {
      if (milestone.eventSlug) {
        expect(slugs, milestone.title).toContain(milestone.eventSlug);
      }
    }
  });

  it("lists milestones in chronological order", () => {
    const dates = about.milestones.map((m) => Date.parse(m.date));
    expect(dates).toEqual([...dates].sort((a, b) => a - b));
  });
});

describe("sponsors", () => {
  it("has unique tier ids", () => {
    const ids = sponsors.tiers.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never quotes a reach figure as confirmed unless it is computed", () => {
    // Everything except the computed event count must be flagged approximate, so the
    // page cannot present an invented number to a prospective sponsor as fact.
    for (const stat of sponsors.reach) {
      if (stat.label !== "Events hosted") {
        expect(stat.approximate, stat.label).toBe(true);
      }
    }
  });
});

describe("site", () => {
  it("points featuredEventSlug at a real event", () => {
    if (site.featuredEventSlug) {
      expect(events.map((e) => e.slug)).toContain(site.featuredEventSlug);
    }
  });

  it("uses https for every external link", () => {
    const urls = [
      site.url,
      site.mapUrl,
      site.joinFormUrl,
      site.contactFormUrl,
      ...Object.values(site.socials),
    ];
    for (const url of urls) {
      if (url) expect(url.startsWith("https://"), url).toBe(true);
    }
  });
});
