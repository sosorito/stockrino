import Link from "next/link";
import { Plus } from "lucide-react";
import { getAllPostsAdmin } from "@/lib/data/posts";
import { getAllCategories } from "@/lib/data/categories";
import { Button, Card } from "@/components/admin/ui";
import { PostsFilterBar } from "@/components/admin/posts-filter-bar";
import { PostsTable } from "@/components/admin/posts-table";
import { Pagination } from "@/components/site/pagination";

export const metadata = { title: "Blog Posts" };

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const page = sp.page ? parseInt(sp.page, 10) : 1;

  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getAllPostsAdmin({
      page,
      limit: 15,
      search: sp.search,
      status: sp.status,
      categoryId: sp.categoryId ? Number(sp.categoryId) : undefined,
    }),
    getAllCategories(),
  ]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Blog Posts</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total blog posts</p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus size={16} /> Create Blog
          </Button>
        </Link>
      </div>

      <Card>
        <PostsFilterBar categories={categories} />
        <PostsTable posts={posts} />
      </Card>

      <Pagination page={page} totalPages={totalPages} basePath="/admin/posts" searchParams={sp} />
    </div>
  );
}
