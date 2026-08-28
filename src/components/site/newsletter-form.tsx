"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail } from "lucide-react";

export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast.success("You're subscribed! Thanks for joining Stockrino.");
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "Could not subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const isDark = variant === "dark";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <div
        className={
          "flex items-center gap-2 flex-1 rounded-lg border px-3 py-2.5 " +
          (isDark
            ? "border-white/20 bg-white/10"
            : "border-border bg-surface")
        }
      >
        <Mail size={16} className={isDark ? "text-white/60" : "text-muted"} />
        <input
          type="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={
            "flex-1 bg-transparent text-sm outline-none " +
            (isDark ? "text-white placeholder:text-white/50" : "placeholder:text-muted")
          }
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold px-5 py-2.5 text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
    </form>
  );
}
