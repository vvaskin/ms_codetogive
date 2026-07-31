import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AuthForm } from "@/components/AuthForm";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "建立帳戶",
  description: "建立 Love 21 基金會個人頁面帳戶。",
};

export default async function SignupHkPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect("/portal");

  return (
    <section className="auth-page">
      <div className="auth-side-panel signup-panel" aria-hidden="true">
        <div>
          <p className="eyebrow">加入 LOVE 21</p>
          <h2>每個人都可以出一分力。</h2>
          <p>建立帳戶時，請選擇會員、捐贈者或義工身份。</p>
        </div>
      </div>
      <AuthForm mode="signup" locale="zh" />
    </section>
  );
}
