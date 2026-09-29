import { parseContent, siteSchema } from "./schema";

/**
 * Site-wide settings. Everything global — links, address, stats, whether recruitment is
 * open — is edited here and nowhere else.
 *
 * `description` is derived from the club's own statement in about.ts, so the hero intro,
 * the SEO description and the About lead all trace back to one sentence the club wrote.
 */
export const site = parseContent(
  siteSchema,
  {
    name: "E-Cell, JNTU Hyderabad",
    shortName: "E-Cell JNTUH",
    tagline: "Innovate | Connect | Elevate",
    motto: "Innovate. Connect. Elevate.",
    description:
      "The Entrepreneurship Cell of JNTU Hyderabad — competitions, workshops and speaker sessions for students building something of their own.",
    heroIntro: "Ideas get argued, defended and torn apart here — then built anyway.",
    // TODO: replace with the real domain once it is registered.
    url: "https://ecelljntuh.vercel.app",
    // TODO: the club's official email is not confirmed. Left unset so no fake mailto ships.
    address: "JNTUH UCESTH, Kukatpally, Hyderabad, Telangana 500085",
    mapUrl: "https://maps.google.com/?q=JNTUH+College+of+Engineering+Hyderabad+Kukatpally",
    mapEmbedUrl:
      "https://www.google.com/maps?q=JNTUH+College+of+Engineering+Hyderabad+Kukatpally&output=embed",
    socials: {
      instagram: "https://www.instagram.com/ecell_jntuh/",
      linkedin: "https://www.linkedin.com/company/ecell-jntuh/",
    },
    // Events hosted, students reached, colleges represented and speakers/jury hosted are
    // all computed from the events data by the data layer rather than typed here, so they
    // can never drift out of date. Only what the events data can't derive goes below.
    stats: [{ label: "Teams at Pitch Perfect 2.0", value: 16 }],
    featuredEventSlug: "ethos-2026",
    // TODO: confirm with the club, along with the application form link.
    recruitmentOpen: false,
  },
  "site.ts",
);
