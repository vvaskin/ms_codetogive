import Link from "next/link";
import type { Locale } from "../content/site-data";
import { CountUp } from "./CountUp";
import styles from "./CommunitySection.module.css";

function t(val: { en: string; zh: string; cn: string }, locale: Locale) {
  return val[locale];
}

const copy = {
  eyebrow: {
    en: "LEARN ABOUT OUR COMMUNITY",
    zh: "了解我們的社群",
    cn: "了解我们的社群",
  },
  heading: {
    en: "This isn’t an ability issue.\nIt’s an opportunity issue.",
    zh: "這不是能力問題。\n這是機會問題。",
    cn: "这不是能力问题。\n这是机会问题。",
  },
  subtitle: {
    en: "Love 21 creates opportunities for Hong Kong’s Down syndrome, autistic and neurodiverse community to build health, confidence and connection.",
    zh: "Love 21 為香港唐氏綜合症、自閉症及神經多樣性社群創造機會，建立健康、自信和連結。",
    cn: "Love 21 为香港唐氏综合症、自闭症及神经多样性社群创造机会，建立健康、自信和连结。",
  },
  factsHeading: {
    en: "LOVE 21, IN AUDITED NUMBERS",
    zh: "LOVE 21，經審計數據",
    cn: "LOVE 21，经审计数据",
  },
  source: {
    en: "Source: Love 21 FY2024–25 audited Annual Report and approved programme information.",
    zh: "來源：Love 21 FY2024–25 經審計年度報告及核准計劃資訊。",
    cn: "来源：Love 21 FY2024–25 经审计年度报告及核准计划资讯。",
  },
  cta: {
    en: "Learn about Love 21",
    zh: "了解 Love 21",
    cn: "了解 Love 21",
  },
};

const stats = [
  {
    value: { en: "6,859", zh: "6,859", cn: "6,859" },
    label: {
      en: "sessions delivered in\nFY2024–25",
      zh: "FY2024–25\n課程次數",
      cn: "FY2024–25\n课程次数",
    },
    tone: "pink" as const,
  },
  {
    value: { en: "84", zh: "84", cn: "84" },
    label: {
      en: "activity types offered in\nFY2024–25",
      zh: "FY2024–25\n活動類型",
      cn: "FY2024–25\n活动类型",
    },
    tone: "blue" as const,
  },
  {
    value: { en: "1 goal", zh: "1 個目標", cn: "1 个目标" },
    label: {
      en: "opportunity, inclusion and\nsupport for every family",
      zh: "為每個家庭提供機會、\n包容和支持",
      cn: "为每个家庭提供机会、\n包容和支持",
    },
    tone: "pink" as const,
  },
];

const facts = [
  {
    value: { en: "490", zh: "490", cn: "490" },
    label: {
      en: "families supported in FY2024–25",
      zh: "FY2024–25 受惠家庭",
      cn: "FY2024–25 受惠家庭",
    },
    tone: "blue" as const,
  },
  {
    value: { en: "90%+", zh: "90%+", cn: "90%+" },
    label: {
      en: "of donations reach families",
      zh: "捐款直達家庭",
      cn: "捐款直达家庭",
    },
    tone: "mint" as const,
  },
];

const routes = {
  about: {
    en: "/about-us/",
    zh: "/zh/about-us-hk/",
    cn: "/cn/about-us/",
  },
};

export function CommunitySection({ locale }: { locale: Locale }) {
  return (
    <section className={styles.section} aria-labelledby="community-title">
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{t(copy.eyebrow, locale)}</p>
          <h2 id="community-title" className={styles.heading}>
            {t(copy.heading, locale)}
          </h2>
          <p className={styles.subtitle}>{t(copy.subtitle, locale)}</p>
        </header>

        <hr className={styles.divider} />

        <ul className={styles.stats}>
          {stats.map((stat) => (
            <li
              key={t(stat.value, locale)}
              className={`${styles.statCard} ${styles[`card_${stat.tone}`]}`}
            >
              <strong>
                <CountUp value={t(stat.value, locale)} className={styles.countUp} />
              </strong>
              <span>{t(stat.label, locale)}</span>
            </li>
          ))}
        </ul>

        <hr className={styles.divider} />

        <div className={styles.factsBlock}>
          <h3 className={styles.factsHeading}>
            {t(copy.factsHeading, locale)}
          </h3>
          <div className={styles.facts}>
            {facts.map((fact) => (
              <article
                key={t(fact.value, locale)}
                className={`${styles.factCard} ${styles[`fact_${fact.tone}`]}`}
              >
                <strong>{t(fact.value, locale)}</strong>
                <span>{t(fact.label, locale)}</span>
              </article>
            ))}
          </div>
          <p className={styles.source}>{t(copy.source, locale)}</p>
        </div>

        <Link href={t(routes.about, locale)} className={styles.cta}>
          {t(copy.cta, locale)}
        </Link>
      </div>
    </section>
  );
}
