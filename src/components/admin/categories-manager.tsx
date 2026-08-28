"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button, Input, Textarea, Label } from "@/components/admin/ui";
import { slugify } from "@/lib/utils";

interface CategoryRow {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
}

export function CategoriesManager({ initial }: { initial: CategoryRow[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  function openCreate() {
    setEditing(null);
    setForm({ name: "", slug: "", description: "" });
    setShowForm(true);
  }

  function openEdit(cat: CategoryRow) {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/admin/categories/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategories((prev) =>
          prev.map((c) => (c.id === editing.id ? { ...c, ...data.category } : c))
        );
        toast.success("Category updated.");
      } else {
        const res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setCategories((prev) => [...prev, { ...data.category, postCount: 0 }]);
        toast.success("Category created.");
      }
      setShowForm(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted.");
      router.refresh();
    } catch {
      toast.error("Could not delete category.");
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}>
          <Plus size={16} /> New Category
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
              <th className="py-3 px-5">Name</th>
              <th className="py-3 px-5">Slug</th>
              <th className="py-3 px-5">Description</th>
              <th className="py-3 px-5">Posts</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50">
                <td className="py-3 px-5 font-semibold text-slate-900">{cat.name}</td>
                <td className="py-3 px-5 text-slate-500 font-mono text-xs">/{cat.slug}</td>
                <td className="py-3 px-5 text-slate-500 max-w-xs truncate">{cat.description || "—"}</td>
                <td className="py-3 px-5 text-slate-500">{cat.postCount}</td>
                <td className="py-3 px-5">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-navy-700 hover:bg-slate-100"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(cat.id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">{editing ? "Edit Category" : "New Category"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  autoFocus
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: editing ? f.slug : slugify(name),
                    }));
                  }}
                  placeholder="e.g. Technology Stocks"
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                  placeholder="technology-stocks"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Short description shown on the category page"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                <Check size={15} /> {saving ? "Saving..." : editing ? "Save Changes" : "Create Category"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-slate-900 mb-2">Delete this category?</h3>
            <p className="text-sm text-slate-500 mb-5">
              Posts in this category will become uncategorized. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
