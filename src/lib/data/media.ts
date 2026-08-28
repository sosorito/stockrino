import { db } from "@/db";
import { media } from "@/db/schema";
import { desc, eq, like, or } from "drizzle-orm";

export async function getAllMedia(search?: string) {
  if (search) {
    const term = `%${search}%`;
    return db
      .select()
      .from(media)
      .where(or(like(media.title, term), like(media.filename, term), like(media.altText, term)))
      .orderBy(desc(media.createdAt));
  }
  return db.select().from(media).orderBy(desc(media.createdAt));
}

export async function getMediaById(id: number) {
  return db.query.media.findFirst({ where: eq(media.id, id) });
}

export async function createMedia(input: {
  filename: string;
  url: string;
  title?: string;
  altText?: string;
  caption?: string;
  width?: number;
  height?: number;
  size?: number;
  mimeType?: string;
}) {
  const [created] = await db
    .insert(media)
    .values({
      filename: input.filename,
      url: input.url,
      title: input.title || "",
      altText: input.altText || "",
      caption: input.caption || "",
      width: input.width,
      height: input.height,
      size: input.size,
      mimeType: input.mimeType,
    })
    .returning();
  return created;
}

export async function updateMedia(
  id: number,
  input: { title?: string; altText?: string; caption?: string }
) {
  await db.update(media).set(input).where(eq(media.id, id));
  return getMediaById(id);
}

export async function deleteMedia(id: number) {
  await db.delete(media).where(eq(media.id, id));
}
