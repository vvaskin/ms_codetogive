import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "登入",
  description: "登入您的 Love 21 基金會個人頁面。",
};

function safeRedirect(value: string | string[] | undefined) {
  const path = Array.isArray(value) ? value[0] : value;
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/portal";
}

export default async function LoginHkPage({
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
      eyebrow="同一社群"
      title="為每一段 Love 21 旅程而設。"
      description="會員、捐贈者及義工，均經由同一個安全入口到達這裡。"
    >
      <AuthForm mode="login" redirectTo={redirectTo} locale="zh" />
    </AuthPage>
  );
}
