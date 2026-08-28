import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllCategories } from "@/lib/data/categories";
import { getSettings } from "@/lib/data/settings";
import { PostForm } from "@/components/admin/post-form";

export const metadata = { title: "Create Blog" };

export default async function NewPostPage() {
  const [categories, settings] = await Promise.all([getAllCategories(), getSettings()]);

  return (
    <div>
      <Link href="/admin/posts" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft size={15} /> Back to Blog Posts
      </Link>
      <h1 className="text-2xl font-extrabold text-slate-900 mb-6">Create New Blog Post</h1>
      <PostForm categories={categories} siteUrl={settings.siteUrl || ""} />
    </div>
  );
}
