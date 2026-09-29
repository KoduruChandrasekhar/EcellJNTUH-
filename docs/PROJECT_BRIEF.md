# E-Cell JNTU Hyderabad — Official Website (Phase 1: Frontend Only)

## Project Brief for Claude Code

> Read this entire document before writing any code. It is the single source of truth for this project. When something here conflicts with your defaults, follow this document. When something is unclear or missing, ask me instead of guessing.

---

## 0. Who I am and how I want you to work

- I am a student developer applying to be the **tech lead of E-Cell JNTU Hyderabad**. This website is my proof of work for the club's core team, so design quality and polish matter a lot.
- **I know basic React only. I am new to Next.js, TypeScript and Tailwind.** Teach me as you build:
  - When you introduce a new concept (App Router folders, layouts, server vs client components, static generation, metadata, `next/image`, Tailwind theme tokens, TypeScript types, Zod), explain it in 2–4 plain sentences the first time it appears.
  - Add short comments only where the "why" is not obvious. Don't comment every line.
  - After each stage, give me a short summary: what you built, which files matter most, which concepts I should understand, and how to check it myself.
- **Work in stages (Section 12). Stop at the end of every stage** and wait for my go-ahead.
- **Before each stage, show me a short plan** (files to create/change, packages to install) and wait for approval.
- **Never run `git commit`, `git push`, or any command that creates commits, branches, tags or pull requests. I will commit myself.** You may run `git init` once in Stage 0 and read-only commands like `git status` and `git diff`. At the end of each step, suggest a conventional commit message (`feat:`, `fix:`, `chore:`, `docs:`, `style:`, `test:`) and list the files it covers, so I can commit.
- **Check versions and docs.** Framework APIs change often (e.g. Next.js async `params`, Tailwind v4 CSS-first config). Check the versions installed in `package.json` and follow the current docs for those versions, not memory. If you're unsure about an API, say so.
- **Do not add dependencies** beyond the stack below without asking me and explaining why.
- If you hit an error you can't fix after two attempts, stop and explain the problem and the options.

---

## 1. Scope of this phase

### This phase: **frontend only**

Build a complete, polished, fully responsive, production-ready **static website** for **E-Cell JNTUH** (Entrepreneurship Cell, JNTU Hyderabad, Kukatpally, Hyderabad, Telangana).

- **No backend. No database. No authentication. No admin panel. No API routes. No server actions. No environment secrets.**
- All content lives in **typed data files** inside the repo (`src/content/`), validated with Zod at build time.
- Event registrations, "Join us" applications and the contact form use **external links** (Google Forms or similar) configured in the data files, exactly as the club does today.
- Deployed to **Vercel** as a static site.

### Later phase (NOT now): backend

A later phase will add Supabase (database, admin panel, on-site registrations replacing Google Forms). **Do not build any of it now**, but structure the frontend so it can be added without rewriting pages (see Section 9: "Backend-ready architecture").

---

## 1A. Non-negotiable quality goals

Every decision in this project is judged against these six goals. If a choice trades one away, tell me before doing it.

**1. Dynamic (feels alive, content-driven)**

- Nothing is hard-coded in page components. Every list, date, status, stat and link comes from `src/content/` through the data layer, so updating a file updates the whole site.
- Status is computed, not typed: "Upcoming", "Registrations open", "Closing soon" (within 48 hours), "Closed", "Completed", countdowns and the Home page's featured event all derive from dates and are re-checked on the client.
- Interactive where it helps: filterable/searchable events, term switcher on Team, album filter and lightbox in Gallery, live countdowns, share and calendar actions, smooth page transitions.
- Designed so the backend phase can switch data to a database without touching pages (Section 9).

**2. No lag (fast on a budget Android phone on college Wi-Fi)**

- Hard budgets, checked in Stage 4 and enforced in CI with Lighthouse CI (`@lhci/cli`, dev dependency) on Home, Events and one event page:
  - LCP < 2.0 s, INP < 200 ms, CLS < 0.05 on a throttled mobile profile.
  - First-load JavaScript per route ≤ 120 KB gzipped (report it from the build output; explain any route over budget).
  - No image over 200 KB after optimisation; hero/LCP image ≤ 120 KB.
- Server components by default; client components are small leaves. Heavy client pieces (lightbox, marquee, Motion effects) are lazy-loaded with `next/dynamic` and only on the pages that use them.
- Animations only on `transform` and `opacity`, never on layout properties. No scroll listeners without `requestAnimationFrame`/IntersectionObserver. Pause offscreen animations. Nothing blocks the main thread for more than 50 ms.
- Links prefetch (Next.js default); every route has a branded `loading.tsx` skeleton that matches the final layout (no jump when content appears).
- Fonts: at most 4 families, only used weights, `display: swap`, preloaded by `next/font`.

**3. Scalable**

