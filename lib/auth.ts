import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "./db";
import {
  PUBLIC_USER_ROLES,
  schema,
  USER_ROLES,
  type PublicUserRole,
} from "./db/schema";

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
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          const requestedRole = newUser.role;
          const role = PUBLIC_USER_ROLES.includes(
            requestedRole as PublicUserRole,
          )
            ? requestedRole
            : "member";

          return { data: { ...newUser, role } };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: [...USER_ROLES],
        required: true,
        input: true,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
