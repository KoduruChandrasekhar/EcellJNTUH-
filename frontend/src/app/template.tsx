/**
 * A template is like a layout, except Next re-mounts it on every navigation — so any
 * animation on it replays each time the route changes. That makes it the idiomatic place
 * for a route entrance, with no client-side JavaScript involved at all.
 *
 * The animation itself lives in globals.css (`.page-enter`).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
