import type { Metadata } from "next";
import { AuthPage } from "@/components/AuthPage";
import { VolunteerSignupForm } from "@/components/VolunteerSignupForm";

export const metadata: Metadata = {
  title: "Volunteer registration",
  description: "Complete your Love 21 volunteer registration.",
};

export default function VolunteerSignupPage() {
  return (
    <AuthPage
      variant="signup"
      eyebrow="Join Love 21"
      title="There is a role for everyone."
      description="Complete your volunteer profile so we can match you to the right sessions."
    >
      <VolunteerSignupForm />
    </AuthPage>
  );
}
