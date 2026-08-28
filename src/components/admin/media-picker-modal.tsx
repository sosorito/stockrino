"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { X, UploadCloud, ImageIcon, Search, Loader2 } from "lucide-react";
import { Button, Input, Textarea, Label } from "./ui";

export interface PickedMedia {
  id: number;
  url: string;
  title: string;
  altText: string;
  caption: string;
}

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  title = "Select Image",
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (media: PickedMedia) => void;
  title?: string;
}) {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [library, setLibrary] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<PickedMedia | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && tab === "library") {
      loadLibrary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tab]);

  async function loadLibrary(q?: string) {
    setLoadingLibrary(true);
    try {
      const res = await fetch(`/api/admin/media${q ? `?search=${encodeURIComponent(q)}` : ""}`);
      const data = await res.json();
      setLibrary(data.media || []);
    } finally {
      setLoadingLibrary(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setSelected({
        id: data.media.id,
        url: data.media.url,
        title: data.media.title,
        altText: data.media.altText,
        caption: data.media.caption,
      });
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function pickFromLibrary(m: any) {
    setSelected({
      id: m.id,
      url: m.url,
      title: m.title || "",
      altText: m.altText || "",
      caption: m.caption || "",
    });
  }

  async function handleInsert() {
    if (!selected) return;
    // persist any edits to alt/title/caption back to the media library record
    await fetch(`/api/admin/media/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: selected.title,
        altText: selected.altText,
        caption: selected.caption,
      }),
    }).catch(() => {});
    onSelect(selected);
    setSelected(null);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-100 px-5">
          <button
            onClick={() => setTab("upload")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px ${
              tab === "upload" ? "border-navy-800 text-navy-900" : "border-transparent text-slate-500"
            }`}
          >
            Upload New
          </button>
          <button
            onClick={() => setTab("library")}
            className={`px-4 py-3 text-sm font-semibold border-b-2 -mb-px ${
              tab === "library" ? "border-navy-800 text-navy-900" : "border-transparent text-slate-500"
            }`}
          >
            Media Library
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {tab === "upload" && !selected && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl py-16 cursor-pointer hover:border-navy-500 hover:bg-slate-50 transition-colors"
            >
              {uploading ? (
                <Loader2 className="animate-spin text-navy-700" size={32} />
              ) : (
                <UploadCloud size={32} className="text-slate-400 mb-3" />
              )}
              <p className="text-sm font-semibold text-slate-700">
                {uploading ? "Uploading..." : "Click to upload an image"}
              </p>
              <p className="text-xs text-slate-400 mt-1">JPEG, PNG, WebP, GIF, or SVG — up to 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {tab === "library" && !selected && (
            <div>
              <div className="relative mb-4">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    loadLibrary(e.target.value);
                  }}
                  placeholder="Search media..."
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
                />
              </div>
              {loadingLibrary ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin text-navy-700" size={28} />
                </div>
              ) : library.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">No images yet.</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {library.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => pickFromLibrary(m)}
                      className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 hover:border-navy-600 hover:ring-2 hover:ring-navy-200 transition-all"
                    >
                      <Image src={m.url} alt={m.altText || m.title || ""} fill sizes="150px" className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selected && (
            <div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 mb-4 bg-slate-100">
                <Image src={selected.url} alt={selected.altText || ""} fill sizes="600px" className="object-contain" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Image Title</Label>
                  <Input
                    value={selected.title}
                    onChange={(e) => setSelected({ ...selected, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Alt Text (for SEO &amp; accessibility)</Label>
                  <Input
                    value={selected.altText}
                    onChange={(e) => setSelected({ ...selected, altText: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label>Caption (optional)</Label>
                <Textarea
                  rows={2}
                  value={selected.caption}
                  onChange={(e) => setSelected({ ...selected, caption: e.target.value })}
                  placeholder="Displayed below the image"
                />
              </div>
              <div className="flex gap-3 mt-5">
                <Button variant="secondary" onClick={() => setSelected(null)}>
                  <ImageIcon size={15} /> Choose Different Image
                </Button>
                <Button onClick={handleInsert}>Insert Image</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
