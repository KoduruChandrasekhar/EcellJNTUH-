import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The E-Cell lock-up: the official chevron mark, a hairline divider, and "E-CELL /
 * JNTU Hyderabad" as live text — the arrangement the club uses on its posters.
 *
 * The mark is `mark.png`, cropped straight out of the official logo by
 * `pnpm extract-mark` with its black background turned transparent. It is never redrawn
 * or recoloured. Because the background is transparent, it sits on paper or on night
 * equally well, and the wordmark beside it is real text that follows the theme — so it
 * stays crisp at any size instead of being a shrunken screenshot.
 */
const MARK = "/images/brand/mark.png";
const MARK_INTRINSIC = 512;

type LockupSize = "sm" | "md" | "lg";

/** Mark height in px per size. The wordmark scales with it. */
const markHeight: Record<LockupSize, number> = { sm: 38, md: 56, lg: 92 };

const wordmarkClass: Record<LockupSize, string> = {
  sm: "text-[0.9rem] leading-none",
  md: "text-[1.3rem] leading-none",
  lg: "text-[2rem] leading-none",
};

const subClass: Record<LockupSize, string> = {
  sm: "text-[0.6rem]",
  md: "text-[0.8rem]",
  lg: "text-[1.1rem]",
};

export function Lockup({
  size = "sm",
  showText = true,
  priority = false,
  className,
}: {
  size?: LockupSize;
  /** Hide the wordmark when space is tight — the mark alone still identifies the club. */
  showText?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const h = markHeight[size];

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={MARK}
        alt=""
        aria-hidden
        width={MARK_INTRINSIC}
        height={MARK_INTRINSIC}
        priority={priority}
        sizes={`${h * 2}px`}
        style={{ width: h, height: h }}
        className="shrink-0"
      />

      {showText ? (
        <>
          <span aria-hidden className="bg-line-soft h-[1.6em] w-px shrink-0" />
          <span className="font-body flex flex-col justify-center">
            <span className={cn("text-body font-bold tracking-tight", wordmarkClass[size])}>
              E-CELL
            </span>
            <span className={cn("text-body-2 font-medium", subClass[size])}>JNTU Hyderabad</span>
          </span>
        </>
      ) : null}
    </span>
  );
}

/** The lock-up as a link home. Used in the navbar and footer. */
export function LockupLink({
  size,
  showText,
  priority,
  className,
}: {
  size?: LockupSize;
  showText?: boolean;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="E-Cell JNTU Hyderabad — home"
      className={cn("inline-flex shrink-0 items-center rounded-sm", className)}
    >
      <Lockup size={size} showText={showText} priority={priority} />
    </Link>
  );
}

/** The mark on its own — loaders, favicons, decorative use. */
export function Mark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <Image
      src={MARK}
      alt=""
      aria-hidden
      width={MARK_INTRINSIC}
      height={MARK_INTRINSIC}
      sizes={`${size * 2}px`}
      style={{ width: size, height: size }}
      className={cn("shrink-0", className)}
    />
  );
}
