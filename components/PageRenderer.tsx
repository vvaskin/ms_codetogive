import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  boardMembers,
  getPage,
  images,
  mediaArticles,
  SitePage,
} from "../content/site-data";
import {
  AccountForm,
  ContactForm,
  VolunteerForm,
} from "./DemoForms";
import { DonateExperience } from "./DonateExperience";
import { InstagramFeed } from "./InstagramFeed";
import styles from "./PageRenderer.module.css";

function PageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.pageHeading}>
      <h1>{children}</h1>
    </div>
  );
}

function StandardPage({ page }: { page: SitePage }) {
  return (
    <article className={styles.contentPage}>
      <PageHeading>{page.title}</PageHeading>
      {page.image && (
        <div className={styles.featureImage}>
          <Image src={page.image} alt={page.title} fill unoptimized sizes="(max-width: 900px) 100vw, 800px" />
        </div>
      )}
      <div className={styles.prose}>
        {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </article>
  );
}

function ProgrammesPage({ zh }: { zh: boolean }) {
  const programmes = zh
    ? [
        {
          id: "sport",
          title: "體育",
          image: images.sports,
          paragraphs: [
            "我們的體育計劃不設限制，致力為會員提供充分發揮潛能的機會。",
            "除了運動課堂，我們亦注重力量訓練、協調能力及心理健康活動。",
          ],
        },
        {
          id: "nutrition",
          title: "飲食與營養",
          image: images.nutrition,
          paragraphs: [
            "我們提供個人營養支援和指導，協助會員及家庭建立健康生活方式。",
            "我們亦定期舉辦烹飪及食物準備課堂。",
          ],
        },
        {
          id: "family",
          title: "家庭",
          image: images.family,
          paragraphs: [
            "Love 21重視整個家庭，為家長提供專屬課堂、輔導和參與活動的機會。",
          ],
        },
        {
          id: "csr",
          title: "企業社會責任",
          image: images.csr,
          paragraphs: [
            "企業夥伴透過共同活動了解會員的能力，建立更共融的香港。",
          ],
        },
      ]
    : [
        {
          id: "sport",
          title: "Sports",
          image: images.sports,
          paragraphs: [
            "Our sports programme is designed without limitations. We aim to give our beneficiaries the greatest opportunity to reach their full potential by offering a comprehensive range of activities while also striving for excellence in each sport.",
            "In addition to sport classes, we also focus on strength training, coordination and mental health activities.",
          ],
        },
        {
          id: "nutrition",
          title: "Nutrition",
          image: images.nutrition,
          paragraphs: [
            "Sport classes alone are not enough to significantly extend the life expectancy of our beneficiaries. This is why we’ve developed a well thought out nutrition programme to give our community the support and guidance needed to make healthy lifestyle changes.",
            "We also run regular cooking and food preparation lessons for families.",
          ],
        },
        {
          id: "family",
          title: "Family",
          image: images.family,
          paragraphs: [
            "Love 21’s focus on family sets us apart. We offer specialty classes for parents and allow parental participation in many sport and healthy lifestyle classes.",
          ],
        },
        {
          id: "csr",
          title: "CSR",
          image: images.csr,
          paragraphs: [
            "Our Corporate Social Responsibility Programme helps Hong Kong organisations learn about the community through shared activity and human connection.",
            "If you’d like to learn more, please contact our Founder/CEO at jeff@love21foundation.com.",
          ],
        },
      ];

  return (
    <article className={`${styles.contentPage} ${styles.programmesPage}`}>
      <PageHeading>{zh ? "我們的計劃" : "OUR PROGRAMMES"}</PageHeading>
      {programmes.map((programme, index) => (
        <section className={styles.programmeRow} id={programme.id} key={programme.title}>
          <div className={styles.programmePhoto}>
            <Image
              src={programme.image}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 800px) 100vw, 45vw"
            />
          </div>
          <div className={styles.programmeCopy}>
            <h2>{programme.title}</h2>
            {programme.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {index < programmes.length - 1 && <div className={styles.wideRule} />}
        </section>
      ))}
    </article>
  );
}

function ReportsPage({ page }: { page: SitePage }) {
  const reports = [
    ["2024-2025 Annual Report", "/assets/reports/annual-report-2024-2025.pdf"],
    ["2023-2024 Annual Report", "/assets/reports/annual-report-2023-2024.pdf"],
    ["2022-2023 Annual Report", "/assets/reports/annual-report-2022-2023.pdf"],
  ];
  return (
    <article className={styles.contentPage}>
      <PageHeading>{page.title}</PageHeading>
      <div className={`${styles.prose} ${styles.centered}`}>
        {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className={styles.reportLinks}>
        {reports.map(([label, href]) => (
          <a href={href} target="_blank" rel="noreferrer" key={href}>
            {label} <span>➜</span>
          </a>
        ))}
      </div>
    </article>
  );
}

function MediaIndex({ zh }: { zh: boolean }) {
  return (
    <article className={styles.contentPage}>
      <PageHeading>{zh ? "媒體報導" : "MEDIA"}</PageHeading>
      <div className={styles.mediaGrid}>
        {mediaArticles.map((article) => (
          <article className={styles.mediaCard} key={article.slug}>
            <Link href={`/${article.slug}/`} className={styles.mediaCardImage}>
              {article.image && (
                <Image
                  src={article.image}
                  alt=""
                  fill
                  unoptimized
                  sizes="(max-width: 800px) 100vw, 33vw"
                />
              )}
            </Link>
            <div>
              <span>{article.date}</span>
              <h2>
                <Link href={`/${article.slug}/`}>{article.title}</Link>
              </h2>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}

function PeopleIndex({ page }: { page: SitePage }) {
  const zh = page.locale === "zh";
  return (
    <article className={styles.contentPage}>
      <PageHeading>{page.title}</PageHeading>
      <div className={`${styles.prose} ${styles.centered}`}>
        {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className={styles.peopleGrid}>
        {boardMembers.map((person) => (
          <Link
            key={person.slug}
            href={zh ? "/zh/board-of-directors-hk/" : `/board-of-directors/${person.slug}/`}
            className={styles.personCard}
          >
            <div>
              <Image
                src={person.image}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 700px) 50vw, 25vw"
              />
            </div>
            <h2>{person.name}</h2>
          </Link>
        ))}
      </div>
    </article>
  );
}

function PersonPage({ page }: { page: SitePage }) {
  return (
    <article className={styles.contentPage}>
      <PageHeading>BOARD OF DIRECTORS</PageHeading>
      <div className={styles.profileLayout}>
        {page.image && (
          <div className={styles.profileImage}>
            <Image src={page.image} alt={page.title} fill unoptimized sizes="(max-width: 700px) 80vw, 35vw" />
          </div>
        )}
        <div className={styles.profileCopy}>
          <h2>{page.title}</h2>
          {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </article>
  );
}

function VolunteerPage({ page }: { page: SitePage }) {
  const zh = page.locale === "zh";
  return (
    <article className={styles.contentPage}>
      <PageHeading>{page.title}</PageHeading>
      {page.image && (
        <div className={styles.featureImage}>
          <Image src={page.image} alt="" fill unoptimized sizes="(max-width: 900px) 100vw, 800px" />
        </div>
      )}
      <div className={`${styles.prose} ${styles.centered}`}>
        {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <VolunteerForm zh={zh} />
      <div className={styles.handsonBlock}>
        <Image src="/assets/images/handson.png" width={180} height={180} unoptimized alt="HandsOn Hong Kong" />
        <p>
          {zh
            ? "Love 21亦與HandsOn Hong Kong合作，義工可透過其平台查看活動。"
            : "We are also partnered with HandsOn Hong Kong. Visit their website to view the volunteering schedule and register through their dashboard."}
        </p>
        <a
          href="https://www.handsonhongkong.org/project-calendar"
          target="_blank"
          rel="noreferrer"
        >
          HandsOn Hong Kong ➜
        </a>
      </div>
    </article>
  );
}

function ContactPage({ page }: { page: SitePage }) {
  const zh = page.locale === "zh";
  return (
    <article className={`${styles.contentPage} ${styles.narrowPage}`}>
      <PageHeading>{page.title}</PageHeading>
      <div className={styles.prose}>
        <p>
          {zh
            ? "如果你想加入計劃、捐款、做義工或了解更多，歡迎聯絡我們。"
            : "If you’d like to join our programme, donate, volunteer or find out more information, please get in touch. We’d love to hear from you!"}
        </p>
        <p>
          Love 21 Space: 2/F, Trium Lab, 21 Luk Hop Street, San Po Kong, Kowloon
          <br />
          Love 21 Office: 1102, 11/F, Trium Lab, 21 Luk Hop Street, San Po Kong,
          Kowloon
        </p>
        <p>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLScxXfbxdMlHBDphqwJhMZS1YuUuF9anGC8Mb_ncgpwiEes-Pw/viewform"
            target="_blank"
            rel="noreferrer"
          >
            {zh ? "會員登記表 ➜" : "Member registration form ➜"}
          </a>
        </p>
      </div>
      <ContactForm zh={zh} />
    </article>
  );
}

function DonatePage({ page }: { page: SitePage }) {
  const locale = page.locale === "zh" ? "zh" : "en";
  return <DonateExperience locale={locale} />;
}

function JoinPage({ zh }: { zh: boolean }) {
  return (
    <article className={`${styles.contentPage} ${styles.narrowPage}`}>
      <PageHeading>{zh ? "實習機會" : "INTERNSHIP OPPORTUNITIES"}</PageHeading>
      <div className={styles.prose}>
        <p>
          {zh
            ? "我們歡迎相關學科的學生申請Love 21實習。"
            : "We welcome students majoring in related fields to apply for an internship at Love 21. Interns gain first-hand experience in the operations and management of a growing NGO."}
        </p>
        <h2>{zh ? "實習工作可能包括" : "Roles may include"}</h2>
        <ul>
          <li>Devising a sports programme for our community</li>
          <li>Managing the operations of Love 21 Space</li>
          <li>Proposal writing and programme reporting</li>
          <li>Refining and executing the nutrition programme</li>
          <li>Administrative, marketing and design work</li>
        </ul>
        <h2>{zh ? "要求" : "Requirements"}</h2>
        <ul>
          <li>Fluent English and Chinese, written and spoken</li>
          <li>Currently enrolled in university</li>
          <li>Flexible, compassionate and proactive</li>
        </ul>
        <p>
          For interested parties, contact Jeff at jeff@love21foundation.com and
          Maggie at maggie@love21foundation.com.
        </p>
      </div>
    </article>
  );
}

export function PageRenderer({ path }: { path: string }) {
  const page = getPage(path);
  if (!page) notFound();

  switch (page.template) {
    case "standard":
    case "article":
      return <StandardPage page={page} />;
    case "programmes":
      return <ProgrammesPage zh={page.locale === "zh"} />;
    case "reports":
      return <ReportsPage page={page} />;
    case "media-index":
      return <MediaIndex zh={page.locale === "zh"} />;
    case "people-index":
      return <PeopleIndex page={page} />;
    case "person":
      return <PersonPage page={page} />;
    case "volunteer":
      return <VolunteerPage page={page} />;
    case "contact":
      return <ContactPage page={page} />;
    case "donate":
      return <DonatePage page={page} />;
    case "account":
      return (
        <article className={`${styles.contentPage} ${styles.accountPage}`}>
          <PageHeading>{page.title}</PageHeading>
          <AccountForm title={page.title} zh={page.locale === "zh"} />
        </article>
      );
    case "calendar":
      return (
        <article className={`${styles.contentPage} ${styles.calendarPage}`}>
          <PageHeading>{page.title}</PageHeading>
      <p>
        {page.locale === "zh" ? (
          <>
            如你希望義務為我們的會員每星期教授一堂課，或支援現有的課堂，歡迎聯絡我們的計劃經理：
            <a href="mailto:maggie@love21foundation.com">
              maggie@love21foundation.com
            </a>
            。
          </>
        ) : (
          <>
            If you’d like to commit to teaching your own weekly class for our
            beneficiaries or support an existing class, please contact our
            Programme Manager at{" "}
            <a href="mailto:maggie@love21foundation.com">
              maggie@love21foundation.com
            </a>
            .
          </>
        )}
      </p>
      <h2>{page.locale === "zh" ? "最新Instagram貼文" : "Latest from Instagram"}</h2>
      <InstagramFeed />
    </article>
      );
    case "join":
      return <JoinPage zh={page.locale === "zh"} />;
  }
}
