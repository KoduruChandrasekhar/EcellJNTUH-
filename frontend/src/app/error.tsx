"use client";

import { useEffect } from "react";
import { Headline } from "@/components/brand/Headline";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { HazardStripe } from "@/components/brand/HazardStripe";
import { Button, ButtonLink } from "@/components/ui/button";

/**
 * Next.js renders this when a page below it throws. It must be a client component —
 * it receives the error and a `reset` function that retries the failed render.
 */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only safe identifier to show: the real message may leak internals.
    console.error(error);
  }, [error]);

  return (
    <div className="container-site section-y flex flex-col items-center text-center">
      <HazardStripe className="text-signal-red mb-10 max-w-xs" />

      <SectionEyebrow>Something broke</SectionEyebrow>
      <Headline
        as="h1"
        size="display"
        align="center"
        solid="That didn't"
        outline="Work"
        className="mt-3"
      />

      <p className="text-body-2 mt-6 max-w-md text-balance">
        An unexpected error stopped this page from loading. Trying again usually fixes it.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
      </div>

      {error.digest ? (
        <p className="text-body-3 mt-8 font-mono text-xs">Reference: {error.digest}</p>
      ) : null}
    </div>
  );
}
