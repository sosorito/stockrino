"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Images,
  Mail,
  Settings,
  LogOut,
  LineChart,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderKanban },
  { href: "/admin/media", label: "Media Library", icon: Images },
  { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const content = (
    <>
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <span className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950">
          <LineChart size={18} strokeWidth={2.5} />
        </span>
        <div>
          <div className="font-bold text-white text-sm leading-tight">Stockrino</div>
          <div className="text-navy-400 text-[11px]">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-gold-500 text-navy-950"
                  : "text-navy-200 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon size={17} />
              {link.label}
            </Link>
          );
        })}

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-200 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink size={17} />
          View Website
        </a>
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <div className="text-xs text-navy-400">Signed in as</div>
          <div className="text-sm text-white font-medium truncate">{userName}</div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-navy-200 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="lg:hidden flex items-center justify-between bg-navy-950 px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950">
            <LineChart size={16} strokeWidth={2.5} />
          </span>
          <span className="font-bold text-white text-sm">Stockrino Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="text-white p-1.5 rounded-lg hover:bg-white/10"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-navy-950 flex flex-col border-b border-white/10">{content}</div>
      )}

      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-navy-950 min-h-screen sticky top-0">
        {content}
      </aside>
    </>
  );
}
