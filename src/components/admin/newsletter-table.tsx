"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2, Download } from "lucide-react";
import { Button } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: string;
}

export function NewsletterTable({ initial }: { initial: Subscriber[] }) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState(initial);

  async function handleDelete(id: number) {
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      toast.success("Subscriber removed.");
      router.refresh();
    } catch {
      toast.error("Could not remove subscriber.");
    }
  }

  function handleExport() {
    const rows = [["Email", "Subscribed At"], ...subscribers.map((s) => [s.email, s.subscribedAt])];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stockrino-newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-slate-500">{subscribers.length} total subscribers</p>
        <Button variant="secondary" onClick={handleExport} disabled={subscribers.length === 0}>
          <Download size={15} /> Export CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
              <th className="py-3 px-5">Email</th>
              <th className="py-3 px-5">Subscribed</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-12 text-slate-400">
                  No subscribers yet.
                </td>
              </tr>
            )}
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="py-3 px-5 font-medium text-slate-900">{s.email}</td>
                <td className="py-3 px-5 text-slate-500">{formatDate(s.subscribedAt)}</td>
                <td className="py-3 px-5 text-right">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
