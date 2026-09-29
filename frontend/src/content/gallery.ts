import { galleryAlbumSchema, parseContent } from "./schema";
import { z } from "zod";

/**
 * One album per event that has photographs.
 *
 * Events without photos simply have no album — the gallery shows what exists rather than
 * padding itself with poster screenshots, and the Gallery page has a designed empty state
 * for when nothing matches a filter.
 *
 * Alt text describes what is visible without naming anyone.
 *
 * TODO: more photos are coming from the club. Drop them in
 * `assets-source/events/<event-slug>/`, run `pnpm optimize-images`, and paste the printed
 * width/height values in here.
 */
export const gallery = parseContent(
  z.array(galleryAlbumSchema),
  [
    {
      slug: "ethos-2026",
      title: "ETHOS 2026 — The Decision Matrix",
      eventSlug: "ethos-2026",
      date: "2026-08-07T10:30:00+05:30",
      cover: "/images/events/ethos-2026/group.webp",
      images: [
        {
          src: "/images/events/ethos-2026/group.webp",
          alt: "Participants, jury and faculty of ETHOS 2026 gathered together in the hall at JNTUH after the boardroom challenge",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/ethos-2026/audience.webp",
          alt: "Attendees seated at round tables watching a session at ETHOS 2026, with panellists on stage",
          width: 750,
          height: 496,
        },
        {
          src: "/images/events/ethos-2026/winners-1.webp",
          alt: "A winning team receiving their certificate and trophy from the jury and faculty on stage at ETHOS 2026",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/ethos-2026/winners-2.webp",
          alt: "A runner-up team being presented with their certificate by the jury at ETHOS 2026",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/ethos-2026/winners-3.webp",
          alt: "A placing team collecting their certificate alongside the jury and faculty at ETHOS 2026",
          width: 1200,
          height: 900,
        },
      ],
    },
    {
      slug: "ethos-2025",
      title: "ETHOS 2025 — Dilemma Decoded",
      eventSlug: "ethos-2025",
      date: "2025-04-12T10:00:00+05:30",
      cover: "/images/events/ethos-2025/speaker.webp",
      images: [
        {
          src: "/images/events/ethos-2025/speaker.webp",
          alt: "A speaker addressing the room at ETHOS 2025, with the session's introduction slide projected behind",
          width: 607,
          height: 581,
        },
        {
          src: "/images/events/ethos-2025/presenter.webp",
          alt: "A participant presenting a business analytics dashboard to the room during ETHOS 2025",
          width: 632,
          height: 753,
        },
        {
          src: "/images/events/ethos-2025/audience.webp",
          alt: "A full room of attendees working on laptops during a session at ETHOS 2025",
          width: 768,
          height: 597,
        },
        {
          src: "/images/events/ethos-2025/group.webp",
          alt: "Participants, speakers and organisers of ETHOS 2025 gathered on the steps beneath the JNTUH lettering at the end of the day",
          width: 797,
          height: 251,
        },
      ],
    },
    {
      slug: "pitch-perfect-2",
      title: "Pitch Perfect 2.0",
      eventSlug: "pitch-perfect-2",
      date: "2026-01-28T10:00:00+05:30",
      cover: "/images/events/pitch-perfect-2/group-hall.webp",
      images: [
        {
          src: "/images/events/pitch-perfect-2/group-hall.webp",
          alt: "A wider view of the Pitch Perfect 2.0 group on stage, with the auditorium screens behind them",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/pitch-perfect-2/group-stage.webp",
          alt: "Participants and organisers of Pitch Perfect 2.0 grouped on the seminar hall stage after the final pitches",
          width: 1200,
          height: 681,
        },
      ],
    },
    {
      slug: "market-mayhem",
      title: "Market Mayhem",
      eventSlug: "market-mayhem",
      date: "2026-09-22T17:00:00+05:30",
      cover: "/images/events/market-mayhem/gallery/mm-01.webp",
      images: [
        {
          src: "/images/events/market-mayhem/gallery/mm-01.webp",
          alt: "Competitors and organisers crowded together in the tiered seminar hall at the end of Market Mayhem, arms around each other",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-02.webp",
          alt: "The Market Mayhem group gathered on the hall steps in front of the stage, with the event banner behind them",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-03.webp",
          alt: "Teams seated in the front rows facing the stage as the Market Mayhem title slide is projected",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-04.webp",
          alt: "A team on stage joining hands in a circle after their round",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-05.webp",
          alt: "A second team on stage with hands joined in the centre, mid-celebration",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-06.webp",
          alt: "A winning team on stage holding the trophy together",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-07.webp",
          alt: "A live band playing on the darkened stage before the debate rounds began",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-08.webp",
          alt: "A competitor at the microphone delivering an argument, notes in hand, with the round's slide projected behind",
          width: 1200,
          height: 901,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-09.webp",
          alt: "Team members leaning over the desk comparing notes between rounds",
          width: 874,
          height: 656,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-10.webp",
          alt: "A panel at the front desk debating the Company 6 case, Videocon Telecom, projected on the screen behind them",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-11.webp",
          alt: "Competitors handing printed case sheets along the row at the start of a round",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-12.webp",
          alt: "A wide view of the seminar hall filled with participants under the blue ceiling lights",
          width: 1200,
          height: 901,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-13.webp",
          alt: "Speakers seated at the front desk presenting the Satyam Computer Services case",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-14.webp",
          alt: "A competitor speaking from the lectern with the case slide projected behind",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-15.webp",
          alt: "Participants along the desk listening as the case is introduced",
          width: 900,
          height: 675,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-16.webp",
          alt: "Competitors writing up their arguments at the desks before their round",
          width: 1200,
          height: 900,
        },
        {
          src: "/images/events/market-mayhem/gallery/mm-17.webp",
          alt: "A group of participants turning to the camera from their seats, grinning, at the close of the day",
          width: 720,
          height: 540,
        },
      ],
    },
    {
      slug: "trivial-pursuits",
      title: "Trivial Pursuits",
      eventSlug: "trivial-pursuits",
      date: "2025-09-19T16:30:00+05:30",
      cover: "/images/events/trivial-pursuits/group.webp",
      images: [
        {
          src: "/images/events/trivial-pursuits/group.webp",
          alt: "The full room of Trivial Pursuits participants gathered in front of the projected event title at the end of the quiz",
          width: 795,
          height: 322,
        },
      ],
    },
  ],
  "gallery.ts",
);
