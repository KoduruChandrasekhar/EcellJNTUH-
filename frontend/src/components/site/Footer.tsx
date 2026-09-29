import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { InstagramIcon, LinkedinIcon, XIcon, YoutubeIcon } from "@/components/brand/SocialIcons";
import { getSiteConfig } from "@/lib/data";
import { footerNav, legalNav } from "@/lib/nav";
import { LockupLink } from "./Lockup";

/**
 * Site footer. A server component — no interactivity, so no JavaScript ships for it.
 *
 * Every value comes from the content layer: address, email, socials and motto are edited
 * in `src/content/site.ts` and nowhere else.
 */
export async function Footer() {
  const site = await getSiteConfig();

  // Only the networks the club actually has get an icon — adding `youtube` to site.ts is
  // all it takes for one to appear here.
  const socials = [
    { key: "instagram", href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
    { key: "linkedin", href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { key: "x", href: site.socials.x, label: "X", Icon: XIcon },
    { key: "youtube", href: site.socials.youtube, label: "YouTube", Icon: YoutubeIcon },
  ].filter((social): social is typeof social & { href: string } => Boolean(social.href));

  return (
    <footer className="border-line-soft bg-surface-2 mt-auto border-t">
      <div className="container-site grid grid-cols-1 gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <LockupLink size="lg" />
          <p className="font-wide text-body-3 mt-5 text-sm tracking-(--tracking-wide-label) uppercase">
            {site.motto}
          </p>
          <p className="text-body-2 mt-4 max-w-xs text-sm leading-relaxed">{site.description}</p>
        </div>

        <nav aria-label="Footer">
          <SectionEyebrow>Explore</SectionEyebrow>
          <ul className="mt-4 flex flex-col gap-2.5">
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-body-2 hover:text-body text-sm transition-colors duration-(--duration-fast)"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <SectionEyebrow>Find us</SectionEyebrow>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li className="text-body-2 flex gap-2.5">
              <MapPin aria-hidden className="size-4 shrink-0 translate-y-0.5" />
              <span>{site.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Mail aria-hidden className="size-4 shrink-0 translate-y-0.5" />
              {site.email ? (
                <a
                  href={`mailto:${site.email}`}
                  className="text-body-2 hover:text-body transition-colors"
                >
                  {site.email}
                </a>
              ) : (
                /* No invented address — the real one isn't confirmed yet. */
                <span className="text-body-3">Official email coming soon</span>
              )}
            </li>
          </ul>

          {socials.length > 0 ? (
            <div className="mt-5 flex gap-2">
              {socials.map(({ key, href, label, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="border-line text-body hover:bg-brand-yellow hover:text-ink hover:border-brand-yellow grid size-11 place-items-center rounded-(--radius-pill) border-[1.5px] transition-colors duration-(--duration-fast)"
                >
                  <Icon />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="container-site border-line-soft mt-4 flex flex-col gap-3 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-3">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
        <ul className="flex gap-4">
          {legalNav.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-body-3 hover:text-body transition-colors">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
