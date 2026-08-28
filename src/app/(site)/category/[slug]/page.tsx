import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPosts } from "@/lib/data/posts";
import { getAllCategories, getCategoryBySlug } from "@/lib/data/categories";
import { ArticleCard } from "@/components/site/article-card";
import { BlogFilters } from "@/components/site/blog-filters";
import { Pagination } from "@/components/site/pagination";
import { getSettings } from "@/lib/data/settings";

export const revalidate = 30;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const settings = await getSettings();
  if (!category) return { title: "Category Not Found" };

  const title = `${category.name} News`;
  const description =
    category.description ||
    `Latest ${category.name} news, analysis, and updates from ${settings.siteName}.`;

  return {
    title,
    description,
    alternates: { canonical: `${settings.siteUrl}/category/${category.slug}` },
    openGraph: { title, description },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = sp.page ? parseInt(sp.page, 10) : 1;
  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPublishedPosts({
      page,
      limit: 9,
      categorySlug: slug,
      search: sp.q,
      sort: (sp.sort as "latest" | "oldest") || "latest",
    }),
    getAllCategories(),
  ]);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: category.name, item: `/category/${category.slug}` },
    ],
  };

  return (
    <div className="container-page py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-600 dark:text-gold-400">
          Category
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{category.name}</h1>
        {category.description && (
          <p className="text-muted mt-2 max-w-2xl">{category.description}</p>
        )}
        <p className="text-sm text-muted mt-2">
          {total} article{total === 1 ? "" : "s"} in this category
        </p>
      </div>

      <BlogFilters categories={categories} />

      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted">
          No articles published in this category yet.
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
        basePath={`/category/${slug}`}
        searchParams={sp}
      />
    </div>
  );
}
