import { defineConfig } from "drizzle-kit";
import path from "node:path";
import { loadEnvFile } from "node:process";

try {
  loadEnvFile(".env.local");
} catch {
  // Drizzle can use the local default when no environment file exists.
}

const databaseFileName = process.env.DB_FILE_NAME ?? "love21.sqlite";

if (databaseFileName !== path.basename(databaseFileName)) {
  throw new Error("DB_FILE_NAME must be a filename inside the data directory.");
}

export default defineConfig({
  dialect: "sqlite",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: path.join(process.cwd(), "data", databaseFileName),
  },
});
