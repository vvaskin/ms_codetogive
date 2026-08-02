import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { isSignupRole } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Love 21 Foundation portal account.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string | string[] }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/portal");

  const rawRole = (await searchParams).role;
  const roleValue = Array.isArray(rawRole) ? rawRole[0] : rawRole;
  const initialRole = isSignupRole(roleValue) ? roleValue : "member";

  return (
    <AuthPage
      variant="signup"
      eyebrow="Join Love 21"
      title="There is a role for everyone."
      description="Choose member or contributor when you create your account."
    >
      <AuthForm mode="signup" initialRole={initialRole} />
    </AuthPage>
  );
}
