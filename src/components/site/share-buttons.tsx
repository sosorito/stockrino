"use client";

import { Link2, Check } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaLinkedinIn } from "react-icons/fa6";
import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Share on Facebook",
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "Share on X",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      label: "Share on LinkedIn",
      icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op
    }
  }

  return (
    <div className="flex items-center gap-2">
      {links.map(({ label, icon: Icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface-hover hover:border-gold-400 transition-colors"
        >
          <Icon size={16} />
        </a>
      ))}
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-surface-hover hover:border-gold-400 transition-colors"
      >
        {copied ? <Check size={16} className="text-emerald-500" /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
