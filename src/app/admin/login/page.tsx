"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, Eye, EyeOff, LineChart } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid credentials.");
        return;
      }
      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950 px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <span className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-lg mb-4">
            <LineChart size={28} strokeWidth={2.5} />
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Stockrino<span className="text-gold-500">.</span> Admin
          </h1>
          <p className="text-navy-300 text-sm mt-1">Sign in to manage your stock market news platform</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-navy-900/80 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl"
        >
          {error && (
            <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-3 py-2.5">
              {error}
            </div>
          )}

          <label className="block text-xs font-semibold uppercase tracking-wide text-navy-300 mb-2">
            Email or Username
          </label>
          <div className="relative mb-5">
            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              required
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@stockrino.com"
              className="w-full rounded-lg bg-navy-950/60 border border-white/10 pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <label className="block text-xs font-semibold uppercase tracking-wide text-navy-300 mb-2">
            Password
          </label>
          <div className="relative mb-6">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
            <input
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-navy-950/60 border border-white/10 pl-9 pr-9 py-2.5 text-white text-sm placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-200"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-2.5 text-sm transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <p className="text-center text-navy-400 text-xs mt-6">
          Demo credentials: admin@stockrino.com / Stockrino@123
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
