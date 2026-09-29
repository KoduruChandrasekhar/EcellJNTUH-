"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

/**
 * Mobile navigation trigger.
 *
 * `next/dynamic` splits the panel into its own chunk fetched the first time the menu is
 * opened, so Radix — the largest client dependency in the shell — never loads for someone
 * who doesn't open it. The trigger itself is plain HTML.
 *
 * Open state is lifted to the Navbar so it can refuse to hide itself while the menu is up.
 */
const MobileMenuPanel = dynamic(() => import("./MobileMenuPanel").then((m) => m.MobileMenuPanel), {
  ssr: false,
});

export function MobileMenu({
  pathname,
  open,
  onOpenChange,
}: {
  pathname: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  // Once opened, keep it mounted so closing and reopening doesn't refetch the chunk.
  const [everOpened, setEverOpened] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => {
          setEverOpened(true);
          onOpenChange(true);
        }}
        className="border-line text-body hover:border-brand-blue hover:text-brand-blue grid size-11 place-items-center rounded-(--radius-pill) border-[1.5px] transition-colors duration-(--duration-fast) lg:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </button>

      {everOpened ? (
        <MobileMenuPanel open={open} onOpenChange={onOpenChange} pathname={pathname} />
      ) : null}
    </>
  );
}
