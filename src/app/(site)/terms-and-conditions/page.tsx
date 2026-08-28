import type { Metadata } from "next";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read the terms and conditions governing your use of Stockrino.",
};

export default async function TermsPage() {
  const settings = await getSettings();

  return (
    <div className="container-page py-12 max-w-3xl">
      <h1 className="text-3xl font-extrabold mb-2">Terms &amp; Conditions</h1>
      <p className="text-muted text-sm mb-8">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <div className="prose-stockrino">
        <p>
          By accessing and using {settings.siteName}, you agree to be bound by the following terms and conditions.
          Please read them carefully before using our website.
        </p>

        <h2>Not Financial Advice</h2>
        <p>
          Content published on {settings.siteName}, including news, analysis, and commentary about the U.S. stock
          market, is provided for general informational and educational purposes only. It does not constitute
          financial, investment, legal, or tax advice, and should not be relied upon as the basis for any investment
          decision. Always consult a qualified financial advisor before making investment decisions.
        </p>

        <h2>Accuracy of Information</h2>
        <p>
          We strive to provide accurate and timely information, but market conditions change rapidly and we make no
          warranties about the completeness, reliability, or accuracy of the content on this site. Any reliance you
          place on such information is strictly at your own risk.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on {settings.siteName}, including articles, graphics, logos, and images (excluding
          third-party or licensed material), is the property of {settings.siteName} and may not be reproduced,
          distributed, or republished without prior written permission.
        </p>

        <h2>User Conduct</h2>
        <p>
          You agree not to misuse this website, including attempting to gain unauthorized access to any part of the
          site, disrupting its normal operation, or using it for unlawful purposes.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the content, accuracy,
          or practices of these external sites.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          {settings.siteName} and its authors shall not be liable for any direct, indirect, incidental, or
          consequential damages arising from your use of, or inability to use, this website or its content.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may update these Terms and Conditions from time to time. Continued use of the site after changes are
          posted constitutes your acceptance of the revised terms.
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about these Terms should be sent to{" "}
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
