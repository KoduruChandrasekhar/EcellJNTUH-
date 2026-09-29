import { expect, test, type Page } from "@playwright/test";

/**
 * Crawls every internal link reachable from the site and fails on any 404 or console error.
 *
 * This is the test that enforces "nothing may 404 from the navbar, the footer or any
 * button". It discovers pages by following links rather than reading a hard-coded list,
 * so a new page with a broken link is caught without anyone remembering to add it here.
 *
 * External links are checked for shape (https + rel="noopener") but never requested —
 * the suite shouldn't fail because Instagram is slow, and shouldn't hammer third parties.
 */

const ORIGIN = "http://localhost:3000";

/** Console noise we can't control and that doesn't indicate a broken page. */
const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  /\[Fast Refresh\]/i,
  // Next logs this for images it chooses not to optimise in dev.
  /was detected as the Largest Contentful Paint/i,
];

type Visit = { url: string; from: string };

/**
 * Navigate, retrying once on ERR_ABORTED.
 *
 * Originally needed because a global View Transition held the document for ~750ms after
 * every load, and back-to-back navigations aborted. That transition has since been removed
 * (it also dropped visitors' first clicks); the retry stays as cheap insurance against a
 * genuinely transient abort.
 */
async function goto(page: Page, url: string) {
  try {
    return await page.goto(url, { waitUntil: "load" });
  } catch (error) {
    if (!String(error).includes("ERR_ABORTED")) throw error;
    return await page.goto(url, { waitUntil: "load" });
  }
}

async function collectLinks(page: Page): Promise<string[]> {
  return page.$$eval("a[href]", (anchors) =>
    anchors.map((a) => (a as HTMLAnchorElement).href).filter(Boolean),
  );
}

test("every internal link resolves, with no console errors", async ({ page }) => {
  const consoleErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    if (IGNORED_CONSOLE.some((pattern) => pattern.test(text))) return;
    consoleErrors.push(`${page.url()} → ${text}`);
  });

  page.on("pageerror", (error) => {
    consoleErrors.push(`${page.url()} → uncaught: ${error.message}`);
  });

  const queue: Visit[] = [{ url: `${ORIGIN}/`, from: "(entry)" }];
  const seen = new Set<string>();
  const broken: string[] = [];

  while (queue.length > 0) {
    const visit = queue.shift()!;
    const url = visit.url.split("#")[0]!;

    if (seen.has(url)) continue;
    seen.add(url);

    const response = await goto(page, url);
    const status = response?.status() ?? 0;

    if (status >= 400) {
      broken.push(`${status} — ${url} (linked from ${visit.from})`);
      continue;
    }

    for (const href of await collectLinks(page)) {
      if (!href.startsWith(ORIGIN)) continue; // external links aren't requested
      const clean = href.split("#")[0]!;
      if (!seen.has(clean)) queue.push({ url: clean, from: url });
    }
  }

  expect(broken, `Broken internal links:\n${broken.join("\n")}`).toHaveLength(0);
  expect(consoleErrors, `Console errors:\n${consoleErrors.join("\n")}`).toHaveLength(0);

  // A crawl that only found the home page means link discovery silently failed.
  expect(seen.size, "crawled too few pages — did link discovery break?").toBeGreaterThan(10);
});

test("the 404 page is branded, not a raw error", async ({ page }) => {
  const response = await page.goto(`${ORIGIN}/this-page-does-not-exist`);

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/not/i);
  // The shell must still be there — a bare error page is a broken experience.
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
});

test("every external link is safe and https", async ({ page }) => {
  const problems: string[] = [];

  for (const path of ["/", "/events", "/sponsors", "/contact", "/join", "/about"]) {
    await goto(page, `${ORIGIN}${path}`);

    const external = await page.$$eval("a[href^='http']", (anchors) =>
      anchors
        .map((a) => a as HTMLAnchorElement)
        .filter((a) => !a.href.startsWith(window.location.origin))
        .map((a) => ({ href: a.href, rel: a.rel, target: a.target })),
    );

    for (const link of external) {
      if (!link.href.startsWith("https://")) {
        problems.push(`${path}: not https — ${link.href}`);
      }
      if (link.target === "_blank" && !link.rel.includes("noopener")) {
        problems.push(`${path}: _blank without rel=noopener — ${link.href}`);
      }
    }
  }

  expect(problems, problems.join("\n")).toHaveLength(0);
});

test("no horizontal scroll at 360px on any main route", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  const overflowing: string[] = [];

  for (const path of [
    "/",
    "/about",
    "/events",
    "/events/ethos-2026",
    "/team",
    "/initiatives",
    "/gallery",
    "/sponsors",
    "/join",
    "/contact",
    "/privacy",
  ]) {
    await goto(page, `${ORIGIN}${path}`);

    const overflows = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth > el.clientWidth + 1;
    });

    if (overflows) overflowing.push(path);
  }

  expect(overflowing, `Horizontal scroll at 360px on: ${overflowing.join(", ")}`).toHaveLength(0);
});
