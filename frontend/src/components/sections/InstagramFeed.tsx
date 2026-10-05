import Image from "next/image";
import { Play, Images } from "lucide-react";
import type { InstagramPost } from "@/content/schema";

/**
 * The Instagram grid.
 *
 * A server component with no client JavaScript: the images are ours (downloaded by the
 * sync script), the hover effect is CSS, and there is no Instagram embed script — which is
 * what keeps the JS budget and the `script-src 'self'` CSP intact.
 *
 * Videos and carousels render their still with a small badge, so a visitor knows a click
 * leads to something more than the one image they can see.
 */
export function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  return (
    <ul className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        <li key={post.id}>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            // The caption is the only description we have, so it names the link for screen
            // readers. Posts without one fall back to something honest rather than silent.
            aria-label={
              post.caption
                ? `Instagram post: ${post.caption.slice(0, 80)}`
                : "View this post on Instagram"
            }
            className="border-line group relative block aspect-square overflow-hidden rounded-(--radius-card) border-[1.5px]"
          >
            <Image
              src={post.image}
              alt={post.caption ? post.caption.slice(0, 120) : "A post from the club's Instagram"}
              width={post.width}
              height={post.height}
              sizes="(min-width: 1024px) 280px, 45vw"
              className="h-full w-full object-cover transition-transform duration-(--duration-slow) group-hover:scale-[1.04]"
            />

            {post.mediaType !== "IMAGE" ? (
              <span className="bg-ink/80 text-paper absolute top-2 right-2 grid size-7 place-items-center rounded-full">
                {post.mediaType === "VIDEO" ? (
                  <Play aria-hidden className="size-3.5" />
                ) : (
                  <Images aria-hidden className="size-3.5" />
                )}
                <span className="sr-only">
                  {post.mediaType === "VIDEO" ? "Video" : "Multiple photos"}
                </span>
              </span>
            ) : null}
          </a>
        </li>
      ))}
    </ul>
  );
}
