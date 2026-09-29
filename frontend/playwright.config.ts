import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright runs against the production build, not the dev server: dev has extra console
 * noise, different bundling and no static generation, so a pass there would not prove the
 * deployed site works.
 *
 * `webServer` starts `pnpm start` automatically and reuses an already-running server
 * locally, so the suite is a single command either way.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,

  /**
   * Deliberately limited. Four workers hammering one Next server starves the machine of
   * frames, and the scroll-reveal sweep then sees IntersectionObserver skip elements —
   * a measurement artefact, not something a real scrolling visitor encounters. Two
   * workers keeps the suite quick while leaving enough headroom to measure honestly.
   */
  workers: 2,

  /**
   * Crawling every page and re-checking each at 360px legitimately takes longer than the
   * 30s default — this is a whole-site sweep, not a single interaction.
   */
  timeout: 150_000,
  expect: { timeout: 10_000 },
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },

  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
