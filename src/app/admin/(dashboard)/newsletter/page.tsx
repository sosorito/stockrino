import { getAllSubscribers } from "@/lib/data/newsletter";
import { NewsletterTable } from "@/components/admin/newsletter-table";

export const metadata = { title: "Newsletter Subscribers" };

export default async function AdminNewsletterPage() {
  const subscribers = await getAllSubscribers();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900">Newsletter Subscribers</h1>
        <p className="text-slate-500 text-sm mt-1">Everyone who has subscribed via the Stockrino newsletter form.</p>
      </div>
      <NewsletterTable initial={subscribers as any} />
    </div>
  );
}
