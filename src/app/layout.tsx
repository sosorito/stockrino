import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seoDefaultTitle || `${settings.siteName} - USA Stock Market News & Analysis`;
  const description =
    settings.seoDefaultDescription || settings.tagline || "";

  return {
    metadataBase: new URL(settings.siteUrl?.trim() || "http://localhost:3000"),
    title: {
      default: title,
      template: `%s | ${settings.siteName}`,
    },
    description,
    alternates: { canonical: "/" },
    keywords: settings.seoDefaultKeywords?.split(",").map((k) => k.trim()),
    openGraph: {
      type: "website",
      siteName: settings.siteName,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: "/icon",
      shortcut: "/icon",
      apple: "/apple-icon",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const baseUrl = settings.siteUrl || "http://localhost:3000";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: baseUrl,
    logo: `${baseUrl}/icon`,
    description: settings.tagline,
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ThemeProvider>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
