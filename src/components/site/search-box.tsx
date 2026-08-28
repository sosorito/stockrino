"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBox({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search companies, tickers, topics..."
        className="w-full rounded-xl border border-border bg-surface pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-card"
      />
    </form>
  );
}
