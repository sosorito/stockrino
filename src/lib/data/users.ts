import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function findAdminByLogin(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  return db.query.adminUsers.findFirst({
    where: or(
      eq(adminUsers.email, normalized),
      eq(adminUsers.username, normalized)
    ),
  });
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createAdminUser(input: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  const passwordHash = await bcrypt.hash(input.password, 10);
  const [created] = await db
    .insert(adminUsers)
    .values({
      name: input.name,
      username: input.username.toLowerCase(),
      email: input.email.toLowerCase(),
      passwordHash,
    })
    .returning();
  return created;
}
