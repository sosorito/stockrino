import { sql } from "drizzle-orm";
import { db } from "@/db";

/**
 * Lazily promotes any "scheduled" posts whose scheduled time has passed
 * into "published". Called at the top of every public-facing read so the
 * site stays correct without needing an external cron process.
 */
export async function syncScheduledPosts() {
  const now = new Date().toISOString();
  await db.execute(sql`
    UPDATE posts
       SET status = 'published',
           published_at = COALESCE(published_at, scheduled_at, ${now}),
           updated_at = ${now}
     WHERE status = 'scheduled'
       AND scheduled_at IS NOT NULL
       AND scheduled_at <= ${now}
  `);
}
