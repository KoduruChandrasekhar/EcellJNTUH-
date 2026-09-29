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
      photo: "/images/team/sai-naishika-bollikonda.webp",
      // TODO: verify this profile URL — the one supplied ended in a trailing hyphen and
      // may be truncated. A LinkedIn link that 404s is worse than no link.
      linkedin: "https://in.linkedin.com/in/sai-naishika-bollikonda-",
      order: 0,
    },
    {
      id: "supraja-tatikonda",
      name: "Supraja Tatikonda",
      position: "Vice President",
      category: "core",
      term: "2026-27",
      photo: "/images/team/supraja-tatikonda.webp",
      linkedin: "https://www.linkedin.com/in/supraja-tatikonda-607b042a6/",
      order: 1,
    },
    {
      id: "shreya-nambiar",
      name: "Shreya Nambiar",
      position: "PR and Outreach",
      category: "lead",
      term: "2026-27",
      // TODO: photo and LinkedIn pending.
      order: 2,
    },
    {
      id: "shriya-tallapragada",
      name: "Shriya Tallapragada",
      position: "Design",
      category: "lead",
      term: "2026-27",
      photo: "/images/team/shriya-tallapragada.webp",
      linkedin: "https://www.linkedin.com/in/shriya-tallapragada-0b9356380/",
      order: 3,
    },
    {
      id: "bhuvana-sai-srivalli",
      name: "Bhuvana Sai Srivalli",
      position: "Social Media",
      category: "lead",
      term: "2026-27",
      // TODO: photo and LinkedIn pending.
      order: 4,
    },
    {
      id: "lahari-r",
      name: "Lahari R",
      position: "Social Media",
      category: "lead",
      term: "2026-27",
      // TODO: photo and LinkedIn pending.
      order: 5,
    },
    {
      id: "srija-janamachari",
      name: "Srija Janamachari",
      position: "Event Planning and Ideation",
      category: "lead",
      term: "2026-27",
      // TODO: photo and LinkedIn pending.
      order: 6,
    },
    {
      id: "rahul-badam",
      name: "Rahul Badam",
      position: "Finance and Logistics",
      category: "lead",
      term: "2026-27",
      photo: "/images/team/rahul-badam.webp",
      linkedin: "https://www.linkedin.com/in/rahulbadam/",
      order: 7,
    },
  ],
  "team.ts",
);
