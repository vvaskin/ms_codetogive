import Link from "next/link";
import styles from "./page.module.css";

type TopicIconName = "leaf" | "book" | "target" | "numbers" | "bolt" | "spectrum";

const mythRows = [
  {
    myth: "They can't hold a real job.",
    fact: "16% are in full-time work today, but 77% of unemployed autistic adults want to work. The gap is opportunity, not ability.",
  },
  {
    myth: "Down syndrome means a short, limited life.",
    fact: "People with Down syndrome study, work, form relationships, and live rich, independent or supported lives with the right opportunities.",
  },
  {
    myth: "Autism only looks one way.",
    fact: "It is a spectrum. No two autistic people are the same; strengths, challenges and personalities vary as widely as in anyone else.",
  },
  {
    myth: "Hiring them is charity, not a business decision.",
    fact: "Companies that hire neurodivergent talent report strong performance, loyalty and fresh problem-solving, hired for skill, not sympathy.",
  },
] as const;

const widerCards = [
  {
    icon: "leaf",
    label: "~7%",
    labelSub: "of children worldwide",
    labelColor: "blue",
    title: "ADHD",
    desc: "Affects attention, impulse control and activity levels. Often brings intense focus, creativity and energy alongside the challenges.",
    source: "Source: Global meta-analysis, 175 studies",
  },
  {
    icon: "book",
    label: "~1 in 10",
    labelSub: "of people worldwide",
    labelColor: "blue",
    title: "Dyslexia",
    desc: "A learning difference that affects reading and spelling, unrelated to intelligence. Many dyslexic people excel at spatial reasoning and problem-solving.",
    source: "Source: International Dyslexia Association",
  },
  {
    icon: "target",
    label: "Common",
    labelSub: "developmental condition",
    labelColor: "pink",
    title: "Dyspraxia",
    desc: "Affects coordination and motor planning. Often accompanied by strong verbal skills and determination.",
    source: "",
  },
  {
    icon: "numbers",
    label: "Common",
    labelSub: "learning difference",
    labelColor: "pink",
    title: "Dyscalculia",
    desc: "Makes working with numbers and quantities harder, distinct from general math dislike. Often paired with strong verbal or creative strengths.",
    source: "",
  },
  {
    icon: "bolt",
    label: "Under-recognised",
    labelSub: "neurological condition",
    labelColor: "teal",
    title: "Tourette's & tics",
    desc: "Involves involuntary movements or sounds. Frequently misunderstood in public, despite having no bearing on intelligence or character.",
    source: "",
  },
  {
    icon: "spectrum",
    label: "Every brain",
    labelSub: "is different",
    labelColor: "pink",
    title: "And more",
    desc: "Neurodivergence also includes conditions like OCD, sensory processing differences, and more: a spectrum, not a checklist.",
    source: "",
  },
] as const;

