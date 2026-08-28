import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, incrementViewCount } from "@/lib/data/posts";
import { getSettings } from "@/lib/data/settings";
import { ArticleCard } from "@/components/site/article-card";
import { ShareButtons } from "@/components/site/share-buttons";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock, User, ChevronRight, RefreshCw } from "lucide-react";
import { readingTime } from "@/lib/utils";

export const revalidate = 30;

async function getData(slug: string) {
  const post = await getPostBySlug(slug);
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getData(slug);
  const settings = await getSettings();
  if (!post) return { title: "Article Not Found" };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "";
  const canonical = post.canonicalUrl || `${settings.siteUrl}/blog/${post.slug}`;
  const ogImage = post.ogImage?.url || post.featuredImage?.url;

  return {
    title,
    description,
    keywords: post.seoKeywords ? post.seoKeywords.split(",").map((k: string) => k.trim()) : undefined,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || undefined,
      section: post.category?.name,
      tags: (post.tags || []).map((t: any) => t.name),
    },
    twitter: {
      card: "summary_large_image",
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getData(slug);
  if (!post) notFound();

  const settings = await getSettings();
  incrementViewCount(post.id).catch(() => {});

  const related = await getRelatedPosts(post.id, post.categoryId, 3);
  const url = `${settings.siteUrl}/blog/${post.slug}`;
  const mins = readingTime(post.content);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: [{ "@type": "Person", name: post.author?.name || settings.siteName }],
    publisher: {
      "@type": "Organization",
      name: settings.siteName,
      logo: { "@type": "ImageObject", url: `${settings.siteUrl}/icon` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: settings.siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${settings.siteUrl}/blog` },
      post.category
        ? {
            "@type": "ListItem",
            position: 3,
            name: post.category.name,
            item: `${settings.siteUrl}/category/${post.category.slug}`,
          }
        : undefined,
      {
        "@type": "ListItem",
        position: post.category ? 4 : 3,
        name: post.title,
        item: url,
      },
    ].filter(Boolean),
  };

  return (
    <article className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-muted mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gold-600 dark:hover:text-gold-400">Home</Link>
        <ChevronRight size={14} />
        <Link href="/blog" className="hover:text-gold-600 dark:hover:text-gold-400">Blog</Link>
        {post.category && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/category/${post.category.slug}`}
              className="hover:text-gold-600 dark:hover:text-gold-400"
            >
              {post.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="max-w-3xl mx-auto">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-block rounded-full bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1 mb-4"
          >
            {post.category.name}
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-5">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted mb-6 pb-6 border-b border-border">
          <span className="flex items-center gap-1.5">
            <User size={14} /> {post.author?.name || settings.siteName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> Published {formatDate(post.publishedAt)}
          </span>
          {post.updatedAt && post.publishedAt && post.updatedAt !== post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <RefreshCw size={14} /> Updated {formatDate(post.updatedAt)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={14} /> {mins} min read
          </span>
        </div>

        {post.featuredImage?.url && (
          <figure className="mb-8">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden">
              <Image
                src={post.featuredImage.url}
                alt={post.featuredImage.altText || post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            {post.featuredImage.caption && (
              <figcaption className="text-center text-xs text-muted mt-2">
                {post.featuredImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        <div
          className="prose-stockrino"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((tag: any) => (
              <span
                key={tag.id}
                className="text-xs font-medium rounded-full border border-border px-3 py-1 text-muted"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <span className="text-sm font-semibold">Share this article</span>
          <ShareButtons url={url} title={post.title} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="max-w-5xl mx-auto mt-16">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p: any) => (
              <ArticleCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
