import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "登录",
  description: "登录您的 Love 21 基金会个人页面。",
};

function safeRedirect(value: string | string[] | undefined) {
  const path = Array.isArray(value) ? value[0] : value;
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/portal";
}

export default async function LoginCnPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { next } = await searchParams;
  const redirectTo = safeRedirect(next);

  if (user) redirect(redirectTo);

  return (
    <AuthPage
      eyebrow="同一个社群"
      title="为每一段 Love 21 旅程而设。"
      description="会员、捐赠者及义工，均经由同一个安全入口到达这里。"
    >
      <AuthForm mode="login" redirectTo={redirectTo} locale="cn" />
    </AuthPage>
  );
}
