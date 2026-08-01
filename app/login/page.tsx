import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AuthForm } from "@/components/AuthForm";
import { AuthPage } from "@/components/AuthPage";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Love 21 Foundation portal.",
};

function safeRedirect(value: string | string[] | undefined) {
  const path = Array.isArray(value) ? value[0] : value;
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/portal";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const { next } = await searchParams;
  const redirectTo = safeRedirect(next);

  if (session) redirect(redirectTo);

  return (
    <AuthPage
      eyebrow="One community"
      title="A place for every Love 21 journey."
      description="Members, donors, and volunteers each arrive here through one secure doorway."
    >
      <AuthForm mode="login" redirectTo={redirectTo} />
    </AuthPage>
  );
}
