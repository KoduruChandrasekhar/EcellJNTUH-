# CLAUDE.md — E-Cell JNTUH website

Conventions for this repo. The full specification is [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md);
this file is the short version you should keep in working memory. **When the two disagree, the
brief wins** — and tell the user about the conflict.

---

## What this is

Static, frontend-only marketing site for E-Cell, JNTU Hyderabad (JNTUH UCESTH, Kukatpally).
Phase 1 is **frontend only**. A later phase adds Supabase — prepare for it, build none of it.

## Working agreement

- **Work in stages** (brief section 12). Show a short plan before each stage, stop at the end of
  each stage, wait for approval.
- **Never run `git commit`, `git push`, or anything that creates commits, branches, tags or PRs.**
  Read-only git (`status`, `diff`, `log`) is fine. At the end of each step, suggest a conventional
  commit message and list the files it covers.
- **Check installed versions before using an API.** Framework APIs move fast (async `params` in
  Next 16, Tailwind v4's CSS-first `@theme`). Read `package.json` and follow the docs for _that_
  version, not memory. If unsure, say so.
- **No new dependencies** beyond the stack below without asking first and explaining why.
- Stuck after two attempts at the same error? Stop and explain the problem and the options.
- The user knows basic React; Next.js, TypeScript and Tailwind are new to them. Explain each new
  concept in 2–4 plain sentences the first time it appears. Comment the "why", not every line.

## Stack (do not substitute)

Next.js 16 App Router · React 19 · TypeScript `strict` · Tailwind v4 (CSS-first `@theme`) ·
Radix primitives · lucide-react · Zod · react-markdown · yet-another-react-lightbox ·
Vitest + Playwright · pnpm 10 · sharp (image script) · Vercel.

**Motion is deliberately NOT installed.** The brief lists it, but every animation here —
marquee, scroll reveal, count-up, loader — is CSS keyframes plus IntersectionObserver, which
costs ~0 KB against a ~35 KB library. Re-add it only for something CSS genuinely can't do
(spring physics, FLIP layout animation), and re-measure with `pnpm measure` when you do.

**shadcn's CLI does not work on this machine** — it hangs whenever it shells out to pnpm, on
both `init` and `add`. Build primitives directly on Radix instead, keeping shadcn's file
layout and API shape (`src/components/ui/<lowercase>.tsx`) so they stay familiar.

**Never**: database/BaaS, API routes, server actions, auth, Redux, CSS-in-JS, Pages Router, a CMS,
`output: "export"`.

Dates use native `Intl.DateTimeFormat` with `Asia/Kolkata`. No date library.

## Non-negotiables

1. **Dynamic** — nothing hard-coded in page components. Every list, date, status, stat and link
   comes from `src/content/` via `src/lib/data/`. Status ("Upcoming", "Closing soon" ≤48h,
   "Closed", "Completed") is _computed_ from dates, never typed by hand, and re-checked client-side.
2. **No lag** — LCP < 2.0s, INP < 200ms, CLS < 0.05 on throttled mobile. No image over 200 KB;
   hero ≤ 120 KB. Server components by default; client components are small leaves. Animate only
   `transform`/`opacity`.

   **JS budgets** (these supersede the single 120 KB figure in brief section 1A, which was
   unreachable — the React 19 + Next 16 runtime alone is ~121 KB before any of our code):

   - **Total first-load JS ≤ 170 KB gzipped per route**, framework included.
   - **Our own code ≤ 50 KB gzipped per route**, framework excluded. This is the number our
     decisions actually move — guard it.

   Check with `pnpm measure` against a running `pnpm start`. It reports both and exits non-zero
   if either is blown. Cross-check against Lighthouse in Stage 4.

   **The loader must never delay LCP or interactivity.** The page renders and hydrates
   underneath; the loader is only a fading overlay, hard-capped at 800 ms, and its image is
   deliberately not `priority` so it can't compete with the real LCP element. Measure LCP with
   and without it in Stage 4 — if it costs anything measurable, delete it.

3. **Scalable** — must stay fast at 200+ events, 60+ members, 1,000+ photos. Don't ship all events
   to every page. One component per job; no duplicate UI.
4. **Secure** — every external URL validated as `https://` by Zod, `rel="noopener noreferrer"` on
   all external links, markdown rendered without raw HTML, no `dangerouslySetInnerHTML`, no secrets.
5. **Consistent** — design tokens are the single source of truth. **No hard-coded hex values, pixel
   sizes or one-off font sizes in components.** 4px spacing scale, one container width, one card
   style, one button system. Every new component appears on `/styleguide`.
6. **Great UI/UX** — one primary action per screen; registration never more than one tap from Home.
   Designed empty / loading / error / past states for every dynamic block. WCAG 2.2 AA. Check 360px
   and 1280px before calling a stage done.

## Architecture rules

- **Pages never import `src/content/` directly.** They call async functions in `src/lib/data/`
  (`getEvents()`, `getEventBySlug()`, `getUpcomingEvents()`, `getTeam(term)`, …). The backend phase
  changes only those functions.
- Types are inferred from Zod schemas in `src/content/schema.ts` via `z.infer`. One source of truth.
- `registration` is a discriminated union (`"external" | "none"`) so `"internal"` can be added
  later. It renders through a single `<RegistrationSection event={event} />`.
- Invalid content **must fail the build** with a clear message: missing field, bad date, missing
  image file, duplicate slug, broken `parentSlug`.
- `"use client"` only on interactive leaves: menu, theme toggle, tabs/filters, countdown, lightbox,
  marquee, animations. Heavy ones are lazy-loaded with `next/dynamic`.

## Brand

Editorial **"paper and ink"** — warm off-white paper with grain, charcoal ink, heavy condensed
display headlines paired with an outlined (stroke-only) second line, small navy eyebrows, and
poster motifs: slanted parallelogram rows, red dotted frames, wireframe globes/tori, × grids,
hazard stripes, numbered eco-green pill cards, barcode strips, halftone greyscale imagery.

It must look nothing like the generic dark-gradient E-Cell template sites.
**Look at every image in `docs/reference/` before designing anything.**

### The logo is fixed

One asset, `public/images/brand/logo.png` — the square dark-background official logo — used
**identically everywhere**: navbar, footer and loader. Rendered only through
`src/components/site/Logo.tsx`.

Never redraw it, trace it to SVG, recolour it, crop it, or strip its background. `ChevronAccent`
is a decorative mark, explicitly _not_ a reconstruction of the logo.

### Loader

**No circular spinner** — and no circle of any kind. The logo sits centred on a dark plate.
Hard-capped at 800 ms (500 visible + 300 fade), dismissible by any key or click, shown once per
session, skipped entirely under `prefers-reduced-motion`. Its image is not `priority` so it can
never compete with the page's real LCP element.

### Tokens

Defined once in the Tailwind theme, never inline:
`paper #ECE9E2` · `paper-2 #E2DED6` · `paper-3 #F5F3EE` · `ink #1F1F1F` · `ink-2 #3A3A3A` ·
`ink-3 #6B6760` · `brand-yellow #FFC83D` · `brand-blue #2F7BEA` · `brand-green #3FB27F` ·
`navy #13297A` · `sky #3DA9F2` · `signal-red #C8202C` · `eco #5B9A68` · `charcoal-panel #2A2A2A` ·
`mint #CFE6D3` · `purple #8E2DE2`.

Hex values are estimated from posters — keep them in one file so they're easy to correct.
Dark mode: `#0B0B0B` background, `#F2EFE8` text, same yellow/blue accents, no flash on load.

Fonts (max 4 families, `next/font`, `display: swap`): **Anton** display · **Unbounded** wide labels ·
**Poppins** body/UI · one condensed face for section headings.

Per-event `accent` presets (`ink` default, `yellow`, `blue`, `eco`, `red`, `navy`, `sky`, `mint`,
`purple`) theme only that event's page. `purple` gradient text is allowed on Trivial Pursuits only.

## Dynamic UI

The site should feel alive, not static — but not at the cost of the JS budget. The pattern:

- **Movement is CSS.** Marquee and scroll reveal are keyframes in `globals.css`; `Marquee` is a
  server component and costs no JavaScript at all.
- **Only the trigger is JavaScript.** `Reveal`, `CountUp` use IntersectionObserver, never a
  scroll listener. `BackToTop` and `Navbar` throttle scroll reads through `requestAnimationFrame`.
- **Fail safe.** `.reveal` hides content only inside `@media (scripting: enabled)`, so blocked or
  broken JS leaves the page fully visible instead of blank.
- **No hydration mismatches.** Anything clock- or theme-dependent (`Countdown`, `StatusBadge`,
  `ThemeToggle`) renders a stable server value first and reconciles on mount — never branches on
  `Date.now()` or the theme during render.
- Everything above stops dead under `prefers-reduced-motion`.

## Content rules

- **Never invent people, quotes, numbers or dates.** Unknowns get an obvious placeholder and a
  `// TODO: confirm` comment.
- Only the confirmed team members from brief section 2.1 appear on the site. No fake placeholder people.
- Competition winners are shown by **team name only**, never student names.
- Speaker and jury names are public professional info and may be shown with their roles.
- **No phone numbers, personal emails, QR codes or referral IDs anywhere in the repo or on the
  site.** `docs/reference/career-craft-UNCROPPED.png` contains phone numbers and a QR code — it must
  be cropped before any part of it ships to `public/`.

## Commands

```bash
pnpm dev            # dev server
pnpm build          # production build
pnpm lint           # eslint
pnpm typecheck      # tsc --noEmit
pnpm format         # prettier --write
pnpm test           # vitest unit tests
```

`pnpm` is installed at user level (`corepack enable` needs admin here). **pnpm 11 crashes on this
machine** — its native binary hits `STATUS_DLL_NOT_FOUND`. Stay on pnpm 10.x, which is pure JS.

## Layout

**The Next.js app lives in `frontend/`, not at the repo root.** Run every `pnpm` command
from there. On Vercel, set **Root Directory = `frontend`**. The root holds only the repo's
own files (docs, reference images, CI) so a `backend/` can sit beside it in the Supabase phase.

```
docs/reference/              poster + logo screenshots — study before designing
frontend/src/app/            App Router routes
frontend/src/components/ui/  shadcn primitives   frontend/src/components/brand/  Headline, Grain…
frontend/src/components/site/ Navbar, Footer…    frontend/src/components/sections/ Hero, EventCard…
frontend/src/content/        typed data + schema.ts (the only place content is edited)
frontend/src/lib/data/       data access layer — the backend seam
frontend/src/lib/og/         Open Graph card layout (Satori — flexbox only, no Tailwind)
frontend/tests/unit/         content validation, date/status logic, ics
frontend/tests/e2e/          Playwright smoke + responsive + interaction regressions
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
