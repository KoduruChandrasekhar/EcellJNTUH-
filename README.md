# E-Cell JNTU Hyderabad — Official Website

The website of **E-Cell, JNTU Hyderabad** (Entrepreneurship Cell, JNTUH UCESTH, Kukatpally,
Hyderabad) — _Innovate | Connect | Elevate_.

A static, content-driven site: every event, team member, photo and link is edited in plain data
files in `src/content/`, and the whole site rebuilds from them.

> **Status: Stage 0 of 5 complete** (project setup). See [docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md)
> for the full plan.

---

## Getting started

Requires **Node 20.9+** (Node 24 recommended) and **pnpm 10**.

```bash
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

> **pnpm note:** stay on pnpm 10. Version 11 ships a compiled binary that fails to start on some
> Windows machines (`STATUS_DLL_NOT_FOUND`); v10 is pure JavaScript and works everywhere.

## Scripts

| Command             | What it does                                               |
| ------------------- | ---------------------------------------------------------- |
| `pnpm dev`          | Start the dev server with hot reload                       |
| `pnpm build`        | Production build (this is what Vercel runs)                |
| `pnpm start`        | Serve the production build locally                         |
| `pnpm lint`         | ESLint                                                     |
| `pnpm typecheck`    | TypeScript, no output — catches type errors CI would catch |
| `pnpm format`       | Rewrite files with Prettier                                |
| `pnpm format:check` | Fail if anything is unformatted (what CI runs)             |
| `pnpm test`         | Vitest unit tests                                          |

## How the project is laid out

```
docs/
  PROJECT_BRIEF.md     full specification — the source of truth
  reference/           the club's logo and Instagram posters (design reference)
public/images/         optimised images that ship to visitors
assets-source/         original full-size images (not committed, not served)
src/
  app/                 routes — every folder here is a URL
  components/
    ui/                shadcn/ui primitives
    brand/             poster motifs: Headline, WireGlobe, Grain, ChevronMotif…
    site/              Navbar, Footer, ThemeToggle, MobileMenu
    sections/          Hero, EthosSpotlight, StatsBand, EventCard…
  content/             ← all site content lives here, and nowhere else
  lib/data/            data access layer (the seam for the future backend)
  styles/              Tailwind theme and design tokens
tests/
  unit/                content validation, date/status logic
  e2e/                 Playwright smoke and responsive checks
```

## Editing content

Everything visitors read — events, team members, gallery albums, stats, social links, registration
URLs — lives in `src/content/`. Nothing is hard-coded in the pages.

Content is validated by Zod when the site builds, so a typo (a missing field, a bad date, a
duplicate event slug, a link that isn't `https://`) **fails the build with a clear message** instead
of shipping broken.

A step-by-step guide written for non-developers lands in `docs/CONTENT_GUIDE.md` in Stage 5.

## Deploying

Vercel. Setup instructions land in `docs/DEPLOYMENT.md` in Stage 5.

## Contributing

Read [CLAUDE.md](CLAUDE.md) for the conventions this codebase follows, then
[docs/PROJECT_BRIEF.md](docs/PROJECT_BRIEF.md) for the reasoning behind them.
