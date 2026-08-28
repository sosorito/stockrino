"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Copy, Eye, EyeOff, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

export function PostsTable({ posts }: { posts: any[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Blog post deleted.");
      router.refresh();
    } catch {
      toast.error("Could not delete post.");
    } finally {
      setBusyId(null);
      setConfirmDeleteId(null);
    }
  }

  async function handleDuplicate(id: number) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to duplicate");
      toast.success("Blog post duplicated as draft.");
      router.refresh();
    } catch {
      toast.error("Could not duplicate post.");
    } finally {
      setBusyId(null);
    }
  }

  async function toggleStatus(post: any) {
    setBusyId(post.id);
    const newStatus = post.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success(newStatus === "published" ? "Blog published." : "Blog unpublished.");
      router.refresh();
    } catch {
      toast.error("Could not update status.");
    } finally {
      setBusyId(null);
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 text-sm">
        No blog posts match your filters yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
            <th className="py-3 pr-4">Title</th>
            <th className="py-3 pr-4">Category</th>
            <th className="py-3 pr-4">Status</th>
            <th className="py-3 pr-4">Published</th>
            <th className="py-3 pr-4">Updated</th>
            <th className="py-3 pr-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-slate-50">
              <td className="py-3 pr-4 max-w-xs">
                <Link href={`/admin/posts/${post.id}/edit`} className="font-semibold text-slate-900 hover:text-navy-700 line-clamp-1">
                  {post.title}
                  {post.isDemo && (
                    <span className="ml-2 inline-block text-[10px] font-bold uppercase text-gold-700 bg-gold-100 rounded px-1.5 py-0.5 align-middle">
                      Demo
                    </span>
                  )}
                </Link>
              </td>
              <td className="py-3 pr-4 text-slate-500">{post.category?.name || "Uncategorized"}</td>
              <td className="py-3 pr-4">
                <StatusBadge status={post.status} />
              </td>
              <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                {post.status === "scheduled" ? `Scheduled: ${formatDate(post.scheduledAt)}` : formatDate(post.publishedAt) || "—"}
              </td>
              <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">{formatDate(post.updatedAt)}</td>
              <td className="py-3 pr-4">
                <div className="flex items-center justify-end gap-1">
                  {post.status === "published" && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View live"
                      className="p-1.5 rounded-md text-slate-400 hover:text-navy-700 hover:bg-slate-100"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <button
                    title={post.status === "published" ? "Unpublish" : "Publish"}
                    disabled={busyId === post.id}
                    onClick={() => toggleStatus(post)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-navy-700 hover:bg-slate-100 disabled:opacity-40"
                  >
                    {post.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    title="Edit"
                    className="p-1.5 rounded-md text-slate-400 hover:text-navy-700 hover:bg-slate-100"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    title="Duplicate"
                    disabled={busyId === post.id}
                    onClick={() => handleDuplicate(post.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-navy-700 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Copy size={15} />
                  </button>
                  <button
                    title="Delete"
                    disabled={busyId === post.id}
                    onClick={() => setConfirmDeleteId(post.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-slate-900 mb-2">Delete this blog post?</h3>
            <p className="text-sm text-slate-500 mb-5">
              This action cannot be undone. The post will be permanently removed.
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
