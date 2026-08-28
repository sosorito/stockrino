import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export type Settings = typeof settings.$inferSelect;

let cache: Settings | null = null;
let cacheTime = 0;

export async function getSettings(): Promise<Settings> {
  const now = Date.now();
  if (cache && now - cacheTime < 5000) return cache;
  let row = await db.query.settings.findFirst({ where: eq(settings.id, 1) });
  if (!row) {
    const [created] = await db.insert(settings).values({ id: 1 }).returning();
    row = created;
  }
  cache = row;
  cacheTime = now;
  return row;
}

export async function updateSettings(input: Partial<Settings>) {
  const { id: _id, ...rest } = input;
  await db.update(settings).set(rest).where(eq(settings.id, 1));
  cache = null;
  return getSettings();
}
