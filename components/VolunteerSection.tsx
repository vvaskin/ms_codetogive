import Link from "next/link";
import type { Locale } from "../content/site-data";
import { EventsCarousel, type UpcomingEvent } from "./EventsCarousel";
import styles from "./VolunteerSection.module.css";

function t(val: { en: string; zh: string; cn: string }, locale: Locale) {
  return val[locale];
}

const copy = {
  eyebrow: { en: "JOIN 249 VOLUNTEERS", zh: "加入249位義工", cn: "加入249位义工" },
  heading1: { en: "No experience needed.", zh: "無需經驗。", cn: "无需经验。" },
  heading2: {
    en: "Just show up — we'll show you how.",
    zh: "只要出現——我們會教你怎麼做。",
    cn: "只要出现——我们会教你怎么做。",
  },
  subtitle: {
    en: "Whether you have an hour or a whole Saturday, there's a role for you. Ages 14+, individuals or corporates.",
    zh: "無論你有一小時還是整個週六，都有適合你的角色。14歲以上，個人或企業。",
    cn: "无论你有一小时还是整个周六，都有适合你的角色。14岁以上，个人或企业。",
  },
  signUp: { en: "Sign up to volunteer →", zh: "報名成為義工 →", cn: "报名成为义工 →" },
  learnMore: {
    en: "Learn what volunteering looks like →",
    zh: "了解義工體驗 →",
    cn: "了解义工体验 →",
  },
};

const routes = {
  volunteerSignup: {
    en: "/signup?role=contributor",
    zh: "/zh/signup-hk/?role=contributor",
    cn: "/cn/signup-hk/?role=contributor",
  },
  stories: { en: "/stories", zh: "/zh/stories", cn: "/cn/stories" },
};

export function VolunteerSection({
  events,
  locale,
}: {
  events: UpcomingEvent[];
  locale: Locale;
}) {
  return (
    <section className={styles.section} aria-labelledby="volunteer-title">
      <div className={styles.inner}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{t(copy.eyebrow, locale)}</p>
          <h2 id="volunteer-title" className={styles.heading1}>
            {t(copy.heading1, locale)}
          </h2>
          <p className={styles.heading2}>{t(copy.heading2, locale)}</p>
          <p className={styles.subtitle}>{t(copy.subtitle, locale)}</p>
        </div>
      </div>

      <EventsCarousel events={events} locale={locale} />

      <div className={styles.inner}>
        <div className={styles.ctaRow}>
          <Link href={t(routes.volunteerSignup, locale)} className={styles.ctaButton}>
            {t(copy.signUp, locale)}
          </Link>
          <Link href={t(routes.stories, locale)} className={styles.ctaLink}>
            {t(copy.learnMore, locale)}
          </Link>
        </div>
      </div>
    </section>
  );
}
