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

function PageHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-heading">
      <h1>{children}</h1>
    </div>
  );
}

function StandardPage({ page }: { page: SitePage }) {
  return (
    <article className="content-page">
      <PageHeading>{page.title}</PageHeading>
      {page.image && (
        <div className="feature-image">
          <Image src={page.image} alt={page.title} fill unoptimized sizes="(max-width: 900px) 100vw, 800px" />
        </div>
      )}
      <div className="prose">
        {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </article>
  );
}

function ProgrammesPage({ zh }: { zh: boolean }) {
  const programmes = zh
    ? [
        {
          title: "體育",
          image: images.sports,
          paragraphs: [
            "我們的體育計劃不設限制，致力為會員提供充分發揮潛能的機會。",
            "除了運動課堂，我們亦注重力量訓練、協調能力及心理健康活動。",
          ],
        },
        {
          title: "飲食與營養",
          image: images.nutrition,
          paragraphs: [
            "我們提供個人營養支援和指導，協助會員及家庭建立健康生活方式。",
            "我們亦定期舉辦烹飪及食物準備課堂。",
          ],
        },
        {
          title: "家庭",
          image: images.family,
          paragraphs: [
            "Love 21重視整個家庭，為家長提供專屬課堂、輔導和參與活動的機會。",
          ],
        },
        {
          title: "企業社會責任",
          image: images.csr,
          paragraphs: [
            "企業夥伴透過共同活動了解會員的能力，建立更共融的香港。",
          ],
        },
      ]
    : [
        {
          title: "Sports",
          image: images.sports,
          paragraphs: [
            "Our sports programme is designed without limitations. We aim to give our beneficiaries the greatest opportunity to reach their full potential by offering a comprehensive range of activities while also striving for excellence in each sport.",
            "In addition to sport classes, we also focus on strength training, coordination and mental health activities.",
          ],
        },
        {
          title: "Nutrition",
          image: images.nutrition,
          paragraphs: [
            "Sport classes alone are not enough to significantly extend the life expectancy of our beneficiaries. This is why we’ve developed a well thought out nutrition programme to give our community the support and guidance needed to make healthy lifestyle changes.",
            "We also run regular cooking and food preparation lessons for families.",
          ],
        },
        {
          title: "Family",
          image: images.family,
          paragraphs: [
            "Love 21’s focus on family sets us apart. We offer specialty classes for parents and allow parental participation in many sport and healthy lifestyle classes.",
          ],
        },
        {
          title: "CSR",
          image: images.csr,
          paragraphs: [
            "Our Corporate Social Responsibility Programme helps Hong Kong organisations learn about the community through shared activity and human connection.",
            "If you’d like to learn more, please contact our Founder/CEO at jeff@love21foundation.com.",
          ],
        },
      ];

  return (
    <article className="content-page programmes-page">
      <PageHeading>{zh ? "我們的計劃" : "OUR PROGRAMMES"}</PageHeading>
      {programmes.map((programme, index) => (
        <section className="programme-row" key={programme.title}>
          <div className="programme-photo">
            <Image
              src={programme.image}
              alt=""
              fill
              unoptimized
              sizes="(max-width: 800px) 100vw, 45vw"
            />
          </div>
          <div className="programme-copy">
            <h2>{programme.title}</h2>
            {programme.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {index < programmes.length - 1 && <div className="wide-rule" />}
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
    <article className="content-page reports-page">
      <PageHeading>{page.title}</PageHeading>
      <div className="prose centered">
        {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className="report-links">
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
    <article className="content-page">
      <PageHeading>{zh ? "媒體報導" : "MEDIA"}</PageHeading>
      <div className="media-grid">
        {mediaArticles.map((article) => (
          <article className="media-card" key={article.slug}>
            <Link href={`/${article.slug}/`} className="media-card-image">
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
    <article className="content-page">
      <PageHeading>{page.title}</PageHeading>
      <div className="prose centered">
        {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <div className="people-grid">
        {boardMembers.map((person) => (
          <Link
            key={person.slug}
            href={zh ? "/zh/board-of-directors-hk/" : `/board-of-directors/${person.slug}/`}
            className="person-card"
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
    <article className="content-page">
      <PageHeading>BOARD OF DIRECTORS</PageHeading>
      <div className="profile-layout">
        {page.image && (
          <div className="profile-image">
            <Image src={page.image} alt={page.title} fill unoptimized sizes="(max-width: 700px) 80vw, 35vw" />
          </div>
        )}
        <div className="profile-copy">
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
    <article className="content-page">
      <PageHeading>{page.title}</PageHeading>
      {page.image && (
        <div className="feature-image">
          <Image src={page.image} alt="" fill unoptimized sizes="(max-width: 900px) 100vw, 800px" />
        </div>
      )}
      <div className="prose centered">
        {page.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <VolunteerForm zh={zh} />
      <div className="handson-block">
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
    <article className="content-page narrow-page">
      <PageHeading>{page.title}</PageHeading>
      <div className="prose">
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
  const zh = page.locale === "zh";
  return (
    <article className="content-page donate-page">
      <PageHeading>{page.title}</PageHeading>
      <h2>{zh ? "非常感謝你支持Love 21！" : "Thank you so much for supporting Love 21!"}</h2>
      <p>
        {zh
          ? "你的捐款將為唐氏綜合症、自閉症及神經多樣性社群帶來更多機會。"
          : "Your kind donation will help us provide even more opportunities for our Down syndrome and autistic community through sports, nutrition and holistic programmes."}
      </p>
      <div className="donation-options">
        <div>
          <Image src="/assets/images/payme.png" width={240} height={240} unoptimized alt="Love 21 PayMe" />
          <span>PayMe</span>
        </div>
        <a href="https://app.moonclerk.com/pay/2805gcehxjca" target="_blank" rel="noreferrer">
          <Image src="/assets/images/moonclerk.png" width={240} height={120} unoptimized alt="MoonClerk" />
          <strong>{zh ? "網上捐贈 ➜" : "DONATE ONLINE ➜"}</strong>
        </a>
      </div>
      <h3>{zh ? "每一分支持都十分重要！" : "Every dollar counts!"}</h3>
      <p className="privacy-note">
        {zh
          ? "這是開發版本；網上捐贈會前往Love 21目前使用的外部付款平台。"
          : "Development copy: online donations continue to Love 21’s existing external payment provider."}
      </p>
    </article>
  );
}

function JoinPage({ zh }: { zh: boolean }) {
  return (
    <article className="content-page narrow-page">
      <PageHeading>{zh ? "實習機會" : "INTERNSHIP OPPORTUNITIES"}</PageHeading>
      <div className="prose">
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
        <article className="content-page account-page">
          <PageHeading>{page.title}</PageHeading>
          <AccountForm title={page.title} zh={page.locale === "zh"} />
        </article>
      );
    case "calendar":
      return (
        <article className="content-page calendar-page">
          <PageHeading>{page.title}</PageHeading>
          <p>
            If you’d like to commit to teaching your own weekly class for our
            beneficiaries or support an existing class, please contact our Programme
            Manager at{" "}
            <a href="mailto:maggie@love21foundation.com">
              maggie@love21foundation.com
            </a>
            .
          </p>
        </article>
      );
    case "join":
      return <JoinPage zh={page.locale === "zh"} />;
  }
}
