import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { LoginNotice } from "@/components/LoginNotice";
import { safeRedirect } from "@/lib/auth/safe-redirect";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Love 21 Foundation portal.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; notice?: string | string[] }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { next, notice } = await searchParams;
  const redirectTo = safeRedirect(next);

  if (user) redirect(redirectTo);

  return (
    <AuthPage
      eyebrow="One community"
      title="A place for every Love 21 journey."
      description="Members, donors, and volunteers each arrive here through one secure doorway."
    >
      <LoginNotice locale="en" notice={notice} />
      <AuthForm mode="login" redirectTo={redirectTo} />
    </AuthPage>
  );
}
