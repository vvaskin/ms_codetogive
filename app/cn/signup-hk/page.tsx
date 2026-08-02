import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { isSignupRole } from "@/lib/roles";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "建立账户",
  description: "建立 Love 21 基金会个人页面账户。",
};

export default async function SignupCnPage({
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
      eyebrow="加入 Love 21"
      title="每个人都可以出一分力。"
      description="建立账户时，请选择会员或贡献者身份。"
    >
      <AuthForm mode="signup" locale="cn" initialRole={initialRole} />
    </AuthPage>
  );
}
