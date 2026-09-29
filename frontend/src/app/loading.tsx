/**
 * Shown while a route's content is still being fetched. It mirrors the final layout's
 * proportions so nothing jumps when the real content replaces it.
 */
export default function Loading() {
  return (
    <div className="container-site section-y" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>

      <div className="bg-surface-2 h-4 w-28 animate-pulse rounded-full" />
      <div className="bg-surface-2 mt-6 h-16 w-full max-w-2xl animate-pulse rounded-(--radius-card) md:h-24" />
      <div className="bg-surface-2 mt-3 h-16 w-3/4 max-w-xl animate-pulse rounded-(--radius-card) md:h-24" />

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="border-line-soft bg-surface-2 h-72 animate-pulse rounded-(--radius-card) border"
          />
        ))}
      </div>
    </div>
  );
}
