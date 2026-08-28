import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function subscribeEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  const existing = await db.query.newsletterSubscribers.findFirst({
    where: eq(newsletterSubscribers.email, normalized),
  });
  if (existing) return existing;
  const [created] = await db
    .insert(newsletterSubscribers)
    .values({ email: normalized })
    .returning();
  return created;
}

export async function getAllSubscribers() {
  return db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.subscribedAt));
}

export async function deleteSubscriber(id: number) {
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
}
