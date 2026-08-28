import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function buildHref(p: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (v && k !== "page") params.set(k, v);
    });
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border",
          page === 1 ? "pointer-events-none opacity-40" : "hover:bg-surface-hover"
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {start > 1 && (
        <>
          <Link href={buildHref(1)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface-hover text-sm">
            1
          </Link>
          {start > 2 && <span className="text-muted">...</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(p)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium",
            p === page
              ? "bg-navy-900 text-white border-navy-900 dark:bg-gold-500 dark:text-navy-950 dark:border-gold-500"
              : "border-border hover:bg-surface-hover"
          )}
        >
          {p}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-muted">...</span>}
          <Link href={buildHref(totalPages)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface-hover text-sm">
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={buildHref(Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-border",
          page === totalPages ? "pointer-events-none opacity-40" : "hover:bg-surface-hover"
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
