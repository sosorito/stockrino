"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  ImageIcon,
  X,
  Save,
  Search as SearchIcon,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { MediaPickerModal, type PickedMedia } from "@/components/admin/media-picker-modal";
import { Button, Input, Textarea, Select, Label, Card } from "@/components/admin/ui";
import { slugify, formatDateTimeLocal } from "@/lib/utils";

export interface CategoryOption {
  id: number;
  name: string;
}

export interface PostFormInitialData {
  id?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: PickedMedia | null;
  categoryId?: number | null;
  status?: "draft" | "published" | "scheduled";
  scheduledAt?: string | null;
  isFeatured?: boolean;
  isTrending?: boolean;
  tags?: { name: string }[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: PickedMedia | null;
}

export function PostForm({
  categories,
  initial,
  siteUrl,
}: {
  categories: CategoryOption[];
  initial?: PostFormInitialData;
  siteUrl: string;
}) {
  const router = useRouter();
  const isEdit = !!initial?.id;

  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [content, setContent] = useState(initial?.content || "");
  const [featuredImage, setFeaturedImage] = useState<PickedMedia | null>(initial?.featuredImage || null);
  const [categoryId, setCategoryId] = useState<string>(initial?.categoryId ? String(initial.categoryId) : "");
  const [tagsInput, setTagsInput] = useState((initial?.tags || []).map((t) => t.name).join(", "));
  const [status, setStatus] = useState<"draft" | "published" | "scheduled">(initial?.status || "draft");
  const [scheduledAt, setScheduledAt] = useState(formatDateTimeLocal(initial?.scheduledAt));
  const [isFeatured, setIsFeatured] = useState(!!initial?.isFeatured);
  const [isTrending, setIsTrending] = useState(!!initial?.isTrending);

  const [seoTitle, setSeoTitle] = useState(initial?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initial?.seoDescription || "");
  const [seoKeywords, setSeoKeywords] = useState(initial?.seoKeywords || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initial?.canonicalUrl || "");
  const [ogTitle, setOgTitle] = useState(initial?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(initial?.ogDescription || "");
  const [ogImage, setOgImage] = useState<PickedMedia | null>(initial?.ogImage || null);

  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);
  const [ogModalOpen, setOgModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error("Please add a blog title.");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      toast.error("Please add some blog content.");
      return;
    }
    if (status === "scheduled" && !scheduledAt) {
      toast.error("Please choose a date and time to schedule this post.");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      slug,
      excerpt,
      content,
      featuredImageId: featuredImage?.id ?? null,
      categoryId: categoryId ? Number(categoryId) : null,
      status,
      scheduledAt: status === "scheduled" ? new Date(scheduledAt).toISOString() : null,
      isFeatured,
      isTrending,
      tagNames: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      seoTitle,
      seoDescription,
      seoKeywords,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImageId: ogImage?.id ?? null,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/posts/${initial!.id}` : "/api/admin/posts", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save post.");

      toast.success(
        status === "published"
          ? "Blog published successfully!"
          : status === "scheduled"
          ? "Blog scheduled successfully!"
          : "Blog saved as draft."
      );
      router.push("/admin/posts");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  const displaySeoTitle = seoTitle || title || "Your blog title appears here";
  const displaySeoDesc = seoDescription || excerpt || "Your meta description will appear here in search results.";
  const displayUrl = `${siteUrl}/blog/${slug || "your-post-slug"}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Basic Information">
          <div className="space-y-4">
            <div>
              <Label>Blog Title</Label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. S&P 500 Hits Record High as Tech Stocks Rally"
              />
            </div>
            <div>
              <Label>URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">/blog/</span>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugTouched(true);
                  }}
                  placeholder="auto-generated-from-title"
                />
              </div>
            </div>
            <div>
              <Label>Short Description / Excerpt</Label>
              <Textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary shown on cards and search results. Auto-generated from content if left blank."
              />
            </div>
          </div>
        </Card>

        <Card title="Blog Content">
          <RichTextEditor content={content} onChange={setContent} />
        </Card>

