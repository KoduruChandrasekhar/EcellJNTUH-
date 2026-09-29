import { aboutSchema, parseContent } from "./schema";

/**
 * The About page content.
 *
 * `intro` is the club's own words, lightly edited for flow only. It is the single source
 * for the lead paragraph on /about, and `site.description` is derived from it — so the
 * club's statement drives the hero and the SEO description too, rather than being
 * paraphrased separately in three places.
 *
 * TODO: vision, mission and objectives are written in the club's voice but not yet
 * approved by the committee. Replace with their official wording when it arrives.
 */
export const about = parseContent(
  aboutSchema,
  {
    intro:
      "We represent the students who are passionate about entrepreneurship and want to build something that adds value to society. Join us in our journey, as we start here on the beautiful campus of Jawaharlal Nehru Technological University, Hyderabad.",
    alsoKnownAs:
      "Previously known as the I.C.E Club — Innovate, Connect, Elevate — and still the same people.",
    vision:
      "To build E-Cell into a campus funnel that turns student innovation into scalable, real-world ventures, through community and hands-on learning.",
    mission:
      "Give every student at JNTUH a low-risk place to practise what entrepreneurship actually demands: deciding with incomplete information, defending a position, and working with people who disagree.",
    objectives: [
      "Run a flagship summit each year that brings industry practitioners onto campus.",
      "Host competitions where students make real decisions under real constraints.",
      "Connect students to founders, investors and alumni already doing the work.",
      "Build practical literacy in finance, strategy, marketing and communication.",
      "Represent JNTUH in national entrepreneurship competitions.",
    ],
    milestones: [
      {
        date: "2024-11-06T16:30:00+05:30",
        title: "Pitch Perfect",
        description: "The club's first pitching competition, in the CRC Seminar Hall.",
        eventSlug: "pitch-perfect",
      },
      {
        date: "2024-11-19T16:30:00+05:30",
        title: "Case Reboot",
        description: "Simulated startup challenges, played out in teams of four to five.",
        eventSlug: "case-reboot",
      },
      {
        date: "2025-03-27T16:30:00+05:30",
        title: "Pitch or Ditch",
        description:
          "A Women's Month product debate, with sides assigned at random so nobody argued the easy case.",
        eventSlug: "pitch-or-ditch",
      },
      {
        date: "2025-04-01T16:30:00+05:30",
        title: "Cash & Chaos: Lawsuit Edition",
        description: "Corporate crisis simulation — composure under scrutiny, not preparation.",
        dateApproximate: true,
        eventSlug: "cash-and-chaos-lawsuit-edition",
      },
      {
        date: "2025-04-12T10:00:00+05:30",
        title: "ETHOS'25 — the first flagship",
        description:
          "Conceptualised and executed in ten days, and still drew 150+ students from 10+ colleges to a day of ethics, strategy and AI-driven decisions.",
        eventSlug: "ethos-2025",
      },
      {
        date: "2025-08-23T10:00:00+05:30",
        title: "Eureka! 2025 campus round",
        description:
          "Hosted the campus stage of E-Cell IIT Bombay's Eureka!, under the National Entrepreneurship Challenge. Momentum took first; Trovo took third and the audience vote.",
        eventSlug: "eureka-2025-campus-round",
      },
      {
        date: "2025-09-19T16:30:00+05:30",
        title: "Trivial Pursuits",
        description: "The quiz that opened the academic year, with freshers out in force.",
        eventSlug: "trivial-pursuits",
      },
      {
        date: "2025-10-16T16:00:00+05:30",
        title: "1,00,000 Hours",
        description:
          "An alumni session with the Directorate of Alumni Affairs on using your working hours well.",
        eventSlug: "one-lakh-hours",
      },
      {
        date: "2025-10-26T10:00:00+05:30",
        title: "Career Craft with AIESEC",
        description: "CV building and interview readiness, run with AIESEC in Hyderabad.",
        eventSlug: "career-craft",
      },
      {
        // The exact date isn't recorded. The event reports bracket it: the Eureka! report of
        // 23 Aug 2025 is still signed "ICE JNTUH", and the Pitch Perfect 2.0 report of
        // 28 Jan 2026 is signed "E-Cell, JNTU Hyderabad".
        // TODO: confirm the changeover date with the committee.
        date: "2025-11-01T10:00:00+05:30",
        title: "From I.C.E to E-Cell",
        description:
          "The I.C.E Club became E-Cell, JNTU Hyderabad — a new name and a wider remit, run by the same people.",
        dateApproximate: true,
      },
      {
        date: "2026-01-28T10:00:00+05:30",
        title: "Pitch Perfect 2.0",
        description:
          "Sixteen teams were handed a random idea on the spot and had minutes to build a pitch around it.",
        eventSlug: "pitch-perfect-2",
      },
      {
        date: "2026-08-07T10:30:00+05:30",
        title: "ETHOS 2026 — The Decision Matrix",
        description:
          "The second ETHOS, themed Sustainable Infrastructure & Green Innovation: 120+ participants from 6+ colleges, and ten teams in the boardroom finale.",
        eventSlug: "ethos-2026",
      },
      {
        date: "2026-09-22T17:00:00+05:30",
        title: "Market Mayhem",
        description:
          "A high-stakes debate on real Indian businesses, won by Team Balayya Mansion House.",
        eventSlug: "market-mayhem",
      },
      {
        date: "2026-09-28T17:00:00+05:30",
        title: "2026 Unveil",
        description:
          "The season opener: the full year's event calendar revealed, with live performances.",
        eventSlug: "unveil-2026",
      },
    ],
  },
  "about.ts",
);
