import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { SignOutButton } from "@/components/SignOutButton";
import { getAdminAuthState } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const { user, isStaff } = await getAdminAuthState();

  if (user && isStaff) redirect("/admin");

  if (user) {
    return (
      <AuthPage
        eyebrow="Restricted area"
        title="Administrator access required"
        description="This account is not authorized to access the admin portal. Sign out and use an approved administrator account."
      >
        <SignOutButton redirectTo="/admin/login" />
      </AuthPage>
    );
  }

  return (
    <AuthPage
      eyebrow="Restricted area"
      title="Admin login"
      description="Sign in with an approved administrator account."
    >
      <AuthForm
        mode="login"
        redirectTo="/admin"
        showAccountSwitch={false}
      />
    </AuthPage>
  );
}
