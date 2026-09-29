import { cn } from "@/lib/utils";

/**
 * The thin wireframe globe cropped into the posters' corners. Drawn as ellipses rather
 * than a mesh image — a handful of vector paths instead of a download.
 *
 * Colour follows the theme through `currentColor` (ink on paper, blue on night), with a
 * single meridian picked out in brand yellow so the logo's two colours are present even
 * in the decorative furniture.
 */
export function WireGlobe({ className }: { className?: string }) {
  // Latitude rings squash toward the poles; longitude lines are ellipses of varying width.
  const latitudes = [-60, -30, 0, 30, 60];
  const longitudes = [0.18, 0.5, 0.82];

  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      className={cn("text-ink/50 dark:text-brand-blue/70 h-full w-full", className)}
    >
      <circle cx="100" cy="100" r="88" />
      {latitudes.map((lat) => {
        const y = 100 - (lat / 90) * 88;
        const rx = 88 * Math.cos((lat * Math.PI) / 180);
        return <ellipse key={lat} cx="100" cy={y} rx={rx} ry={rx * 0.16} />;
      })}
      {longitudes.map((t) => (
        <ellipse key={t} cx="100" cy="100" rx={88 * Math.abs(1 - 2 * t)} ry="88" />
      ))}

      {/* The one yellow meridian. */}
      <ellipse
        cx="100"
        cy="100"
        rx="44"
        ry="88"
        stroke="var(--color-brand-yellow)"
        strokeWidth="1.4"
      />
      <line x1="100" y1="12" x2="100" y2="188" />
    </svg>
  );
}

/** The wireframe torus from the Decision Matrix poster. */
export function WireTorus({ className }: { className?: string }) {
  const rings = Array.from({ length: 14 }, (_, i) => (i / 14) * Math.PI * 2);

  return (
    <svg
      aria-hidden
      viewBox="0 0 200 140"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      className={cn("text-ink/50 dark:text-brand-blue/70 h-full w-full", className)}
    >
      <ellipse cx="100" cy="70" rx="86" ry="42" />
      <ellipse cx="100" cy="70" rx="38" ry="16" />
      {rings.map((a, i) => {
        const cx = 100 + Math.cos(a) * 62;
        const cy = 70 + Math.sin(a) * 29;
        return <ellipse key={i} cx={cx} cy={cy} rx="13" ry="26" />;
      })}
    </svg>
  );
}
