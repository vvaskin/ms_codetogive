import Database from "better-sqlite3";
import path from "node:path";
import process, { loadEnvFile } from "node:process";

try {
  loadEnvFile(".env.local");
} catch {
  // The default local database filename is used without an environment file.
}

const requestedValue = process.argv[2];
const fromLegacyEnvironment = requestedValue === "--from-env";
const emails = fromLegacyEnvironment
  ? (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  : [requestedValue?.trim().toLowerCase()].filter(Boolean);

if (emails.length === 0 || emails.some((email) => !email.includes("@"))) {
  console.error("Usage: npm run staff:promote -- person@example.com");
  process.exit(1);
}

const databaseFileName = process.env.DB_FILE_NAME ?? "love21.sqlite";

if (databaseFileName !== path.basename(databaseFileName)) {
  throw new Error("DB_FILE_NAME must be a filename inside the data directory.");
}

const databasePath = path.join(process.cwd(), "data", databaseFileName);
const sqlite = new Database(databasePath);

try {
  const promote = sqlite.prepare(
    "UPDATE user SET role = 'staff', updated_at = unixepoch() WHERE lower(email) = ?",
  );
  let promoted = 0;
  const missing = [];

  for (const email of emails) {
    const result = promote.run(email);
    if (result.changes === 0) missing.push(email);
    else promoted += result.changes;
  }

  if (missing.length > 0) {
    console.error("One or more accounts were not found. Create them through /signup first.");
    process.exitCode = 1;
  }

  console.log(`${promoted} account${promoted === 1 ? " is" : "s are"} now staff.`);
} finally {
  sqlite.close();
}
