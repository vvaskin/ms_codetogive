import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./AdminUI.module.css";

export type AdminMetricTone =
  | "pink"
  | "blue"
  | "teal"
  | "purple"
  | "yellow"
  | "coral";

export type AdminStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"
  | "published"
  | "cancelled"
  | "completed"
  | "registered"
  | "attended"
  | "no_show"
  | "waitlisted"
  | "demo";

export type AdminPanelTone = "white" | "blush" | "sky" | "mint";

const metricToneClasses: Record<AdminMetricTone, string> = {
  pink: styles.metricPink,
  blue: styles.metricBlue,
  teal: styles.metricTeal,
  purple: styles.metricPurple,
  yellow: styles.metricYellow,
  coral: styles.metricCoral,
};

const statusClasses: Record<AdminStatus, string> = {
  pending: styles.statusPending,
  approved: styles.statusApproved,
  rejected: styles.statusRejected,
  active: styles.statusActive,
  inactive: styles.statusInactive,
  published: styles.statusPublished,
  cancelled: styles.statusCancelled,
  completed: styles.statusCompleted,
  registered: styles.statusRegistered,
  attended: styles.statusAttended,
  no_show: styles.statusNoShow,
  waitlisted: styles.statusWaitlisted,
  demo: styles.statusDemo,
};

const panelToneClasses: Record<AdminPanelTone, string> = {
  white: styles.panelWhite,
  blush: styles.panelBlush,
  sky: styles.panelSky,
  mint: styles.panelMint,
};

function humanizeStatus(status: AdminStatus) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function AdminPageHeader({
  eyebrow = "Administration",
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className={styles.pageHeader}>
      <div className={styles.pageHeaderCopy}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p className={styles.pageDescription}>{description}</p> : null}
      </div>
      {actions ? <div className={styles.pageActions}>{actions}</div> : null}
    </header>
  );
}

export function AdminMetricCard({
  label,
  value,
  description,
  href,
  linkLabel = "View details",
  icon,
  tone = "pink",
}: {
  label: string;
  value: ReactNode;
  description?: string;
  href?: string;
  linkLabel?: string;
  icon?: ReactNode;
  tone?: AdminMetricTone;
}) {
  const content = (
    <>
      <div className={styles.metricTopline}>
        <span className={styles.metricLabel}>{label}</span>
        {icon ? <span className={styles.metricIcon} aria-hidden="true">{icon}</span> : null}
      </div>
      <strong className={styles.metricValue}>{value}</strong>
      {description ? <span className={styles.metricDescription}>{description}</span> : null}
      {href ? (
        <span className={styles.metricLinkLabel}>
          {linkLabel} <span aria-hidden="true">→</span>
        </span>
      ) : null}
    </>
  );
  const className = `${styles.metricCard} ${metricToneClasses[tone]}`;

  if (href) {
    return (
      <Link className={className} href={href}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
}

export function AdminStatusBadge({
  status,
  label,
}: {
  status: AdminStatus;
  label?: string;
}) {
  return (
    <span className={`${styles.statusBadge} ${statusClasses[status]}`}>
      <span className={styles.statusDot} aria-hidden="true" />
      {label ?? humanizeStatus(status)}
    </span>
  );
}

export function AdminPanel({
  eyebrow,
  title,
  description,
  actions,
  children,
  tone = "white",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  tone?: AdminPanelTone;
}) {
  return (
    <section
      className={`${styles.panel} ${panelToneClasses[tone]}`}
      aria-label={title}
    >
      <div className={styles.panelHeader}>
        <div>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2>{title}</h2>
          {description ? <p className={styles.panelDescription}>{description}</p> : null}
        </div>
        {actions ? <div className={styles.panelActions}>{actions}</div> : null}
      </div>
      <div className={styles.panelBody}>{children}</div>
    </section>
  );
}

export function AdminEmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className={styles.emptyState}>
      <span className={styles.emptyIcon} aria-hidden="true">
        {icon ?? "○"}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className={styles.emptyAction}>{action}</div> : null}
    </div>
  );
}

export function DemoNotice({
  title = "Demonstration data",
  children = "These values are placeholders and are kept separate from live project data.",
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <aside className={styles.demoNotice} aria-label={title} data-demo-content="true">
      <span className={styles.demoMark} aria-hidden="true">i</span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </aside>
  );
}
