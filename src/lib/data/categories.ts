import { db } from "@/db";
import { categories, posts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function getAllCategories() {
  const rows = await db.select().from(categories).orderBy(categories.name);
  const counts = await db
    .select({ id: posts.categoryId, count: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.status, "published"))
    .groupBy(posts.categoryId);
  const countMap = new Map(counts.map((c) => [c.id, Number(c.count) || 0]));
  return rows.map((c) => ({ ...c, postCount: countMap.get(c.id) || 0 }));
}

export async function getCategoryBySlug(slug: string) {
  return db.query.categories.findFirst({ where: eq(categories.slug, slug) });
}

export async function createCategory(input: {
  name: string;
  slug?: string;
  description?: string;
}) {
  let slug = slugify(input.slug || input.name);
  let n = 1;
  while (await db.query.categories.findFirst({ where: eq(categories.slug, slug) })) {
    n += 1;
    slug = `${slugify(input.slug || input.name)}-${n}`;
  }
  const [created] = await db
    .insert(categories)
    .values({ name: input.name, slug, description: input.description || "" })
    .returning();
  return created;
}

export async function updateCategory(
  id: number,
  input: { name?: string; slug?: string; description?: string }
) {
  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.slug !== undefined) {
    let slug = slugify(input.slug);
    let n = 1;
    while (true) {
      const existing = await db.query.categories.findFirst({
        where: eq(categories.slug, slug),
      });
      if (!existing || existing.id === id) break;
      n += 1;
      slug = `${slugify(input.slug)}-${n}`;
    }
    updates.slug = slug;
  }
  await db.update(categories).set(updates).where(eq(categories.id, id));
  return db.query.categories.findFirst({ where: eq(categories.id, id) });
}

export async function deleteCategory(id: number) {
  await db.update(posts).set({ categoryId: null }).where(eq(posts.categoryId, id));
  await db.delete(categories).where(eq(categories.id, id));
}
