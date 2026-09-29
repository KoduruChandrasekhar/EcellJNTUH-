"use client";

import Link from "next/link";
import { ChevronTick } from "@/components/brand/ChevronPair";
import { ButtonLink } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { isActiveRoute, primaryNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { Lockup } from "./Lockup";

/**
 * The menu panel itself, split from the trigger so Radix only downloads when someone
 * actually opens the menu.
 */
export function MobileMenuPanel({
  open,
  onOpenChange,
  pathname,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title="Site menu" description="Links to every page on this site.">
        <Lockup size="sm" className="mt-2" />

        <ul className="mt-8 flex flex-col gap-1">
          {primaryNav.map((link) => {
            const active = isActiveRoute(link.href, pathname);
            return (
              <li key={link.href}>
                {/* Wrapping in SheetClose means the click that navigates also closes the
                    panel — no effect watching the pathname is needed. */}
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "font-display flex min-h-12 items-center gap-2 rounded-(--radius-card) px-2 text-2xl uppercase",
                      "transition-colors duration-(--duration-fast)",
                      active ? "text-body" : "text-body-3 hover:text-body",
                    )}
                  >
                    {active ? <ChevronTick tone="yellow" size={18} /> : null}
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            );
          })}
        </ul>

        <SheetClose asChild>
          <ButtonLink href="/join" size="md" className="mt-auto w-full">
            Join us
          </ButtonLink>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
