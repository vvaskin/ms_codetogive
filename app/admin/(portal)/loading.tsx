import styles from "@/components/admin/AdminUI.module.css";

export default function AdminLoading() {
  return (
    <div className={styles.loadingState} role="status" aria-live="polite">
      <span className={styles.loadingMark} aria-hidden="true" />
      <div>
        <strong>Loading admin data</strong>
        <p>Please wait while the latest records are prepared.</p>
      </div>
    </div>
  );
}
