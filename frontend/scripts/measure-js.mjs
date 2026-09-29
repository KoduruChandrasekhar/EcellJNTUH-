/**
 * Measure first-load JavaScript per route against the budgets in CLAUDE.md.
 *
 *   Total first-load JS  ≤ 170 KB gzipped  (framework included)
 *   Our own code         ≤  50 KB gzipped  (framework excluded)
 *
 * Two numbers rather than one, because the React + Next runtime is a fixed cost we can't
 * shrink — the second budget is the one our decisions actually move.
 *
 * Next 16's Turbopack build no longer prints the old route-size table, so this reads the
 * <script> tags a served page emits and gzips the referenced files.
 *
 * Usage:
 *   pnpm build && pnpm start        # one terminal
 *   pnpm measure                    # another
 */
import { existsSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const ORIGIN = process.env.MEASURE_ORIGIN ?? "http://localhost:3000";
const TOTAL_BUDGET_KB = 170;
const APP_BUDGET_KB = 50;
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/team", "/styleguide"];

/**
 * A chunk counts as framework only when it carries React's reconciler, Next's router
 * runtime, or the bundler runtime — none of which our decisions can shrink.
 *
 * Deliberately conservative: anything ambiguous falls into "ours", so the budget we
 * actually guard is never flattered by a misclassification.
 */
const FRAMEWORK_CONTENT = /createRoot|hydrateRoot|unstable_scheduleCallback|NEXT_ROUTER|next\/dist/;
const FRAMEWORK_FILE = /\/turbopack-[^/]*\.js$/;

const kb = (bytes) => bytes / 1024;
const fmt = (n) => n.toFixed(1).padStart(6);

async function measure(route) {
  const res = await fetch(ORIGIN + route);
  if (!res.ok) throw new Error(`${route} returned ${res.status}`);
  const html = await res.text();

  let framework = 0;
  let app = 0;
  let legacy = 0;

  for (const [tag, src] of html.matchAll(/<script[^>]*src="(\/_next\/static\/[^"]+\.js)"[^>]*>/g)) {
    const file = path.join(".next", src.replace("/_next/", ""));
    if (!existsSync(file)) continue;

    const raw = readFileSync(file);
    const size = gzipSync(raw).length;

    // `noModule` scripts are the legacy fallback: every browser this site targets
    // supports ES modules and ignores them entirely.
    if (/\bnoModule\b/i.test(tag)) legacy += size;
    else if (FRAMEWORK_FILE.test(src) || FRAMEWORK_CONTENT.test(raw.toString("utf8")))
      framework += size;
    else app += size;
  }

  return { route, framework, app, legacy, total: framework + app };
}

const results = await Promise.all(ROUTES.map(measure));

console.log(
  `\nFirst-load JS, gzipped  —  total budget ${TOTAL_BUDGET_KB} KB, our code ${APP_BUDGET_KB} KB\n`,
);
console.log("route            total    framework   ours    verdict");
console.log("─".repeat(62));

let failed = false;

for (const { route, framework, app, total, legacy } of results) {
  const totalOver = kb(total) > TOTAL_BUDGET_KB;
  const appOver = kb(app) > APP_BUDGET_KB;
  if (totalOver || appOver) failed = true;

  const verdict =
    totalOver && appOver ? "FAIL both" : totalOver ? "FAIL total" : appOver ? "FAIL ours" : "ok";

  console.log(
    route.padEnd(15) +
      fmt(kb(total)) +
      "  " +
      fmt(kb(framework)) +
      "  " +
      fmt(kb(app)) +
      "   " +
      verdict +
      (legacy ? `   (+${kb(legacy).toFixed(1)} KB legacy, not sent to modern browsers)` : ""),
  );
}

console.log();
process.exitCode = failed ? 1 : 0;
