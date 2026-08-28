import { getSettings } from "@/lib/data/settings";
import { getAllCategories } from "@/lib/data/categories";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

// Rendered per-request (reads live data from Postgres). Applies to every page
// under (site) so a fresh database isn't required at build time.
export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getAllCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header siteName={settings.siteName} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} />
    </div>
  );
}
