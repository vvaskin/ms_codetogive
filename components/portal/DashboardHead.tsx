import styles from "./dashboard.module.css";

export function DashboardHead({
  title,
  subtitle,
  stat,
}: {
  title: string;
  subtitle: string;
  stat?: { value: string; label: string };
}) {
  return (
    <header className={styles.dashboardHead}>
      <div className={styles.dashboardHeadText}>
        <h1 className={styles.dashboardTitle}>{title}</h1>
        <p className={styles.dashboardSubtitle}>{subtitle}</p>
      </div>
      {stat && (
        <div className={styles.dashboardHeadStat}>
          <div className={styles.headStat}>
            <div className={styles.headStatValue}>{stat.value}</div>
            <p className={styles.headStatLabel}>{stat.label}</p>
          </div>
        </div>
      )}
    </header>
  );
}
