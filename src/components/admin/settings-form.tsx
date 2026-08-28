"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, ImageIcon, X } from "lucide-react";
import { Card, Input, Textarea, Label, Button } from "@/components/admin/ui";
import { MediaPickerModal, type PickedMedia } from "@/components/admin/media-picker-modal";

interface SettingsData {
  siteName: string;
  tagline: string;
  description: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  socialTwitter: string | null;
  socialFacebook: string | null;
  socialLinkedin: string | null;
  socialYoutube: string | null;
  socialInstagram: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string | null;
  seoDefaultTitle: string | null;
  seoDefaultDescription: string | null;
  seoDefaultKeywords: string | null;
  siteUrl: string | null;
}

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const [faviconModalOpen, setFaviconModalOpen] = useState(false);

  function set<K extends keyof SettingsData>(key: K, value: SettingsData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Settings saved.");
      router.refresh();
    } catch {
      toast.error("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card title="General" description="Core branding information used across the site.">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Website Name</Label>
              <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} />
            </div>
            <div>
              <Label>Site URL</Label>
              <Input value={form.siteUrl || ""} onChange={(e) => set("siteUrl", e.target.value)} placeholder="https://stockrino.com" />
            </div>
          </div>
          <div>
            <Label>Tagline</Label>
            <Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
          </div>
          <div>
            <Label>Website Description</Label>
            <Textarea rows={3} value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Website Logo</Label>
              {form.logoUrl ? (
                <div className="relative w-32 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <Image src={form.logoUrl} alt="Logo" fill sizes="128px" className="object-contain" />
                  <button
                    onClick={() => set("logoUrl", "")}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <Button type="button" variant="secondary" onClick={() => setLogoModalOpen(true)}>
                  <ImageIcon size={14} /> Upload Logo
                </Button>
              )}
            </div>
            <div>
              <Label>Favicon</Label>
              {form.faviconUrl ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                  <Image src={form.faviconUrl} alt="Favicon" fill sizes="64px" className="object-contain" />
                  <button
                    onClick={() => set("faviconUrl", "")}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded p-0.5"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <Button type="button" variant="secondary" onClick={() => setFaviconModalOpen(true)}>
                  <ImageIcon size={14} /> Upload Favicon
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Note: the browser tab icon is generated automatically from the Stockrino brand mark. Uploading a
            custom favicon here stores it for use in your site&apos;s branding assets.
          </p>
        </div>
      </Card>

      <Card title="Social Media Links">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Twitter / X URL</Label>
            <Input value={form.socialTwitter || ""} onChange={(e) => set("socialTwitter", e.target.value)} placeholder="https://twitter.com/stockrino" />
          </div>
          <div>
            <Label>Facebook URL</Label>
            <Input value={form.socialFacebook || ""} onChange={(e) => set("socialFacebook", e.target.value)} placeholder="https://facebook.com/stockrino" />
          </div>
          <div>
            <Label>LinkedIn URL</Label>
            <Input value={form.socialLinkedin || ""} onChange={(e) => set("socialLinkedin", e.target.value)} placeholder="https://linkedin.com/company/stockrino" />
          </div>
          <div>
            <Label>YouTube URL</Label>
            <Input value={form.socialYoutube || ""} onChange={(e) => set("socialYoutube", e.target.value)} />
          </div>
          <div>
            <Label>Instagram URL</Label>
            <Input value={form.socialInstagram || ""} onChange={(e) => set("socialInstagram", e.target.value)} />
          </div>
        </div>
      </Card>

      <Card title="Contact Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Contact Email</Label>
            <Input value={form.contactEmail || ""} onChange={(e) => set("contactEmail", e.target.value)} />
          </div>
          <div>
            <Label>Contact Phone</Label>
            <Input value={form.contactPhone || ""} onChange={(e) => set("contactPhone", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Address</Label>
            <Input value={form.contactAddress || ""} onChange={(e) => set("contactAddress", e.target.value)} />
          </div>
        </div>
      </Card>

      <Card title="Default SEO Settings" description="Used site-wide and as a fallback for posts without custom SEO fields.">
        <div className="space-y-4">
          <div>
            <Label>Default SEO Title</Label>
            <Input value={form.seoDefaultTitle || ""} onChange={(e) => set("seoDefaultTitle", e.target.value)} />
          </div>
          <div>
            <Label>Default SEO Description</Label>
            <Textarea rows={3} value={form.seoDefaultDescription || ""} onChange={(e) => set("seoDefaultDescription", e.target.value)} />
          </div>
          <div>
            <Label>Default SEO Keywords</Label>
            <Input value={form.seoDefaultKeywords || ""} onChange={(e) => set("seoDefaultKeywords", e.target.value)} />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <MediaPickerModal
        open={logoModalOpen}
        onClose={() => setLogoModalOpen(false)}
        onSelect={(m: PickedMedia) => set("logoUrl", m.url)}
        title="Select Logo"
      />
      <MediaPickerModal
        open={faviconModalOpen}
        onClose={() => setFaviconModalOpen(false)}
        onSelect={(m: PickedMedia) => set("faviconUrl", m.url)}
        title="Select Favicon"
      />
    </div>
  );
}
