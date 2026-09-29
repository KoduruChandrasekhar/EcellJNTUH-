"use client";

import { useEffect, useState } from "react";
import { countdownParts } from "@/lib/dates";

/**
 * A live countdown to an event.
 *
 * The server can't know the visitor's clock, so it renders the *labels* and a stable
 * layout, and the numbers fill in on the client. That avoids both a hydration mismatch
 * and the layout shifting once the real values arrive.
 *
 * It removes itself once the target passes.
 */
export function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState<ReturnType<typeof countdownParts> | null>(null);

  useEffect(() => {
    const update = () => setParts(countdownParts(target));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (parts && parts.total <= 0) return null;

  const cells = [
    { label: "Days", value: parts?.days },
    { label: "Hours", value: parts?.hours },
    { label: "Minutes", value: parts?.minutes },
    { label: "Seconds", value: parts?.seconds },
  ];

  return (
    <ul className="flex gap-2 sm:gap-3">
      {cells.map((cell) => (
        <li
          key={cell.label}
          className="border-line bg-surface-3 min-w-16 rounded-(--radius-card) border-[1.5px] px-3 py-2 text-center sm:min-w-20"
        >
          <span className="font-display block text-2xl leading-none tabular-nums sm:text-3xl">
            {/* An em dash holds the width until the client supplies the number. */}
            {cell.value === undefined ? "—" : String(cell.value).padStart(2, "0")}
          </span>
          <span className="text-body-3 mt-1 block text-[0.625rem] tracking-(--tracking-wide-label) uppercase">
            {cell.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
