import { joinSchema, parseContent } from "./schema";

/** TODO: confirm roles and requirements with the committee before recruitment opens. */
export const join = parseContent(
  joinSchema,
  {
    intro:
      "E-Cell runs on students who want to build something bigger than a resume line. If that sounds like you, the organising committee is where it starts.",
    whyJoin: [
      {
        title: "Own something real",
        description:
          "Committee members run actual events with actual budgets, speakers and deadlines — not simulations.",
      },
      {
        title: "Meet people worth knowing",
        description:
          "Founders, investors, alumni and industry practitioners come to us. You are in the room.",
      },
      {
        title: "Learn by doing the hard part",
        description:
          "Sponsorship calls, logistics, design, marketing — the parts nobody teaches and everybody needs.",
      },
    ],
    roles: [
      {
        title: "Events and operations",
        description: "Plan and run the events end to end, from venue to run-sheet.",
        requirements: [
          "Comfortable coordinating people and chasing deadlines",
          "Available on event days",
        ],
      },
      {
        title: "Marketing and outreach",
        description: "Build the audience, run the socials, and get people through the door.",
        requirements: ["Writes clearly", "Understands what actually travels on Instagram"],
      },
      {
        title: "Design",
        description: "Make the posters, decks and assets that set the club's visual tone.",
        requirements: ["Working knowledge of a design tool", "A portfolio, however small"],
      },
      {
        title: "Finance and sponsorship",
        description: "Manage budgets and build relationships with sponsors and partners.",
        requirements: ["Comfortable with numbers", "Willing to make the cold call"],
      },
    ],
  },
  "join.ts",
);
