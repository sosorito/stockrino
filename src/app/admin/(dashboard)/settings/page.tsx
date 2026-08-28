import { getSettings } from "@/lib/data/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your Stockrino brand, contact info, and default SEO.</p>
      </div>
      <div className="max-w-3xl">
        <SettingsForm initial={settings as any} />
      </div>
    </div>
  );
}
