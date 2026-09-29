import { Anton, Oswald, Poppins, Unbounded } from "next/font/google";

/**
 * Fonts are loaded through `next/font`, which downloads them at build time and self-hosts
 * them from our own domain. That removes the request to Google's servers, and because Next
 * knows each font's metrics it can size the fallback to match — so text doesn't jump when
 * the real font arrives (no layout shift).
 *
 * Each font exposes a CSS variable that src/styles/globals.css maps to a `--font-*` token.
 * Swapping a family means changing it here only.
 */

/** Display headlines — heavy condensed caps. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

/** Wide geometric labels — "ETHOS", section eyebrows, stat numbers. */
const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-unbounded",
  display: "swap",
});

/** Condensed section headings — "WHAT IS ETHOS?", "WHY PARTICIPATE?". */
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-oswald",
  display: "swap",
});

/** Body and UI text — matches the lettering in the logo. */
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

/** Applied once on <html> so every token resolves everywhere. */
export const fontVariables = [
  anton.variable,
  unbounded.variable,
  oswald.variable,
  poppins.variable,
].join(" ");
