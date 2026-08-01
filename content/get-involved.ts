import { august2026Events, type ActivityCategory } from "./activities";
import type { Locale } from "./site-data";

export type GetInvolvedLocale = Locale;

export type OpportunityFilter =
  | "all"
  | "sports"
  | "nutrition"
  | "family"
  | "events"
  | "corporate";

export interface Localized {
  en: string;
  zh: string;
}

export const t = (value: Localized, locale: GetInvolvedLocale) => value[locale];

type OpportunityCategory = Exclude<OpportunityFilter, "all">;

const activityFilterMap: Record<ActivityCategory, OpportunityCategory> = {
  sports: "sports",
  nutrition: "nutrition",
  family: "family",
  csr: "corporate",
};

const spotHints: Record<string, Localized> = {
  "yoga-04": { en: "8 spots", zh: "8 個名額" },
  "food-06": { en: "6 spots", zh: "6 個名額" },
  "family-08": { en: "10 spots", zh: "10 個名額" },
  "fitness-11": { en: "12 spots", zh: "12 個名額" },
  "csr-14": { en: "Team of 15", zh: "15 人團隊" },
  "dance-18": { en: "8 spots", zh: "8 個名額" },
  "food-18": { en: "6 spots", zh: "6 個名額" },
  "family-22": { en: "10 spots", zh: "10 個名額" },
  "sports-27": { en: "12 spots", zh: "12 個名額" },
};

const recurrenceHints: Record<string, Localized> = {
  "yoga-04": { en: "Weekly", zh: "每週" },
  "food-06": { en: "Weekly", zh: "每週" },
  "family-08": { en: "Monthly", zh: "每月" },
  "fitness-11": { en: "Weekly", zh: "每週" },
  "csr-14": { en: "By arrangement", zh: "另行安排" },
  "dance-18": { en: "Weekly", zh: "每週" },
  "food-18": { en: "Weekly", zh: "每週" },
  "family-22": { en: "Monthly", zh: "每月" },
  "sports-27": { en: "Weekly", zh: "每週" },
};

const categoryLabels: Record<OpportunityCategory, Localized> = {
  sports: { en: "Sports", zh: "體育" },
  nutrition: { en: "Nutrition", zh: "營養" },
  family: { en: "Family", zh: "家庭" },
  events: { en: "Events", zh: "活動" },
  corporate: { en: "Corporate", zh: "企業" },
};

/** Presentational volunteer slots derived from the August 2026 calendar demo. */
export const volunteerOpportunities = [
  ...august2026Events.map((event) => ({
    id: event.id,
    category: activityFilterMap[event.category],
    categoryLabel: categoryLabels[activityFilterMap[event.category]],
    spots: spotHints[event.id] ?? { en: "Open", zh: "開放" },
    title: event.title,
    location: event.location,
    time: { en: event.time, zh: event.time },
    recurrence: recurrenceHints[event.id] ?? { en: "One-off", zh: "一次" },
  })),
  {
    id: "community-day",
    category: "events" as const,
    categoryLabel: categoryLabels.events,
    spots: { en: "20 spots", zh: "20 個名額" },
    title: { en: "Community open day helpers", zh: "社區開放日協助" },
    location: { en: "Love 21 Space", zh: "Love 21 Space" },
    time: { en: "Half-day shifts", zh: "半天時段" },
    recurrence: { en: "Seasonal", zh: "季節性" },
  },
];

export const opportunityFilters: Array<{
  id: OpportunityFilter;
  label: Localized;
}> = [
  { id: "all", label: { en: "All", zh: "全部" } },
  { id: "sports", label: categoryLabels.sports },
  { id: "nutrition", label: categoryLabels.nutrition },
  { id: "family", label: categoryLabels.family },
  { id: "events", label: categoryLabels.events },
  { id: "corporate", label: categoryLabels.corporate },
];

