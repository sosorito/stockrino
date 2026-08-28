import { db, sqlite } from "@/db";
import { posts, postTags, tags, categories } from "@/db/schema";
import { and, desc, asc, eq, like, or, sql, ne } from "drizzle-orm";
import { syncScheduledPosts } from "@/lib/scheduler";
import { slugify, makeExcerpt } from "@/lib/utils";

const postWith = {
  category: true,
  featuredImage: true,
  author: true,
  ogImage: true,
  postTags: { with: { tag: true } },
} as const;

export type PostWithRelations = Awaited<
  ReturnType<typeof db.query.posts.findFirst<{ with: typeof postWith }>>
>;

function shapePost(p: any) {
  if (!p) return p;
  return {
    ...p,
    tags: (p.postTags || []).map((pt: any) => pt.tag),
  };
}

export interface ListOptions {
  page?: number;
  limit?: number;
  categorySlug?: string;
  search?: string;
  sort?: "latest" | "oldest";
  status?: string;
}

export async function getPublishedPosts(opts: ListOptions = {}) {
  syncScheduledPosts();
  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit || 9;
  const offset = (page - 1) * limit;

  const conditions = [eq(posts.status, "published")];

  if (opts.categorySlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, opts.categorySlug),
    });
    if (cat) {
      conditions.push(eq(posts.categoryId, cat.id));
    } else {
      return { posts: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  if (opts.search) {
    const term = `%${opts.search}%`;
    conditions.push(
      or(
        like(posts.title, term),
        like(posts.excerpt, term),
        like(posts.content, term)
      )!
    );
  }

  const where = and(...conditions);

  const orderBy =
    opts.sort === "oldest" ? asc(posts.publishedAt) : desc(posts.publishedAt);

  const [rows, totalRows] = await Promise.all([
    db.query.posts.findMany({
      where,
      with: postWith,
      orderBy: [orderBy],
      limit,
      offset,
    }),
    db.select({ count: sql<number>`count(*)` }).from(posts).where(where),
  ]);

  const total = Number(totalRows[0]?.count || 0);

  return {
    posts: rows.map(shapePost),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getPostBySlug(slug: string, includeUnpublished = false) {
  syncScheduledPosts();
  const where = includeUnpublished
    ? eq(posts.slug, slug)
    : and(eq(posts.slug, slug), eq(posts.status, "published"));
  const post = await db.query.posts.findFirst({
    where,
    with: postWith,
  });
  return shapePost(post);
}

export async function incrementViewCount(id: number) {
  sqlite
    .prepare(`UPDATE posts SET view_count = view_count + 1 WHERE id = ?`)
    .run(id);
}

export async function getTrendingPosts(limit = 5) {
  syncScheduledPosts();
  const rows = await db.query.posts.findMany({
    where: and(eq(posts.status, "published"), eq(posts.isTrending, true)),
    with: postWith,
    orderBy: [desc(posts.publishedAt)],
    limit,
  });
  if (rows.length > 0) return rows.map(shapePost);
  // fallback: most viewed
  const fallback = await db.query.posts.findMany({
    where: eq(posts.status, "published"),
    with: postWith,
    orderBy: [desc(posts.viewCount), desc(posts.publishedAt)],
    limit,
  });
  return fallback.map(shapePost);
}

export async function getFeaturedPosts(limit = 3) {
  syncScheduledPosts();
  const rows = await db.query.posts.findMany({
    where: and(eq(posts.status, "published"), eq(posts.isFeatured, true)),
    with: postWith,
    orderBy: [desc(posts.publishedAt)],
    limit,
  });
  if (rows.length > 0) return rows.map(shapePost);
  const fallback = await db.query.posts.findMany({
    where: eq(posts.status, "published"),
    with: postWith,
    orderBy: [desc(posts.publishedAt)],
    limit,
  });
  return fallback.map(shapePost);
}

export async function getLatestPosts(limit = 9) {
  syncScheduledPosts();
  const rows = await db.query.posts.findMany({
    where: eq(posts.status, "published"),
    with: postWith,
    orderBy: [desc(posts.publishedAt)],
    limit,
  });
  return rows.map(shapePost);
}

export async function getRelatedPosts(
  postId: number,
  categoryId: number | null,
  limit = 3
) {
  syncScheduledPosts();
  const conditions = [eq(posts.status, "published"), ne(posts.id, postId)];
  if (categoryId) conditions.push(eq(posts.categoryId, categoryId));
  const rows = await db.query.posts.findMany({
    where: and(...conditions),
    with: postWith,
    orderBy: [desc(posts.publishedAt)],
    limit,
  });
  if (rows.length < limit && categoryId) {
    const more = await db.query.posts.findMany({
      where: and(eq(posts.status, "published"), ne(posts.id, postId)),
      with: postWith,
      orderBy: [desc(posts.publishedAt)],
      limit: limit - rows.length,
    });
    const existingIds = new Set(rows.map((r) => r.id));
    for (const m of more) {
      if (!existingIds.has(m.id)) rows.push(m);
    }
  }
  return rows.map(shapePost);
}

// ---------------- Admin ----------------

export interface AdminListOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: number;
}

export async function getAllPostsAdmin(opts: AdminListOptions = {}) {
  const page = opts.page && opts.page > 0 ? opts.page : 1;
  const limit = opts.limit || 15;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (opts.status && opts.status !== "all") {
    conditions.push(eq(posts.status, opts.status));
  }
  if (opts.categoryId) {
    conditions.push(eq(posts.categoryId, opts.categoryId));
  }
  if (opts.search) {
    const term = `%${opts.search}%`;
    conditions.push(or(like(posts.title, term), like(posts.excerpt, term))!);
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [rows, totalRows] = await Promise.all([
    db.query.posts.findMany({
      where,
      with: postWith,
      orderBy: [desc(posts.updatedAt)],
      limit,
      offset,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(where as any),
  ]);

  const total = Number(totalRows[0]?.count || 0);

  return {
    posts: rows.map(shapePost),
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getPostById(id: number) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: postWith,
  });
  return shapePost(post);
}

export interface PostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImageId?: number | null;
  categoryId?: number | null;
  authorId?: number | null;
  status: "draft" | "published" | "scheduled";
  isTrending?: boolean;
  isFeatured?: boolean;
  scheduledAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageId?: number | null;
  tagNames?: string[];
}

async function resolveUniqueSlug(base: string, excludeId?: number) {
  let slug = slugify(base) || `post-${Date.now()}`;
  let n = 1;
  // ensure uniqueness
  while (true) {
    const existing = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });
    if (!existing || existing.id === excludeId) break;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
  return slug;
}

async function setTagsForPost(postId: number, tagNames: string[] = []) {
  await db.delete(postTags).where(eq(postTags.postId, postId));
  for (const rawName of tagNames) {
    const name = rawName.trim();
    if (!name) continue;
    const slug = slugify(name);
    let tag = await db.query.tags.findFirst({ where: eq(tags.slug, slug) });
    if (!tag) {
      const [inserted] = await db
        .insert(tags)
        .values({ name, slug })
        .returning();
      tag = inserted;
    }
    await db
      .insert(postTags)
      .values({ postId, tagId: tag.id })
      .onConflictDoNothing();
  }
}

export async function createPost(input: PostInput) {
  const slug = await resolveUniqueSlug(input.slug || input.title);
  const now = new Date().toISOString();
  const excerpt = input.excerpt?.trim() || makeExcerpt(input.content);

  let publishedAt: string | null = null;
  if (input.status === "published") publishedAt = now;

  const [created] = await db
    .insert(posts)
    .values({
      title: input.title,
      slug,
      excerpt,
      content: input.content,
      featuredImageId: input.featuredImageId ?? null,
      categoryId: input.categoryId ?? null,
      authorId: input.authorId ?? null,
      status: input.status,
      isTrending: !!input.isTrending,
      isFeatured: !!input.isFeatured,
      scheduledAt: input.status === "scheduled" ? input.scheduledAt : null,
      publishedAt,
      createdAt: now,
      updatedAt: now,
      seoTitle: input.seoTitle || "",
      seoDescription: input.seoDescription || "",
      seoKeywords: input.seoKeywords || "",
      canonicalUrl: input.canonicalUrl || "",
      ogTitle: input.ogTitle || "",
      ogDescription: input.ogDescription || "",
      ogImageId: input.ogImageId ?? null,
    })
    .returning();

  if (input.tagNames) {
    await setTagsForPost(created.id, input.tagNames);
  }

  return getPostById(created.id);
}

export async function updatePost(id: number, input: Partial<PostInput>) {
  const existing = await db.query.posts.findFirst({ where: eq(posts.id, id) });
  if (!existing) return null;

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = { updatedAt: now };

  if (input.title !== undefined) updates.title = input.title;
  if (input.slug !== undefined) {
    updates.slug = await resolveUniqueSlug(input.slug || input.title || existing.title, id);
  }
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
  if (input.content !== undefined) {
    updates.content = input.content;
    if (!input.excerpt) updates.excerpt = makeExcerpt(input.content);
  }
  if (input.featuredImageId !== undefined)
    updates.featuredImageId = input.featuredImageId;
  if (input.categoryId !== undefined) updates.categoryId = input.categoryId;
  if (input.isTrending !== undefined) updates.isTrending = input.isTrending;
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured;
  if (input.seoTitle !== undefined) updates.seoTitle = input.seoTitle;
  if (input.seoDescription !== undefined)
    updates.seoDescription = input.seoDescription;
  if (input.seoKeywords !== undefined) updates.seoKeywords = input.seoKeywords;
  if (input.canonicalUrl !== undefined) updates.canonicalUrl = input.canonicalUrl;
  if (input.ogTitle !== undefined) updates.ogTitle = input.ogTitle;
  if (input.ogDescription !== undefined)
    updates.ogDescription = input.ogDescription;
  if (input.ogImageId !== undefined) updates.ogImageId = input.ogImageId;

  if (input.status !== undefined) {
    updates.status = input.status;
    if (input.status === "published") {
      updates.publishedAt = existing.publishedAt || now;
      updates.scheduledAt = null;
    } else if (input.status === "scheduled") {
      updates.scheduledAt = input.scheduledAt ?? existing.scheduledAt;
      updates.publishedAt = null;
    } else if (input.status === "draft") {
      updates.scheduledAt = null;
    }
  }

  await db.update(posts).set(updates).where(eq(posts.id, id));

  if (input.tagNames) {
    await setTagsForPost(id, input.tagNames);
  }

  return getPostById(id);
}

export async function deletePost(id: number) {
  await db.delete(posts).where(eq(posts.id, id));
}

export async function duplicatePost(id: number) {
  const original = await getPostById(id);
  if (!original) return null;
  const now = new Date().toISOString();
  const slug = await resolveUniqueSlug(`${original.title}-copy`);
  const [created] = await db
    .insert(posts)
    .values({
      title: `${original.title} (Copy)`,
      slug,
      excerpt: original.excerpt,
      content: original.content,
      featuredImageId: original.featuredImageId,
      categoryId: original.categoryId,
      authorId: original.authorId,
      status: "draft",
      isTrending: false,
      isFeatured: false,
      isDemo: false,
      publishedAt: null,
      scheduledAt: null,
      createdAt: now,
      updatedAt: now,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      seoKeywords: original.seoKeywords,
      canonicalUrl: "",
      ogTitle: original.ogTitle,
      ogDescription: original.ogDescription,
      ogImageId: original.ogImageId,
    })
    .returning();

  const tagNames = (original.tags || []).map((t: any) => t.name);
  if (tagNames.length) await setTagsForPost(created.id, tagNames);

  return getPostById(created.id);
}

export async function getDashboardStats() {
  syncScheduledPosts();
  const all = sqlite
    .prepare(
      `SELECT status, COUNT(*) as count FROM posts GROUP BY status`
    )
    .all() as { status: string; count: number }[];

  const counts: Record<string, number> = {
    draft: 0,
    published: 0,
    scheduled: 0,
  };
  let total = 0;
  for (const row of all) {
    counts[row.status] = row.count;
    total += row.count;
  }

  const categoryCount = sqlite
    .prepare(`SELECT COUNT(*) as c FROM categories`)
    .get() as { c: number };

  const subscriberCount = sqlite
    .prepare(`SELECT COUNT(*) as c FROM newsletter_subscribers`)
    .get() as { c: number };

  const recentPosts = await db.query.posts.findMany({
    with: postWith,
    orderBy: [desc(posts.updatedAt)],
    limit: 6,
  });

  return {
    total,
    published: counts.published,
    draft: counts.draft,
    scheduled: counts.scheduled,
    categories: categoryCount.c,
    subscribers: subscriberCount.c,
    recentPosts: recentPosts.map(shapePost),
  };
}

export async function searchPosts(query: string, limit = 20) {
  syncScheduledPosts();
  const term = `%${query}%`;
  const rows = await db.query.posts.findMany({
    where: and(
      eq(posts.status, "published"),
      or(
        like(posts.title, term),
        like(posts.excerpt, term),
        like(posts.content, term),
        like(posts.seoKeywords, term)
      )
    ),
    with: postWith,
    orderBy: [desc(posts.publishedAt)],
    limit,
  });
  return rows.map(shapePost);
}
