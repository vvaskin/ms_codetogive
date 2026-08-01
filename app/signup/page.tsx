import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Love 21 Foundation portal account.",
};

export default async function SignupPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) redirect("/portal");

  return (
    <AuthPage
      variant="signup"
      eyebrow="Join Love 21"
      title="There is a role for everyone."
      description="Select member, donor, or volunteer when you create your account."
    >
      <AuthForm mode="signup" />
    </AuthPage>
  );
}
