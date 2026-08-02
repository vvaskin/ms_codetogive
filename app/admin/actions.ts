"use server";

import { redirect } from "next/navigation";
import { isStaffRole } from "@/lib/admin";
import { isSignupRole, type SignupRole } from "@/lib/roles";
import {
  createAdminClient,
  getAdminAuthState,
} from "@/lib/supabase/admin";

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function parseRole(value: string): SignupRole {
  if (!isSignupRole(value)) {
    throw new Error("Invalid account type.");
  }
  return value;
}

async function requireAdmin() {
  const { user, isStaff } = await getAdminAuthState();
  if (!user || !isStaff) redirect("/admin/login");
  return user;
}

const directoryPaths: Record<SignupRole, string> = {
  member: "/admin/people/members",
  volunteer: "/admin/people/volunteers",
  donor: "/admin/people/donors",
};

async function removeUserStorage(
  admin: ReturnType<typeof createAdminClient>,
  bucket: "avatars" | "certificates",
  userId: string,
) {
  const paths: string[] = [];
  const pageSize = 100;

  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await admin.storage
      .from(bucket)
      .list(userId, { limit: pageSize, offset });

    if (error) throw new Error(`Unable to inspect the ${bucket} bucket.`);

    paths.push(
      ...(data ?? [])
        .filter(({ id }) => Boolean(id))
        .map(({ name }) => `${userId}/${name}`),
    );

    if (!data || data.length < pageSize) break;
  }

  for (let index = 0; index < paths.length; index += pageSize) {
    const { error } = await admin.storage
      .from(bucket)
      .remove(paths.slice(index, index + pageSize));
    if (error) throw new Error(`Unable to clean the ${bucket} bucket.`);
  }
}

export async function deleteUser(formData: FormData) {
  const staffUser = await requireAdmin();

  const id = textValue(formData, "id");
  const currentView = parseRole(textValue(formData, "currentView"));
  if (id === staffUser.id) {
    throw new Error("Staff accounts cannot be deleted here.");
  }

  const admin = createAdminClient();
  const { data: existing, error: lookupError } = await admin
    .from("users")
    .select("id, role")
    .eq("id", id)
    .maybeSingle();

  if (lookupError || !existing) throw new Error("Account not found.");
  const existingRole = (existing as { role?: unknown }).role;
  if (isStaffRole(existingRole)) {
    throw new Error("Staff accounts cannot be deleted here.");
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(id);
  if (deleteError) throw new Error("Unable to delete this account.");

  const cleanup = await Promise.allSettled([
    removeUserStorage(admin, "avatars", id),
    removeUserStorage(admin, "certificates", id),
  ]);

  if (cleanup.some(({ status }) => status === "rejected")) {
    console.error("Account deleted, but one or more storage files remain.");
  }

  redirect(directoryPaths[currentView]);
}
