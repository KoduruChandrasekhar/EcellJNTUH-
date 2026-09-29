import type { NextConfig } from "next";

/**
 * A Content Security Policy tight enough to be worth having.
 *
 * Two deliberate loosenings, both forced by the framework rather than by our code:
 *
 * - `'unsafe-inline'` in `script-src` — Next's bootstrap and the next-themes script that
 *   sets the theme class before paint are inline. The alternative is a per-request nonce,
 *   which requires middleware and makes every page dynamic; that trades all of this
 *   site's static-rendering performance for a marginal gain, since we ship no
 *   user-generated markup and never use dangerouslySetInnerHTML.
 * - `'unsafe-inline'` in `style-src` — React writes inline `style` attributes for the
 *   animation delays the reveals depend on.
 *
 * `frame-src` allows Google Maps only, for the embedded campus map on /contact.
 * `frame-ancestors 'none'` means nobody can put this site in an iframe of their own.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src https://www.google.com https://maps.google.com",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Two years, so the site qualifies for the HSTS preload list.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for none of these, so deny them outright rather than on first use.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Belt and braces alongside frame-ancestors, for anything that predates CSP level 2.
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers (see docs/PROJECT_BRIEF.md section 10).
  poweredByHeader: false,

  // We deliberately do NOT set `output: "export"` — the brief (section 9.4) keeps the
  // standard Vercel build so server features can be added in the backend phase.

  images: {
    // Every image on the site is local, so no remote patterns are allowed at all: the
    // optimiser cannot be pointed at a third-party URL.
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    // An SVG rendered through next/image executes its own scripts. Nothing here needs it.
    dangerouslyAllowSVG: false,
  },

  async headers() {
    // Only security headers here. Next already serves /_next/static as immutable, and
    // overriding Cache-Control on that path makes it warn that dev behaviour may break.
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
