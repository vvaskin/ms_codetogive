import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VolunteerSignupForm } from "@/components/VolunteerSignupForm";
import { VOLUNTEER_SIGNUP_IN_PROGRESS_COOKIE } from "@/lib/volunteer-signup-draft";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Volunteer registration",
  description: "Complete your Love 21 volunteer registration.",
};

export default async function VolunteerSignupPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get(VOLUNTEER_SIGNUP_IN_PROGRESS_COOKIE)) {
    redirect("/signup");
  }

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Join Love 21</p>
        <h1 className={styles.title}>There is a role for everyone.</h1>
        <p className={styles.description}>
          Complete your volunteer registration so we can match you to the right
          sessions.
        </p>
        <div className={styles.formWrap}>
          <VolunteerSignupForm />
        </div>
      </div>
    </section>
  );
}
