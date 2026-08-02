import Link from "next/link";
import type { Locale } from "../content/site-data";
import { CountUp } from "./CountUp";
import styles from "./NeurodiversitySection.module.css";

function t(val: { en: string; zh: string; cn: string }, locale: Locale) {
  return val[locale];
}

const copy = {
  eyebrow: {
    en: "EXPLORE NEURODIVERSITY",
    zh: "探索神經多樣性",
    cn: "探索神经多样性",
  },
  heading: {
    en: "It starts with understanding.\nStigma ends when knowledge begins.",
    zh: "從了解開始。\n偏見在知識面前消失。",
    cn: "从了解开始。\n偏见在知识面前消失。",
  },
  subtitle: {
    en: "Most people in Hong Kong have never met someone with Down syndrome. Meeting our community — and knowing the facts — is how stigma falls away.",
    zh: "香港大多數人從未見過唐氏綜合症人士。認識我們的社群——了解事實——正是消除偏見的方式。",
    cn: "香港大多数人从未见过唐氏综合症人士。认识我们的社群——了解事实——正是消除偏见的方式。",
  },
  factsHeading: {
    en: "Neurodiversity, in numbers (worldwide)",
    zh: "神經多樣性的全球數據",
    cn: "神经多样性的全球数据",
  },
  source: {
    en: "Source: World Health Organization",
    zh: "來源：世界衛生組織",
    cn: "来源：世界卫生组织",
  },
  cta: {
    en: "Explore the neurodiversity hub",
    zh: "探索神經多樣性專區",
    cn: "探索神经多样性专区",
  },
};

const stats = [
  {
    value: { en: "~15%", zh: "~15%", cn: "~15%" },
    label: {
      en: "of neurodiverse adults worldwide are in competitive employment — hired for their talent, not as a favour.",
      zh: "全球神經多樣性成人處於競爭性就業——因才能而非恩惠被聘用。",
      cn: "全球神经多样性成人处于竞争性就业——因才能而非恩惠被聘用。",
    },
    tone: "pink" as const,
  },
  {
    value: { en: "~70%", zh: "~70%", cn: "~70%" },
    label: {
      en: "of our families are single-parent households, most led by a full-time caretaker.",
      zh: "我們的家庭為單親家庭，大多由全職照顧者帶領。",
      cn: "我们的家庭为单亲家庭，大多由全职照顾者带领。",
    },
    tone: "teal" as const,
  },
  {
    value: { en: "1 goal", zh: "1 個目標", cn: "1 个目标" },
    label: {
      en: "to be seen for ability, not judged for difference. Opportunity changes everything.",
      zh: "被看見能力，而非被評判差異。機會改變一切。",
      cn: "被看见能力，而非被评判差异。机会改变一切。",
    },
    tone: "pink" as const,
  },
];

const facts = [
  {
    value: { en: "~1 in 100", zh: "~1/100", cn: "~1/100" },
    label: {
      en: "people worldwide are on the autism spectrum. Neurodiversity isn’t rare — it’s part of being human.",
      zh: "全球人口處於自閉症譜系。神經多樣性並不罕見——它是人類的一部分。",
      cn: "全球人口处于自闭症谱系。神经多样性并不罕见——它是人类的一部分。",
    },
    tone: "blue" as const,
  },
  {
    value: { en: "~1 in 1,000", zh: "~1/1,000", cn: "~1/1,000" },
    label: {
      en: "babies worldwide are born with Down syndrome — each with their own path, personality, and potential.",
      zh: "全球嬰兒出生時患有唐氏綜合症——每一位都有自己的道路、個性和潛力。",
      cn: "全球婴儿出生时患有唐氏综合症——每一位都有自己的道路、个性和潜力。",
    },
    tone: "mint" as const,
  },
];

const routes = {
  hub: {
    en: "/neurodiversity/",
    zh: "/zh/neurodiversity-hk/",
    cn: "/cn/neurodiversity/",
  },
};

export function NeurodiversitySection({ locale }: { locale: Locale }) {
  return (
    <section className={styles.section} aria-labelledby="neurodiversity-title">
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}>{t(copy.eyebrow, locale)}</p>
          <h2 id="neurodiversity-title" className={styles.heading}>
            {t(copy.heading, locale)}
          </h2>
          <p className={styles.subtitle}>{t(copy.subtitle, locale)}</p>
        </header>

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

        <h3 className={styles.factsHeading}>{t(copy.factsHeading, locale)}</h3>
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

        <Link href={t(routes.hub, locale)} className={styles.cta}>
          {t(copy.cta, locale)}
        </Link>
      </div>
    </section>
  );
}
