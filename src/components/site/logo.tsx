import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  siteName = "Stockrino",
  className,
  size = "md",
}: {
  siteName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { mark: "h-7 w-7 text-sm", text: "text-lg" },
    md: { mark: "h-9 w-9 text-base", text: "text-xl" },
    lg: { mark: "h-12 w-12 text-lg", text: "text-2xl" },
  }[size];

  return (
    <Link href="/" className={cn("flex items-center gap-2.5 group", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-900 text-gold-400 font-extrabold shadow-card shrink-0",
          sizes.mark
        )}
      >
        S
      </span>
      <span className={cn("font-extrabold tracking-tight text-foreground", sizes.text)}>
        {siteName}
        <span className="text-gold-500">.</span>
      </span>
    </Link>
  );
}
