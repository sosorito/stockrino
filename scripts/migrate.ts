/* eslint-disable no-console */
import "dotenv/config";
import postgres from "postgres";
import { ensureSchema } from "../src/db/migrate";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  console.error(
    "No Postgres connection string found. Set DATABASE_URL (or POSTGRES_URL) in .env"
  );
  process.exit(1);
}

async function main() {
  const sql = postgres(connectionString as string, { max: 1, prepare: false });
  try {
    console.log("Creating Stockrino schema (idempotent)...");
    await ensureSchema(sql);
    console.log("Schema is ready.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
