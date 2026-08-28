import { cn } from "@/lib/utils";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "navy",
  href,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "navy" | "gold" | "green" | "blue" | "red";
  href?: string;
}) {
  const accents: Record<string, string> = {
    navy: "bg-navy-900 text-white",
    gold: "bg-gold-500 text-navy-950",
    green: "bg-emerald-500 text-white",
    blue: "bg-sky-500 text-white",
    red: "bg-rose-500 text-white",
  };

  const Comp: any = href ? Link : "div";

  return (
    <Comp
      href={href}
      className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <span className={cn("flex items-center justify-center h-11 w-11 rounded-lg shrink-0", accents[accent])}>
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <div className="text-2xl font-extrabold text-slate-900 leading-tight">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </Comp>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-700",
    draft: "bg-slate-200 text-slate-600",
    scheduled: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        styles[status] || "bg-slate-100 text-slate-600"
      )}
    >
      {status}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants: Record<string, string> = {
    primary: "bg-navy-900 text-white hover:bg-navy-800",
    secondary: "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-500",
    ghost: "text-slate-600 hover:bg-slate-100",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  title,
  description,
  actions,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 shadow-sm", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            {title && <h3 className="font-bold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-500 mt-0.5">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-navy-700 bg-white",
        props.className
      )}
    />
  );
}

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700 mb-1.5">
      {children}
    </label>
  );
}
