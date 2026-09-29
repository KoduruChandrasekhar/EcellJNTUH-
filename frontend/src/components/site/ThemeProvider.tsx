"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes writes the theme class onto <html> from a tiny inline script that runs
 * *before* the page paints, which is what prevents the flash of the wrong theme.
 * It has to be a client component because it uses React context.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
