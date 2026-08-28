import type { Metadata } from "next";
import { getSettings } from "@/lib/data/settings";
import { ContactForm } from "@/components/site/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Stockrino team.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl mb-10">
        <h1 className="text-3xl font-extrabold mb-3">Contact Us</h1>
        <p className="text-muted">
          Have a tip, question, or feedback about our USA stock market coverage? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <div className="space-y-5">
          {settings.contactEmail && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-card">
              <Mail size={18} className="text-gold-500 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Email</div>
                <a href={`mailto:${settings.contactEmail}`} className="text-sm text-muted hover:text-gold-600">
                  {settings.contactEmail}
                </a>
              </div>
            </div>
          )}
          {settings.contactPhone && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-card">
              <Phone size={18} className="text-gold-500 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Phone</div>
                <span className="text-sm text-muted">{settings.contactPhone}</span>
              </div>
            </div>
          )}
          {settings.contactAddress && (
            <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-card">
              <MapPin size={18} className="text-gold-500 mt-0.5" />
              <div>
                <div className="font-semibold text-sm">Address</div>
                <span className="text-sm text-muted">{settings.contactAddress}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
