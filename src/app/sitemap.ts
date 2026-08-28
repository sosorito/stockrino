import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/data/settings";
import { getAllCategories } from "@/lib/data/categories";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSettings();
  const baseUrl = (settings.siteUrl || "http://localhost:3000").replace(/\/$/, "");

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/blog`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/search`, changeFrequency: "weekly", priority: 0.3 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categories = await getAllCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const allPosts = await db
    .select({ slug: posts.slug, updatedAt: posts.updatedAt })
    .from(posts)
    .where(eq(posts.status, "published"));

  const postPages: MetadataRoute.Sitemap = allPosts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
