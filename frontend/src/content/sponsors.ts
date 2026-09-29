import { parseContent, sponsorsSchema } from "./schema";

/**
 * The Sponsors page.
 *
 * Three of the four reach figures are now **computed by the data layer** from the
 * `participation` recorded on each event, which in turn comes from the club's own
 * post-event reports. The values written below are only fallbacks; `getSponsors()`
 * overwrites them. They still carry `approximate: true`, because the reports themselves
 * give rounded figures ("150+ from 10+ colleges") rather than exact headcounts.
 *
 * The follower count is the one number nothing in the repo can prove, so it stays an
 * explicit placeholder.
 *
 * Tier names, benefits and prices are equally unconfirmed. No prices are shown at all.
 */
export const sponsors = parseContent(
  sponsorsSchema,
  {
    intro:
      "E-Cell JNTUH puts brands in front of the students who will start companies, join them early, and hire from your industry in three years. Our events run on campus at one of Telangana's largest engineering universities, and draw teams from institutions across the state.",

    whyPartner: [
      {
        title: "Reach engineering students across Telangana",
        description:
          "Our flagship events are intercollegiate — teams travel in from institutions across the state, not just our own campus.",
      },
      {
        title: "Meet student talent before anyone else",
        description:
          "Competitions surface the students who can reason under pressure and defend a decision. You see them work, not just their CVs.",
      },
      {
        title: "Associate with ETHOS and our competitions",
        description:
          "ETHOS is a full-day intercollegiate case competition with an industry jury. Your brand sits alongside it, on stage and in the room.",
      },
      {
        title: "Align with sustainability and CSR goals",
        description:
          "ETHOS 2026 was built entirely around sustainability — where profitability, ethics and environmental responsibility collide.",
      },
    ],

    // TODO: every figure below is a placeholder. Confirm with the club before publishing.
    reach: [
      // The first three are overwritten by getSponsors() from the events data.
      { label: "Events hosted", value: 0, approximate: false },
      { label: "Students reached", value: 0, suffix: "+", approximate: true },
      { label: "Colleges represented", value: 0, suffix: "+", approximate: true },
      // TODO: ask the committee for the real follower count.
      { label: "Social media followers", value: 1000, suffix: "+", approximate: true },
    ],

    // TODO: tier names and benefits are placeholders pending the club's sponsorship deck.
    tiers: [
      {
        id: "title",
        name: "Title partner",
        summary: "Your name alongside the event's, everywhere it appears.",
        benefits: [
          "Naming rights on the flagship event",
          "Top billing on all posters, stage backdrops and social posts",
          "Speaking slot at the opening session",
          "Stall space across the full event day",
          "First access to participant talent",
        ],
        order: 0,
      },
      {
        id: "event",
        name: "Event partner",
        summary: "Headline presence at a single competition or summit.",
        benefits: [
          "Logo on event posters and the event page",
          "Stage mentions throughout the day",
          "Stall space on the event day",
          "Social media features before and after",
        ],
        order: 1,
      },
      {
        id: "workshop",
        name: "Workshop partner",
        summary: "Run or back a session in your own field.",
        benefits: [
          "Your speaker leads a workshop",
          "Logo on workshop materials and certificates",
          "Direct interaction with attending students",
        ],
        order: 2,
      },
      {
        id: "in-kind",
        name: "In-kind / community partner",
        summary: "Support in goods, services or reach rather than cash.",
        benefits: [
          "Logo on the partners section of the site",
          "Social media acknowledgement",
          "Product sampling or prize sponsorship",
        ],
        order: 3,
      },
    ],

    // TODO: confirm the exact deliverables with the club.
    whatYouGet: [
      "Logo placement on posters, banners and the event page",
      "Stage mentions during the opening and prize ceremony",
      "Stall space on campus during the event",
      "Social media features across Instagram and LinkedIn",
      "Co-branding on participation and winner certificates",
      "A post-event report with reach and participation figures",
    ],

    // TODO: no brochure yet. The download button stays hidden until this is set.
    // TODO: no sponsorship enquiry form yet — the page falls back to the email link.
  },
  "sponsors.ts",
);
