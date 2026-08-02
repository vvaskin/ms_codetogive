import Link from "next/link";
import type { Locale } from "../content/site-data";
import styles from "./GiveSection.module.css";

function t(val: { en: string; zh: string; cn: string }, locale: Locale) {
  return val[locale];
}

const copy = {
  questionLine1: {
    en: "What if the thing that changed someone's life",
    zh: "如果改變一個人一生的事情",
    cn: "如果改变一个人一生的事情",
  },
  questionLine2: {
    en: "was just one afternoon of yours?",
    zh: "只是你的一個下午？",
    cn: "只是你的一个下午？",
  },
  subtitle: {
    en: "Our members don't need saving. They need people who show up.",
    zh: "我們的會員不需要被拯救，他們需要有人出現。",
    cn: "我们的会员不需要被拯救，他们需要有人出现。",
  },
  pickPath: {
    en: "pick your path ↓",
    zh: "選擇你的方式 ↓",
    cn: "选择你的方式 ↓",
  },
  timeTitle: {
    en: "Show up for someone",
    zh: "為某個人出現",
    cn: "为某个人出现",
  },
  role1Title: {
    en: "Swim alongside someone learning to float",
    zh: "陪伴一個正在學浮水的人游泳",
    cn: "陪伴一个正在学浮水的人游泳",
  },
  role1Meta: {
    en: "Sports coach · Saturday mornings · 3 spots",
    zh: "體育教練 · 週六早上 · 3 個名額",
    cn: "体育教练 · 周六早上 · 3 个名额",
  },
  role2Title: {
    en: "Be the reason a family feels welcome",
    zh: "讓一個家庭感到被歡迎",
    cn: "让一个家庭感到被欢迎",
  },
  role2Meta: {
    en: "Event volunteer · Flexible hours · 5 spots",
    zh: "活動義工 · 彈性時間 · 5 個名額",
    cn: "活动义工 · 弹性时间 · 5 个名额",
  },
  timeCta: {
    en: "See where you fit",
    zh: "找到你的位置",
    cn: "找到你的位置",
  },
  giftTitle: {
    en: "Give from where you are",
    zh: "在你所在的地方付出",
    cn: "在你所在的地方付出",
  },
  amount1Title: {
    en: "HK$100 puts someone in the pool for the first time",
    zh: "港幣 100 元讓一個人第一次踏入泳池",
    cn: "港币 100 元让一个人第一次踏入泳池",
  },
  amount1Desc: {
    en: "One swimming lesson — the start of something big",
    zh: "一堂游泳課——偉大的開始",
    cn: "一堂游泳课——伟大的开始",
  },
  amount2Title: {
    en: "HK$500 carries a member through an entire term",
    zh: "港幣 500 元支持一位會員完成整個學期",
    cn: "港币 500 元支持一位会员完成整个学期",
  },
  amount2Desc: {
    en: "Equipment, coaching, and a place to belong",
    zh: "器材、教練和一個歸屬感",
    cn: "器材、教练和一个归属感",
  },
  giftCta: {
    en: "Make a gift",
    zh: "捐助",
    cn: "捐助",
  },
  giftLink: {
    en: "Other ways to give →",
    zh: "其他捐助方式 →",
    cn: "其他捐助方式 →",
  },
};

const routes = {
  volunteer: { en: "/our-volunteer/", zh: "/zh/our-volunteer-hk/", cn: "/cn/our-volunteer/" },
  donate: { en: "/donate/", zh: "/zh/donate-hk/", cn: "/cn/donate/" },
  donateItems: { en: "/donate/?mode=items", zh: "/zh/donate-hk/?mode=items", cn: "/cn/donate/?mode=items" },
};

export function GiveSection({ locale }: { locale: Locale }) {
  return (
    <section className={styles.section} aria-labelledby="give-section-title">
      <div className={styles.inner}>
        <div className={styles.questionBlock}>
          <h2 className={styles.questionLine1} id="give-section-title">
            {t(copy.questionLine1, locale)}
          </h2>
          <p className={styles.questionLine2}>
            {t(copy.questionLine2, locale)}
          </p>
          <p className={styles.subtitle}>{t(copy.subtitle, locale)}</p>
        </div>

        <p className={styles.pickPath}>{t(copy.pickPath, locale)}</p>

        <div className={styles.columns}>
          <div className={styles.timeCol}>
            <h3 className={styles.colTitle}>{t(copy.timeTitle, locale)}</h3>
            <div className={styles.divider} />
            <div className={styles.role}>
              <p className={styles.roleTitle}>{t(copy.role1Title, locale)}</p>
              <p className={styles.roleMeta}>{t(copy.role1Meta, locale)}</p>
            </div>
            <div className={styles.role}>
              <p className={styles.roleTitle}>{t(copy.role2Title, locale)}</p>
              <p className={styles.roleMeta}>{t(copy.role2Meta, locale)}</p>
            </div>
            <Link href={t(routes.volunteer, locale)} className={styles.outlineCta}>
              {t(copy.timeCta, locale)}
            </Link>
          </div>

          <div className={styles.giftCol}>
            <h3 className={styles.colTitlePink}>{t(copy.giftTitle, locale)}</h3>
            <div className={styles.dividerPink} />
            <div className={styles.role}>
              <p className={styles.roleTitle}>{t(copy.amount1Title, locale)}</p>
              <p className={styles.roleMeta}>{t(copy.amount1Desc, locale)}</p>
            </div>
            <div className={styles.role}>
              <p className={styles.roleTitle}>{t(copy.amount2Title, locale)}</p>
              <p className={styles.roleMeta}>{t(copy.amount2Desc, locale)}</p>
            </div>
            <div className={styles.giftActions}>
              <Link href={t(routes.donate, locale)} className={styles.pinkCta}>
                {t(copy.giftCta, locale)}
              </Link>
              <Link href={t(routes.donateItems, locale)} className={styles.giftLink}>
                {t(copy.giftLink, locale)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
