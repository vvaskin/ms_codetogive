import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "node:path";
import { schema } from "./schema";

const databaseFileName = process.env.DB_FILE_NAME ?? "love21.sqlite";

if (databaseFileName !== path.basename(databaseFileName)) {
  throw new Error("DB_FILE_NAME must be a filename inside the data directory.");
}

const databasePath = path.join(process.cwd(), "data", databaseFileName);

const globalForDatabase = globalThis as unknown as {
  love21Sqlite?: Database.Database;
};

const sqlite = globalForDatabase.love21Sqlite ?? new Database(databasePath);

sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.love21Sqlite = sqlite;
}

export const db = drizzle(sqlite, { schema });
