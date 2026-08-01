"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { isStaffRole } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  PUBLIC_USER_ROLES,
  user,
  type PublicUserRole,
} from "@/lib/db/schema";

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseRole(value: string): PublicUserRole {
  if (!PUBLIC_USER_ROLES.includes(value as PublicUserRole)) {
    throw new Error("Invalid account type.");
  }
  return value as PublicUserRole;
}

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isStaffRole(session.user.role)) redirect("/admin/login");
  return session;
}

export async function deleteUser(formData: FormData) {
  await requireAdmin();

  const id = textValue(formData, "id");
  const currentView = parseRole(textValue(formData, "currentView"));
  const existing = await db.query.user.findFirst({ where: eq(user.id, id) });
  if (!existing) throw new Error("Account not found.");
  if (isStaffRole(existing.role)) throw new Error("Staff accounts cannot be deleted here.");

  await db.delete(user).where(eq(user.id, id));
  redirect(`/admin?view=${currentView}`);
}
