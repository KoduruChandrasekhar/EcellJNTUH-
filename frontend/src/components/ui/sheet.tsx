"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The slide-in panel used for the mobile menu.
 *
 * Built directly on Radix's Dialog primitive, which supplies the accessibility behaviour
 * we'd otherwise have to hand-roll: focus moves into the panel on open and returns to the
 * trigger on close, focus is trapped while it's open, Escape closes it, and the rest of
 * the page is hidden from screen readers.
 */

export const Sheet = DialogPrimitive.Root;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  children,
  className,
  title,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  /** Required by Radix for the accessible name; visually hidden. */
  title: string;
  description?: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "bg-ink/60 fixed inset-0 z-(--z-index-overlay) backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "bg-surface border-line fixed inset-y-0 right-0 z-(--z-index-overlay)",
          "flex w-[min(22rem,88vw)] flex-col border-l-[1.5px] p-6",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-right",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right",
          "duration-(--duration-base)",
          className,
        )}
      >
        <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">
          {description ?? title}
        </DialogPrimitive.Description>

        <DialogPrimitive.Close
          aria-label="Close menu"
          className="border-line text-body hover:bg-surface-2 ml-auto grid size-11 place-items-center rounded-(--radius-pill) border-[1.5px] transition-colors duration-(--duration-fast)"
        >
          <X aria-hidden className="size-5" />
        </DialogPrimitive.Close>

        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
