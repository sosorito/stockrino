import { getAllCategories } from "@/lib/data/categories";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Categories</h1>
        <p className="text-slate-500 text-sm mt-1">Organize your blog posts into categories.</p>
      </div>
      <CategoriesManager initial={categories as any} />
    </div>
  );
}
