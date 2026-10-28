import { parseContent, teamMemberSchema } from "./schema";
import { z } from "zod";

/** The term shown by default on the Team page. */
export const currentTerm = "2026-27";

/**
 * Set to true once the full committee is listed — it hides the
 * "more members coming soon" note.
 */
export const teamComplete = true;

/**
 * Only confirmed people appear here. No placeholder humans: an incomplete team is honest,
 * an invented one is not.
 *
 * Nobody carries a photo. Four of the eight had one and four didn't, which made the grid
 * read as broken rather than partial — so the whole committee renders as the brand initials
 * block instead. Consistency beats a half-filled grid. Restore photos only when there is
 * one for every member; the originals are still in assets-source/team/ and come back with
 * `pnpm optimize-images`.
 */
export const team = parseContent(
  z.array(teamMemberSchema),
  [
    {
      id: "sai-naishika-bollikonda",
      name: "Sai Naishika Bollikonda",
      position: "President",
      category: "core",
      term: "2026-27",
      // The trailing hyphen is part of the real vanity URL, confirmed against LinkedIn's
      // own mention links on the club page. Not a truncation.
      linkedin: "https://www.linkedin.com/in/sai-naishika-bollikonda-/",
      order: 0,
    },
    {
      id: "supraja-tatikonda",
      name: "Supraja Tatikonda",
      position: "Vice President",
      category: "core",
      term: "2026-27",
      linkedin: "https://www.linkedin.com/in/supraja-tatikonda-607b042a6/",
      order: 1,
    },
    {
      id: "shreya-nambiar",
      name: "Shreya Nambiar",
      position: "PR and Outreach",
      category: "lead",
      term: "2026-27",
      linkedin: "https://www.linkedin.com/in/shreya-nambiar-9b7929325/",
      order: 2,
    },
    {
      id: "shriya-tallapragada",
      name: "Shriya Tallapragada",
      position: "Design",
      category: "lead",
      term: "2026-27",
      linkedin: "https://www.linkedin.com/in/shriya-tallapragada-0b9356380/",
      order: 3,
    },
    {
      id: "bhuvana-b",
      name: "Bhuvana B",
      position: "Social Media",
      category: "lead",
      term: "2026-27",
      linkedin: "https://www.linkedin.com/in/bhuvana-bhimavarapu-06b3b0431/",
      order: 4,
    },
    {
      id: "lahari-r",
      name: "Lahari R",
      position: "Social Media",
      category: "lead",
      term: "2026-27",
      linkedin: "https://www.linkedin.com/in/lahari-rompicharla-b94726326/",
      order: 5,
    },
    {
      id: "srija-janamachari",
      name: "Srija Janamachari",
      position: "Event Planning and Ideation",
      category: "lead",
      term: "2026-27",
      // Her LinkedIn reads "Janamanchi Laxmi Srija", as did the ETHOS 2026 report.
      // TODO: confirm which spelling she wants on the site.
      linkedin: "https://www.linkedin.com/in/janamanchi-laxmi-srija-b8a45737a/",
      order: 6,
    },
    {
      id: "rahul-badam",
      name: "Rahul Badam",
      position: "Finance and Logistics",
      category: "lead",
      term: "2026-27",
      linkedin: "https://www.linkedin.com/in/rahulbadam/",
      order: 7,
    },
  ],
  "team.ts",
);
