import { getSession } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/sidebar";

// Admin is always per-request (auth + live data); never prerendered.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <AdminSidebar userName={session?.name || "Admin"} />
      <div className="flex-1 min-w-0 bg-slate-50">
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">{children}</main>
      </div>
    </div>
  );
}
