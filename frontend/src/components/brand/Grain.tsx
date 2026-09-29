import { cn } from "@/lib/utils";

/**
 * The paper texture. An inline SVG turbulence filter tiled across the viewport at ~3%
 * opacity — no image request, and because it's a fixed-position overlay the browser
 * paints it once instead of re-rasterising on scroll.
 *
 * `aria-hidden` and `pointer-events-none` keep it entirely out of the way of
 * screen readers and clicks.
 */
export function Grain({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-(--z-index-base) opacity-(--grain-opacity)",
        "bg-repeat mix-blend-multiply dark:mix-blend-screen",
        className,
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "160px 160px",
      }}
    />
  );
}
