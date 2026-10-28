import { caseStudySchema, parseContent } from "./schema";
import { z } from "zod";

/**
 * Business breakdowns the club has published on Instagram.
 *
 * Summaries are condensed from the club's own captions — never invented. The full
 * carousel lives on Instagram; this is the index, so the work doesn't disappear the
 * moment it scrolls off the grid.
 *
 * Adding one: crop the cover to the artwork, drop it in `assets-source/case-studies/`,
 * run `pnpm optimize-images`, and paste the printed width and height here.
 */
export const caseStudies = parseContent(
  z.array(caseStudySchema),
  [
    {
      id: "cred",
      subject: "CRED",
      title: "The CRED paradox",
      summary:
        "A ₹1,457 crore net loss and a valuation in the billions — the same company. Inside India's fintech unicorn, and the story, strategy and business behind it.",
      image: "/images/case-studies/DewZ1bsmRu4.webp",
      imageAlt: "Case study cover: The CRED Paradox, in white on black, beside a halftone unicorn",
      width: 1080,
      height: 1339,
      url: "https://www.instagram.com/p/DewZ1bsmRu4/",
      publishedAt: "2026-10-21T12:00:00+05:30",
    },
    {
      id: "what-makes-a-unicorn",
      subject: "Unicorn startups",
      title: "What actually makes a startup a unicorn",
      summary:
        "The $1 billion line, and what a company has to do to cross it. A primer on the label everyone uses and few define.",
      image: "/images/case-studies/DeB_Ai1GXr8.webp",
      imageAlt:
        "Case study cover: the word Unicorn over a halftone horse on green, with $1 billion beneath",
      width: 1080,
      height: 1350,
      url: "https://www.instagram.com/p/DeB_Ai1GXr8/",
      publishedAt: "2026-10-03T12:00:00+05:30",
    },
    {
      id: "cadbury",
      subject: "Cadbury",
      title: "How Cadbury became part of every Indian celebration",
      summary:
        "A brand that sold itself into the country's festivals rather than onto its shelves — told through the story of a Raksha Bandhan morning.",
      image: "/images/case-studies/DNL0efKsDKW.webp",
      imageAlt:
        "Case study cover: a hand-drawn comic page titled The tale of every brother, on paper with tape and string",
      width: 1200,
      height: 1200,
      url: "https://www.instagram.com/p/DNL0efKsDKW/",
      publishedAt: "2025-08-11T12:00:00+05:30",
    },
    {
      id: "housing-com",
      subject: "Housing.com",
      title: "The rise and fall of Housing.com",
      summary:
        "What went wrong for one of India's most promising startups: leadership conflict, overspending, and a loss of focus. A lesson in what growth alone cannot fix.",
      image: "/images/case-studies/DCe1IAfymkr.webp",
      imageAlt:
        "Case study cover: The Rise and Fall of Housing.com in white on blue, with a line-drawn house outline",
      width: 1080,
      height: 1080,
      url: "https://www.instagram.com/p/DCe1IAfymkr/",
      publishedAt: "2024-11-17T12:00:00+05:30",
    },
  ],
  "case-studies.ts",
);
