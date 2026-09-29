import type { Metadata } from "next";
import { getSiteConfig } from "@/lib/data";
import { OrganizationSchema } from "@/components/site/StructuredData";
import { Grain } from "@/components/brand/Grain";
import { BackToTop } from "@/components/site/BackToTop";
import { Footer } from "@/components/site/Footer";
import { Loader } from "@/components/site/Loader";
import { Navbar } from "@/components/site/Navbar";
import { SkipLink } from "@/components/site/SkipLink";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

/**
 * Site-wide metadata, built from site.ts so the canonical domain is written once.
 *
 * `metadataBase` is the load-bearing field: without it, Next emits relative og:image URLs,
 * which every social platform rejects — the link preview silently falls back to nothing.
 * The Open Graph image itself comes from app/opengraph-image.tsx, which Next wires up on
 * its own; routes that want a different card supply their own file.
 */
export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteConfig();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.shortName} — ${site.motto}`,
      // Every page that sets a title gets it slotted in here automatically.
      template: `%s · ${site.shortName}`,
    },
    description: site.description,
    applicationName: site.name,
    keywords: [
      "E-Cell JNTUH",
      "Entrepreneurship Cell JNTU Hyderabad",
      "JNTUH student clubs",
      "ETHOS JNTUH",
      "student entrepreneurship Hyderabad",
    ],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.name,
      description: site.description,
      url: site.url,
      locale: "en_IN",
    },
    twitter: { card: "summary_large_image", title: site.name, description: site.description },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    // The browser chrome matches the page background in both themes, so there is no
    // coloured seam above the content on mobile.
    other: { "color-scheme": "light dark" },
  };
}

/**
 * Themes the mobile browser chrome. Two entries rather than one, keyed on the media
 * query, so the address bar follows the user's theme instead of forcing paper onto a
 * dark-mode phone.
 */
export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ECE9E2" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0B" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteConfig();

  return (
    // suppressHydrationWarning is needed on <html> only: next-themes adds the theme class
    // before React hydrates, so the server and client markup differ by design.
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider>
          <OrganizationSchema site={site} />
          <Grain />
          <Loader />
          <SkipLink />
          <Navbar />
          {/* tabindex="-1" lets the skip link move focus here without making it tabbable. */}
          {/* The navbar is fixed and transparent over the hero, so content clears its
              height here; the Home hero pulls itself back up under it. */}
          <main id="main" tabIndex={-1} className="flex-1 pt-20 md:pt-24">
            {children}
          </main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
