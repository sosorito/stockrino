"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export function PostsFilterBar({
  categories,
}: {
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("search", search.trim());
        }}
        className="relative flex-1"
      >
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blog posts..."
          className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy-700"
        />
      </form>

      <select
        value={searchParams.get("status") || "all"}
        onChange={(e) => updateParam("status", e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-700"
      >
        <option value="all">All Statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
      </select>

      <select
        value={searchParams.get("categoryId") || ""}
        onChange={(e) => updateParam("categoryId", e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-700"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
