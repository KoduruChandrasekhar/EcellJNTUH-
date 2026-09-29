import { CrossGrid } from "@/components/brand/CrossGrid";
import { Headline } from "@/components/brand/Headline";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { Reveal } from "@/components/motion/Reveal";
import { TeamCard } from "@/components/sections/TeamCard";
import { TermSwitcher } from "@/components/sections/TermSwitcher";
import { getTeamByCategory, getTeamMeta, getTeamTerms } from "@/lib/data";

/**
 * The Team page body, shared by /team (current term) and /team/[term] (past committees).
 *
 * Both routes are statically generated — the term lives in the URL path rather than a
 * query string, which keeps every committee prerendered, linkable and crawlable.
 */
export async function TeamDirectory({ term }: { term: string }) {
  const [terms, meta, groups] = await Promise.all([
    getTeamTerms(),
    getTeamMeta(),
    getTeamByCategory(term),
  ]);

  return (
    <div className="container-site section-y">
      <Reveal>
        <SectionEyebrow>Who we are</SectionEyebrow>
        <Headline as="h1" solid="The" outline="Team" className="mt-3" />
        <p className="text-body-2 mt-6 max-w-xl text-balance">
          The committee behind E-Cell JNTUH.
        </p>
      </Reveal>

      {terms.length > 1 ? (
        <Reveal delay={60}>
          <TermSwitcher
            terms={terms}
            active={term}
            currentTerm={meta.currentTerm}
            className="mt-8"
          />
        </Reveal>
      ) : null}

      {groups.length > 0 ? (
        <div className="mt-12 flex flex-col gap-14">
          {/* Categories with nobody in them are dropped by the data layer, so an empty
              heading can never render. */}
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="font-condensed border-line border-b pb-3 text-(length:--text-heading) tracking-(--tracking-wide-label) uppercase">
                {group.label}
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {group.members.map((member, i) => (
                  <Reveal key={member.id} delay={i * 60}>
                    <TeamCard member={member} />
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-body-2 mt-12">No members listed for {term} yet.</p>
      )}

      {!meta.teamComplete && term === meta.currentTerm ? (
        <Reveal>
          <div className="border-line-soft mt-14 flex flex-col items-center rounded-(--radius-card) border border-dashed px-6 py-10 text-center">
            <CrossGrid cols={4} rows={1} className="text-body-3 opacity-30" />
            <p className="font-condensed mt-5 text-(length:--text-heading) uppercase">
              More team members coming soon
            </p>
            <p className="text-body-3 mt-2 max-w-sm text-sm">
              The rest of the {term} committee is being confirmed. This page updates as they are
              announced.
            </p>
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
