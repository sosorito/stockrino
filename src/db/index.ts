import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Postgres connection string. On Vercel, adding a Postgres store (Neon) from the
 * Storage tab injects these automatically. Locally, set DATABASE_URL in .env.
 */
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    "No Postgres connection string found. Set DATABASE_URL (or POSTGRES_URL) in your environment."
  );
}

declare global {
  // eslint-disable-next-line no-var
  var __stockrino_pg: ReturnType<typeof postgres> | undefined;
}

/**
 * `prepare: false` is required when going through a transaction-mode pooler
 * (Neon / Supabase pooled connection, PgBouncer). `max: 1` keeps each
 * serverless instance to a single connection.
 */
export const client =
  global.__stockrino_pg ||
  postgres(connectionString, {
    max: 1,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 30,
  });

if (process.env.NODE_ENV !== "production") {
  global.__stockrino_pg = client;
}

export const db = drizzle(client, { schema });
