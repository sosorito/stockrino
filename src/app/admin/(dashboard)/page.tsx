import Link from "next/link";
import { getDashboardStats } from "@/lib/data/posts";
import { StatCard, StatusBadge, Button } from "@/components/admin/ui";
import { formatDate } from "@/lib/utils";
import {
  FileText,
  CheckCircle2,
  PenLine,
  Clock,
  FolderKanban,
  Mail,
  Plus,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back. Here&apos;s what&apos;s happening on Stockrino.
          </p>
        </div>
        <Link href="/admin/posts/new">
          <Button>
            <Plus size={16} />
            Create Blog
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total Blogs" value={stats.total} icon={FileText} accent="navy" href="/admin/posts" />
        <StatCard
          label="Published"
          value={stats.published}
          icon={CheckCircle2}
          accent="green"
          href="/admin/posts?status=published"
        />
        <StatCard label="Drafts" value={stats.draft} icon={PenLine} accent="blue" href="/admin/posts?status=draft" />
        <StatCard
          label="Scheduled"
          value={stats.scheduled}
          icon={Clock}
          accent="gold"
          href="/admin/posts?status=scheduled"
        />
        <StatCard
          label="Categories"
          value={stats.categories}
          icon={FolderKanban}
          accent="navy"
          href="/admin/categories"
        />
        <StatCard
          label="Subscribers"
          value={stats.subscribers}
          icon={Mail}
          accent="red"
          href="/admin/newsletter"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Recent Activity</h3>
          <Link href="/admin/posts" className="text-sm font-semibold text-navy-700 hover:underline">
            View all posts
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {stats.recentPosts.length === 0 && (
            <p className="px-5 py-8 text-center text-slate-500 text-sm">No blog posts yet.</p>
          )}
          {stats.recentPosts.map((post: any) => (
            <Link
              key={post.id}
              href={`/admin/posts/${post.id}/edit`}
              className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-900 truncate">{post.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {post.category?.name || "Uncategorized"} &middot; Updated {formatDate(post.updatedAt)}
                </p>
              </div>
              <StatusBadge status={post.status} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
