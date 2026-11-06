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
 * Roles and membership follow the club's own "Introducing The New Heads" announcement on
 * LinkedIn, which is the authoritative list.
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
      linkedin: "https://www.linkedin.com/in/sai-naishika-bollikonda-/",
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
      position: "Head of PR & Outreach",
      category: "lead",
      term: "2026-27",
      photo: "/images/team/shreya-nambiar.webp",
      linkedin: "https://www.linkedin.com/in/shreya-nambiar-9b7929325/",
      order: 2,
    },
    {
      id: "shriya-tallapragada",
      name: "Shriya Tallapragada",
      position: "Head of Design",
      category: "lead",
      term: "2026-27",
      photo: "/images/team/shriya-tallapragada.webp",
      linkedin: "https://www.linkedin.com/in/shriya-tallapragada-0b9356380/",
      order: 3,
    },
    {
      id: "rahul-badam",
      name: "Rahul Badam",
      position: "Head of Finance & Logistics",
      category: "lead",
      term: "2026-27",
      photo: "/images/team/rahul-badam.webp",
      linkedin: "https://www.linkedin.com/in/rahulbadam/",
      order: 4,
    },
    {
      id: "lahari-rompicharla",
      name: "Lahari Rompicharla",
      position: "Head of Social Media & Marketing",
      category: "lead",
      term: "2026-27",
      // TODO: her LinkedIn photo is only 100px, which renders soft. Initials block
      // until a sharper one exists.
      linkedin: "https://www.linkedin.com/in/lahari-rompicharla-b94726326/",
      order: 5,
    },
    {
      id: "bhuvana-bhimavarapu",
      name: "Bhuvana Bhimavarapu",
      position: "Head of Social Media & Marketing",
      category: "lead",
      term: "2026-27",
      photo: "/images/team/bhuvana-bhimavarapu.webp",
      linkedin: "https://www.linkedin.com/in/bhuvana-bhimavarapu-06b3b0431/",
      order: 6,
    },
    {
      id: "janamanchi-laxmi-srija",
      name: "Janamanchi Laxmi Srija",
      position: "Head of Events Planning & Ideation",
      category: "lead",
      term: "2026-27",
      photo: "/images/team/janamanchi-laxmi-srija.webp",
      linkedin: "https://www.linkedin.com/in/janamanchi-laxmi-srija-b8a45737a/",
      order: 7,
    },
    {
      id: "pruthvi-kothawar",
      name: "Pruthvi Kothawar",
      position: "Head of Events Planning & Ideation",
      category: "lead",
      term: "2026-27",
      photo: "/images/team/pruthvi-kothawar.webp",
      linkedin: "https://www.linkedin.com/in/pruthvi-kothawar-2022b9421/",
      order: 8,
    },
  ],
  "team.ts",
);
