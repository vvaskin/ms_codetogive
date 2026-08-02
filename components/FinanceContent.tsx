import { financeContent, financeReports, t, type FinanceLocale } from "../content/finance";
import { StatusPill } from "./ui/StatusPill";
import styles from "./FinanceExperience.module.css";

function RoadmapIcon({ name }: { name: "living-room" | "education" | "family-support" }) {
  if (name === "living-room") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
        <path
          d="M4.5 11 12 4.5 19.5 11v8a1 1 0 0 1-1 1h-4.2v-5.2H9.7V20H5.5a1 1 0 0 1-1-1v-8Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "education") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
        <circle cx="8" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="16" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M4.5 17.5c.8-2.2 2.5-3.3 3.5-3.3s2.7 1.1 3.5 3.3M12.5 17.5c.8-2.2 2.5-3.3 3.5-3.3s2.7 1.1 3.5 3.3"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M12 19.2s-6.2-3.8-7.8-7.1C3 9.4 4.4 6.8 7.1 6.5c1.5-.2 2.9.5 3.7 1.7.8-1.2 2.2-1.9 3.7-1.7 2.7.3 4.1 2.9 2.9 5.6-1.6 3.3-7.4 7.1-7.4 7.1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Finance subpage body, shared with the /about "Trust & transparency" section. */
export function FinanceContent({ locale }: { locale: FinanceLocale }) {
  const c = financeContent;
  const latestReport = financeReports.find((report) => report.latest) ?? financeReports[0];

  return (
    <>
      <section className={styles.support} aria-label={t(c.allocation.title, locale)}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.cardEyebrow}>{t(c.allocation.eyebrow, locale)}</p>
            <a className={styles.cardLink} href="#annual-reports">
              {t(c.allocation.viewReports, locale)}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <h2 className={styles.cardTitle}>{t(c.allocation.title, locale)}</h2>
          <ul className={styles.bars}>
            {c.allocation.bars.map((bar) => (
              <li key={bar.key}>
                <div className={styles.barMeta}>
                  <span>{t(bar.label, locale)}</span>
                  <strong>{bar.percent}%</strong>
                </div>
                <div
                  className={styles.barTrack}
                  role="img"
                  aria-label={`${t(bar.label, locale)} ${bar.percent}%`}
                >
                  <span
                    className={`${styles.barFill} ${styles[`bar_${bar.tone}`]}`}
                    style={{ width: `${bar.percent}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className={styles.cardFootnote}>{t(c.allocation.footnote, locale)}</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.cardEyebrow}>{t(c.roadmap.eyebrow, locale)}</p>
            <a
              className={styles.cardLink}
              href={latestReport.href}
              target="_blank"
              rel="noreferrer"
            >
              {t(c.roadmap.readMore, locale)}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <h2 className={styles.cardTitle}>{t(c.roadmap.title, locale)}</h2>
          <ul className={styles.roadmapList}>
            {c.roadmap.items.map((item) => (
              <li key={item.key}>
                <span
                  className={`${styles.roadmapIcon} ${styles[`icon_${item.tone}`]}`}
                  aria-hidden="true"
                >
                  <RoadmapIcon name={item.key} />
                </span>
                <div>
                  <strong>{t(item.title, locale)}</strong>
                  <span>{t(item.detail, locale)}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className={styles.cardFootnote}>{t(c.roadmap.footnote, locale)}</p>
        </div>
      </section>

      <section className={styles.impact} aria-label={t(c.hero.badge, locale)}>
        <ul className={styles.impactList}>
          {c.impact.items.map((item) => (
            <li key={item.value}>
              <strong>{item.value}</strong>
              <span>{t(item.label, locale)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.statements} aria-labelledby="finance-statements-title">
        <div className={styles.sectionIntro}>
          <h2 id="finance-statements-title">{t(c.statements.title, locale)}</h2>
          <p>{t(c.statements.lead, locale)}</p>
        </div>
        <div className={styles.statementGrid}>
          <div className={styles.statementCard}>
            <div className={styles.statementHead}>
              <h3>{t(c.statements.income.title, locale)}</h3>
              <strong className={styles.incomeTotal}>
                {c.statements.income.total}
              </strong>
            </div>
            <ul>
              {c.statements.income.rows.map((row) => (
                <li key={row.label.en}>
                  <span>{t(row.label, locale)}</span>
                  <span className={styles.rowFigures}>
                    <strong>{row.amount}</strong>
                    <em>{row.percent}</em>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.statementCard}>
            <div className={styles.statementHead}>
              <h3>{t(c.statements.expenditure.title, locale)}</h3>
              <strong className={styles.spendTotal}>
                {c.statements.expenditure.total}
              </strong>
            </div>
            <ul>
              {c.statements.expenditure.rows.map((row) => (
                <li key={row.label.en}>
                  <span>{t(row.label, locale)}</span>
                  <span className={styles.rowFigures}>
                    <strong>{row.amount}</strong>
                    <em>{row.percent}</em>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className={styles.governance}
        id="annual-reports"
        aria-labelledby="finance-governance-title"
      >
        <div className={styles.governanceCopy}>
          <StatusPill tone="blue">{t(c.governance.badge, locale)}</StatusPill>
          <h2 id="finance-governance-title">{t(c.governance.title, locale)}</h2>
          {c.governance.paragraphs.map((paragraph) => (
            <p key={paragraph.en}>{t(paragraph, locale)}</p>
          ))}
        </div>

        <div className={styles.reportsCard}>
          <div className={styles.reportsHead}>
            <span className={styles.docIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
                <path
                  d="M7 3.5h7.2L19 8.2V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5H7Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M14 3.5V8h5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M9 12h6M9 15.5h6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <h3>{t(c.governance.reportsTitle, locale)}</h3>
          </div>
          <ul className={styles.reportList}>
            {financeReports.map((report) => (
              <li key={report.id}>
                <div className={styles.reportMeta}>
                  <span>{t(report.label, locale)}</span>
                  {report.latest ? (
                    <StatusPill tone="pink">
                      {t(c.governance.latestBadge, locale)}
                    </StatusPill>
                  ) : null}
                </div>
                <a
                  href={report.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.reportView}
                >
                  {t(c.governance.viewLabel, locale)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
