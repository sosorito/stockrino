"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

export interface NavCategory {
  name: string;
  slug: string;
}

export function Header({
  siteName,
  categories,
}: {
  siteName: string;
  categories: NavCategory[];
}) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    ...categories.slice(0, 5).map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
  ];

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border">
      <div className="hidden sm:block border-b border-border bg-navy-950 text-navy-100 text-xs">
        <div className="container-page flex items-center justify-between py-1.5">
          <span className="tracking-wide">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            &middot; U.S. Markets Coverage
          </span>
          <span className="text-gold-400 font-medium">
            Daily USA Stock Market News &amp; Analysis
          </span>
        </div>
      </div>

      <div className="container-page flex items-center justify-between py-3.5">
        <Logo siteName={siteName} />

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "text-gold-600 bg-gold-50 dark:bg-gold-900/20 dark:text-gold-400"
                    : "text-foreground/80 hover:text-foreground hover:bg-surface-hover"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            {searchOpen ? (
              <form onSubmit={submitSearch} className="flex items-center">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                  placeholder="Search stocks, news, topics..."
                  className="w-64 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                />
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface-hover transition-colors"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          <ThemeToggle />

          <Link
            href="/blog"
            className="hidden md:inline-flex items-center rounded-lg bg-navy-900 dark:bg-gold-500 dark:text-navy-950 text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 dark:hover:bg-gold-400 transition-colors"
          >
            Read Latest News
          </Link>

          <button
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border"
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-page py-3 flex flex-col gap-1">
            <form onSubmit={submitSearch} className="mb-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search stocks, news, topics..."
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-surface-hover"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
