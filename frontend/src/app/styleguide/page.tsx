import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrossGrid, CrossMark } from "@/components/brand/CrossGrid";
import { DottedFrame, InkPanel } from "@/components/brand/DottedFrame";
import { HazardStripe } from "@/components/brand/HazardStripe";
import { Headline } from "@/components/brand/Headline";
import { NumberedPill } from "@/components/brand/NumberedPill";
import { ParallelogramRow } from "@/components/brand/ParallelogramRow";
import { PixelBlocks } from "@/components/brand/PixelBlocks";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { WireGlobe, WireTorus } from "@/components/brand/WireGlobe";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDivider, ChevronPair, ChevronTick } from "@/components/brand/ChevronPair";
import { MarkWatermark } from "@/components/brand/MarkWatermark";
import { Lockup, Mark } from "@/components/site/Lockup";

export const metadata: Metadata = {
  title: "Style guide",
  // Never index this page, even if it is made visible in production.
  robots: { index: false, follow: false },
};

/**
 * The living design reference. Every component added to the site appears here, so there's
 * one place to check that a new piece matches the system.
 *
 * Hidden in production by default. To show it on a deployment, set
 * NEXT_PUBLIC_SHOW_STYLEGUIDE=true.
 */
export default function StyleguidePage() {
  const hidden =
    process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SHOW_STYLEGUIDE !== "true";
  if (hidden) notFound();

  return (
    <div className="container-site section-y">
      <SectionEyebrow>Internal reference</SectionEyebrow>
      <Headline as="h1" size="display" solid="Style" outline="Guide" className="mt-3" />
      <p className="text-body-2 mt-5 max-w-xl">
        Every design token and component in the site. If something here looks wrong, fix it here —
        not in the page that uses it.
      </p>

      <Section title="Colour tokens">
        <p className="text-body-3 -mt-2 mb-6 max-w-2xl text-sm">
          Brand values are fixed. Semantic tokens (surface, body, line) flip between light and dark
          — toggle the theme in the navbar to see them move.
        </p>

        <SubHeading>Paper and ink</SubHeading>
        <Swatches
          items={[
            ["paper", "bg-paper"],
            ["paper-2", "bg-paper-2"],
            ["paper-3", "bg-paper-3"],
            ["ink", "bg-ink"],
            ["ink-2", "bg-ink-2"],
            ["ink-3", "bg-ink-3"],
          ]}
        />

        <SubHeading>Brand</SubHeading>
        <Swatches
          items={[
            ["brand-yellow", "bg-brand-yellow"],
            ["brand-blue", "bg-brand-blue"],
            ["brand-green", "bg-brand-green"],
            ["navy", "bg-navy"],
            ["sky", "bg-sky"],
            ["signal-red", "bg-signal-red"],
          ]}
        />

        <SubHeading>Event accents</SubHeading>
        <Swatches
          items={[
            ["eco", "bg-eco"],
            ["mint", "bg-mint"],
            ["purple", "bg-purple"],
            ["charcoal-panel", "bg-charcoal-panel"],
          ]}
        />

        <SubHeading>Semantic (theme-aware)</SubHeading>
        <Swatches
          items={[
            ["surface", "bg-surface"],
            ["surface-2", "bg-surface-2"],
            ["surface-3", "bg-surface-3"],
            ["panel", "bg-panel"],
          ]}
        />
      </Section>

      <Section title="Typography">
        <div className="flex flex-col gap-8">
          <div>
            <Label>Headline pair — solid over outline</Label>
            <Headline solid="Build what's" outline="Next" />
          </div>
          <div>
            <Label>Hero scale</Label>
            <Headline size="hero" solid="Ethos" outline="2026" />
          </div>
          <div>
            <Label>Title scale</Label>
            <Headline size="title" solid="What to expect?" />
          </div>
          <div>
            <Label>Eyebrow — Unbounded</Label>
            <SectionEyebrow>Presents</SectionEyebrow>
          </div>
          <div>
            <Label>Section heading — Oswald condensed</Label>
            <p className="font-condensed text-(length:--text-heading) font-semibold tracking-(--tracking-wide-label) uppercase">
              Why participate?
            </p>
          </div>
          <div>
            <Label>Body — Poppins</Label>
            <p className="max-w-prose">
              E-Cell JNTUH runs workshops, speaker sessions and competitions that put students in
              the room where decisions get made. Sentence case for UI text, caps for display
              headlines.
            </p>
            <p className="text-body-2 mt-2 max-w-prose text-sm">
              Secondary text uses body-2. Captions and metadata use body-3.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Logo lock-up">
        <p className="text-body-3 -mt-2 mb-6 max-w-2xl text-sm">
          The chevron mark is cropped straight out of the official logo by{" "}
          <code className="font-mono text-xs">pnpm extract-mark</code> and given a transparent
          background — never redrawn or recoloured. The wordmark beside it is live text, so it stays
          crisp at any size and follows the theme.
        </p>
        <div className="flex flex-col gap-8">
          <Lockup size="lg" />
          <Lockup size="md" />
          <Lockup size="sm" />
          <div className="flex items-center gap-6">
            <Mark size={64} />
            <Mark size={40} />
            <Mark size={28} />
          </div>
        </div>
      </Section>

      <Section title="Chevron motif">
        <p className="text-body-3 -mt-2 mb-6 max-w-2xl text-sm">
          Yellow pointing right, blue pointing left, meeting in the middle — two sides coming
          together. Used as dividers, bullets, button arrows and the scroll cue.
        </p>
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-6">
            <ChevronPair size={36} />
            <ChevronPair size={24} />
            <ChevronPair size={16} />
          </div>
          <div className="flex items-center gap-4">
            <ChevronTick tone="yellow" />
            <ChevronTick tone="blue" direction="left" />
          </div>
          <ChevronDivider />
          <div className="border-line-soft relative overflow-hidden rounded-(--radius-card) border p-8 text-center text-sm">
            <MarkWatermark size={180} />
            Mark watermark — used behind CTA panels
          </div>
        </div>
      </Section>

      <Section title="Colour bands">
        <p className="text-body-3 -mt-2 mb-6 max-w-2xl text-sm">
          Full-bleed bands that break up the paper. Each pairs a background with the one text colour
          that passes AA on it. Yellow is never used as text on paper — only as a fill.
        </p>
        <div className="flex flex-col gap-4">
          <div className="band-yellow rounded-(--radius-card) p-6">
            <p className="font-condensed text-(length:--text-heading) uppercase">Yellow band</p>
            <p className="mt-1 text-sm">Stats counter. Ink text on brand yellow.</p>
          </div>
          <div className="band-blue rounded-(--radius-card) p-6">
            <p className="font-condensed text-(length:--text-heading) uppercase">Blue band</p>
            <p className="mt-1 text-sm">Sponsor call to action. White text on brand blue.</p>
          </div>
          <div className="band-charcoal rounded-(--radius-card) p-6">
            <p className="font-condensed text-(length:--text-heading) uppercase">Charcoal band</p>
            <p className="mt-1 text-sm">ETHOS spotlight. Paper text on charcoal.</p>
          </div>
        </div>

        <div className="mt-8">
          <Label>Headline accents</Label>
          <Headline solid="Build what's" outline="Next" size="title" />
          <p className="mt-6 max-w-md text-lg">
            A <span className="highlight-yellow">yellow highlighter</span> behind a key word, or a{" "}
            <span className="accent-blue font-semibold">blue accent</span> on another.
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-col gap-6">
          <Row>
            <Button variant="primary">Primary</Button>
            <Button variant="ink">Ink</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </Row>
          <Row>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row>
            <ButtonLink href="/events">Internal link</ButtonLink>
            <ExternalButtonLink href="https://www.instagram.com/ecell_jntuh/">
              External link
            </ExternalButtonLink>
          </Row>
        </div>
      </Section>

      <Section title="Badges — computed event status">
        <Row>
          <Badge tone="open">Registrations open</Badge>
          <Badge tone="soon">Closing soon</Badge>
          <Badge tone="live">Live now</Badge>
          <Badge tone="closed">Registrations closed</Badge>
          <Badge tone="done">Completed</Badge>
          <Badge tone="neutral">Workshop</Badge>
          <Badge tone="accent">Accent</Badge>
        </Row>
      </Section>

      <Section title="Cards">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-condensed text-(length:--text-heading) uppercase">Static card</h3>
            <p className="text-body-2 mt-2 text-sm">
              Paper surface, 1.5px ink border, no hover state.
            </p>
          </Card>
          <Card interactive className="p-6">
            <h3 className="font-condensed text-(length:--text-heading) uppercase">Interactive</h3>
            <p className="text-body-2 mt-2 text-sm">
              Hover me — the card lifts and a hard offset shadow snaps in.
            </p>
          </Card>
          <Card surface="sunken" className="p-6">
            <h3 className="font-condensed text-(length:--text-heading) uppercase">Sunken</h3>
            <p className="text-body-2 mt-2 text-sm">For cards on an already-raised surface.</p>
          </Card>
        </div>
      </Section>

      <Section title="Poster motifs">
        <div className="grid gap-10 md:grid-cols-2">
          <Motif label="Parallelogram row — section divider">
            <ParallelogramRow className="text-body" />
          </Motif>

          <Motif label="Hazard stripe">
            <HazardStripe className="text-body max-w-xs" />
          </Motif>

          <Motif label="Cross grid / cross mark">
            <div className="flex items-center gap-6">
              <CrossGrid className="text-body-3" />
              <CrossMark className="text-signal-red size-6" />
            </div>
          </Motif>

          <Motif label="Pixel blocks">
            <PixelBlocks className="text-body" />
          </Motif>

          <Motif label="Wireframe globe">
            <div className="text-eco size-40">
              <WireGlobe />
            </div>
          </Motif>

          <Motif label="Wireframe torus">
            <div className="text-body size-40">
              <WireTorus />
            </div>
          </Motif>
        </div>
      </Section>

      <Section title="Panels and frames">
        <div className="grid gap-6 md:grid-cols-2">
          <DottedFrame>
            <h3 className="font-condensed text-(length:--text-heading) uppercase">Dotted frame</h3>
            <p className="text-body-2 mt-2 text-sm">
              The red dotted rounded frame that rings the key block on the ETHOS posters.
            </p>
          </DottedFrame>

          <InkPanel>
            <h3 className="font-condensed text-(length:--text-heading) uppercase">Ink panel</h3>
            <p className="mt-2 text-sm opacity-90">
              A dark grain panel holding light body copy, with a thin dotted inner border.
            </p>
          </InkPanel>
        </div>
      </Section>

      <Section title="Numbered pill cards">
        <div className="flex flex-col gap-4">
          <NumberedPill
            index={1}
            title="Speaker sessions and workshops"
            description="Discover bold ideas from inspiring speakers, then turn learning into action."
          />
          <NumberedPill
            index={2}
            side="right"
            title="Boardroom challenge"
            description="Debate people, planet and profit, and unravel the problem like an executive."
          />
        </div>
      </Section>

      <Section title="Event accent presets">
        <p className="text-body-3 -mt-2 mb-6 max-w-2xl text-sm">
          An event page sets <code className="font-mono text-xs">data-accent</code> on its wrapper
          and everything accent-coloured inside follows. Each preset holds AA contrast in both
          themes.
        </p>
        <div className="flex flex-wrap gap-3">
          {(["ink", "yellow", "blue", "eco", "red", "navy", "sky", "mint", "purple"] as const).map(
            (accent) => (
              <div key={accent} data-accent={accent}>
                <Button variant="accent" size="sm">
                  {accent}
                </Button>
              </div>
            ),
          )}
        </div>
      </Section>
    </div>
  );
}

/* ---------- local layout helpers, used only by this page ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line-soft mt-20 border-t pt-10">
      <h2 className="font-condensed mb-8 text-(length:--text-heading) tracking-(--tracking-wide-label) uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-body-3 mt-8 mb-3 text-xs font-semibold tracking-(--tracking-eyebrow) uppercase first:mt-0">
      {children}
    </h3>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-body-3 mb-2 font-mono text-xs tracking-(--tracking-wide-label) uppercase">
      {children}
    </p>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

function Motif({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="border-line-soft bg-surface-2 flex min-h-32 items-center justify-center rounded-(--radius-card) border p-6">
        {children}
      </div>
    </div>
  );
}

function Swatches({ items }: { items: [string, string][] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {items.map(([name, bg]) => (
        <div key={name}>
          <div className={`border-line-soft h-16 rounded-(--radius-card) border ${bg}`} />
          <p className="text-body-3 mt-1.5 font-mono text-xs">{name}</p>
        </div>
      ))}
    </div>
  );
}
