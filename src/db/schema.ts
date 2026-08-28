import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// ---------- Admin Users ----------
export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Categories ----------
export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Tags ----------
export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

// ---------- Media ----------
export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  title: text("title").default(""),
  altText: text("alt_text").default(""),
  caption: text("caption").default(""),
  width: integer("width"),
  height: integer("height"),
  size: integer("size"),
  mimeType: text("mime_type"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Posts ----------
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").default(""),
  content: text("content").notNull().default(""), // HTML content from rich text editor
  featuredImageId: integer("featured_image_id").references(() => media.id, {
    onDelete: "set null",
  }),
  authorId: integer("author_id").references(() => adminUsers.id, {
    onDelete: "set null",
  }),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  status: text("status").notNull().default("draft"), // draft | published | scheduled
  isTrending: integer("is_trending", { mode: "boolean" })
    .notNull()
    .default(false),
  isFeatured: integer("is_featured", { mode: "boolean" })
    .notNull()
    .default(false),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  publishedAt: text("published_at"),
  scheduledAt: text("scheduled_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  // SEO
  seoTitle: text("seo_title").default(""),
  seoDescription: text("seo_description").default(""),
  seoKeywords: text("seo_keywords").default(""),
  canonicalUrl: text("canonical_url").default(""),
  ogTitle: text("og_title").default(""),
  ogDescription: text("og_description").default(""),
  ogImageId: integer("og_image_id").references(() => media.id, {
    onDelete: "set null",
  }),
});

// ---------- Post <-> Tag (many to many) ----------
export const postTags = sqliteTable(
  "post_tags",
  {
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.postId, t.tagId] }),
  })
);

// ---------- Newsletter ----------
export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  subscribedAt: text("subscribed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ---------- Settings (single row) ----------
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siteName: text("site_name").notNull().default("Stockrino"),
  tagline: text("tagline")
    .notNull()
    .default(
      "A modern platform for USA Stock Market news, updates, analysis, and financial insights."
    ),
  description: text("description").default(""),
  logoUrl: text("logo_url").default(""),
  faviconUrl: text("favicon_url").default(""),
  socialTwitter: text("social_twitter").default(""),
  socialFacebook: text("social_facebook").default(""),
  socialLinkedin: text("social_linkedin").default(""),
  socialYoutube: text("social_youtube").default(""),
  socialInstagram: text("social_instagram").default(""),
  contactEmail: text("contact_email").default(""),
  contactPhone: text("contact_phone").default(""),
  contactAddress: text("contact_address").default(""),
  seoDefaultTitle: text("seo_default_title").default(""),
  seoDefaultDescription: text("seo_default_description").default(""),
  seoDefaultKeywords: text("seo_default_keywords").default(""),
  siteUrl: text("site_url").default("http://localhost:3000"),
});

// ---------- Relations ----------
export const postsRelations = relations(posts, ({ one, many }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
  author: one(adminUsers, {
    fields: [posts.authorId],
    references: [adminUsers.id],
  }),
  featuredImage: one(media, {
    fields: [posts.featuredImageId],
    references: [media.id],
  }),
  ogImage: one(media, {
    fields: [posts.ogImageId],
    references: [media.id],
  }),
  postTags: many(postTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));
