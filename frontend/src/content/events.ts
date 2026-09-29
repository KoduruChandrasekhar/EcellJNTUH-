import { eventSchema, parseContent } from "./schema";
import { z } from "zod";

/**
 * Every event the club has run. Order doesn't matter — the data layer sorts by date.
 *
 * Dates are ISO with the +05:30 offset, so "7 Aug 2026, 10:30 AM IST" means the same
 * instant regardless of where the build runs or where the visitor is.
 *
 * Where the club hasn't confirmed an exact day, `dateApproximate: true` is set: the date
 * still orders the event correctly, but the UI shows only the month and says it's to be
 * confirmed, rather than presenting a guess as fact.
 *
 * TODO: posters are pending. Cards and heroes fall back to a brand-styled block when
 * `poster` is absent, so nothing looks broken in the meantime.
 */
export const events = parseContent(
  z.array(eventSchema),
  [
    /* ------------------------------------------------------- ETHOS 2026 */
    {
      slug: "ethos-2026",
      title: "ETHOS 2026 — The Decision Matrix",
      shortDescription:
        "The flagship summit: an intercollegiate case competition wrapped in a full day of workshops and speaker sessions.",
      description: `ETHOS is E-Cell JNTUH's flagship — an intercollegiate case competition that brings students from across institutions onto one platform of innovation, strategy and problem-solving, wrapped in a full day of workshops and speaker sessions.

The 2026 edition, the second, was themed **Sustainable Infrastructure & Green Innovation** — business problems where profitability, ethics and environmental responsibility collide, and somebody still has to decide.`,
      category: "summit",
      tagline: "Earth isn't an inheritance; it's a responsibility.",
      theme: "Sustainable Infrastructure & Green Innovation",
      accent: "eco",
      eligibility: "College students from institutions across Telangana",
      teamSize: { min: 3, max: 5 },
      rounds: [
        {
          name: "Round 1 — Online screening",
          mode: "online",
          description:
            "Teams received a problem statement on registration and submitted a two-to-four page strategic draft. Eighteen teams entered; the top eight went through to the finale.",
          deadline: "2026-08-04T00:00:00+05:30",
        },
        {
          name: "Wildcard round",
          mode: "online",
          description:
            "Ten strong teams had missed the cut by a narrow margin, so they were given a second, fresh problem statement and a short window to answer it. Two more earned a place in the finale.",
        },
        {
          name: "Finale — Decision Matrix, the Boardroom Challenge",
          mode: "on-campus",
          description:
            "Ten teams took C-suite roles — CEO, CFO, CMO, COO, CTO — at a fictional company, worked a real corporate scenario into a ten-slide case, presented it to the jury and then defended it through three minutes of live Q&A.",
        },
      ],
      highlights: [
        {
          title: "Speaker sessions and workshops",
          description:
            "Bold ideas from inspiring speakers, turned into action through hands-on workshops.",
        },
        {
          title: "Boardroom challenge",
          description:
            "Debate people, planet and profit, and unravel the problem statement like a real executive.",
        },
      ],
      results: [
        { position: 1, teamName: "Team Innovista" },
        { position: 2, teamName: "Team The Pinnacle" },
        { position: 3, teamName: "Team Ankura" },
      ],
      jury: [
        {
          name: "Mr. Nanduri Ravi Kumar",
          role: "Public speaker, finance and startup mentor",
        },
        {
          name: "Mr. Vippulancha Venugopal Rao",
          role: "Founder, Mandalaa Pvt. Ltd. and Vistarakau — corporate leader, social entrepreneur and natural farmer",
        },
        {
          name: "Mrs. Shailaja Priyadarshini",
          role: "Joint Secretary, WTITC Startups & Innovation Chapter",
        },
        {
          name: "Mr. Raghunandan Devarshetty",
          role: "Marketing leader and growth strategist",
        },
      ],
      participation: {
        participants: 120,
        colleges: 6,
        teamsEntered: 18,
        teamsShortlisted: 10,
      },
      takeaways: [
        "Sustainability is a strategy question before it is an ethics one — the teams that scored well costed it.",
        "A wildcard round is worth running: two of the ten finalists came through it.",
        "Certificates went out for the finance workshop, for competing in Decision Matrix, and to the winners and runners-up.",
      ],
      poster: "/images/events/ethos-2026/poster.webp",
      posterAlt:
        "ETHOS 2026 poster: the ETHOS wordmark with a globe for the O, Decision Matrix beneath, and halftone hands holding trees and a coin",
      startsAt: "2026-08-07T10:30:00+05:30",
      endsAt: "2026-08-07T17:00:00+05:30",
      venue: "JNTUH College of Engineering Hyderabad",
      registration: { mode: "none", note: "Event completed" },
      gallerySlug: "ethos-2026",
      featured: true,
    },

    /* --------------------------------------------- ETHOS 2026 sessions
       Speaker names and titles follow the club's own ETHOS 2026 event report, which is
       the most authoritative source we have. Three differ from the spelling used in the
       Instagram announcements — Shair/Shaik, Maredy/Mareddy, and the placement of
       Vippulancha — so they are worth a second look.
       TODO: confirm these three spellings with the speakers themselves. */
    {
      slug: "ethos-2026-ai-and-personal-branding",
      title: "AI & Emerging Technologies, Startups and Personal Branding",
      shortDescription:
        "A workshop on building with emerging technology, and building a name while you do it.",
      description:
        "A hands-on workshop covering where emerging technology is actually useful to early founders, and how personal branding compounds alongside the work.",
      category: "workshop",
      accent: "eco",
      parentSlug: "ethos-2026",
      speakers: [
        {
          name: "Mr. Saahil Zameer Shair",
          role: "CEO, Prompt Techies (Trovofi Private Limited)",
        },
      ],
      takeaways: [
        "How to build AI-first startups, and turn an idea into something that scales.",
        "Why personal branding and a credible digital presence are worth the time.",
        "Where emerging technology actually buys you a competitive advantage.",
        "Staying adaptable: the entrepreneurial mindset in a technology-driven market.",
      ],
      startsAt: "2026-08-07T11:00:00+05:30",
      venue: "JNTUH College of Engineering Hyderabad",
      registration: { mode: "none", note: "Part of ETHOS 2026" },
    },
    {
      slug: "ethos-2026-sustainability-in-action",
      title: "Sustainability in Action: Business, Climate and the Road Ahead",
      shortDescription:
        "A speaker session on what sustainability costs, what it returns, and who pays for it.",
      description:
        "A speaker session on sustainability as a business decision rather than a slogan — where climate responsibility meets margin, and what the road ahead asks of the next generation of founders.",
      category: "speaker-session",
      accent: "eco",
      parentSlug: "ethos-2026",
      speakers: [
        {
          name: "Mr. Vippulancha Venugopal Rao",
          role: "Founder, Mandalaa Pvt. Ltd. and Vistarakau — corporate leader, social entrepreneur and natural farmer",
        },
      ],
      takeaways: [
        "Why sustainability is becoming a business requirement rather than a preference.",
        "Practical ways to adopt sustainable habits day to day.",
        "Climate change, resilience, and what the pandemic taught about both.",
        "How a business balances growth, responsibility and environmental impact.",
      ],
      startsAt: "2026-08-07T13:00:00+05:30",
      venue: "JNTUH College of Engineering Hyderabad",
      registration: { mode: "none", note: "Part of ETHOS 2026" },
    },
    {
      slug: "ethos-2026-wealth-creation-blueprint",
      title: "Wealth Creation Blueprint and Proven Financial Strategies",
      shortDescription:
        "A standalone financial literacy workshop, open to everyone — not only ETHOS participants.",
      description: `A practical workshop on how wealth actually accumulates: what a wealth creation plan is, why it matters, and which strategies hold up over time.

Unlike the other ETHOS sessions this one ran as a **standalone workshop with its own registration**, open to anyone — not only ETHOS participants.`,
      category: "workshop",
      accent: "eco",
      parentSlug: "ethos-2026",
      speakers: [
        {
          name: "Mr. Sundara Rami Reddy Maredy",
          role: "MD, RCP Technologies — financial educator, investment coach, NISM and CRISIL certified wealth manager",
        },
      ],
      takeaways: [
        "The fundamentals of wealth planning, and matching assets to long-term goals.",
        "Why financial independence and inflation protection belong in the same plan.",
        "Asset allocation and disciplined investing for growth that lasts.",
        "Practical strategies for making informed financial decisions.",
      ],
      startsAt: "2026-08-07T14:30:00+05:30",
      venue: "JNTUH College of Engineering Hyderabad",
      registration: { mode: "none", note: "Event completed" },
    },
    {
      slug: "ethos-2026-decision-matrix",
      title: "The Decision Matrix — Boardroom Challenge",
      shortDescription:
        "Ten teams took C-suite roles and defended a sustainability strategy before a four-person jury.",
      description:
        "Teams stepped into the shoes of a leadership team — CEO, CFO, CMO, COO, CTO — to resolve a real-world corporate problem statement, then presented and defended their strategy live before the jury.",
      category: "competition",
      accent: "eco",
      parentSlug: "ethos-2026",
      startsAt: "2026-08-07T15:00:00+05:30",
      venue: "JNTUH College of Engineering Hyderabad",
      registration: { mode: "none", note: "Event completed" },
    },

    /* ------------------------------------------------------- upcoming */
    {
      slug: "market-mayhem",
      title: "Market Mayhem — The ultimate business debate",
      shortDescription:
        "Two teams, one failed Indian giant, opposite sides. Rescue it, or prove it was doomed.",
      description: `The company failed. Could you have stopped the bleeding?

Market Mayhem is a two-round business debate built on **failed Indian business giants**. Instead of Team A against Team B on different topics, both teams take the *same* collapsed brand from opposite sides:

- **The Rescuers** argue the failure was avoidable, and show how they would have saved it.
- **The Doomed** argue the flaws were structural, and it was always going to crash.

Round two takes the ground out from under you: you are now in charge, you draw a Mayhem Card — an unexpected market crisis — and you have sixty seconds to make the call and defend it to the judges.

The day closed with a live performance by **Ragavarsha**.`,
      category: "competition",
      tagline: "The company failed. Can you do better?",
      theme: "Failed Indian business giants",
      accent: "red",
      rounds: [
        {
          name: "Round 1 — The Counterfactual",
          mode: "on-campus",
          description:
            "Analyse the missteps, build an alternate strategy, and defend whether the company could have survived.",
        },
        {
          name: "Round 2 — Market Mayhem",
          mode: "on-campus",
          description:
            "You are in charge. Draw a Mayhem Card, make a high-stakes call in sixty seconds, and defend your move against the judges.",
        },
      ],
      highlights: [
        {
          title: "Strategy and business debate",
          description:
            "Formulate your arguments, dismantle the opposing stance, and prove your mettle where every word counts.",
        },
        {
          title: "Crisis management",
          description:
            "A split-second executive call under fire, with the judges pushing back on every assumption.",
        },
      ],
      results: [
        { position: 1, teamName: "Team Balayya Mansion House" },
        { position: 2, teamName: "Team Hash" },
        { position: 3, teamName: "Team SHH" },
      ],
      jury: [
        { name: "Jashwanth Sonti", role: "Jury, Market Mayhem" },
        { name: "Siram Sankeerth", role: "Jury, Market Mayhem" },
      ],
      poster: "/images/events/market-mayhem/poster.webp",
      posterAlt:
        "Market Mayhem poster: the event name in orange and black over a patterned background, with the 22 September 2026 date",
      startsAt: "2026-09-22T17:00:00+05:30",
      venue: "SIT Seminar Hall, JNTUH Kukatpally",
      // The registration form stays recorded even though the event is over: the data layer
      // computes "closed" from the date, so the page never offers a dead form.
      registration: {
        mode: "external",
        url: "https://forms.gle/gMHgbFhC4vqN8Guf7",
        label: "Register your team",
      },
      gallerySlug: "market-mayhem",
    },

    /* --------------------------------------------------- 2026 Unveil */
    {
      slug: "unveil-2026",
      title: "2026 Unveil",
      shortDescription:
        "The season opener: the full E-Cell event calendar revealed, with live performances.",
      description: `A new season begins. **2026 Unveil** opened the year by putting the whole E-Cell calendar on the table at once — every competition, workshop and summit planned for the year ahead, revealed in one sitting.

Live performances by **Raagavarsha** and **Elite Feet** ran alongside the reveal.`,
      category: "other",
      accent: "red",
      poster: "/images/events/unveil-2026/poster.webp",
      posterAlt:
        "2026 Unveil poster: torn-paper collage of band and dance performances in greyscale, with the date 28.09.2026 and 5:00 PM on a dark panel",
      startsAt: "2026-09-28T17:00:00+05:30",
      venue: "SIT Building, JNTUH Kukatpally",
      registration: { mode: "none", note: "Event completed" },
    },

    {
      slug: "eraya-2026",
      title: "ERAYA 2026",
      shortDescription:
        "The cultural fest of JNTUH UCESTH, co-presented with the university's student clubs.",
      description:
        "ERAYA is the cultural fest of JNTUH UCESTH. E-Cell co-presented the 2026 edition alongside the university's other student clubs — a reminder that the club shows up for campus life, not only for the business calendar.",
      category: "other",
      accent: "red",
      poster: "/images/events/eraya-2026/poster.webp",
      posterAlt:
        "ERAYA 2026 poster on a deep pink patterned background, presented by JNTUH, E-Cell and the JNTUH UCESTH student clubs",
      // TODO: confirm the exact date with the club.
      startsAt: "2026-03-01T10:00:00+05:30",
      dateApproximate: true,
      venue: "JNTUH UCESTH campus, Kukatpally",
      registration: { mode: "none", note: "Event completed" },
    },

    /* --------------------------------------------------------- 2026 */
    {
      slug: "pitch-perfect-2",
      title: "Pitch Perfect 2.0",
      shortDescription:
        "Teams were handed unconventional products and had to sell them to a panel — with no AI allowed.",
      description: `A pitch built under pressure, with no preparation allowed. Each team was handed a **random idea on the spot** and had to think fast: find a problem worth solving, argue a solution, and sketch a market strategy using nothing but creativity and critical thinking.

They then pitched to a panel — marketing the product and enacting their own advertisements to sell it. No AI during brainstorming. Sixteen teams took part, with strong first-year turnout.

By the end, everyone in the room had defended an idea they had first heard an hour earlier: impromptu communication, creative thinking and entrepreneurial confidence, all in one sitting.`,
      category: "competition",
      accent: "mint",
      highlights: [
        {
          title: "A random idea, on the spot",
          description:
            "No brief in advance and no preparation — teams found out what they were selling when the clock started.",
        },
        {
          title: "Problem, solution, market",
          description:
            "The structure a real pitch needs, assembled from scratch in minutes.",
        },
        {
          title: "Enacted advertisements",
          description:
            "Teams performed their own ads for the panel, which turned out to be the fastest way to find out whether the idea actually landed.",
        },
      ],
      results: [
        { position: 1, teamName: "Team Playmaker" },
        { position: 2, teamName: "Team Infinity" },
        { position: 3, teamName: "Team Goose" },
      ],
      poster: "/images/events/pitch-perfect-2/poster.webp",
      posterAlt:
        "Pitch Perfect 2.0 poster: a 3D robot mascot on mint green, with the 28 January 2026 date",
      startsAt: "2026-01-28T17:00:00+05:30",
      venue: "Seminar Hall, SIT — JNTUH Kukatpally",
      registration: { mode: "none", note: "Event completed" },
      gallerySlug: "pitch-perfect-2",
    },

    /* --------------------------------------------------------- 2025 */
    {
      slug: "career-craft",
      title: "Career Craft",
      shortDescription:
        "Entrepreneurial preparedness with AIESEC in Hyderabad — CV building and interview readiness.",
      description:
        "A session on entrepreneurial preparedness run with AIESEC in Hyderabad, covering CV building and interview readiness: CV screening, mock interviews and guidance from the people who do the hiring.",
      category: "workshop",
      accent: "blue",
      poster: "/images/events/career-craft/poster.webp",
      posterAlt:
        "Career Craft poster: the AIESEC in Hyderabad and E-Cell JNTUH collaboration, with the date and Golden Jubilee Hall venue",
      startsAt: "2025-10-26T10:00:00+05:30",
      endsAt: "2025-10-26T13:00:00+05:30",
      venue: "Golden Jubilee Hall, JNTUH Kukatpally",
      partners: ["aiesec-hyderabad"],
      registration: { mode: "none", note: "Event completed" },
    },
    {
      slug: "one-lakh-hours",
      title: "1,00,000 Hours",
      shortDescription:
        "An alumni session on startups, entrepreneurship and using your working hours meaningfully.",
      description:
        "Organised with the JNTUH Directorate of Alumni Affairs, this session asked what you actually do with the hundred thousand hours of a working life. It drew a large turnout.",
      category: "speaker-session",
      accent: "navy",
      speakers: [
        {
          name: "Mr. P. Purushotham Babu",
          role: "JNTUH alumnus (B.Tech 2006–10) and Senior Manager (Marketing), Vizag Steel Plant",
        },
      ],
      poster: "/images/events/one-lakh-hours/poster.webp",
      posterAlt:
        "1,00,000 Hours poster: the session title alongside a portrait of the speaker from the Directorate of Alumni Affairs",
      startsAt: "2025-10-16T16:00:00+05:30",
      venue: "Golden Jubilee Seminar Hall, JNTUH Kukatpally",
      partners: ["jntuh-alumni-affairs"],
      registration: { mode: "none", note: "Event completed" },
    },
    {
      slug: "trivial-pursuits",
      title: "Trivial Pursuits",
      shortDescription:
        "A business, finance and real-world knowledge quiz that opened the academic year.",
      description:
        "The quiz that opened the academic year: business, finance and general real-world knowledge, played in teams and pitched at speed. Freshers turned out in force.",
      category: "quiz",
      accent: "purple",
      poster: "/images/events/trivial-pursuits/poster.webp",
      posterAlt:
        "Trivial Pursuits poster: neon gradient lettering over a black grid floor with a spotlit podium",
      startsAt: "2025-09-19T16:30:00+05:30",
      // TODO: confirm venue.
      venue: "JNTUH UCESTH campus, Kukatpally",
      registration: { mode: "none", note: "Event completed" },
    },
    {
      slug: "eureka-2025-campus-round",
      title: "Eureka! 2025 — Campus Round",
      shortDescription:
        "The campus stage of E-Cell IIT Bombay's business model competition, under NEC 2025.",
      description: `The club hosted the first stage of **Eureka!**, the business model competition run by E-Cell IIT Bombay, under IIT Bombay's National Entrepreneurship Challenge 2025. The campus winner qualified for the zonal rounds in Delhi, Bangalore or Mumbai.

Finalists presented a structured deck in **two minutes**, then took **three minutes of Q&A** from the jury — long enough to find out whether a business model survives contact with someone who has built one. The audience voted for their own favourite alongside the jury's decision.`,
      category: "competition",
      accent: "navy",
      teamSize: { min: 1, max: 7 },
      results: [
        {
          position: 1,
          teamName: "Momentum",
          note: "A scalable model with a clear problem-solution fit and a costed route to market.",
        },
        {
          position: 2,
          teamName: "Sahara",
          note: "Tied for second — modular, repairable solar panels and a service ecosystem for solar waste.",
        },
        {
          position: 2,
          teamName: "Divyadarshan",
          note: "Tied for second — deep research and real social impact from a creative use of technology.",
        },
        { position: 3, teamName: "Trovo", note: "Also won the Audience Favourite award." },
      ],
      jury: [
        {
          name: "Dr. Divakar Sadam",
          role: "Ph.D. in Biotechnology — founder of ELYNS Publishing and Scholar Bench, mentor at JTBI Hyderabad",
        },
        {
          name: "Mr. N. Chaitanya Kosanam",
          role: "MBA (IIM Bangalore), B.Tech (JNTUCEH) — formerly HAL, Wipro and Cyient; founder of Maha Bhashyam School, now leading TriQuanta Labs",
        },
      ],
      participation: { participants: 100, colleges: 15 },
      takeaways: [
        "Student innovation shows up when there is a platform to pitch on and someone qualified to push back.",
        "Sustainability, social impact and scalability were the themes teams kept returning to.",
        "An audience award adds a second, more democratic kind of recognition.",
      ],
      poster: "/images/events/eureka-2025-campus-round/poster.webp",
      posterAlt:
        "Eureka! 2025 poster: the Road to Enterprise wordmark on deep navy above the organising team",
      startsAt: "2025-08-23T10:00:00+05:30",
      venue: "Golden Jubilee Conference Hall, JTBI Building — JNTU Hyderabad",
      partners: ["ecell-iit-bombay"],
      registration: { mode: "none", note: "Event completed" },
    },
    {
      slug: "cash-and-chaos-lawsuit-edition",
      title: "Cash & Chaos: Lawsuit Edition",
      shortDescription:
        "A role-based simulation dropping teams into corporate crises — legal disputes, PR fires, hard calls.",
      description:
        "A role-based simulation that put teams inside high-pressure corporate crisis scenarios: legal disputes, PR challenges and strategic decisions with no clean answer. It tested structured reasoning and composure under scrutiny more than it tested preparation.",
      category: "competition",
      accent: "red",
      // TODO: confirm date with the club — placed between Pitch or Ditch and Eureka! 2025.
      startsAt: "2025-04-01T16:30:00+05:30",
      dateApproximate: true,
      // TODO: confirm venue.
      venue: "JNTUH UCESTH campus, Kukatpally",
      registration: { mode: "none", note: "Event completed" },
    },
    {
      slug: "pitch-or-ditch",
      title: "Pitch or Ditch",
      shortDescription:
        "A Women's Month product debate: revive a failed women-centric product, or let it stay buried.",
      description: `A debate format built around failed women-centric products. Two teams went head to head on each one — one arguing to bring it back, the other to keep it buried — with six minutes to decide its fate.

Sides were **assigned at random**, so nobody could rely on an opinion they already held, and every argument had to be grounded in market reality. It cut across branches and years, and rewarded analytical thinking as much as persuasion.`,
      category: "competition",
      accent: "purple",
      teamSize: { min: 2, max: 4 },
      poster: "/images/events/pitch-or-ditch/poster.webp",
      posterAlt:
        "Pitch or Ditch poster: two illustrated women debating, with the Women's Month product debate subtitle",
      startsAt: "2025-03-27T16:30:00+05:30",
      venue: "CRC Seminar Hall, JNTUH Kukatpally",
      registration: { mode: "none", note: "Event completed" },
    },
    {
      slug: "ethos-2025",
      title: "ETHOS 2025 — Dilemma Decoded",
      shortDescription:
        "The first ETHOS: an intercollegiate flagship on ethics, strategy and AI-driven decisions.",
      description: `The first edition of ETHOS, and the club's first flagship event — conceptualised and executed **in ten days**.

Themed around ethics, strategy and AI-driven dilemmas, it ran two expert-led workshops and an ideation sprint before its centrepiece, **Dilemma Decoded**: a live boardroom challenge simulating executive decision-making. It drew **150+ students from 10+ colleges**.`,
      category: "summit",
      theme: "Ethics, strategy and AI",
      accent: "ink",
      highlights: [
        {
          title: "Telling Business Stories with Power BI",
          description:
            "Cleaning and structuring raw data, building dashboards that mean something, and turning the result into a decision. Over 80 students attended; certification was powered by HDAC.",
        },
        {
          title: "Build a Brand with Canva",
          description:
            "Design hierarchy and typography, assembling a brand identity kit — logo, palette, tagline — and using it to tell a credible story. Certification was powered by Designland.",
        },
        {
          title: "Dilemma Decoded",
          description:
            "Teams took C-suite roles at fictional startups, solved an ethical and commercial dilemma from a provided case, built a ten-slide deck using what the workshops had taught them, and faced three minutes of live Q&A from the jury.",
        },
      ],
      jury: [
        { name: "Ashwath Vyas Sudam", role: "Founder & CEO, Amaavi Experiences" },
        { name: "Luvieen Alva", role: "Co-founder, MentorMind" },
        { name: "Anand Reddy K S", role: "Co-founder & CTO, Tericsoft" },
        { name: "Adithya Ram Parisa", role: "Data Analyst, TCS — Community Lead, HDAC" },
      ],
      participation: { participants: 150, colleges: 10, teamsShortlisted: 10 },
      takeaways: [
        "Data and design can carry an ethical argument, not just decorate it.",
        "Real dilemmas need a narrative, not only a solution.",
        "Ten days is enough, if the people are.",
      ],
      poster: "/images/events/ethos-2025/poster.webp",
      posterAlt:
        "ETHOS 2025 poster: The Dilemma Decoded, with an illustration of a man facing a humanoid robot",
      startsAt: "2025-04-12T10:00:00+05:30",
      venue: "JNTUH College of Engineering Hyderabad",
      registration: { mode: "none", note: "Event completed" },
      gallerySlug: "ethos-2025",
    },
    {
      slug: "ethos-2025-dilemma-decoded",
      title: "Dilemma Decoded",
      shortDescription:
        "Teams took the C-suite of fictional startups and faced high-stakes ethical and strategic calls.",
      description:
        "The boardroom challenge at the heart of the first ETHOS. Teams stepped into the C-suite of fictional startups and worked through AI controversies, branding dilemmas and data analysis — crafting a rebrand, and deciding whether to pivot, continue or transform.",
      category: "competition",
      accent: "ink",
      parentSlug: "ethos-2025",
      startsAt: "2025-04-12T14:00:00+05:30",
      venue: "JNTUH College of Engineering Hyderabad",
      registration: { mode: "none", note: "Event completed" },
    },

    /* --------------------------------------------------------- 2024 */
    {
      slug: "case-reboot",
      title: "Case Reboot",
      shortDescription:
        "Simulated startup challenges — be the team that reboots success rather than explains failure.",
      description:
        "A case simulation built around startups in trouble. Teams of four to five worked through the kind of problems that don't arrive with clean data, and had to commit to a direction rather than hedge.",
      category: "competition",
      accent: "blue",
      teamSize: { min: 4, max: 5 },
      poster: "/images/events/case-reboot/poster.webp",
      posterAlt:
        "Case Reboot poster: a laptop under a spotlight on blue, with the event date, time, venue and team size",
      startsAt: "2024-11-19T16:30:00+05:30",
      venue: "CRC Seminar Hall, JNTUH Kukatpally",
      registration: { mode: "none", note: "Event completed" },
    },
    {
      slug: "pitch-perfect",
      title: "Pitch Perfect",
      shortDescription:
        "The first Pitch Perfect — test your pitching skills in front of a live panel.",
      description:
        "The first edition of Pitch Perfect, and the club's first pitching competition: teams built and delivered a sales pitch to a live panel, with prizes and certificates for the winners. It set the format that Pitch Perfect 2.0 would later sharpen.",
      category: "competition",
      accent: "yellow",
      poster: "/images/events/pitch-perfect/poster.webp",
      posterAlt:
        "Pitch Perfect poster: a 3D character with a megaphone on grid paper, with the date and venue",
      startsAt: "2024-11-06T16:30:00+05:30",
      venue: "CRC Seminar Hall, JNTUH Kukatpally",
      registration: { mode: "none", note: "Event completed" },
    },
  ],
  "events.ts",
);
