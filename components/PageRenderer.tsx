import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  boardMembers,
  getPage,
  type Locale,
  SitePage,
} from "../content/site-data";
import {
  AccountForm,
  VolunteerForm,
} from "./DemoForms";
import { AboutExperience } from "./AboutExperience";
import { ActivitiesExperience } from "./ActivitiesExperience";
import { ContactExperience } from "./ContactExperience";
import { DonateExperience } from "./DonateExperience";
import { FinanceExperience } from "./FinanceExperience";
import { GetInvolvedExperience } from "./GetInvolvedExperience";
import { MediaExperience } from "./MediaExperience";
import { ProgrammesExperience } from "./ProgrammesExperience";
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

function PeopleIndex({ page }: { page: SitePage }) {
  const zh = page.locale === "zh";
  const cn = page.locale === "cn";
  const boardHref = zh
    ? "/zh/board-of-directors-hk/"
    : cn
      ? "/cn/board-of-directors/"
      : undefined;
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
            href={boardHref ?? `/board-of-directors/${person.slug}/`}
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
  const locale = page.locale;
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
      <VolunteerForm locale={locale} />
      <div className={styles.handsonBlock}>
        <Image src="/assets/images/handson.png" width={180} height={180} unoptimized alt="HandsOn Hong Kong" />
        <p>
          {locale === "zh"
            ? "Love 21亦與HandsOn Hong Kong合作，義工可透過其平台查看活動。"
            : locale === "cn"
              ? "Love 21 亦与 HandsOn Hong Kong 合作，义工可透过其平台查看活动。"
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

function DonatePage({ page }: { page: SitePage }) {
  return <DonateExperience locale={page.locale === "en" ? "en" : "zh"} />;
}

function JoinPage({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  const cn = locale === "cn";
  return (
    <article className={`${styles.contentPage} ${styles.narrowPage}`}>
      <PageHeading>
        {zh ? "實習機會" : cn ? "实习机会" : "INTERNSHIP OPPORTUNITIES"}
      </PageHeading>
      <div className={styles.prose}>
        <p>
          {zh
            ? "我們歡迎相關學科的學生申請Love 21實習。"
            : cn
              ? "我们欢迎相关学科的学生申请 Love 21 实习。"
              : "We welcome students majoring in related fields to apply for an internship at Love 21. Interns gain first-hand experience in the operations and management of a growing NGO."}
        </p>
        <h2>{zh ? "實習工作可能包括" : cn ? "实习工作可能包括" : "Roles may include"}</h2>
        <ul>
          <li>Devising a sports programme for our community</li>
          <li>Managing the operations of Love 21 Space</li>
          <li>Proposal writing and programme reporting</li>
          <li>Refining and executing the nutrition programme</li>
          <li>Administrative, marketing and design work</li>
        </ul>
        <h2>{zh ? "要求" : cn ? "要求" : "Requirements"}</h2>
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
    case "about":
      return <AboutExperience locale={page.locale} />;
    case "programmes":
      return <ProgrammesExperience locale={page.locale} />;
    case "reports":
      return <FinanceExperience locale={page.locale} />;
    case "media-index":
      return <MediaExperience locale={page.locale} />;
    case "people-index":
      return <PeopleIndex page={page} />;
    case "person":
      return <PersonPage page={page} />;
    case "volunteer":
      return <VolunteerPage page={page} />;
    case "get-involved":
      return <GetInvolvedExperience locale={page.locale} />;
    case "contact":
      return <ContactExperience locale={page.locale} />;
    case "donate":
      return <DonatePage page={page} />;
    case "account":
      return (
        <article className={`${styles.contentPage} ${styles.accountPage}`}>
          <PageHeading>{page.title}</PageHeading>
          <AccountForm title={page.title} locale={page.locale} />
        </article>
      );
    case "calendar":
      return <ActivitiesExperience locale={page.locale} />;
    case "join":
      return <JoinPage locale={page.locale} />;
  }
}
