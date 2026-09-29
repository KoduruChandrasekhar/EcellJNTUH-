/**
 * Site navigation. Structural rather than editorial, so it lives here rather than in
 * src/content — but it is still defined once and consumed by the navbar, the mobile menu
 * and the footer, so nothing can drift out of sync or point at a route that doesn't exist.
 */
export type NavLink = { href: string; label: string };

export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/gallery", label: "Gallery" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/contact", label: "Contact" },
];

/** The footer lists everything in the navbar plus the pages that aren't in it. */
export const footerNav: NavLink[] = [...primaryNav, { href: "/join", label: "Join us" }];

export const legalNav: NavLink[] = [{ href: "/privacy", label: "Privacy" }];

/**
 * Is `href` the current page? "/" must match exactly, or it would light up everywhere;
 * every other route also matches its children, so /events/ethos-2026 highlights Events.
 */
export function isActiveRoute(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
