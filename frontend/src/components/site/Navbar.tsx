"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { isActiveRoute, primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { LockupLink } from "./Lockup";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Sticky site header.
 *
 * Three scroll behaviours, all driven by a single `requestAnimationFrame`-throttled
 * reader — never a raw scroll handler, which would run on the main thread on every pixel
 * and make cheap phones stutter:
 *
 *   1. transparent over the hero, solid + blurred + hairline border past 40px
 *   2. hides when scrolling down, reappears when scrolling up
 *   3. never hides while the mobile menu is open
 *
 * The active-link underline is one absolutely-positioned bar that animates between links,
 * so it slides rather than blinking from one to the next.
 */
const SOLID_AFTER = 40;
const HIDE_AFTER = 120;

export function Navbar() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const listRef = useRef<HTMLUListElement>(null);
  const [underline, setUnderline] = useState<{ left: number; width: number } | null>(null);

  /* ---- scroll state ---- */
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const read = () => {
      const y = window.scrollY;
      setSolid(y > SOLID_AFTER);

      // Only react to deliberate movement, and never hide near the very top.
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > HIDE_AFTER);
        lastY = y;
      }
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    read();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /* ---- underline position ---- */
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const place = () => {
      const active = list.querySelector<HTMLElement>("[data-active='true']");
      if (!active) {
        setUnderline(null);
        return;
      }
      setUnderline({ left: active.offsetLeft, width: active.offsetWidth });
    };

    place();

    // Re-measure when the row reflows (font load, resize) so the bar stays aligned.
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-(--z-index-nav) transition-[transform,background-color,border-color,backdrop-filter]",
        "duration-(--duration-base) ease-(--ease-out-brand)",
        solid
          ? "border-line-soft bg-surface/85 border-b backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
      )}
    >
      <nav aria-label="Main" className="container-site flex h-20 items-center gap-4 md:h-24">
        <LockupLink size="sm" priority />

        <ul ref={listRef} className="relative ml-auto hidden items-center gap-1 lg:flex">
          {primaryNav.map((link) => {
            const active = isActiveRoute(link.href, pathname);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  data-active={active}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-(--radius-pill) px-3.5 text-sm font-medium",
                    "transition-colors duration-(--duration-fast)",
                    active ? "text-body" : "text-body-3 hover:text-brand-blue",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}

          {/* One bar that slides between links rather than one per link. */}
          {underline ? (
            <span
              aria-hidden
              className="bg-brand-yellow absolute bottom-1.5 h-[3px] rounded-full transition-[left,width] duration-(--duration-base) ease-(--ease-out-brand)"
              style={{ left: underline.left + 14, width: underline.width - 28 }}
            />
          ) : null}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle />
          <ButtonLink href="/join" size="sm" className="hidden sm:inline-flex">
            Join us
          </ButtonLink>
          <MobileMenu pathname={pathname} open={menuOpen} onOpenChange={setMenuOpen} />
        </div>
      </nav>
    </header>
  );
}