function TopicIcon({ name }: { name: TopicIconName }) {
  if (name === "leaf") {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label="Leaf icon">
        <path
          d="M19.5 4.5c-5.8 0-10.5 4.7-10.5 10.5 0 2.5 0.8 3.8 2.1 4.9 2.7 2.3 7.4 1.7 9.7-0.8 2.4-2.5 2.8-7.4 1.2-14.6-1 0-1.9 0-2.5 0z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6 18c2.4-0.4 4.6-1.8 6.3-3.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "book") {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label="Book icon">
        <path
          d="M4 6.5c0-1.1 0.9-2 2-2h12c1.1 0 2 0.9 2 2v11.5H8c-1.1 0-2 0.9-2 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 20V6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (name === "target") {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label="Target icon">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="1.3" fill="currentColor" />
      </svg>
    );
  }

  if (name === "numbers") {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label="Numbers icon">
        <path
          d="M7 6.5L5.8 17.5M11 6.5L9.8 17.5M4.5 10.2h8M4 14.3h8M15 8.5h5M15 12h5M15 15.5h5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "bolt") {
    return (
      <svg viewBox="0 0 24 24" role="img" aria-label="Lightning icon">
        <path
          d="M13.4 2.8L5.8 13.2h4.9l-1 8 8.5-11h-5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="Spectrum icon">
      <path
        d="M4 14a8 8 0 0 1 16 0M6.9 14a5.1 5.1 0 0 1 10.2 0M10 14a2 2 0 0 1 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ctaStats = [
  { num: "490+", label: "families supported" },
  { num: "~1,000", label: "classes & activities / month" },
  { num: "26", label: "members trained for real jobs" },
  { num: "6,000+", label: "hours of real employment" },
] as const;

export default function NeurodiversityHubPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.heroTab}>Neurodiversity Hub</p>
        <h1>
          Every mind works differently.
          <br />
          That is not a flaw.
        </h1>
        <p>
          Down syndrome, autism and other forms of neurodivergence are widely misunderstood, not
          because they are rare, but because most people never had the chance to learn. Here are
          the facts, sourced and cited.
        </p>
      </section>

      <section className={styles.centerSection}>
        <p className={styles.sectionTag}>What is Neurodiversity?</p>
        <h2>A word for natural variation in how brains work.</h2>
        <p>
          Neurodiversity is the idea that differences in how people think, learn, communicate and
          process the world, including Down syndrome, autism, ADHD and dyslexia, are natural human
          variation, not deficits to be fixed. The goal is not to make everyone the same. It is to
          build a world where different minds get a fair shot.
        </p>
      </section>

      <section className={styles.blushSection}>
        <div className={styles.twoCol}>
          <div>
            <span className={styles.chipPink}>Down Syndrome</span>
            <h2>An extra chromosome. A whole person.</h2>
            <p>
              Down syndrome happens when a person is born with a full or partial extra copy of
              chromosome 21, which is exactly where &quot;Love 21&quot; gets its name. It is a genetic
              difference, not an illness, and it cannot be caught or prevented by anything a parent
              does.
            </p>
            <p>
              People with Down syndrome have their own personalities, talents and interests, just
              like anyone else. Many read, write, hold jobs, form relationships, and live full,
              independent or semi-independent lives with the right support and opportunity.
            </p>
          </div>
          <div className={styles.cardsCol}>
            <article className={styles.statCard}>
              <p className={styles.statPink}>1 in 1,000</p>
              <p>
                babies worldwide are born with Down syndrome, the most common chromosomal
                condition.
              </p>
              <small>Source: World Health Organization</small>
            </article>
            <article className={styles.statCard}>
              <p className={styles.statPink}>3 copies</p>
              <p>
                of chromosome 21, instead of the usual 2, hence Trisomy 21, the medical name for
                Down syndrome.
              </p>
              <small>Source: WHO</small>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.skySection}>
        <div className={styles.twoCol}>
          <div className={styles.cardsCol}>
            <article className={styles.statCard}>
              <p className={styles.statBlue}>1 in 100</p>
              <p>
                people worldwide are on the autism spectrum. It is not rare, it is common, and
                often invisible.
              </p>
              <small>Source: World Health Organization</small>
            </article>
            <div className={styles.miniGrid}>
              <article className={styles.statCard}>
                <p className={styles.statBlue}>16%</p>
                <p>of autistic adults are in full-time paid work.</p>
                <small>National Autistic Society, UK</small>
              </article>
              <article className={styles.statCard}>
                <p className={styles.statBlue}>77%</p>
                <p>of unemployed autistic adults say they want to work.</p>
                <small>National Autistic Society, UK</small>
              </article>
            </div>
          </div>
          <div>
            <span className={styles.chipBlue}>Autism</span>
            <h2>A different way of thinking, not a lesser one.</h2>
            <p>
              Autism is a developmental condition that affects how a person communicates, processes
              sensory information, and interacts with the world. It is called a spectrum because it
              looks different in every person.
            </p>
            <p>
              The employment numbers here do not reflect ability, they reflect access. The 77%
              figure says it plainly: autistic adults want to work at nearly the same rate as
              anyone else. What is missing is opportunity, not capability.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.whiteSection}>
        <div className={styles.midWrap}>
          <p className={styles.sectionTagPink}>Myths vs. Facts</p>
          <h2>What people get wrong and what is actually true.</h2>
          <div className={styles.mythList}>
            {mythRows.map((row) => (
              <div key={row.myth} className={styles.mythRow}>
                <article className={styles.mythCard}>
                  <span aria-hidden="true">✕</span>
                  <p>{row.myth}</p>
                </article>
                <article className={styles.factCard}>
                  <span aria-hidden="true">✓</span>
                  <p>{row.fact}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sandSection}>
        <div className={styles.wideWrap}>
          <p className={styles.sectionTag}>The Wider Neurodiverse Community</p>
          <h2>Down syndrome and autism are just part of the picture.</h2>
          <div className={styles.cardGrid}>
            {widerCards.map((card) => (
              <article key={card.title} className={styles.topicCard}>
                <div className={styles.topicTop}>
                  <span className={styles.topicIcon} aria-hidden="true">
                    <TopicIcon name={card.icon} />
                  </span>
                  <div className={styles.topicMetric}>
                    <p className={card.labelColor === "blue" ? styles.metricBlue : card.labelColor === "teal" ? styles.metricTeal : styles.metricPink}>
                      {card.label}
                    </p>
                    <p>{card.labelSub}</p>
                  </div>
                </div>
                <p className={styles.topicTitle}>{card.title}</p>
                <p className={styles.topicDesc}>{card.desc}</p>
                {card.source ? <small>{card.source}</small> : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.darkCta}>
        <span>See it in action</span>
        <h2>This is not theory. It is what Love 21 does every day.</h2>
        <div className={styles.ctaStats}>
          {ctaStats.map((stat) => (
            <article key={stat.num}>
              <p>{stat.num}</p>
              <small>{stat.label}</small>
            </article>
          ))}
        </div>
        <div className={styles.ctaButtons}>
          <Link href="/stories/" className={styles.ctaPrimary}>
            See our community in action
          </Link>
          <Link href="/signup?role=contributor" className={styles.ctaSecondary}>
            Volunteer with us
          </Link>
        </div>
      </section>
    </main>
  );
}