        <Card title="SEO Settings" description="Control how this article appears in search engines and social shares.">
          <div className="space-y-4">
            <div>
              <Label>SEO Meta Title</Label>
              <Input
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder={title || "Defaults to blog title"}
              />
            </div>
            <div>
              <Label>SEO Meta Description</Label>
              <Textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Defaults to excerpt"
              />
            </div>
            <div>
              <Label>SEO Keywords (comma separated)</Label>
              <Input
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                placeholder="S&P 500, stock market, Wall Street"
              />
            </div>
            <div>
              <Label>Canonical URL</Label>
              <Input
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder={displayUrl}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <Label>Open Graph Title</Label>
                <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder={title} />
              </div>
              <div>
                <Label>Open Graph Description</Label>
                <Input
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder={excerpt}
                />
              </div>
            </div>

            <div>
              <Label>Open Graph Image</Label>
              {ogImage ? (
                <div className="relative w-40 aspect-video rounded-lg overflow-hidden border border-slate-200">
                  <Image src={ogImage.url} alt="" fill sizes="160px" className="object-cover" />
                  <button
                    onClick={() => setOgImage(null)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <Button type="button" variant="secondary" onClick={() => setOgModalOpen(true)}>
                  <ImageIcon size={14} /> Choose Image
                </Button>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-2">
                <SearchIcon size={12} /> Google Search Preview
              </div>
              <div className="text-[#1a0dab] text-lg leading-tight truncate">{displaySeoTitle}</div>
              <div className="text-[#006621] text-xs mt-0.5">{displayUrl}</div>
              <div className="text-sm text-slate-600 mt-1 line-clamp-2">{displaySeoDesc}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card title="Publish">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(["draft", "published", "scheduled"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`rounded-lg border py-2 text-xs font-semibold capitalize transition-colors ${
                    status === s
                      ? "bg-navy-900 text-white border-navy-900"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {s === "published" ? "Publish Now" : s}
                </button>
              ))}
            </div>

            {status === "scheduled" && (
              <div>
                <Label>Schedule Date &amp; Time</Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
            )}

            <Button className="w-full" onClick={handleSave} disabled={saving}>
              <Save size={15} />
              {saving
                ? "Saving..."
                : isEdit
                ? "Update Blog"
                : status === "published"
                ? "Publish Now"
                : status === "scheduled"
                ? "Schedule Post"
                : "Save as Draft"}
            </Button>

            <div className="flex flex-col gap-2.5 pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="rounded" />
                <Star size={14} className="text-gold-500" /> Mark as Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="rounded" />
                <TrendingUp size={14} className="text-emerald-500" /> Mark as Trending
              </label>
            </div>
          </div>
        </Card>

        <Card title="Featured Image">
          {featuredImage ? (
            <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-200">
              <Image src={featuredImage.url} alt={featuredImage.altText} fill sizes="400px" className="object-cover" />
              <button
                onClick={() => setFeaturedImage(null)}
                className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-lg p-1.5"
              >
                <X size={14} />
              </button>
              <button
                onClick={() => setFeaturedModalOpen(true)}
                className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              onClick={() => setFeaturedModalOpen(true)}
              className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-slate-300 hover:border-navy-500 hover:bg-slate-50 transition-colors"
            >
              <ImageIcon size={24} className="text-slate-400 mb-2" />
              <span className="text-sm font-medium text-slate-600">Set Featured Image</span>
            </button>
          )}
        </Card>

        <Card title="Category">
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Card>

        <Card title="Tags">
          <Input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. S&P 500, Wall Street, Earnings"
          />
          <p className="text-xs text-slate-400 mt-2">Separate tags with commas.</p>
        </Card>

        <div className="rounded-xl border border-gold-200 bg-gold-50 p-4 flex gap-3">
          <Sparkles size={18} className="text-gold-600 shrink-0 mt-0.5" />
          <p className="text-xs text-gold-800 leading-relaxed">
            Tip: Add a compelling featured image and a clear SEO title to improve click-through rates
            from search and social media.
          </p>
        </div>
      </div>

      <MediaPickerModal
        open={featuredModalOpen}
        onClose={() => setFeaturedModalOpen(false)}
        onSelect={(m) => setFeaturedImage(m)}
        title="Select Featured Image"
      />
      <MediaPickerModal
        open={ogModalOpen}
        onClose={() => setOgModalOpen(false)}
        onSelect={(m) => setOgImage(m)}
        title="Select Open Graph Image"
      />
    </div>
  );
}
