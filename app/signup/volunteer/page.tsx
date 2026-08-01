import type { Metadata } from "next";
import { VolunteerSignupForm } from "@/components/VolunteerSignupForm";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Volunteer registration",
  description: "Complete your Love 21 volunteer registration.",
};

export default function VolunteerSignupPage() {
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
