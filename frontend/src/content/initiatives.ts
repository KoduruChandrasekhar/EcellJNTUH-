import { initiativeSchema, parseContent } from "./schema";
import { z } from "zod";

/**
 * The three things the club actually runs. `eventSlugs` links each initiative to its
 * events, so the detail pages stay in sync with the events data automatically.
 *
 * TODO: confirm this framing with the club.
 */
export const initiatives = parseContent(
  z.array(initiativeSchema),
  [
    {
      slug: "ethos",
      title: "ETHOS",
      summary:
        "The annual flagship — an intercollegiate case competition wrapped in workshops and speaker sessions.",
      description:
        "ETHOS is the club's flagship. Each edition takes a theme that resists easy answers — ethics and AI in 2025, sustainability in 2026 — and builds a day around it: speaker sessions, hands-on workshops, and a boardroom simulation where teams have to commit to a decision and defend it. The first edition was put together in a week and still drew 150+ students.",
      purpose: "Put students in front of practitioners, then make them decide something.",
      eventSlugs: ["ethos-2026", "ethos-2025"],
      order: 0,
    },
    {
      slug: "competitions",
      title: "Competitions",
      summary:
        "Pitch Perfect, Pitch or Ditch, Case Reboot, Cash & Chaos, the Decision Matrix and Eureka!",
      description:
        "Competitions are where the theory gets tested. Pitch Perfect hands teams an impossible product and a panel. Pitch or Ditch assigns your side at random and makes you argue it anyway. Case Reboot and Cash & Chaos drop teams into startups and corporate crises that don't arrive with clean data. The Eureka! campus round sends the winner to IIT Bombay's zonal stage.",
      purpose: "Practise making a case, under time pressure, in front of people who push back.",
      eventSlugs: [
        "pitch-perfect-2",
        "pitch-or-ditch",
        "case-reboot",
        "cash-and-chaos-lawsuit-edition",
        "eureka-2025-campus-round",
        "trivial-pursuits",
        "pitch-perfect",
      ],
      order: 1,
    },
    {
      slug: "workshops-and-sessions",
      title: "Workshops and speaker sessions",
      summary: "Career Craft, 1,00,000 Hours, and the ETHOS workshops.",
      description:
        "Between the big events, the club runs shorter sessions on the skills that compound: CV building and interview readiness with AIESEC, personal finance and wealth creation, and conversations with alumni who were sitting in the same lecture halls a few years ago.",
      purpose: "Build the practical literacy that most degrees leave out.",
      eventSlugs: [
        "career-craft",
        "one-lakh-hours",
        "ethos-2026-wealth-creation-blueprint",
        "ethos-2026-ai-and-personal-branding",
        "ethos-2026-sustainability-in-action",
      ],
      order: 2,
    },
  ],
  "initiatives.ts",
);
