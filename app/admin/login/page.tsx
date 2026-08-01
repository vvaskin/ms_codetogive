import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { SignOutButton } from "@/components/SignOutButton";
import { isStaffRole } from "@/lib/admin";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session && isStaffRole(session.user.role)) redirect("/admin");

  if (session) {
    return (
      <AuthPage
        eyebrow="Restricted area"
        title="Administrator access required"
        description="This account is not authorized to access the admin portal. Sign out and use an approved administrator account."
      >
        <SignOutButton />
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
