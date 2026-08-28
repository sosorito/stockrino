import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/data/posts";
import { getAllCategories } from "@/lib/data/categories";
import { ArticleCard } from "@/components/site/article-card";
import { BlogFilters } from "@/components/site/blog-filters";
import { Pagination } from "@/components/site/pagination";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "Latest USA Stock Market News & Blog",
  description:
    "Browse all Stockrino articles covering USA stock market news, S&P 500, Nasdaq, Dow Jones, earnings, Federal Reserve updates, and more.",
  alternates: { canonical: "/blog" },
};

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page, 10) : 1;
  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPublishedPosts({
      page,
      limit: 9,
      categorySlug: sp.category,
      search: sp.q,
      sort: (sp.sort as "latest" | "oldest") || "latest",
    }),
    getAllCategories(),
  ]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
          <Newspaper className="text-gold-500" size={28} />
          Stock Market Blog
        </h1>
        <p className="text-muted mt-2">
          {total} article{total === 1 ? "" : "s"} covering the U.S. stock market, earnings, and financial insights.
        </p>
      </div>

      <BlogFilters categories={categories} />

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted">
          No articles found. Try a different search or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/blog"
        searchParams={sp}
      />
    </div>
  );
}
