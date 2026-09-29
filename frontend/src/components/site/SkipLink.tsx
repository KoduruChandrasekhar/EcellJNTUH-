/**
 * Keyboard users land here first. It's off-screen until focused, then jumps to the
 * main content so nobody has to tab through the whole navbar on every page.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-ink text-brand-yellow focus:ring-brand-blue sr-only rounded-(--radius-pill) px-5 py-3 font-medium focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-(--z-index-loader) focus:ring-2"
    >
      Skip to content
    </a>
  );
}
