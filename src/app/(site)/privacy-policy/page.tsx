import type { Metadata } from "next";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the Stockrino privacy policy to learn how we collect, use, and protect your information.",
};

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();

  return (
    <div className="container-page py-12 max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-2">Privacy Policy</h1>
      <p className="text-muted text-sm mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="prose-stockrino">
        <p>
          {settings.siteName} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is
          committed to protecting the personal information you share with us when you use our website.
          This Privacy Policy explains what information we collect, how we use it, and the choices you have.
        </p>

        <h2>Information We Collect</h2>
        <p>
          We may collect information you voluntarily provide, such as your email address when you subscribe to our
          newsletter or contact us. We also automatically collect certain technical information, including your
          IP address, browser type, device information, and pages visited, to help us understand how our site is used.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To deliver our newsletter and market updates to subscribers</li>
          <li>To respond to inquiries submitted through our contact page</li>
          <li>To analyze site traffic and improve our content and user experience</li>
          <li>To maintain the security and integrity of our website</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We may use cookies and similar technologies to remember your preferences (such as light or dark mode) and
          to gather anonymous analytics about site usage. You can control cookies through your browser settings.
        </p>

        <h2>Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share information with trusted service providers who
          help us operate our website (such as email delivery or hosting providers), and only to the extent
          necessary for them to perform their services.
        </p>

        <h2>Your Choices</h2>
        <p>
          You may unsubscribe from our newsletter at any time using the link provided in each email, or by
          contacting us directly.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{" "}
          {settings.contactEmail ? (
            <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
          ) : (
            "our contact page"
          )}
          .
        </p>
      </div>
    </div>
  );
}
