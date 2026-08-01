import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  boardMembers,
  getPage,
  SitePage,
} from "../content/site-data";
import type { DonationModeId } from "../content/donation";
import { getPublishedCalendarEvents } from "../lib/supabase/calendar-events";
import { createClient } from "../lib/supabase/server";
import { getSessionProfile } from "../lib/supabase/profile";
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

function DonatePage({ page, initialMode }: { page: SitePage; initialMode?: DonationModeId }) {
  return <DonateExperience initialMode={initialMode} locale={page.locale === "en" ? "en" : "zh"} />;
}

export async function PageRenderer({
  path,
  donationMode,
}: {
  path: string;
  donationMode?: DonationModeId;
}) {
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
      return <DonatePage initialMode={donationMode} page={page} />;
    case "account":
      return (
        <article className={`${styles.contentPage} ${styles.accountPage}`}>
          <PageHeading>{page.title}</PageHeading>
          <AccountForm title={page.title} locale={page.locale} />
        </article>
      );
    case "calendar": {
      const calendarEvents = await getPublishedCalendarEvents();
      const profile = await getSessionProfile();
      let registeredEventIds: number[] = [];
      if (profile) {
        const supabase = await createClient();
        const { data } = await supabase
          .from("event_participations")
          .select("event_id")
          .eq("user_id", profile.id);
        registeredEventIds = (data ?? []).map((row) => row.event_id);
      }
      return (
        <ActivitiesExperience
          locale={page.locale}
          events={calendarEvents}
          sessionRole={
            profile && profile.role !== "staff" ? profile.role : null
          }
          registeredEventIds={registeredEventIds}
        />
      );
    }
  }
}
