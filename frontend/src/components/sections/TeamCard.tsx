import Image from "next/image";
import { LinkedinIcon } from "@/components/brand/SocialIcons";
import { Card } from "@/components/ui/card";
import type { TeamMember } from "@/content/schema";

/** Deterministic initials — "Sai Naishika Bollikonda" becomes "SB". */
function initials(name: string): string {
  const words = name.replace(/^(Dr|Mr|Mrs|Ms)\.?\s+/i, "").split(/\s+/);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * A team member.
 *
 * Photos are shown in full colour — these are people, and the greyscale-until-hover
 * treatment that suits poster artwork made the team page look washed out.
 *
 * Members without a photo get a brand-styled initials block — never a stock photo of a
 * stranger standing in for a real person.
 */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <Card interactive className="overflow-hidden">
      <div className="bg-surface-2 relative aspect-square w-full overflow-hidden">
        {member.photo ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 280px, (min-width: 640px) 30vw, 45vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-ink dark:bg-night-2 absolute inset-0 grid place-items-center">
            <span
              aria-hidden
              className="font-display text-brand-yellow text-5xl leading-none md:text-6xl"
            >
              {initials(member.name)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <h3 className="font-condensed text-base leading-tight uppercase">{member.name}</h3>
          <p className="text-body-3 mt-1 text-xs">{member.position}</p>
        </div>

        {member.linkedin ? (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="border-line text-body hover:bg-brand-blue hover:border-brand-blue relative grid size-9 shrink-0 place-items-center rounded-(--radius-pill) border transition-colors duration-(--duration-fast) hover:text-white"
          >
            <LinkedinIcon className="size-4" />
          </a>
        ) : null}
      </div>
    </Card>
  );
}
