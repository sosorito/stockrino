import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/data/settings";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSettings();
  const baseUrl = (settings.siteUrl || "http://localhost:3000").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
