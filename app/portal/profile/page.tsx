import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/portal/ProfileEditor";
import { getSessionProfile } from "@/lib/supabase/profile";

export const metadata: Metadata = {
  title: "My profile",
  description: "Read and update your Love 21 account details.",
};

export default async function ProfilePage() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login?next=/portal/profile");

  return (
    <div className="portal-subpage">
      <header className="portal-subpage-head">
        <p className="eyebrow">ACCOUNT</p>
        <h1>My profile</h1>
        <p>Keep your details current so we can stay in touch.</p>
      </header>

      <ProfileEditor
        initial={{
          userId: profile.id,
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          phone: profile.phoneNumber,
          address: profile.address,
        }}
      />
    </div>
  );
}
