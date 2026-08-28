import Link from "next/link";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils";
import type { PostCardData } from "@/lib/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80";

export function ArticleCard({
  post,
  variant = "default",
}: {
  post: PostCardData;
  variant?: "default" | "compact" | "featured";
}) {
  const image = post.featuredImage?.url || FALLBACK_IMAGE;
  const date = formatDateShort(post.publishedAt || post.createdAt);

  if (variant === "compact") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group flex gap-3 items-start"
      >
        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={image}
            alt={post.featuredImage?.altText || post.title}
            fill
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="min-w-0">
          {post.category && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gold-600 dark:text-gold-400">
              {post.category.name}
            </span>
          )}
          <h4 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
            {post.title}
          </h4>
          <span className="text-xs text-muted">{date}</span>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-shadow h-full"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt={post.featuredImage?.altText || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          {post.category && (
            <span className="absolute top-4 left-4 rounded-full bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1">
              {post.category.name}
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="text-white text-xl sm:text-2xl font-bold leading-tight line-clamp-3 group-hover:text-gold-300 transition-colors">
              {post.title}
            </h3>
            <span className="text-white/70 text-xs mt-2 inline-block">{date}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-shadow h-full"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={image}
          alt={post.featuredImage?.altText || post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {post.category && (
          <span className="absolute top-3 left-3 rounded-full bg-navy-900/90 text-white text-[11px] font-semibold px-2.5 py-1">
            {post.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-muted mt-2 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between text-xs text-muted">
          <span>{date}</span>
          <span className="font-semibold text-gold-600 dark:text-gold-400 group-hover:underline">
            Read More
          </span>
        </div>
      </div>
    </Link>
  );
}
