import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "./db";
import { schema, USER_ROLES } from "./db/schema";

const secret = process.env.BETTER_AUTH_SECRET;

if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET is required. Copy .env.example to .env.local and set a random secret.",
  );
}

export const auth = betterAuth({
  appName: "Love 21 Foundation",
  secret,
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: {
        type: [...USER_ROLES],
        required: true,
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      address: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
