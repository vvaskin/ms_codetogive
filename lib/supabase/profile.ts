import type { UserRole } from "@/lib/roles";
import { createClient } from "./server";
import type { UserRow } from "./types";

export interface SessionProfile {
  id: string;
  email: string;
  name: string;
  phoneNumber: string | null;
  address: string | null;
  role: UserRole;
  /** Object path in the `avatars` bucket, or null. */
  profileImage: string | null;
  /** Public URL for `profileImage`, or null when no avatar is set. */
  avatarUrl: string | null;
}

/**
 * Returns the signed-in user's profile, or null when signed out.
 * Combines the auth user (identity) with the `public.users` row (profile).
 */
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("users")
    .select(
      "id, email, name, phone_number, address, role, profile_image",
    )
    .eq("id", user.id)
    .maybeSingle<
      Pick<
        UserRow,
        | "id"
        | "email"
        | "name"
        | "phone_number"
        | "address"
        | "role"
        | "profile_image"
      >
    >();

  if (error) throw new Error("Unable to load the account profile.");
  if (!data) throw new Error("This account does not have a profile.");

  const profileImage = data?.profile_image ?? null;
  const avatarUrl = profileImage
    ? supabase.storage.from("avatars").getPublicUrl(profileImage).data.publicUrl
    : null;

  return {
    id: user.id,
    email: data.email ?? user.email ?? "",
    name: data.name,
    phoneNumber: data.phone_number,
    address: data.address,
    role: data.role,
    profileImage,
    avatarUrl,
  };
}
