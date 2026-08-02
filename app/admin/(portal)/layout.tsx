import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getAdminAuthState } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isStaff } = await getAdminAuthState();

  if (!user || !isStaff) redirect("/admin/login");

  const displayName =
    typeof user.user_metadata.name === "string" && user.user_metadata.name.trim()
      ? user.user_metadata.name.trim()
      : "Love 21 staff";

  return (
    <AdminLayout
      admin={{
        name: displayName,
        email: user.email ?? "Staff account",
      }}
    >
      {children}
    </AdminLayout>
  );
}
