import { expect, test } from "@playwright/test";

/**
 * Motion correctness.
 *
 * Scroll-triggered animations start hidden, so a broken trigger doesn't throw an error —
 * it silently leaves content invisible. That is the kind of failure nobody notices until a
 * visitor reports a blank page, which makes it worth testing.
 *
 * These assertions pin the two rules the motion system depends on: content must end up
 * visible, and everything must stop dead under reduced motion.
 */

test("the above-the-fold headline is visible", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });

  // The hero headline is in view immediately, which is the case most likely to break: the
  // observer fires during hydration, so anything that rewrites the element afterwards
  // would strand it at opacity 0 with no error.
  //
  // The hero h1 holds the animated wordmark (per-letter wave), so the letters are what
  // must end up painted. Asserting on the letters rather than on the h1 is deliberate:
  // an h1 at opacity 1 whose children are all transparent still renders nothing.
  const letters = page.locator("h1 .wordmark-letter");
  await expect(letters.first()).toHaveCSS("opacity", "1", { timeout: 5000 });
  await expect(letters.last()).toHaveCSS("opacity", "1", { timeout: 5000 });

  // The screen-reader text must carry the whole word, since the letters are aria-hidden.
  await expect(page.locator("h1 .sr-only")).toHaveText(/\S/);
});

test("section headlines further down the page reveal on scroll", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });

  // SplitHeadline is the component the rest of the page uses; it starts hidden and is
  // revealed by IntersectionObserver, which is the mechanism most likely to fail silently.
  const headline = page.locator(".rise-in > *").first();
  await headline.scrollIntoViewIfNeeded();
  await expect(headline).toHaveCSS("opacity", "1", { timeout: 5000 });
});

/**
 * Swept at both widths on purpose. At phone width the recent-events rail scrolls
 * horizontally, and a card scrolled out of view sideways never intersects the viewport —
 * which previously left those cards permanently invisible to anyone who didn't swipe.
 */
for (const viewport of [
  { width: 1280, height: 720 },
  { width: 360, height: 780 },
]) {
  test(`every reveal ends up visible at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "load" });

    // Scroll in small continuous increments rather than teleporting a screen at a time.
    // Instant jumps can skip an element between two IntersectionObserver samples, which no
    // real scroll does — testing the teleport would be testing an artefact.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight / 4);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 40)));
      }
    });
    // Assert on the attribute the observer sets, not on computed opacity.
    //
    // `data-visible` flips the instant the element is seen; opacity then takes 420ms to
    // follow. Waiting on the paint makes the result depend on how loaded the machine is —
    // which is why this test was flaky. The attribute is what actually proves the
    // observer fired, and it is deterministic.
    await expect
      .poll(
        () =>
          page.evaluate(() =>
            [...document.querySelectorAll(".reveal")]
              .filter((el) => (el as HTMLElement).dataset.visible !== "true")
              .map((el) => (el.textContent ?? "").trim().slice(0, 40)),
          ),
        { timeout: 15_000, message: "reveals never marked visible after scrolling the page" },
      )
      .toEqual([]);
  });
}

test("the typewriter never shifts the layout as it types", async ({ page }) => {
  await page.goto("/", { waitUntil: "load" });

  const caret = page.locator(".type-caret");
  await expect(caret).toBeAttached();

  // The wrapper reserves the width of the longest word, so characters appearing and
  // deleting must not move anything. A typewriter that resizes its own box is the classic
  // cause of layout shift in a hero, which is exactly what the CLS budget forbids.
  const widthOf = () =>
    page.evaluate(() => {
      const caretEl = document.querySelector(".type-caret");
      const wrapper = caretEl?.closest("span.relative") as HTMLElement | null;
      return wrapper ? Math.round(wrapper.getBoundingClientRect().width) : -1;
    });

  const first = await widthOf();
  expect(first).toBeGreaterThan(0);

  // Sample across a full type/delete cycle.
  for (let i = 0; i < 6; i += 1) {
    await page.waitForTimeout(500);
    expect(await widthOf(), "typewriter box changed width mid-type").toBe(first);
  }
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("content is visible immediately and nothing animates", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });

    // No scrolling, no waiting: everything must already be visible.
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll(".reveal, .rise-in > *")].filter(
          (el) => getComputedStyle(el).opacity !== "1",
        ).length,
    );
    expect(hidden, "content hidden under reduced motion").toBe(0);

    // Named explicitly so this can't pass vacuously: if a selector stops matching anything
    // the count is 0 and the assertion succeeds while testing nothing. Asserting the
    // elements exist first means a renamed animation fails the test instead of hiding.
    const animated = ".marquee-track, .type-caret, .ring-spin-slow, .ring-spin-reverse";

    const found = await page.locator(animated).count();
    expect(found, "no animated elements found — selectors are stale").toBeGreaterThan(0);

    const running = await page.evaluate(
      (selector) =>
        [...document.querySelectorAll(selector)].filter(
          (el) => getComputedStyle(el).animationName !== "none",
        ).length,
      animated,
    );
    expect(running, "animations still running under reduced motion").toBe(0);

    // The intro loader must never appear at all.
    await expect(page.locator(".loader-logo")).toHaveCount(0);
  });
});

test("the page is complete without any JavaScript", async ({ request }) => {
  // Fetched over HTTP rather than through a browser: this is literally the bytes a client
  // with no JS receives. (Driving a `javaScriptEnabled: false` page is not a valid check —
  // Playwright's own role engine and `evaluate` need in-page script, so they fail for
  // reasons unrelated to the site.)
  const response = await request.get("/");
  expect(response.status()).toBe(200);

  const html = await response.text();

  // Assert on structure, not on marketing copy: a test that pins the exact hero sentence
  // breaks every time someone edits the wording, which trains people to ignore it.
  expect(html).toContain("<h1");
  expect(html).toContain("E-Cell JNTUH");
  expect((html.match(/<section/g) ?? []).length, "sections missing").toBeGreaterThan(4);
  expect((html.match(/reveal/g) ?? []).length, "reveal markup missing").toBeGreaterThan(5);
  // The hero intro comes from content, so check the element exists rather than its text.
  expect(html).toContain("Innovate");
});

test("hiding rules are gated on scripting being available", async ({ page }) => {
  // The companion to the test above: the CSS that hides content must sit inside a
  // `scripting: enabled` query, so it cannot apply when the script never runs.
  await page.goto("/", { waitUntil: "load" });

  const gated = await page.evaluate(() =>
    [...document.styleSheets]
      .flatMap((sheet) => {
        try {
          return [...sheet.cssRules].map((rule) => rule.cssText);
        } catch {
          return []; // a cross-origin sheet, not ours
        }
      })
      .filter((text) => text.includes("scripting"))
      .join(" "),
  );

  expect(gated, "no scripting-gated rules found").toContain("scripting");
  expect(gated, ".reveal is not gated").toContain(".reveal");
  expect(gated, ".rise-in is not gated").toContain(".rise-in");
});
