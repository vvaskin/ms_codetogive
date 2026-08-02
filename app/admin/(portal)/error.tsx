"use client";

import { useEffect } from "react";
import styles from "@/components/admin/AdminUI.module.css";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={styles.errorState} role="alert">
      <span aria-hidden="true">!</span>
      <div>
        <h1>We couldn&apos;t load this admin page</h1>
        <p>The data request failed. Try it again before making any changes.</p>
        <button type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </section>
  );
}