export const getInvolvedContent = {
  hero: {
    eyebrow: {
      en: "there's a place for you here",
      zh: "這裡有你的位置",
    } satisfies Localized,
    title: {
      en: "Get involved. Change what Hong Kong sees.",
      zh: "參與其中。改變香港所見。",
    } satisfies Localized,
    description: {
      en: "Volunteer for a class, bring your company for a corporate day, or help keep programmes free. Every way of showing up helps our community move, learn and connect.",
      zh: "參與課堂義工、安排企業日，或協助維持計劃免費。每一種參與，都幫助我們的社群運動、學習與連結。",
    } satisfies Localized,
    primary: {
      label: { en: "Volunteer with us", zh: "成為義工" } satisfies Localized,
      href: "#opportunities",
    },
    secondary: {
      label: { en: "Partner your company", zh: "企業合作" } satisfies Localized,
      href: "#corporate",
    },
    helper: {
      en: "↑ pick a date and just show up — no forms, no email tag",
      zh: "↑ 選一個日子直接到來 — 無需表格、無需電郵標籤",
    } satisfies Localized,
  },
  ways: {
    volunteer: {
      audience: { en: "For individuals", zh: "個人參與" } satisfies Localized,
      badge: { en: "Most popular", zh: "最受歡迎" } satisfies Localized,
      title: { en: "Volunteer with Love 21", zh: "成為 Love 21 義工" } satisfies Localized,
      description: {
        en: "Join a sports class, nutrition session or family activity. Show up, cheer on, and be part of the room.",
        zh: "加入體育課堂、營養活動或家庭聚會。現身、打氣，成為現場的一份子。",
      } satisfies Localized,
      action: {
        label: { en: "Browse opportunities", zh: "瀏覽機會" } satisfies Localized,
        href: "#opportunities",
      },
    },
    corporate: {
      audience: { en: "Companies & CSR", zh: "企業與 CSR" } satisfies Localized,
      title: { en: "Bring your team", zh: "帶你的團隊同行" } satisfies Localized,
      description: {
        en: "Plan a meaningful corporate day built around shared activity and human connection.",
        zh: "規劃以共同活動與人相連為本的企業日。",
      } satisfies Localized,
      action: {
        label: { en: "Explore partnerships", zh: "了解合作" } satisfies Localized,
        href: "#corporate",
      },
    },
    give: {
      audience: { en: "Fundraise & give", zh: "籌款與捐助" } satisfies Localized,
      title: { en: "Keep programmes free", zh: "維持計劃免費" } satisfies Localized,
      description: {
        en: "Your gift helps Love 21 keep sport, nutrition and family support open to the community.",
        zh: "你的捐助幫助 Love 21 維持體育、營養與家庭支援計劃開放予社群。",
      } satisfies Localized,
      action: {
        label: { en: "Donate", zh: "捐助" } satisfies Localized,
        href: { en: "/donate/", zh: "/zh/donate-hk/" },
      },
    },
  },
  opportunities: {
    badge: { en: "Volunteer opportunities", zh: "義工機會" } satisfies Localized,
    title: {
      en: "Find something that fits your week.",
      zh: "找到適合你這個星期的參與方式。",
    } satisfies Localized,
    calendarLink: {
      label: { en: "See full calendar", zh: "查看完整日曆" } satisfies Localized,
      href: { en: "/events", zh: "/zh/events-hk/" },
    },
    signup: { en: "Sign up", zh: "報名" } satisfies Localized,
    empty: {
      en: "No opportunities in this category right now — try another filter or the full calendar.",
      zh: "此分類暫時沒有機會 — 試試其他篩選或查看完整日曆。",
    } satisfies Localized,
    previewNotice: {
      en: "Preview only — signup is not live yet. Use Volunteer with us or HandsOn Hong Kong to register interest.",
      zh: "僅供預覽 — 報名尚未上線。請透過「成為義工」或 HandsOn Hong Kong 登記興趣。",
    } satisfies Localized,
  },
  corporate: {
    badge: { en: "Corporate partnerships", zh: "企業夥伴" } satisfies Localized,
    title: {
      en: "A corporate day that feels human.",
      zh: "有溫度的企業日。",
    } satisfies Localized,
    description: {
      en: "Our CSR programme helps Hong Kong organisations learn about the community through shared activity — not a presentation, a day together.",
      zh: "我們的企業社會責任計劃透過共同活動，讓香港機構認識社群 — 不是簡報，而是一起度過的一天。",
    } satisfies Localized,
    benefits: [
      {
        en: "Inclusive team activities alongside Love 21 members",
        zh: "與 Love 21 會員一起參與共融團隊活動",
      },
      {
        en: "Guided facilitation from our programme team",
        zh: "由我們的計劃團隊引導進行",
      },
      {
        en: "A clear briefing so everyone knows how to show up well",
        zh: "清晰簡介，讓每位同事都知道如何好好參與",
      },
      {
        en: "Follow-up ideas for longer partnerships",
        zh: "提供延續合作的後續想法",
      },
    ] satisfies Localized[],
    bookSession: {
      label: { en: "Book a session", zh: "預約時段" } satisfies Localized,
    },
    talkTeam: {
      label: { en: "Talk to our team", zh: "聯絡我們的團隊" } satisfies Localized,
      href: { en: "/contact-us/", zh: "/zh/contact-us-hk/" },
    },
    bookPreviewNotice: {
      en: "Preview only — session booking is not live. Contact the team to enquire.",
      zh: "僅供預覽 — 預約尚未上線。請聯絡團隊查詢。",
    } satisfies Localized,
    howItWorks: {
      eyebrow: { en: "How a corporate day works", zh: "企業日如何進行" } satisfies Localized,
      steps: [
        {
          title: { en: "Say hello", zh: "先打個招呼" } satisfies Localized,
          copy: {
            en: "Share your team size, goals and preferred dates.",
            zh: "告訴我們團隊人數、目標與理想日期。",
          } satisfies Localized,
        },
        {
          title: { en: "Plan together", zh: "一起規劃" } satisfies Localized,
          copy: {
            en: "We shape a half-day or full-day around sport, cooking or community time.",
            zh: "我們圍繞運動、烹飪或社群時間，設計半天或全日活動。",
          } satisfies Localized,
        },
        {
          title: { en: "Show up & connect", zh: "現身連結" } satisfies Localized,
          copy: {
            en: "Your team joins in — learning by doing, side by side with our members.",
            zh: "你的團隊親自參與 — 與會員並肩學習、一起行動。",
          } satisfies Localized,
        },
      ],
    },
    quote: {
      body: {
        en: "Our team left talking about people, not a programme. It was the most human CSR day we have done in Hong Kong.",
        zh: "團隊離開時談論的是人，而不是一個計劃。這是我們在香港最有溫度的 CSR 一天。",
      } satisfies Localized,
      attribution: {
        en: "Laura · Nakama Global",
        zh: "Laura · Nakama Global",
      } satisfies Localized,
      note: {
        en: "Design mockup quote — illustrative for layout.",
        zh: "設計稿引述 — 僅供版面展示。",
      } satisfies Localized,
    },
  },
  bottomCta: {
    title: { en: "Not sure where to start?", zh: "不知道從何開始？" } satisfies Localized,
    description: {
      en: "Tell us a little about yourself and we will help you find a fit — volunteering, corporate, or giving.",
      zh: "告訴我們一點關於你的事，我們會協助你找到合適方向 — 義工、企業或捐助。",
    } satisfies Localized,
    volunteer: {
      label: { en: "Volunteer", zh: "做義工" } satisfies Localized,
      href: { en: "/our-volunteer/", zh: "/zh/our-volunteer-hk/" },
    },
    corporate: {
      label: { en: "Corporate enquiry", zh: "企業查詢" } satisfies Localized,
      href: { en: "/contact-us/", zh: "/zh/contact-us-hk/" },
    },
  },
} as const;
