import { expect, test, type Page } from "@playwright/test";

/**
 * Interaction regressions.
 *
 * Every test here guards a bug that shipped once and produced no error at all — the page
 * looked fine and simply didn't respond. Silent failures are the ones nobody reports, so
 * they need a test more than the loud ones do.
 */

/** Scroll instantly: the site sets `scroll-behavior: smooth`, which makes a plain
 *  scrollIntoView animate and leaves the element offscreen when you measure it. */
async function scrollTo(page: Page, selector: string) {
  await page
    .locator(selector)
    .first()
    .evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await page.waitForTimeout(500);
}

test("the first click after load is never dropped", async ({ page }) => {
  // A global View Transition once held the document non-interactive for ~750ms after every
  // load, so a visitor's first click did nothing. Click immediately — no settling time.
  await page.goto("/", { waitUntil: "load" });

  const cta = page.getByRole("link", { name: /Register for|Explore/ }).first();
  const box = await cta.boundingBox();
  if (!box) throw new Error("hero CTA not found");

  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page).toHaveURL(/\/events\//, { timeout: 6000 });
});

test("an event card opens its event wherever it is clicked", async ({ page }) => {
  // The title link's stretched overlay needs the card to be `relative`; without it only
  // the title text was clickable and the poster did nothing.
  for (const part of ["img", "p.line-clamp-3"]) {
    await page.goto("/", { waitUntil: "load" });
    await page.waitForTimeout(1200); // let the once-per-session intro overlay clear
    await scrollTo(page, ".snap-rail li");

    const target = page.locator(".snap-rail li").first().locator(part).first();
    const box = await target.boundingBox();
    if (!box) throw new Error(`no ${part} on the first card`);

    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page, `clicking the card's ${part} did not navigate`).toHaveURL(/\/events\//);
  }
});

test("gallery photos pop forward on hover without being clipped", async ({ page }) => {
  for (const [route, strip] of [
    ["/", ".marquee:has(.photo-pop)"],
    ["/gallery", "ul:has(.photo-pop)"],
  ] as const) {
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    await scrollTo(page, strip);

    // A real pointer: on the home strip, entering it pauses the marquee, which is what lets
    // a visitor land on a photo in the first place.
    const box = await page.locator(strip).first().boundingBox();
    if (!box) throw new Error(`${strip} not found on ${route}`);
    await page.mouse.move(box.x + box.width * 0.45, box.y + box.height / 2, { steps: 6 });
    await page.waitForTimeout(600);

    const state = await page.evaluate((stripSelector) => {
      const photo = [...document.querySelectorAll(".photo-pop")].find((e) => e.matches(":hover"));
      if (!photo) return null;
      const containerEl = document.querySelector(stripSelector)!;
      const container = containerEl.getBoundingClientRect();
      const rect = photo.getBoundingClientRect();
      // Only a container that actually clips can cut the photo off. The gallery grid
      // doesn't, so a photo growing past its box there is fine; the marquee does.
      const clips = getComputedStyle(containerEl).overflowY !== "visible";
      return {
        scale: new DOMMatrix(getComputedStyle(photo).transform).a,
        clipped: clips && (rect.top < container.top - 1 || rect.bottom > container.bottom + 1),
      };
    }, strip);

    expect(state, `nothing hovered on ${route}`).not.toBeNull();
    expect(state!.scale, `${route}: photo did not enlarge`).toBeGreaterThan(1.05);
    expect(state!.clipped, `${route}: enlarged photo is cut off`).toBe(false);
  }
});
