import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamDirectory } from "@/components/sections/TeamDirectory";
import { getTeamMeta, getTeamTerms } from "@/lib/data";

/**
 * `generateStaticParams` tells Next which terms exist, so every past committee is built
 * to static HTML at build time instead of being rendered per request.
 */
export async function generateStaticParams() {
  const [terms, { currentTerm }] = await Promise.all([getTeamTerms(), getTeamMeta()]);
  // The current term is served by /team, so it isn't duplicated here.
  return terms.filter((term) => term !== currentTerm).map((term) => ({ term }));
}

// In Next 16 route params arrive as a promise, so they're awaited before use.
export async function generateMetadata({ params }: PageProps<"/team/[term]">): Promise<Metadata> {
  const { term } = await params;
  return {
    title: `Team ${term}`,
    description: `The ${term} committee of E-Cell, JNTU Hyderabad.`,
  };
}

export default async function TeamTermPage({ params }: PageProps<"/team/[term]">) {
  const { term } = await params;
  const terms = await getTeamTerms();

  if (!terms.includes(term)) notFound();

  return <TeamDirectory term={term} />;
}
