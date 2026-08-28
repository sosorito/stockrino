"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UploadCloud, Search, Copy, Trash2, Pencil, X, Check, Loader2 } from "lucide-react";
import { Button, Input, Textarea, Label } from "@/components/admin/ui";
import { formatDateShort } from "@/lib/utils";

interface MediaRow {
  id: number;
  url: string;
  filename: string;
  title: string | null;
  altText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  createdAt: string;
}

export function MediaLibrary({ initial }: { initial: MediaRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<MediaRow | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.title?.toLowerCase().includes(q) ||
      m.filename.toLowerCase().includes(q) ||
      m.altText?.toLowerCase().includes(q)
    );
  });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setItems((prev) => [data.media, ...prev]);
      }
      toast.success("Image(s) uploaded successfully.");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleCopyUrl(url: string) {
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
    await navigator.clipboard.writeText(fullUrl);
    toast.success("Image URL copied to clipboard.");
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/media/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          altText: editing.altText,
          caption: editing.caption,
        }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.map((m) => (m.id === editing.id ? editing : m)));
      toast.success("Image details updated.");
      setEditing(null);
      router.refresh();
    } catch {
      toast.error("Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((prev) => prev.filter((m) => m.id !== id));
      toast.success("Image deleted.");
      router.refresh();
    } catch {
      toast.error("Could not delete image.");
    } finally {
      setConfirmDeleteId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media by title, filename, or alt text..."
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
          />
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
          {uploading ? "Uploading..." : "Upload Images"}
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400 text-sm bg-white rounded-xl border border-slate-200">
          No images found. Upload your first image to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((m) => (
            <div key={m.id} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-square bg-slate-100">
                <Image src={m.url} alt={m.altText || m.title || ""} fill sizes="200px" className="object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setEditing(m)}
                    title="Edit details"
                    className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(m.url)}
                    title="Copy URL"
                    className="p-2 rounded-lg bg-white/90 hover:bg-white text-slate-700"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(m.id)}
                    title="Delete"
                    className="p-2 rounded-lg bg-white/90 hover:bg-red-500 hover:text-white text-slate-700"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-slate-700 truncate">{m.title || m.filename}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {m.width && m.height ? `${m.width}×${m.height} · ` : ""}
                  {formatDateShort(m.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Edit Image Details</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 mb-4 bg-slate-100">
              <Image src={editing.url} alt="" fill sizes="400px" className="object-contain" />
            </div>
            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label>Alt Text</Label>
                <Input value={editing.altText || ""} onChange={(e) => setEditing({ ...editing, altText: e.target.value })} />
              </div>
              <div>
                <Label>Caption</Label>
                <Textarea rows={2} value={editing.caption || ""} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={saving}>
                <Check size={15} /> {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="font-bold text-slate-900 mb-2">Delete this image?</h3>
            <p className="text-sm text-slate-500 mb-5">
              This will remove the image from your media library. Posts using it may show a broken image.
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
