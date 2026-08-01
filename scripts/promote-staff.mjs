import { createClient } from "@supabase/supabase-js";
import process, { loadEnvFile } from "node:process";

try {
  loadEnvFile(".env.local");
} catch {
  // The configuration check below provides the actionable error.
}

const requestedValue = process.argv[2];
const fromEnvironment = requestedValue === "--from-env";
const emails = fromEnvironment
  ? (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  : [requestedValue?.trim().toLowerCase()].filter(Boolean);

if (emails.length === 0 || emails.some((email) => !email.includes("@"))) {
  console.error("Usage: npm run staff:promote -- person@example.com");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local first.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
});

let promoted = 0;
const missing = [];

for (const email of emails) {
  const { data: profile, error: lookupError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    console.error(`Could not find ${email}: ${lookupError.message}`);
    process.exitCode = 1;
    continue;
  }

  if (!profile) {
    missing.push(email);
    continue;
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({ role: "staff" })
    .eq("id", profile.id);

  if (updateError) {
    const staffRoleIsMissing =
      updateError.code === "22P02" &&
      updateError.message.includes("user_role") &&
      updateError.message.includes('"staff"');

    if (staffRoleIsMissing) {
      console.error(
        "The linked Supabase database does not have the staff role yet.\n" +
          "Run `npm run db:push` to apply the pending staff migration, then run this command again.",
      );
    } else {
      console.error(`Could not promote ${email}: ${updateError.message}`);
    }
    process.exitCode = 1;
    if (staffRoleIsMissing) break;
    continue;
  }

  promoted += 1;
}

if (missing.length > 0) {
  console.error(
    `Account${missing.length === 1 ? "" : "s"} not found: ${missing.join(", ")}. Create them through /signup first.`,
  );
  process.exitCode = 1;
}

if (promoted > 0) {
  console.log(
    `${promoted} account${promoted === 1 ? " is" : "s are"} now staff.`,
  );
} else if (process.exitCode) {
  console.error("No accounts were promoted.");
}
