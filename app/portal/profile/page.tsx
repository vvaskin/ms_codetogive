import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/portal/ProfileEditor";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "My profile",
  description: "Read and update your Love 21 account details.",
};

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login?next=/portal/profile");

  const user = session.user as typeof session.user & {
    phone?: string | null;
    address?: string | null;
  };

  return (
    <div className="portal-subpage">
      <header className="portal-subpage-head">
        <p className="eyebrow">ACCOUNT</p>
        <h1>My profile</h1>
        <p>Keep your details current so we can stay in touch.</p>
      </header>

      <ProfileEditor
        initial={{
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          phone: user.phone ?? null,
          address: user.address ?? null,
        }}
      />
    </div>
  );
}
