import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import fs from "fs";
import * as schema from "./schema";
import { ensureSchema } from "./migrate";

const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, "stockrino.db");

declare global {
  // eslint-disable-next-line no-var
  var __stockrino_sqlite: Database.Database | undefined;
}

const sqlite = global.__stockrino_sqlite || new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");
ensureSchema(sqlite);

if (process.env.NODE_ENV !== "production") {
  global.__stockrino_sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
export { sqlite };
