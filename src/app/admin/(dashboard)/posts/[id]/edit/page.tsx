import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPostById } from "@/lib/data/posts";
import { getAllCategories } from "@/lib/data/categories";
import { getSettings } from "@/lib/data/settings";
import { PostForm } from "@/components/admin/post-form";

export const metadata = { title: "Edit Blog" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, settings] = await Promise.all([
    getPostById(Number(id)),
    getAllCategories(),
    getSettings(),
  ]);

  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft size={15} /> Back to Blog Posts
      </Link>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Edit Blog Post</h1>
      <PostForm
        categories={categories}
        siteUrl={settings.siteUrl || ""}
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          featuredImage: post.featuredImage
            ? {
                id: post.featuredImage.id,
                url: post.featuredImage.url,
                title: post.featuredImage.title || "",
                altText: post.featuredImage.altText || "",
                caption: post.featuredImage.caption || "",
              }
            : null,
          categoryId: post.categoryId,
          status: post.status as any,
          scheduledAt: post.scheduledAt,
          isFeatured: post.isFeatured,
          isTrending: post.isTrending,
          tags: post.tags,
          seoTitle: post.seoTitle || "",
          seoDescription: post.seoDescription || "",
          seoKeywords: post.seoKeywords || "",
          canonicalUrl: post.canonicalUrl || "",
          ogTitle: post.ogTitle || "",
          ogDescription: post.ogDescription || "",
          ogImage: post.ogImage
            ? {
                id: post.ogImage.id,
                url: post.ogImage.url,
                title: post.ogImage.title || "",
                altText: post.ogImage.altText || "",
                caption: post.ogImage.caption || "",
              }
            : null,
        }}
      />
    </div>
  );
}
