import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AuthForm } from "@/components/AuthForm";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Love 21 Foundation portal account.",
};

export default async function SignupPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect("/portal");

  return (
    <section className="auth-page">
      <div className="auth-side-panel signup-panel" aria-hidden="true">
        <div>
          <p className="eyebrow">JOIN LOVE 21</p>
          <h2>There is a role for everyone.</h2>
          <p>
            Select member, donor, or volunteer when you create your account.
          </p>
        </div>
      </div>
      <AuthForm mode="signup" />
    </section>
  );
}
