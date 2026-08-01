import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "建立帳戶",
  description: "建立 Love 21 基金會個人頁面帳戶。",
};

export default async function SignupHkPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/portal");

  return (
    <AuthPage
      variant="signup"
      eyebrow="加入 Love 21"
      title="每個人都可以出一分力。"
      description="建立帳戶時，請選擇會員、捐贈者或義工身份。"
    >
      <AuthForm mode="signup" locale="zh" />
    </AuthPage>
  );
}
