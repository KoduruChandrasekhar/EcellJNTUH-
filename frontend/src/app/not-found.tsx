import { Headline } from "@/components/brand/Headline";
import { SectionEyebrow } from "@/components/brand/SectionEyebrow";
import { CrossGrid } from "@/components/brand/CrossGrid";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-site section-y relative flex flex-col items-center text-center">
      <CrossGrid cols={5} rows={2} className="text-body-3 mb-8 opacity-30" />

      <SectionEyebrow>Error 404</SectionEyebrow>
      <Headline
        as="h1"
        size="hero"
        align="center"
        solid="Page not"
        outline="Found"
        className="mt-3"
      />

      <p className="text-body-2 mt-6 max-w-md text-balance">
        This page has either moved, or it never existed. Either way, there&apos;s plenty happening
        elsewhere.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/events" variant="secondary">
          See our events
        </ButtonLink>
      </div>
    </div>
  );
}