- **Traffic:** fully static pages served from Vercel's global CDN, so hundreds of simultaneous visitors cost nothing and can't slow the site.
- **Content:** the site must stay fast and tidy at 200+ events, 60+ team members across several terms and 1,000+ gallery photos: paginate or "load more" long lists, virtualise nothing unless measured necessary, lazy-load images, keep per-page data small (don't ship all events to every page).
- **Code:** feature-grouped folders, one component per job, no duplicated UI (one `EventCard`, one `Button`, one `Headline`, etc.), strict types end to end. A new page or event type should need content + at most one new component.
- **People:** a new student can take over using the README, `CLAUDE.md` and `CONTENT_GUIDE.md` alone.

**4. Secure**

- Everything in Section 10, plus: no third-party scripts other than the analytics script; no user input anywhere in this phase (all forms are external links); every external URL validated as `https://` by Zod; all dependencies pinned and audited in CI; security headers graded A.

**5. Consistent**

- One source of truth for every visual decision: design tokens (colours, spacing scale, radii, borders, shadows, font sizes, z-index, durations/easings) defined once in the Tailwind theme and used everywhere. **No hard-coded hex values, pixel sizes or one-off font sizes in components.**
- Fixed spacing rhythm (4px base scale), fixed section padding, one container width, one card style, one button system, one heading scale, one icon size set.
- Same interaction patterns everywhere: hover, focus, pressed, disabled and loading states defined once per component.
- Copy style: sentence case for UI text, display headlines in caps, consistent date format ("7 Aug 2026 · 10:30 AM IST"), consistent tone (energetic, clear, no jargon).
- `/styleguide` page is the living reference; any new component appears there.

**6. Great UI/UX**

- Clear hierarchy on every page: what is this, why should I care, what do I do next (one primary action per screen).
- Registration is never more than one tap from the Home page and event cards when registrations are open.
- Designed empty, loading, error and "past/closed" states for every dynamic block — never a blank area or a broken layout.
- Mobile-first with thumb-friendly navigation; sticky "Register" bar on event pages on mobile when registration is open.
- Accessible to WCAG 2.2 AA (keyboard, screen reader, contrast, focus, reduced motion, 200% zoom).
- Micro-interactions that give feedback (button press, copy-link toast, filter change) but never delay the user.
- Before finishing each stage, review the pages at 360px and 1280px yourself (Playwright screenshots) and fix anything that looks unbalanced, cramped or inconsistent.

---

## 2. Organisation facts (use in content)

Sources: the club's Instagram posters and LinkedIn page (as of September 2026). Rewrite everything in fresh website copy; do not paste social-media captions verbatim.

### 2.1 Identity

- **Name:** E-Cell, JNTU Hyderabad (short: E-Cell JNTUH)
- **Tagline / motto:** **Innovate | Connect | Elevate** (also styled **I.C.E**) — official LinkedIn tagline and poster lock-up.
- **Type:** Student-led, non-profit entrepreneurship cell. Roughly 11–50 members.
- **Focus areas seen in their events:** entrepreneurship, sustainability, strategic decision-making, business ethics, AI and emerging technologies, personal branding, financial literacy, pitching and communication, careers.
- **Institution (confirmed):** JNTUH University College of Engineering, Science and Technology Hyderabad — **JNTUH UCESTH**, Kukatpally, Hyderabad, Telangana. Use "JNTUH UCESTH" everywhere (not "CEH").
- **Also known as:** the **I.C.E Club** (Innovate, Connect, Elevate). Older posts (e.g. Eureka! 2025) say "ICE Club of JNTUH" and use an "I.C.E | Innovate Connect Elevate" logo lock-up. Mention this on the About page ("also known as the I.C.E Club") — `TODO: confirm wording with club`.
- **Ecosystem link:** the club hosted the campus round of IIT Bombay E-Cell's **Eureka!** as part of the **National Entrepreneurship Challenge (NEC) 2025**. Can be mentioned on About as a milestone.
- **Common venues:** Golden Jubilee Hall / Golden Jubilee Seminar Hall.
- **Instagram:** https://www.instagram.com/ecell_jntuh/
- **LinkedIn:** https://www.linkedin.com/company/ecell-jntuh/
- **Faculty coordinator (appears on every post as guiding the club):** Dr. Bhramara Panitapu. Team page, category `faculty`, position "Faculty Coordinator" (`TODO: confirm exact title`).
- **Student team (confirmed so far, term 2026-27 — more members will be added later):**

  | Name                    | Position                      | Category | Notes                                             |
  | ----------------------- | ----------------------------- | -------- | ------------------------------------------------- |
  | Rahul Badam             | Head of Finance and Logistics | lead     | LinkedIn: https://www.linkedin.com/in/rahulbadam/ |
  | Shriya Tallapragada     | Head of Design                | lead     | LinkedIn `TODO`                                   |
  | Supraja Tatikonda       | Head of Marketing             | lead     | LinkedIn `TODO`                                   |
  | Sai Naishika Bollikonda | Head of Marketing             | lead     | LinkedIn `TODO`                                   |
  - Use only these names; every other slot stays a clearly marked placeholder. Photos: use the initials avatar component until real photos arrive.
  - The Team page must look good with only 5 people (faculty + 4 heads) and scale to 40+ later. When a category has no members, hide it rather than showing an empty heading.
  - Add a "More team members coming soon" note (removable via content flag `teamComplete: false`).

### 2.2 Flagship event: ETHOS (annual)

**ETHOS 2026 — "The Decision Matrix"** (past event; completed)

- **Theme:** Sustainability — business challenges where profitability, ethics and environmental responsibility intersect.
- **Event tagline (from the club's own poster):** "Earth isn't an inheritance; it's a responsibility."
- **What ETHOS is (their description, rewrite in site voice):** E-Cell JNTUH's flagship event — an immersive full day of workshops, speaker sessions and a boardroom simulation.
- **What to expect:** (01) Speaker sessions and workshops — bold ideas from inspiring speakers, turned into action through workshops. (02) Boardroom challenge — debate people, planet and profit and unravel the problem statement like a real executive.
- **Why participate:** practical experience in strategic decision-making, teamwork and presenting with confidence; a prize pool (amount unknown — `TODO`, do not invent); participation certificates.
- **Date:** 7 August 2026, 10:30 AM – 5:00 PM IST, on campus (venue `TODO: confirm`).
- **Eligibility:** college students from institutions across Telangana; teams of 3–5; cross-college and inter-specialisation teams allowed.
- **Format:**
  - _Round 1 — Online qualifier:_ teams received a problem statement on registration (themes included sustainability and greenwashing ethics) and submitted a 2–4 page strategic draft. Registration and submission deadline: 4 August 2026, 11:59 PM.
  - _Round 2 — On-campus Boardroom Challenge:_ 8 shortlisted teams plus 2 wildcard entries took on organisational roles (CEO, CFO, CMO, COO, CTO), analysed a real-world corporate scenario, then presented and defended their strategy before the jury.
- **Sessions (sub-events, create as child events of ETHOS 2026):**
  - Workshop — _AI & Emerging Technologies, Startups and Personal Branding_ — Mr. Saahil Zameer Shaik, Founder & CEO, Prompt Techies (Trovo Fi Pvt. Ltd.).
  - Speaker session — _Sustainability in Action: Business, Climate and the Road Ahead_ — Mr. Venugopal Rao Vippulancha, corporate leader, social entrepreneur and founder of Mandalaa Pvt. Ltd. (sustainable brand "Vistaraku"); 25+ years at Titan, Siemens, PTC, TCS and SolidWorks.
  - Workshop — _Wealth Creation Blueprint and Proven Financial Strategies_ — Mr. Sundara Ramireddy Mareddy.
  - Competition — _The Decision Matrix_ boardroom challenge (details above).
  - The Instagram poster titled _Beyond the Boardroom_ promoted the workshop and speaker sessions as included for all ETHOS 2026 participants; use it as the umbrella name/poster for the sessions.
- **Jury (show on the Decision Matrix page as "Jury"):**
  - Mr. Ravikumar Nanduri — finance and startup mentor, 35+ years in banking.
  - Mr. Venugopal Rao Vippulancha — see above.
  - Mrs. Shailaja Priyadarshini — industry professional in leadership, innovation and business strategy.
  - Mr. Raghunandan Devarshetty — marketing leader, 15+ years in strategic marketing, go-to-market and B2B growth.
- **Results:** 1st Team Innovista, 2nd Team The Pinnacle, 3rd Team Ankura. Show team names only (no student names) in a "Results" block on the event page.
- **Registration link used:** external Google Form (link expired); set `registration.mode` to `"none"` with note "Event completed".

**ETHOS 2025** (past) — featured _Dilemma Decoded_: teams stepped into the C-suite of fictional startups and faced high-stakes ethical and strategic decisions — AI controversies, branding dilemmas, data analysis, crafting a rebrand, and deciding to pivot, continue or transform. Had a "Meet the Judges" reveal. Exact date `TODO`.

**Next edition:** no ETHOS 2027 details yet. The Home page ETHOS spotlight should show ETHOS 2026 highlights (theme, sessions, winners, gallery link) plus a "Next edition coming soon — follow us" note, and switch to a countdown automatically when a future ETHOS event is added to the content files.

### 2.3 Other past events (seed as past events)

Chronological timeline of known events (use for the About page milestones and the Events "Past" tab):

| Date        | Event                                                           |
| ----------- | --------------------------------------------------------------- |
| 23 Aug 2025 | Eureka! 2025 campus round (IIT Bombay E-Cell, NEC 2025)         |
| 19 Sep 2025 | Trivial Pursuits                                                |
| 16 Oct 2025 | 1,00,000 Hours                                                  |
| 26 Oct 2025 | Career Craft (with AIESEC in Hyderabad)                         |
| 28 Jan 2026 | Pitch Perfect 2.0                                               |
| 7 Aug 2026  | ETHOS 2026 — The Decision Matrix                                |
| `TODO`      | ETHOS 2025 (Dilemma Decoded), Canva Workshop for Brand Identity |

- _Eureka! 2025 — Campus Round_ — 23 August 2025, Golden Jubilee Seminar Hall, JNTUH Kukatpally. The club (as the I.C.E Club) hosted the first stage of **Eureka!**, the business model competition run by E-Cell IIT Bombay, under IIT Bombay's National Entrepreneurship Challenge 2025. Teams of 1–7 took a startup idea through pitching and mentorship; the campus winner qualified for the zonal rounds (Delhi, Bangalore or Mumbai) with a chance at prizes, expert mentorship and pitching to investors. Registration deadline was 17 August 2025. Category: `competition`. Partner: E-Cell IIT Bombay / NEC 2025 (logo placeholder). Do **not** include the NEC/CA referral IDs from the poster.
- _Trivial Pursuits_ — 19 September 2025, 4:30 PM (venue `TODO`). A fast-paced, fun team trivia evening: think fast, laugh loud, compete with your squad through brain-twisting rounds. Category: `other` (add a `quiz` category). Tone: playful.
- _Pitch Perfect 2.0_ — 28 January 2026. Pitch competition: teams were assigned unconventional, imaginative products and built a sales pitch for a panel of judges, with no AI allowed during brainstorming. 16 teams participated, with strong first-year participation. Winners: 1st Team PlayMaker, 2nd Team Infinity, 3rd Team Goose (team names only). Implies an earlier _Pitch Perfect_ edition existed (`TODO: confirm`).
- _Career Craft_ — AIESEC in Hyderabad × E-Cell JNTUH. CV screening, mock interviews and expert career guidance. 26 October 2025, 10 AM–1 PM, Golden Jubilee Hall, JNTUH Kukatpally.
- _1,00,000 Hours_ — interactive alumni session on making an impact, with the Directorate of Alumni Affairs. 16 October 2025, 4 PM, Golden Jubilee Seminar Hall.
- _Canva Workshop for Brand Identity_ — design workshop under the I.C.E banner. Date `TODO`.
- _E-Cell is Hiring_ — organising committee recruitment drive (use for the Join page, not as an event).

### 2.4 Stats (for the Home page counters — all `TODO: confirm with club`)

Known figures to use as placeholders until the club confirms: 16 teams at Pitch Perfect 2.0; 10 finalist teams at the Decision Matrix; 3 speakers/workshop leads and 4 jury members at ETHOS 2026. Totals such as "events conducted" and "students reached" are unknown — use obvious placeholder numbers and flag them.

### 2.5 Content rules

- Everything else (vision, mission, objectives, official email, exact ETHOS 2025 date, team list, photos) is **unknown**. Use clearly marked placeholders (`// TODO: replace`).
- Never invent people, quotes or numbers. Never include phone numbers or personal emails from posters.
- Speaker and jury names are public professional information announced by the club and may be shown with their roles.
- Student names: only the confirmed team members in 2.1 appear on the site. Competition winners are shown by **team name only**.

---

## 3. Tech stack (use exactly this)

| Layer                        | Choice                                                                                   | Notes                                                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Framework                    | **Next.js (latest stable), App Router**                                                  | All public pages statically generated. Server components by default; `"use client"` only for interactive pieces |
| Language                     | **TypeScript, `strict: true`**                                                           | No `any` unless justified in a comment                                                                          |
| Package manager              | **pnpm** (npm acceptable if pnpm unavailable)                                            |                                                                                                                 |
| Styling                      | **Tailwind CSS (latest, v4 CSS-first `@theme` config)**                                  | All design tokens defined once                                                                                  |
| UI primitives                | **shadcn/ui** (Radix-based)                                                              | Only what's needed (sheet for mobile menu, tabs, dialog, tooltip). Restyle fully to the brand                   |
| Icons                        | **lucide-react**                                                                         | Brand icons (Instagram, LinkedIn, X, YouTube) as small inline SVG components                                    |
| Animation                    | **Motion** (`motion/react`)                                                              | Subtle; respect `prefers-reduced-motion`                                                                        |
| Content validation           | **Zod**                                                                                  | Validate every content file at build time                                                                       |
| Markdown (long descriptions) | **react-markdown** (no raw HTML)                                                         | For event/initiative descriptions                                                                               |
| Gallery lightbox             | **yet-another-react-lightbox**                                                           |                                                                                                                 |
| Dates                        | Native `Intl.DateTimeFormat` with `Asia/Kolkata` timezone                                | No moment/dayjs needed                                                                                          |
| Analytics                    | **Vercel Web Analytics** or Cloudflare Web Analytics (cookieless)                        | Production only                                                                                                 |
| Testing                      | **Vitest** (content validation, utils) + **Playwright** (smoke tests, responsive checks) |                                                                                                                 |
| Lint/format                  | ESLint (Next config) + Prettier + prettier-plugin-tailwindcss                            |                                                                                                                 |
| CI                           | **GitHub Actions** + **Lighthouse CI**                                                   | lint, typecheck, tests, build and performance budgets on every PR                                               |
| Dependencies                 | **Dependabot**                                                                           | weekly                                                                                                          |
| Hosting                      | **Vercel**                                                                               | Domain later via Cloudflare DNS                                                                                 |

Do **not** use: any database or BaaS (Supabase/Firebase/etc.) in this phase, API routes, server actions, auth libraries, Redux, styled-components, CSS-in-JS, Pages Router, a CMS, or jQuery-era libraries.

---

## 4. Design system

### 4.1 Direction

The club's recent Instagram posts (reference images in `docs/reference/`) share an **editorial "paper and ink" look**:
warm off-white paper background with subtle grain, charcoal text, heavy condensed display headlines, a second headline line in **outlined (stroke-only) letters**, small navy labels, and decorative motifs: rows of slanted parallelogram outlines, diagonal hazard stripes, wireframe globes/meshes, pixel/checker blocks, "×" marks, greyscale halftone illustrations.

The logo (`docs/reference/logo.png`) is two chevrons, **yellow (left) and blue (right)**, pointing at each other with a small green overlap, with "E-CELL / JNTU Hyderabad" in a bold geometric sans.

**The website should feel like the Instagram posts came alive**: paper-and-ink as the base, logo yellow and blue as the only vivid accents. It must look clearly different from the generic dark-gradient E-Cell template sites. **Look at every image in `docs/reference/` before designing.**

### 4.2 Colour tokens (CSS variables + Tailwind theme)

| Token            | Hex                   | Use                                                                                              |
| ---------------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `paper`          | `#ECE9E2`             | Page background                                                                                  |
| `paper-2`        | `#E2DED6`             | Cards, alternating sections                                                                      |
| `paper-3`        | `#F5F3EE`             | Raised surfaces                                                                                  |
| `ink`            | `#1F1F1F`             | Primary text, borders, dark buttons                                                              |
| `ink-2`          | `#3A3A3A`             | Secondary text                                                                                   |
| `ink-3`          | `#6B6760`             | Muted text, captions (ensure ≥ 4.5:1 contrast on paper)                                          |
| `brand-yellow`   | `#FFC83D`             | Primary CTA accents, highlights                                                                  |
| `brand-blue`     | `#2F7BEA`             | Links, focus rings, secondary accents                                                            |
| `brand-green`    | `#3FB27F`             | Tiny accents only (logo overlap colour)                                                          |
| `navy`           | `#13297A`             | Small labels/eyebrows ("Presents", "For", "Introducing")                                         |
| `sky`            | `#3DA9F2`             | Recruitment / "Join us" section accent only                                                      |
| `signal-red`     | `#C8202C`             | Dates, deadlines, key emphasis, dotted "circled" frames (from ETHOS 2026 posters). Use sparingly |
| `eco`            | `#5B9A68`             | ETHOS 2026 / sustainability green: pill cards, "Decision" wordmark, wireframe lines              |
| `charcoal-panel` | `#2A2A2A`             | Dark textured panels/cards on paper (ETHOS "What is ETHOS?" boxes)                               |
| `mint`           | `#CFE6D3`             | Pitch Perfect accent (event-level only)                                                          |
| `purple`         | `#8E2DE2` → `#FFC83D` | Trivial Pursuits gradient (event-level only; never used site-wide)                               |

These hex values are estimated from images — keep them in one file so they're easy to correct.

**Dark mode:** toggle (default follows system). Dark theme = logo black `#0B0B0B` background, `#F2EFE8` text, same yellow/blue accents. Every component must work in both. No flash of wrong theme on load.

### 4.3 Typography (`next/font/google`, self-hosted, `display: swap`)

- **Display / headlines:** `Anton` (fallback `Bebas Neue`). Uppercase, tight leading (~0.95–1.05).
- **Outlined headline line:** same display font with `color: transparent; -webkit-text-stroke: 1.5px currentColor` (thicker at large sizes). Build a `<Headline solid="…" outline="…" />` component.
- **Wide labels:** `Unbounded` (e.g. "ETHOS", section eyebrows, stat numbers).
- **Body / UI:** `Poppins` (400, 500, 600) — matches the logo lettering.
- Fluid type scale with `clamp()`; hero headline ~48px mobile → ~120px desktop.
- These are the closest free matches; the club's real Canva fonts may differ. Keep font setup in one file so fonts are swappable.

### 4.4 Visual motifs (reusable components in `src/components/brand/`)

- `ParallelogramRow` — row of 3–5 skewed outline rectangles (from the ETHOS posts), used as section dividers.
- `HazardStripe` — diagonal black stripe band.
- `CrossMark` — "×" decorative mark.
- `WireGlobe` — faint wireframe globe SVG (hand-built, low opacity) behind the hero; optional slow rotation.
- `PixelBlocks` — checker/pixel block cluster (from the "Dilemma Decoded" D).
- `Grain` — subtle noise overlay on the paper background (inline SVG `feTurbulence` or tiny tiled image, ≤ 3% opacity, `pointer-events: none`). Must not hurt performance or contrast.
- `ChevronMotif` — the logo's two chevrons (yellow left, blue right) as SVG, used in the loader, bullets, hover states, favicon.
- `SectionEyebrow` — small navy wide-font label above section headings.
- **Buttons:** pill-shaped. Primary = ink background with yellow text; secondary = ink outline; hover = slight lift and chevron nudge. External links show an external-link icon.
- **Cards:** paper-2/paper-3 surface, 1.5px ink border, 8–12px radius, **hard offset shadow on hover** (e.g. `4px 4px 0 ink`) — a "poster/sticker" feel, not soft blurry shadows.
- **Photos:** team photos greyscale by default, colour on hover (mirrors the halftone poster style).

### 4.5 Motion

- Subtle and purposeful: fade/slide-up on scroll (once), count-up stats, infinite marquee for partner logos (pauses on hover), chevrons sliding together in the page loader/intro (short, skippable), smooth tab transitions.
- Everything respects `prefers-reduced-motion` (content shown immediately, no movement).
- No scroll-jacking, no heavy parallax, no autoplay video, no custom cursor.

### 4.6 Poster design language — detailed catalogue

Study every image in `docs/reference/`. These are the specific devices the club's designers use. Recreate them in CSS/SVG (never by embedding poster screenshots as decoration).

**A. Core "paper and ink" system (ETHOS 2025, ETHOS 2026, Canva Workshop, Dilemma Decoded, Meet the Judges)**

- Warm grey-beige paper with visible grain/speckle texture; occasionally a darker charcoal page with the same grain.
- **Mixed-weight headline pairs:** one line solid heavy condensed, the next line outlined (stroke-only), e.g. "BEYOND THE BOARDROOM" solid + "WORKSHOP AND SPEAKER SESSION" outlined; "MEET THE" solid + "JUDGES" outlined; "ROUND-1" solid red + "ROUND-2" outlined.
- **Oversized initial letters:** "Dilemma Decoded" uses a giant pixelated "D" shared by two words ("D-ILEMMA / D-ECODED"); "Decision Matrix" uses a large green "D" with a leaf. Build a reusable `DropCapWordmark` pattern (big initial + stacked words).
- **ETHOS wordmark:** "ETHOS" in an extra-bold wide geometric sans with the "O" replaced by a small Earth globe; "2026" underneath in the same face, outlined. Recreate as an SVG/typographic component `EthosWordmark` (globe drawn as a simple SVG, not an emoji or photo).
- **Section headings in condensed caps** with small-caps style ("WHAT IS ETHOS?", "WHAT TO EXPECT?", "WHY PARTICIPATE?", "SAVE THE DATE!").
- **Dotted/dashed frames:** rounded rectangles with red dotted borders framing the key block; red dotted connector lines that route around elements (the "THEME" slide); a red dotted ring **circling a date**.
- **Dark rounded text panels** (charcoal with grain, thin dotted red inner border) holding white body text on the paper background.
- **Numbered pill cards:** long rounded pills in eco green, big condensed numbers "01", "02" on one end, title in caps + short description; alternating left/right alignment.
- **Icons in red line-art** (trophy, certificate, brain-bulb) next to benefit pills.
- **Wireframe 3D forms:** globe (latitude/longitude lines), torus, twisted mesh — thin 1px lines in ink or eco green, placed at page corners, partially cropped.
- **Decorative marks:** grids of "×" marks; rows of slanted parallelogram outlines (some filled, some outline — used like a progress bar); diagonal hazard stripes; "↙ / ↗" arrow glyphs in corners; triple chevrons "›››" in muted green as "next" cues.
- **Barcode strip** at the bottom edge of a page (ticket/boarding-pass feel) — use as a footer or event-ticket motif.
- **Halftone greyscale imagery:** hands (one holding trees, one holding a coin), a lightbulb containing an Earth, silhouettes of a boardroom meeting, people illustrations. On the site, apply a halftone/greyscale treatment to photos in hero and gallery accents (CSS filter + dot overlay).
- **Calendar-strip "Save the date":** a row of big date cells ("6TH / 7TH / 8TH AUG") with the chosen date circled in red dots — build `DateStrip` for event heroes.
- **Round cards:** two side-by-side rounded outline cards ("ROUND-1 Online Qualifier", "ROUND-2 On-campus Boardroom Challenge") each with a heading and bullet list, deadline highlighted in red.
- **Co-branding header:** JNTUH university seal top-left, E-Cell logo lock-up top-right with a thin vertical divider ("E-CELL | JNTU Hyderabad"). Use the lock-up style (logo | text) in the navbar and footer. The JNTUH seal may be used in the footer only if the club approves (`TODO`).

**B. Event-specific styles (use only inside that event's page accent, never site-wide)**

- _ETHOS 2026:_ paper + ink + eco green + signal red, halftone nature imagery.
- _Pitch Perfect 2.0:_ mint-green organic blobs, navy, mustard-yellow circles, 3D robot mascot, rounded heavy display type, dotted grids.
- _Trivial Pursuits:_ black background, neon purple→magenta→yellow gradient text, yellow spotlight beam, glowing perspective grid floor, podium with buzzer, diagonal black/yellow split.
- _Eureka! 2025:_ deep navy with bright-blue ink-splash, big light-blue circles, white outlined + solid headline mix ("ARE YOU READY" / "REGISTER NOW!"), thin white frame.
- _Career Craft:_ grid-paper background, heavy italic condensed black headline with yellow shadow, royal-blue speech-bubble date bar, yellow pill labels.
- _E-Cell is Hiring:_ sky blue, white rounded speech-bubble card, 3D megaphones, lightning bolts.

### 4.7 Typography details (from posters)

- Solid headlines: heavy condensed sans (Anton / Bebas Neue class).
- Section headings: condensed caps with small-caps feel — use `Big Shoulders Display` or `Oswald` (choose one, keep consistent).
- ETHOS/"MATRIX" style: extra-bold wide geometric with outline variant — `Unbounded` or `Archivo Black` + stroke.
- Body: clean geometric/grotesque sans — `Poppins` for UI, optionally `Manrope` for long paragraphs.
- Keep the total to **at most 4 font families**, subset to Latin, and load display fonts only in the weights used.

### 4.8 Event-level theming

Each event can set an `accent` in its content (see 6.2). The event detail page uses it for the hero wash, badges, pill cards, dotted frames and wireframe colour, so every event page echoes its poster while navbar, footer, spacing and typography stay the same site-wide. Accent presets: `ink` (default), `yellow`, `blue`, `eco` (ETHOS 2026), `red`, `navy` (Eureka!), `sky` (hiring), `mint` (Pitch Perfect), `purple` (Trivial Pursuits — gradient text allowed only here). Every preset must pass AA contrast in light and dark mode.

### 4.10 Reference image index (`docs/reference/`)

I will place these files in `docs/reference/`. View all of them before Stage 1. File names may differ slightly; match by content.

| File                                                               | What it shows                                                                                                               | Use for                                     |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `logo.png`                                                         | Official logo: yellow + blue chevrons on black, "E-CELL / JNTU Hyderabad"                                                   | Logo, favicon, ChevronMotif, dark-mode base |
| `ethos-2026-cover.png`                                             | ETHOS 2026 wordmark (globe O), "Decision Matrix" with leaf D, halftone hands, red dotted frame, JNTUH seal + E-Cell lock-up | EthosWordmark, DropCapWordmark, event hero  |
| `ethos-2026-theme.png`                                             | "THEME" outlined, lightbulb-Earth, red dotted connector, dark grain panel "Why Sustainability"                              | Dotted connectors, dark panels              |
| `ethos-2026-what-is.png`                                           | "What is ETHOS? / What to expect?", green numbered pill cards 01/02, × grids, wireframe globe                               | Numbered pill cards, section headings       |
| `ethos-2026-why-participate.png`                                   | Charcoal grain page, parallelogram progress row, benefit pills with red line icons                                          | Dark section variant, benefit list          |
| `ethos-2026-decision-matrix.png`                                   | Round-1 / Round-2 cards, wireframe torus, barcode strip                                                                     | Round cards, barcode motif                  |
| `ethos-2026-save-the-date.png`                                     | Calendar strip with 7th Aug circled in red dots                                                                             | DateStrip                                   |
| `ethos-2026-beyond-the-boardroom.png`                              | Solid + outlined headline pair                                                                                              | Headline component                          |
| `ethos-2025-dilemma-decoded.png`, `ethos-2025-meet-the-judges.png` | Pixel D wordmark, boardroom silhouettes, mesh                                                                               | PixelBlocks, halftone silhouettes           |
| `canva-workshop.png`                                               | Outlined/solid mix, greyscale illustration, globe, × marks                                                                  | Illustration treatment                      |
| `pitch-perfect-2.png`                                              | Mint blobs, navy, mustard circles, robot                                                                                    | `mint` accent                               |
| `career-craft.png`                                                 | Grid paper, italic black headline with yellow shadow, blue date bar                                                         | `blue`/`yellow` accent                      |
| `trivial-pursuits-*.png` (3)                                       | Neon purple→yellow gradient, spotlight, podium, "Save the date 19-09-2025"                                                  | `purple` accent                             |
| `eureka-2025-*.png` (4)                                            | Navy + blue ink splash, outlined/solid headlines, calendar                                                                  | `navy` accent                               |
| `100000-hours.png`                                                 | Alumni session poster                                                                                                       | Event poster only                           |
| `hiring.png`                                                       | Sky blue recruitment poster                                                                                                 | `/join` page, `sky` accent                  |

Crop out phone numbers, QR codes and referral IDs before using any poster on the site.

### 4.9 Layout and quality bar

- Mobile-first. Test widths: 360, 390, 768, 1024, 1280, 1536.
- No horizontal scroll at any width. Tap targets ≥ 44px.
- Accessibility: semantic HTML, one `h1` per page, visible focus rings (brand-blue), alt text on every image, skip-to-content link, AA contrast, keyboard-navigable menus/tabs/lightbox, `aria-current` on active nav link.
- Lighthouse targets (mobile, production build): Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100. Plus the performance budgets in Section 1A.

---

## 5. Site map (public pages only)

| Route                 | Content                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                   | **Hero**: chevron motif + wireframe globe, "E-CELL JNTUH" solid line + outlined line (e.g. "BUILD WHAT'S NEXT"), I.C.E motto eyebrow, one-line intro, primary CTA (the featured/next event, from config) and secondary CTA "Join the team". **ETHOS spotlight** with live countdown if an ETHOS event is upcoming (otherwise ETHOS 2026 highlights + "Next edition coming soon", see 2.2). **Upcoming events** (up to 3 cards, or the designed empty state). **Past events highlight strip** (latest 4–6 events with posters). **Animated stats** (events conducted, students reached, speakers hosted, partners). **Initiatives preview**. **Partners/collaborators marquee** (AIESEC in Hyderabad, JNTUH Directorate of Alumni Affairs, E-Cell IIT Bombay / NEC 2025 — text-logo placeholders until real logos are approved). **Gallery strip**. **Join-us banner** (sky accent). Footer |
| `/about`              | Who we are, vision, mission, objectives, what we do, milestones timeline                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `/team`               | Grouped by category (Faculty Advisors, Core Team, Heads/Leads, Members); cards with photo, name, position, LinkedIn icon; **term switcher** (e.g. 2025–26, 2026–27) so past teams stay visible                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `/events`             | Tabs: Upcoming / Past (computed from dates at build time, see 7.3); filter chips by category (Summit, Workshop, Speaker Session, Competition, Recruitment); cards with poster, title, date, venue, short description, status badge                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `/events/[slug]`      | Poster, title, date/time, venue with Google Maps link, description (markdown), optional agenda, optional speakers/judges, **sub-events** for ETHOS (parent/child), optional FAQ (accordion), **Register button** (external link) or status message, share buttons (WhatsApp, LinkedIn, X, copy link), "Add to calendar" (.ics generated at build time as a static file, plus Google Calendar link)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `/initiatives`        | Cards: image, name, description, purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `/initiatives/[slug]` | Optional detail page if the initiative has a long description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `/gallery`            | Responsive masonry grid, filter by album/event, lightbox with keyboard + swipe, lazy-loaded                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `/join`               | Why join E-Cell, open roles/opportunities, requirements, what members get, **Apply button** (external link from config; hidden and replaced by "Applications are closed — follow us on Instagram" when `recruitmentOpen` is false)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `/contact`            | Official email (mailto), social links, address, lazy-loaded map embed (click-to-load placeholder for performance), optional external contact form link                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `/privacy`            | Short privacy note: this site has no accounts or cookies, analytics is cookieless, registrations happen on external forms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `not-found`, `error`  | Branded 404 and error pages (e.g. big outlined "404", chevrons pointing apart)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

**Global:** sticky navbar (logo, links, "Register" CTA → featured event), accessible mobile menu (sheet), theme toggle, footer (logo, I.C.E motto, quick links, socials, email, address, © year), back-to-top button.

---

## 6. Content model (`src/content/`)

All content is plain TypeScript data, validated by Zod schemas in `src/content/schema.ts`. **The build must fail with a clear message if any content file is invalid** (missing field, bad date, image file not found, duplicate slug, broken parent reference).

### 6.1 Files

```
src/content/
├── schema.ts          # Zod schemas + inferred types
├── site.ts            # site-wide config
├── events.ts
├── team.ts
├── initiatives.ts
├── gallery.ts
├── partners.ts
├── about.ts           # vision, mission, objectives, milestones
└── join.ts            # why join, roles, requirements
```

### 6.2 Schemas (implement with Zod; types inferred with `z.infer`)

**`site.ts`** — `name`, `shortName`, `tagline`, `motto` ("Innovate. Connect. Elevate."), `description` (SEO), `url`, `email`, `address`, `mapUrl`, `mapEmbedUrl`, `socials` (`instagram`, `linkedin`, `x`, `youtube` — optional), `stats` (array of `{ label, value, suffix? }`), `featuredEventSlug` (optional), `recruitmentOpen` (boolean), `joinFormUrl` (optional URL), `contactFormUrl` (optional URL).

**`events.ts`** — array of:

```ts
{
  slug: string;                 // unique, kebab-case
  title: string;
  shortDescription: string;     // ≤ 160 chars (also used for SEO)
  description: string;          // markdown
  category: "summit" | "workshop" | "speaker-session" | "competition" | "quiz" | "recruitment" | "other";
  tagline?: string;             // e.g. "Earth isn't an inheritance; it's a responsibility."
  theme?: string;               // e.g. "Sustainability" (badge)
  accent?: "ink" | "yellow" | "blue" | "eco" | "red" | "navy" | "sky" | "mint" | "purple"; // per-event accent (see 4.8)
  eligibility?: string;         // e.g. "Students from any college in Telangana"
  teamSize?: { min: number; max: number };
  rounds?: { name: string; mode: "online" | "on-campus"; description: string; deadline?: string }[];
  highlights?: { title: string; description: string }[];   // "What to expect" / "Why participate" cards
  results?: { position: number; teamName: string }[];
  jury?: { name: string; role: string; photo?: string; linkedin?: string }[];
  parentSlug?: string;          // e.g. ETHOS sub-events point to "ethos-2026"
  poster: string;               // path under /public/images/events/
  posterAlt: string;
  startsAt: string;             // ISO datetime with +05:30 offset
  endsAt?: string;
  venue: string;
  mapUrl?: string;
  partners?: string[];          // partner ids
  registration:
    | { mode: "external"; url: string; closesAt?: string; label?: string }
    | { mode: "none"; note?: string };   // "internal" will be added in the backend phase
  agenda?: { time: string; title: string; description?: string }[];
  speakers?: { name: string; role: string; photo?: string; linkedin?: string }[];
  faq?: { q: string; a: string }[];
  featured?: boolean;
  gallerySlug?: string;         // link to a gallery album
}
```

**`team.ts`** — array of `{ id, name, position, category: "faculty" | "core" | "lead" | "member", term: "2025-26" | …, photo, linkedin?, order }`, plus `currentTerm`.

**`initiatives.ts`** — `{ slug, title, summary, description (markdown), purpose, image, imageAlt, order }`.

**`gallery.ts`** — albums: `{ slug, title, eventSlug?, date, cover, images: { src, alt, width, height }[] }`. Every image **must** have alt text and dimensions (dimensions can be read by a small build script — see 8.2).

**`partners.ts`** — `{ id, name, logo, url?, order }`.

**`about.ts`** and **`join.ts`** — structured text blocks (intro, vision, mission, objectives list, milestones `{ year, title, description }`, why-join points, roles `{ title, description, requirements[] }`).

### 6.3 Seed content

- Fill events from Section 2: ETHOS 2026 as a completed parent event (7 Aug 2026) with its four child sessions, speakers, jury and results; ETHOS 2025 as a parent with Dilemma Decoded as a child; Pitch Perfect 2.0; Career Craft; 1,00,000 Hours; Canva Workshop. Use the posters in `docs/reference/` as event posters where they match (copy into `public/images/events/`, converted to WebP); otherwise generate a brand-styled placeholder poster.
- Render `results` as a podium block on past competition pages, `jury` separately from `speakers`, `rounds` as a round-by-round timeline (Round 1 online / Round 2 on-campus cards like the Decision Matrix poster), `highlights` as numbered pill cards ("01", "02"), and `theme`/`tagline` in the event hero.
- Also seed Eureka! 2025 and Trivial Pursuits from Section 2.3, with posters from `docs/reference/`.
- Team: seed exactly the confirmed people from Section 2.1 (faculty coordinator + four heads) plus the `teamComplete: false` note — no fake placeholder people.
- Unknown dates/links: use obvious placeholders and `// TODO` comments. Since there are currently **no upcoming events**, make sure every "upcoming" section has a well-designed empty state (e.g. "Next event dropping soon — follow us on Instagram") and include one clearly marked placeholder upcoming event (`// TODO: remove`) only on the `/styleguide` page to demonstrate upcoming-state designs.
- Team avatars: generated SVG with initials in brand style until real photos arrive (no stock photos of real people).
- Initiatives: derive 3 from what the club actually runs, clearly marked `TODO: confirm` — _ETHOS_ (flagship summit), _Competitions_ (Pitch Perfect, Decision Matrix, Eureka! campus round), _Workshops and Speaker Sessions_ (Career Craft, Canva Workshop, 1,00,000 Hours, ETHOS sessions).
- Partners: the three above. Gallery: one album per past event, using its poster(s) as placeholders until real photos arrive.

---

## 7. Behaviour details

### 7.1 Registration buttons

- `mode: "external"` → "Register now" button opening the URL in a new tab (`target="_blank" rel="noopener noreferrer"`), with a small note "Opens Google Form" (or the host domain, derived from the URL).
- If `closesAt` has passed → show "Registrations closed" (disabled look, not a link).
- Past events → "Event completed" + link to the gallery album if one exists.
- `mode: "none"` → show the note or nothing.

### 7.2 Countdown

Client component; renders a static date server-side and hydrates into a live countdown (no layout shift, no hydration mismatch). Hides itself once the event starts.

### 7.3 Upcoming vs past

Pages are statically generated, so "upcoming vs past" is computed at build time and **also re-checked on the client** for event cards/badges (so a card doesn't still say "Upcoming" days after the event if no rebuild happened). Also set up a Vercel **daily scheduled redeploy** (document how: Vercel Deploy Hook + GitHub Actions cron) so static pages refresh daily.

### 7.4 Calendar

For every event with a date, generate a static `.ics` file at build time (route handler with `dynamic = "force-static"` or a build script) and a Google Calendar URL.

### 7.5 Share

Web Share API on mobile when available; fallback buttons for WhatsApp, LinkedIn, X, and copy-link (with toast confirmation).

---

## 8. SEO, link previews and performance

### 8.1 SEO and previews

- `generateStaticParams` for all dynamic routes; the whole site is static.
- `generateMetadata` on every page; event pages use event title, short description and poster.
- **Dynamic Open Graph images** (`opengraph-image.tsx`, statically generated) for the home page and each event, in the paper-and-ink style: event title in the display font, date, venue, logo chevrons. Event links shared on WhatsApp/LinkedIn/Instagram must look great.
- `sitemap.ts`, `robots.ts`, canonical URLs, web app `manifest`, favicon/app icons from the logo chevrons (`icon.svg`, `apple-icon.png`).
- JSON-LD: `Organization` on home; `Event` schema on event pages (with `eventStatus`, `location`, `organizer`, `offers` URL = registration link).

### 8.2 Performance and images

- `next/image` everywhere with correct `sizes`; hero/LCP image `priority`; everything else lazy.
- Provide a script `scripts/optimize-images.ts` (using `sharp`, dev dependency) that converts images in `assets-source/` to WebP at sensible max widths (posters 1200px, team 600px, gallery 1600px) into `public/images/`, and prints width/height for content files. Document it in the content guide.
- Fonts via `next/font` (no layout shift). Keep client JS small: only interactive bits are client components (menu, theme toggle, tabs/filters, countdown, lightbox, marquee, animations).
- Map embed is click-to-load. Analytics script only in production.

---

## 9. Backend-ready architecture (important)

The backend phase will add Supabase, on-site registrations and an admin panel. Prepare for it **without building any of it**:

1. **Data access layer:** pages never import content files directly. They call async functions in `src/lib/data/` — `getEvents()`, `getEventBySlug()`, `getUpcomingEvents()`, `getTeam(term)`, `getInitiatives()`, `getGallery()`, `getPartners()`, `getSiteConfig()` — which currently read from `src/content/`. Later, only these functions change to query the database.
2. **Types come from Zod schemas** in one place; the database types will later be mapped to the same shapes.
3. The `registration` field is a discriminated union so an `"internal"` mode can be added later, and the event page renders registration through a single `<RegistrationSection event={event} />` component that will later host the on-site form.
4. Do not use `output: "export"` (static export) — keep the default Next.js build on Vercel so server features can be added later. All pages are still statically generated.
5. Keep a `docs/BACKEND_PLAN.md` with a short note of what the next phase will add (Supabase, RLS, admin panel with MFA, on-site registrations with Turnstile and rate limiting, confirmation emails, CSV export) so the next step is clear.

---

## 10. Security (frontend-appropriate)

Even without a backend:

- **Security headers** in `next.config`: Content-Security-Policy (allow self, analytics domain, Google Maps embed domain, Google Forms only as link targets), `Strict-Transport-Security` (2 years, includeSubDomains), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (disable camera, microphone, geolocation, etc.), `frame-ancestors 'none'` / `X-Frame-Options: DENY`. Remove `X-Powered-By`.
- All external links: `rel="noopener noreferrer"`; validate external URLs in the Zod schema (must be `https://`).
- Markdown rendered without raw HTML (no `dangerouslySetInnerHTML`).
- No secrets anywhere (none are needed in this phase). `.env*` gitignored anyway.
- No personal phone numbers or personal emails in the repo; only official club contacts.
- Dependabot + `pnpm audit` in CI (fail on high/critical).
- Target grade A on securityheaders.com and Mozilla Observatory.

---

## 11. Project structure (target)

```
.
├── assets-source/            # original, uncompressed images (gitignored or LFS — ask me)
├── docs/
│   ├── reference/            # logo + Instagram poster screenshots (given by me)
│   ├── PROJECT_BRIEF.md      # this file
│   ├── CONTENT_GUIDE.md      # how to update content (for non-developers)
│   ├── DEPLOYMENT.md
│   └── BACKEND_PLAN.md
├── public/
│   └── images/{events,team,initiatives,gallery,partners,brand}/
├── scripts/optimize-images.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx, page.tsx, not-found.tsx, error.tsx
│   │   ├── about/ team/ events/ events/[slug]/ initiatives/ gallery/ join/ contact/ privacy/
│   │   ├── sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, icon.svg
│   ├── components/
│   │   ├── ui/               # shadcn primitives
│   │   ├── brand/            # Headline, ParallelogramRow, WireGlobe, ChevronMotif, Grain…
│   │   ├── site/             # Navbar, Footer, ThemeToggle, MobileMenu
│   │   └── sections/         # Hero, EthosSpotlight, StatsBand, EventCard, TeamCard, Marquee…
│   ├── content/              # typed data files + schema.ts
│   ├── lib/
│   │   ├── data/             # data access functions (backend-ready)
│   │   ├── dates.ts, ics.ts, seo.ts, utils.ts
│   └── styles/globals.css    # Tailwind + tokens
├── tests/
│   ├── unit/                 # content validation, date/status logic, ics generation
│   └── e2e/                  # smoke: every page loads, nav works, no horizontal scroll at 360px
├── .github/workflows/ci.yml, dependabot.yml
├── CLAUDE.md                 # concise conventions for future sessions (you create this)
└── README.md
```

---

## 12. Build stages (stop after each and wait for me)

**Stage 0 — Setup**
Next.js + TypeScript + Tailwind + ESLint/Prettier, shadcn/ui init, folder structure, `git init` (no commits), `CLAUDE.md` (concise conventions from this brief), README skeleton, GitHub Actions CI, Dependabot. Explain the App Router folder structure to me.

**Stage 1 — Design system and shell**
Fonts, colour tokens, dark mode (no flash), all brand motif components, buttons, cards, badges, Navbar (desktop + mobile sheet), Footer, 404/error pages, and a `/styleguide` page (excluded from production/sitemap) showing every token and component. Tell me how to deploy to Vercel so I can share a live link early.

**Stage 2 — Content layer and Home page**
Zod schemas, all content files with seed data, data access layer, image optimisation script, content-validation unit tests. Build the complete Home page with all sections and animations.

**Stage 3 — Remaining pages**
About, Team (term switcher, grouping), Events (tabs, filters, status logic), Event detail (sub-events, agenda, speakers, FAQ, registration section, share, calendar), Initiatives, Gallery (masonry + lightbox + album filter), Join, Contact, Privacy.

**Stage 4 — SEO, performance and accessibility**
Metadata everywhere, dynamic OG images, sitemap, robots, manifest, icons, JSON-LD, image pass, Lighthouse audit and fixes to hit targets, keyboard and screen-reader pass, reduced-motion pass.

**Stage 5 — Hardening, tests, docs and deploy**
Security headers + CSP, Playwright smoke and responsive tests, daily redeploy workflow, `CONTENT_GUIDE.md` (step-by-step: add an event, change registration link, add team members for a new term, add gallery photos, update stats/socials, open/close recruitment — written for non-developers), `DEPLOYMENT.md` (Vercel setup, custom domain via Cloudflare DNS, deploy hook), `BACKEND_PLAN.md`, final README.

---

## 13. Out of scope for this phase

Database, backend, API routes, server actions, authentication, admin panel, on-site registration forms, file uploads, emails, payments, blog, newsletter, chatbot, certificates, QR attendance, multi-language.

---

## 14. Definition of done

- All pages work and look polished on mobile and desktop, in light and dark mode, and match the paper-and-ink brand from the reference posters.
- Every piece of content (events, team, initiatives, gallery, partners, stats, links) is edited in `src/content/` only; invalid content fails the build with a clear message.
- Registration/apply/contact buttons open the configured external forms; closed and past states display correctly.
- Event links produce attractive previews on WhatsApp/LinkedIn.
- Lighthouse targets met; security headers grade A; CI green.
- A non-developer club member can follow `CONTENT_GUIDE.md` to add an event and redeploy.
- Data access layer is ready for the backend phase.

---

## 15. Reference sites (for structure/feature ideas only — do not copy design, code, text or images)

IIT Bombay (ecell.in), IIT Hyderabad (ecell.iith.ac.in), IIT Kanpur (ecelliitk.org), IIT BHU (ecelliitbhu.in), IIT Guwahati (ecelliitg.in), IIT Goa (iitgoa.ac.in/~students/ecell), NIT Trichy (e-cellnitt.org), VNIT (ecellvnit.org), NIT Silchar (ecellnits.org), NIT Agartala (ecellnita.in), VIT Bhopal (ecellvitb.in).

Patterns worth using: bold hero with one clear CTA, flagship summit spotlight with countdown, animated stat counters, partner/sponsor logo marquee, team grouped by role with past teams, events with upcoming/past tabs, gallery by event. Avoid their common problems: heavy pages slow on phones, cluttered layouts, inconsistent styles, dead links, missing mobile menus.

---

**Start now:** confirm you have read this brief and viewed every image in `docs/reference/`, list any questions or ambiguities, then present your plan for **Stage 0** and wait for my approval.
