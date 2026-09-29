import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names.
 *
 * `clsx` flattens conditional class lists; `twMerge` then resolves Tailwind conflicts so the
 * last one wins — `cn("p-2", "p-4")` gives "p-4" rather than both. shadcn/ui components expect
 * this helper to exist at "@/lib/utils".
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
