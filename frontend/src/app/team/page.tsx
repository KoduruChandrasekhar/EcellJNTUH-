import type { Metadata } from "next";
import { TeamDirectory } from "@/components/sections/TeamDirectory";
import { getTeamMeta } from "@/lib/data";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The students and faculty behind E-Cell, JNTU Hyderabad — the committee that runs ETHOS, Pitch Perfect and everything in between.",
};

export default async function TeamPage() {
  const { currentTerm } = await getTeamMeta();
  return <TeamDirectory term={currentTerm} />;
}
