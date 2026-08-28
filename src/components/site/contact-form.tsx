"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    const subject = encodeURIComponent(`Message from ${form.name} via Stockrino`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:contact@stockrino.com?subject=${subject}&body=${body}`;
    setSent(true);
    toast.success("Opening your email client...");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-border rounded-xl p-6 shadow-card">
      <div>
        <label className="block text-sm font-semibold mb-1.5">Your Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          placeholder="Jane Doe"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">Email Address</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          placeholder="jane@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">Message</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          placeholder="Tell us what's on your mind..."
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-navy-900 dark:bg-gold-500 dark:text-navy-950 text-white font-semibold px-5 py-2.5 text-sm hover:bg-navy-800 dark:hover:bg-gold-400 transition-colors"
      >
        {sent ? "Message Ready — Send via Email" : "Send Message"}
      </button>
    </form>
  );
}
