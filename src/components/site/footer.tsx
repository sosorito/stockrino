import Link from "next/link";
import { Mail } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa6";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";

export interface FooterSettings {
  siteName: string;
  tagline: string;
  contactEmail?: string | null;
  socialTwitter?: string | null;
  socialFacebook?: string | null;
  socialLinkedin?: string | null;
  socialYoutube?: string | null;
  socialInstagram?: string | null;
}

export function Footer({
  settings,
  categories,
}: {
  settings: FooterSettings;
  categories: { name: string; slug: string }[];
}) {
  const socials = [
    { href: settings.socialTwitter, icon: FaXTwitter, label: "Twitter / X" },
    { href: settings.socialFacebook, icon: FaFacebookF, label: "Facebook" },
    { href: settings.socialLinkedin, icon: FaLinkedinIn, label: "LinkedIn" },
    { href: settings.socialYoutube, icon: FaYoutube, label: "YouTube" },
    { href: settings.socialInstagram, icon: FaInstagram, label: "Instagram" },
  ].filter((s) => s.href);

  return (
    <footer className="mt-20 bg-navy-950 text-navy-100">
      <div className="container-page py-14 grid grid-cols-1 gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo siteName={settings.siteName} />
          <p className="mt-4 text-sm text-navy-300 leading-relaxed">
            {settings.tagline}
          </p>
          {socials.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 hover:bg-gold-500 hover:text-navy-950 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Categories</h4>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 7).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="text-navy-300 hover:text-gold-400 transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/blog" className="text-navy-300 hover:text-gold-400 transition-colors">
                All News
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-navy-300 hover:text-gold-400 transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="text-navy-300 hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="text-navy-300 hover:text-gold-400 transition-colors">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="text-navy-400 hover:text-gold-400 transition-colors">
                Admin Login
              </Link>
            </li>
          </ul>
          {settings.contactEmail && (
            <a
              href={`mailto:${settings.contactEmail}`}
              className="mt-4 inline-flex items-center gap-2 text-sm text-navy-300 hover:text-gold-400 transition-colors"
            >
              <Mail size={14} /> {settings.contactEmail}
            </a>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
          <p className="text-sm text-navy-300 mb-4">
            Get the day&apos;s biggest USA stock market headlines in your inbox.
          </p>
          <NewsletterForm variant="dark" />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-navy-400">
          <span>
            &copy; {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </span>
          <span>Market news &amp; analysis for informational purposes only. Not investment advice.</span>
        </div>
      </div>
    </footer>
  );
}
