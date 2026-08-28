import type { Metadata } from "next";
import { searchPosts } from "@/lib/data/posts";
import { ArticleCard } from "@/components/site/article-card";
import { SearchBox } from "@/components/site/search-box";
import { Search as SearchIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();
  const results = query ? await searchPosts(query, 24) : [];

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 mb-4">
          <SearchIcon className="text-gold-500" size={26} />
          Search Stockrino
        </h1>
        <SearchBox initialQuery={query} />
      </div>

      {query && (
        <p className="text-muted mb-6">
          {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
        </p>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-20 text-muted">
          No articles matched your search. Try different keywords, a company name, or a ticker.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((post: any) => (
          <ArticleCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
