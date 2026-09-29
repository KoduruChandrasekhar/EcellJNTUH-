"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Light/dark switch.
 *
 * The server can't know the visitor's theme, so anything that branches on it in JSX would
 * mismatch during hydration. Instead both icons are always rendered and CSS shows the right
 * one via the `dark` class — no mounted flag, no hydration gap, no layout shift.
 *
 * The click handler reads the class off <html> rather than trusting React state, so the
 * very first click is correct even before next-themes has reported a resolved theme.
 */
export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")
      }
      aria-label="Switch between light and dark theme"
      className="border-line text-body hover:bg-surface-2 grid size-11 shrink-0 place-items-center rounded-(--radius-pill) border-[1.5px] transition-colors duration-(--duration-fast)"
    >
      <Sun aria-hidden className="hidden size-5 dark:block" />
      <Moon aria-hidden className="size-5 dark:hidden" />
    </button>
  );
}
