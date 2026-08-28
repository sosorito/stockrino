"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function BlogFilters({
  categories,
}: {
  categories: { name: string; slug: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParam("q", query.trim());
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center bg-surface border border-border rounded-xl p-4 shadow-card mb-8">
      <form onSubmit={handleSearch} className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles, companies, tickers..."
          className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
      </form>

      <select
        value={searchParams.get("category") || ""}
        onChange={(e) => updateParam("category", e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={searchParams.get("sort") || "latest"}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
      >
        <option value="latest">Sort: Latest First</option>
        <option value="oldest">Sort: Oldest First</option>
      </select>
    </div>
  );
}
