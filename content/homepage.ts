import { images, mediaArticles, type Locale } from "./site-data";

export type StoryStatus = "existing" | "placeholder";

export type ProgrammePillarKey = "sports" | "nutrition" | "family";

export type DonationFrequency = "one-time" | "monthly";

export type DonationProgramme = "most-needed" | ProgrammePillarKey;

export interface LocalizedString {
  en: string;
  zh: string;
}

export interface HomepageLink {
  label: LocalizedString;
  href: LocalizedString;
}

export interface HomepageMetric {
  value: string;
  label: LocalizedString;
}

export interface ProgrammeChip {
  label: LocalizedString;
  href: LocalizedString;
}

export interface AbilityStory {
  id: string;
  status: StoryStatus;
  image: string;
  imageAlt: LocalizedString;
  category: LocalizedString;
  achievement: LocalizedString;
  summary: LocalizedString;
  milestones: LocalizedString[];
  shortMilestones: LocalizedString[];
  supportingProgramme: LocalizedString;
  action: HomepageLink;
  source?: {
    label: LocalizedString;
    href?: string;
  };
  placeholderBadge?: LocalizedString;
}

export interface ProgrammePillar {
  key: ProgrammePillarKey;
  title: LocalizedString;
  image: string;
  imageAlt: LocalizedString;
  explanation: LocalizedString;
  example: LocalizedString;
  href: LocalizedString;
}

export interface DonationAmountOption {
  value: number;
  label: LocalizedString;
}

export interface DonationImpactMessage {
  frequency: DonationFrequency;
  programme: DonationProgramme;
  message: LocalizedString;
}

export interface HelpAction {
  id: string;
  status: "live" | "planned";
  title: LocalizedString;
  description: LocalizedString;
  action: HomepageLink;
}

export interface TrustLink {
  label: LocalizedString;
  href: LocalizedString;
}

export interface CommunityUpdate {
  slug: string;
  title: string;
  date: string;
  summary: LocalizedString;
  image?: string;
}

export interface HomepageContent {
  locale: Locale;
  hero: {
    eyebrow: LocalizedString;
    headline: LocalizedString;
    supporting: LocalizedString;
    image: string;
    imageAlt: LocalizedString;
    caption: LocalizedString;
    stickers: LocalizedString[];
    primaryCta: HomepageLink;
    secondaryCta: HomepageLink;
    metrics: HomepageMetric[];
  };
  stakeholderPaths: {
    label: LocalizedString;
    items: HomepageLink[];
  };
  journey: {
    label: LocalizedString;
    steps: LocalizedString[];
  };
  stories: {
    id: string;
    eyebrow: LocalizedString;
    title: LocalizedString;
    lead: LocalizedString;
    previousLabel: LocalizedString;
    nextLabel: LocalizedString;
    tabLabel: LocalizedString;
    items: AbilityStory[];
  };
  model: {
    id: string;
    eyebrow: LocalizedString;
    title: LocalizedString;
    detailsLabel: LocalizedString;
    centre: {
      title: LocalizedString;
      description: LocalizedString;
    };
    pillars: ProgrammePillar[];
    programmeChips: ProgrammeChip[];
  };
  opportunities: {
    id: string;
    eyebrow: LocalizedString;
    title: LocalizedString;
    lead: LocalizedString;
    demoNote: LocalizedString;
    filterLabel: LocalizedString;
    emptyBadge: LocalizedString;
    emptyTitle: LocalizedString;
    emptyDescription: LocalizedString;
    volunteerCta: HomepageLink;
    contactCta: HomepageLink;
    activities: {
      id: string;
      title: LocalizedString;
      role: LocalizedString;
      day: string;
      month: LocalizedString;
      time: LocalizedString;
      location: LocalizedString;
      image: string;
      imageAlt: LocalizedString;
      badge?: LocalizedString;
      action: HomepageLink;
    }[];
  };
  donatePreview: {
    id: string;
    eyebrow: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    frequencyLabel: LocalizedString;
    oneTimeLabel: LocalizedString;
    monthlyLabel: LocalizedString;
    amountLabel: LocalizedString;
    customAmountLabel: LocalizedString;
    customAmountPlaceholder: LocalizedString;
    customAmountError: LocalizedString;
    programmeLabel: LocalizedString;
    programmeOptions: { value: DonationProgramme; label: LocalizedString }[];
    amounts: DonationAmountOption[];
    impactMessages: DonationImpactMessage[];
    defaultImpact: LocalizedString;
    supportLabel: LocalizedString;
    cta: HomepageLink;
    note: LocalizedString;
  };
  help: {
    id: string;
    eyebrow: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    plannedLabel: LocalizedString;
    actions: HelpAction[];
  };
  trust: {
    id: string;
    eyebrow: LocalizedString;
    title: LocalizedString;
    section88: LocalizedString;
    dignityStatement: LocalizedString;
    dignityBadge: LocalizedString;
    metrics: HomepageMetric[];
    links: TrustLink[];
    communityLabel: LocalizedString;
    partnersLabel: LocalizedString;
    partners: { src: string; alt: LocalizedString; width: number; height: number }[];
    updates: CommunityUpdate[];
  };
  finalCta: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    actions: HomepageLink[];
  };
}

const routes = {
  contact: { en: "/contact-us/", zh: "/zh/contact-us-hk/" },
  volunteer: { en: "/our-volunteer/", zh: "/zh/our-volunteer-hk/" },
  donate: { en: "/donate/", zh: "/zh/donate-hk/" },
  programmes: { en: "/our-programmes/", zh: "/zh/our-programmes-hk/" },
  finance: { en: "/our-finance/", zh: "/zh/our-finance-hk/" },
  board: { en: "/board-of-directors/", zh: "/zh/board-of-directors-hk/" },
  media: { en: "/media/", zh: "/zh/媒體報導/" },
} as const;

const proofPoints: HomepageMetric[] = [
  {
    value: "600+",
    label: {
      en: "members and families",
      zh: "會員及家庭",
    },
  },
  {
    value: "≈1,000",
    label: {
      en: "monthly activities",
      zh: "每月活動節數",
    },
  },
  {
    value: "HK$0",
    label: {
      en: "charged to families",
      zh: "不向家庭收費",
    },
  },
];

const curatedUpdates: CommunityUpdate[] = [
  {
    slug: mediaArticles[0].slug,
    title: mediaArticles[0].title,
    date: mediaArticles[0].date,
    image: mediaArticles[0].image,
    summary: {
      en: "Tables open for the Beyond Limits Banquet.",
      zh: "Beyond Limits 晚宴座位現已開放。",
    },
  },
  {
    slug: mediaArticles[1].slug,
    title: mediaArticles[1].title,
    date: mediaArticles[1].date,
    image: mediaArticles[1].image,
    summary: {
      en: "Charity raffle proceeds support Love 21 Space.",
      zh: "慈善抽獎收益支援 Love 21 Space。",
    },
  },
  {
    slug: mediaArticles[4].slug,
    title: mediaArticles[4].title,
    date: mediaArticles[4].date,
    image: mediaArticles[4].image,
    summary: {
      en: "Healthy activity and community support in focus.",
      zh: "聚焦健康活動與社群支援。",
    },
  },
];

export const homepageContent: HomepageContent = {
  locale: "en",
  hero: {
    eyebrow: {
      en: "Love 21 Foundation · Hong Kong",
      zh: "Love 21 Foundation · 香港",
    },
    headline: {
      en: "Our community trains, cooks and grows together.",
      zh: "我們的社群一起訓練、烹飪、成長。",
    },
    supporting: {
      en: "Free sport, nutrition and family support for people with Down syndrome and autism — and the families beside them.",
      zh: "為唐氏綜合症及自閉症人士與家人，提供免費的體育、營養與家庭支援。",
    },
    image: images.hero,
    imageAlt: {
      en: "Love 21 members moving together in a ribbon class",
      zh: "Love 21 會員在絲帶課堂中一起活動",
    },
    caption: {
      en: "Saturday movement class",
      zh: "星期六運動課堂",
    },
    stickers: [
      { en: "JOY", zh: "喜悅" },
      { en: "SKILL", zh: "技能" },
      { en: "BELONGING", zh: "歸屬" },
    ],
    primaryCta: {
      label: { en: "Meet the community", zh: "認識社群" },
      href: { en: "#stories", zh: "#stories" },
    },
    secondaryCta: {
      label: { en: "Get involved", zh: "參與其中" },
      href: { en: "#help", zh: "#help" },
    },
    metrics: proofPoints,
  },
  stakeholderPaths: {
    label: {
      en: "I want to…",
      zh: "我想…",
    },
    items: [
      {
        label: { en: "Support my family", zh: "支援我家" },
        href: routes.contact,
      },
      {
        label: { en: "Volunteer", zh: "做義工" },
        href: { en: "#opportunities", zh: "#opportunities" },
      },
      {
        label: { en: "Donate", zh: "捐助" },
        href: { en: "#donate-preview", zh: "#donate-preview" },
      },
      {
        label: { en: "Partner with us", zh: "成為夥伴" },
        href: routes.contact,
      },
    ],
  },
  journey: {
    label: {
      en: "On this page",
      zh: "本頁導覽",
    },
    steps: [
      { en: "Moments", zh: "時刻" },
      { en: "Programmes", zh: "計劃" },
      { en: "Volunteer", zh: "義工" },
      { en: "Give", zh: "捐助" },
    ],
  },
  stories: {
    id: "stories",
    eyebrow: {
      en: "01 · Community",
      zh: "01 · 社群",
    },
    title: {
      en: "On the pitch. In the kitchen. With family.",
      zh: "在球場。在廚房。與家人一起。",
    },
    lead: {
      en: "",
      zh: "",
    },
    previousLabel: { en: "Previous story", zh: "上一個故事" },
    nextLabel: { en: "Next story", zh: "下一個故事" },
    tabLabel: { en: "Show story", zh: "顯示故事" },
    items: [
      {
        id: "sports-team",
        status: "existing",
        image: images.sports,
        imageAlt: {
          en: "Love 21 sports team outdoors after training",
          zh: "Love 21 體育隊伍戶外訓練後合照",
        },
        category: {
          en: "Sports",
          zh: "體育",
        },
        achievement: {
          en: "Weekly training became a team.",
          zh: "每週訓練，練成一支隊伍。",
        },
        summary: {
          en: "Members practise together, week after week — then take that confidence onto the field.",
          zh: "會員每週一起練習，再把自信帶到場上。",
        },
        shortMilestones: [
          { en: "First class", zh: "第一次課堂" },
          { en: "Weekly drills", zh: "每週練習" },
          { en: "Match day", zh: "比賽日" },
        ],
        milestones: [
          {
            en: "Members join regular sports classes.",
            zh: "會員參與常規體育課堂。",
          },
          {
            en: "Coaches and volunteers train alongside them.",
            zh: "教練與義工並肩訓練。",
          },
          {
            en: "The team competes and celebrates together.",
            zh: "隊伍一起比賽、一起慶祝。",
          },
        ],
        supportingProgramme: {
          en: "Sports programme",
          zh: "體育計劃",
        },
        action: {
          label: { en: "Sports programmes", zh: "體育計劃" },
          href: routes.programmes,
        },
        source: {
          label: {
            en: "Love 21 programme photography",
            zh: "Love 21 計劃影像",
          },
        },
      },
      {
        id: "nutrition-cooking",
        status: "existing",
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 members cooking together in the kitchen",
          zh: "Love 21 會員在廚房一起烹飪",
        },
        category: {
          en: "Nutrition",
          zh: "營養",
        },
        achievement: {
          en: "They cook the meal they planned.",
          zh: "他們煮出自己計劃的一餐。",
        },
        summary: {
          en: "Nutrition guidance moves from advice to chopping boards, recipes and shared meals.",
          zh: "營養指導從建議走進砧板、食譜與共享一餐。",
        },
        shortMilestones: [
          { en: "Plan", zh: "計劃" },
          { en: "Cook", zh: "烹飪" },
          { en: "Share", zh: "分享" },
        ],
        milestones: [
          {
            en: "Families receive practical nutrition guidance.",
            zh: "家庭獲得實用營養指導。",
          },
          {
            en: "Members cook together in class.",
            zh: "會員在課堂一起烹飪。",
          },
          {
            en: "Healthier habits carry into daily life.",
            zh: "更健康的習慣走進日常生活。",
          },
        ],
        supportingProgramme: {
          en: "Nutrition programme",
          zh: "營養計劃",
        },
        action: {
          label: { en: "Nutrition programmes", zh: "營養計劃" },
          href: routes.programmes,
        },
        source: {
          label: {
            en: "Love 21 programme photography",
            zh: "Love 21 計劃影像",
          },
        },
      },
      {
        id: "practice-to-stage",
        status: "placeholder",
        image: images.hero,
        imageAlt: {
          en: "Love 21 members practising movement with ribbons",
          zh: "Love 21 會員練習絲帶動作",
        },
        category: {
          en: "Performance",
          zh: "表演",
        },
        achievement: {
          en: "Practice became a performance.",
          zh: "練習，走到了舞台。",
        },
        summary: {
          en: "A placeholder for a consent-approved story of weekly practice leading to a shared stage moment.",
          zh: "佔位內容：經同意後可替換為「每週練習走到舞台」的真實故事。",
        },
        shortMilestones: [
          { en: "Practice", zh: "練習" },
          { en: "Rehearse", zh: "綵排" },
          { en: "Perform", zh: "演出" },
        ],
        milestones: [
          {
            en: "Weekly practice builds skill and confidence.",
            zh: "每週練習建立技能與自信。",
          },
          {
            en: "Family and volunteers walk the journey.",
            zh: "家人與義工一路同行。",
          },
          {
            en: "A shared performance marks the progress.",
            zh: "共享演出標記進步。",
          },
        ],
        supportingProgramme: {
          en: "Family support",
          zh: "家庭支援",
        },
        action: {
          label: { en: "Support Love 21", zh: "支持 Love 21" },
          href: routes.donate,
        },
        placeholderBadge: {
          en: "Placeholder — replace with approved story",
          zh: "佔位 — 請替換為核准故事",
        },
      },
    ],
  },
  model: {
    id: "what-we-do",
    eyebrow: {
      en: "02 · What we run",
      zh: "02 · 我們的計劃",
    },
    title: {
      en: "Sport. Nutrition. Family support.",
      zh: "體育。營養。家庭支援。",
    },
    detailsLabel: {
      en: "Learn more",
      zh: "了解更多",
    },
    centre: {
      title: {
        en: "Built around members and families",
        zh: "以會員與家庭為本",
      },
      description: {
        en: "Three programmes work as one — free for every Love 21 family.",
        zh: "三項計劃一體運作 — 每位 Love 21 家庭均可免費參與。",
      },
    },
    pillars: [
      {
        key: "sports",
        title: { en: "Sports", zh: "體育" },
        image: images.sports,
        imageAlt: {
          en: "Members in a Love 21 sports session",
          zh: "會員參與 Love 21 體育課堂",
        },
        explanation: {
          en: "Weekly classes, team sports and movement for every level.",
          zh: "每週課堂、團隊運動，適合不同程度。",
        },
        example: {
          en: "Football, climbing, boxing and ribbon class.",
          zh: "足球、攀石、拳擊與絲帶課堂。",
        },
        href: routes.programmes,
      },
      {
        key: "nutrition",
        title: { en: "Nutrition", zh: "營養" },
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 cooking and nutrition session",
          zh: "Love 21 烹飪與營養課堂",
        },
        explanation: {
          en: "One-to-one guidance plus hands-on cooking.",
          zh: "一對一指導，加上動手烹飪。",
        },
        example: {
          en: "Meal planning, kitchen skills and healthier habits.",
          zh: "餐單規劃、廚房技能與健康習慣。",
        },
        href: routes.programmes,
      },
      {
        key: "family",
        title: { en: "Family support", zh: "家庭支援" },
        image: images.family,
        imageAlt: {
          en: "Families connected through Love 21",
          zh: "透過 Love 21 連繫的家庭",
        },
        explanation: {
          en: "Counselling and community for parents and carers.",
          zh: "為家長與照顧者提供輔導與社群。",
        },
        example: {
          en: "Support that strengthens the whole household.",
          zh: "強化整個家庭的支援。",
        },
        href: routes.programmes,
      },
    ],
    programmeChips: [
      {
        label: { en: "Football", zh: "足球" },
        href: routes.programmes,
      },
      {
        label: { en: "Climbing", zh: "攀石" },
        href: routes.programmes,
      },
      {
        label: { en: "Cooking", zh: "烹飪" },
        href: routes.programmes,
      },
      {
        label: { en: "Counselling", zh: "輔導" },
        href: routes.programmes,
      },
    ],
  },
  opportunities: {
    id: "opportunities",
    eyebrow: {
      en: "03 · Volunteer",
      zh: "03 · 義工",
    },
    title: {
      en: "Come for a Saturday. Stay for the community.",
      zh: "來一個星期六，留下一份社群。",
    },
    lead: {
      en: "",
      zh: "",
    },
    demoNote: {
      en: "Demo dates — not live bookings.",
      zh: "示範日期 — 非真實預約。",
    },
    filterLabel: {
      en: "This month",
      zh: "本月",
    },
    emptyBadge: {
      en: "Coming soon",
      zh: "即將開放",
    },
    emptyTitle: {
      en: "New sessions will appear here.",
      zh: "新課堂將顯示於此。",
    },
    emptyDescription: {
      en: "Register interest and we will help you find a role.",
      zh: "請登記興趣，我們會協助你找到合適角色。",
    },
    volunteerCta: {
      label: { en: "Volunteer info", zh: "義工資訊" },
      href: routes.volunteer,
    },
    contactCta: {
      label: { en: "Corporate volunteering", zh: "企業義工" },
      href: { en: "/corporate/", zh: "/zh/corporate-hk/" },
    },
    activities: [
      {
        id: "saturday-movement",
        title: {
          en: "Saturday movement crew",
          zh: "星期六運動小組",
        },
        role: {
          en: "Cheer on, join in, keep the class moving.",
          zh: "打氣、一起參與、協助課堂流暢。",
        },
        day: "08",
        month: { en: "AUG", zh: "8月" },
        time: {
          en: "10:00–12:00",
          zh: "10:00–12:00",
        },
        location: {
          en: "Love 21 Space",
          zh: "Love 21 Space",
        },
        image: images.hero,
        imageAlt: {
          en: "Love 21 movement class with ribbons",
          zh: "Love 21 絲帶運動課堂",
        },
        badge: {
          en: "First-timer friendly",
          zh: "適合新手",
        },
        action: {
          label: { en: "Reserve a spot", zh: "預留名額" },
          href: routes.volunteer,
        },
      },
      {
        id: "climbing-confidence",
        title: {
          en: "Climbing session",
          zh: "攀石課堂",
        },
        role: {
          en: "Help with warm-up, kit and high-fives.",
          zh: "協助熱身、器材與打氣。",
        },
        day: "15",
        month: { en: "AUG", zh: "8月" },
        time: {
          en: "14:00–16:30",
          zh: "14:00–16:30",
        },
        location: {
          en: "Kowloon",
          zh: "九龍",
        },
        image: images.sports,
        imageAlt: {
          en: "Love 21 sports programme activity",
          zh: "Love 21 體育計劃活動",
        },
        action: {
          label: { en: "Reserve a spot", zh: "預留名額" },
          href: routes.volunteer,
        },
      },
      {
        id: "community-kitchen",
        title: {
          en: "Community kitchen",
          zh: "社區廚房",
        },
        role: {
          en: "Prep stations and cook with members.",
          zh: "準備工作站，與會員一起煮。",
        },
        day: "22",
        month: { en: "AUG", zh: "8月" },
        time: {
          en: "11:00–13:00",
          zh: "11:00–13:00",
        },
        location: {
          en: "Love 21 Space",
          zh: "Love 21 Space",
        },
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 nutrition and cooking activity",
          zh: "Love 21 營養與烹飪活動",
        },
        badge: {
          en: "First-timer friendly",
          zh: "適合新手",
        },
        action: {
          label: { en: "Reserve a spot", zh: "預留名額" },
          href: routes.volunteer,
        },
      },
    ],
  },
  donatePreview: {
    id: "donate-preview",
    eyebrow: {
      en: "04 · Give",
      zh: "04 · 捐助",
    },
    title: {
      en: "Keep every programme free.",
      zh: "讓每一項計劃繼續免費。",
    },
    description: {
      en: "Pick an amount and focus. Finish on the donation page.",
      zh: "選擇金額與用途，再到捐助頁完成。",
    },
    supportLabel: {
      en: "Your gift",
      zh: "你的捐助",
    },
    frequencyLabel: { en: "Frequency", zh: "頻率" },
    oneTimeLabel: { en: "One-time", zh: "一次性" },
    monthlyLabel: { en: "Monthly", zh: "每月" },
    amountLabel: { en: "Amount", zh: "金額" },
    customAmountLabel: { en: "Custom amount (HK$)", zh: "自訂金額（港元）" },
    customAmountPlaceholder: { en: "Enter amount", zh: "輸入金額" },
    customAmountError: {
      en: "Enter a whole-number amount of at least HK$1.",
      zh: "請輸入至少港幣 1 元的整數金額。",
    },
    programmeLabel: { en: "Direct my gift to", zh: "將捐助用於" },
    programmeOptions: [
      {
        value: "most-needed",
        label: { en: "Where most needed", zh: "最有需要的地方" },
      },
      { value: "sports", label: { en: "Sports", zh: "體育" } },
      { value: "nutrition", label: { en: "Nutrition", zh: "營養" } },
      {
        value: "family",
        label: { en: "Family support", zh: "家庭支援" },
      },
    ],
    amounts: [
      { value: 250, label: { en: "HK$250", zh: "港幣 250 元" } },
      { value: 500, label: { en: "HK$500", zh: "港幣 500 元" } },
      { value: 1000, label: { en: "HK$1,000", zh: "港幣 1,000 元" } },
    ],
    impactMessages: [
      {
        frequency: "one-time",
        programme: "most-needed",
        message: {
          en: "Helps keep free classes running where families need them most.",
          zh: "協助在最有需要的地方維持免費課堂。",
        },
      },
      {
        frequency: "monthly",
        programme: "most-needed",
        message: {
          en: "Gives Love 21 steady support for the programmes families count on.",
          zh: "為家庭倚賴的計劃提供穩定支援。",
        },
      },
      {
        frequency: "one-time",
        programme: "sports",
        message: {
          en: "Helps fund sports sessions, kit and coaching time.",
          zh: "協助支援體育課堂、器材與教練時間。",
        },
      },
      {
        frequency: "monthly",
        programme: "sports",
        message: {
          en: "Helps keep weekly sports sessions going all year.",
          zh: "協助全年維持每週體育課堂。",
        },
      },
      {
        frequency: "one-time",
        programme: "nutrition",
        message: {
          en: "Helps fund cooking classes and nutrition guidance.",
          zh: "協助支援烹飪課堂與營養指導。",
        },
      },
      {
        frequency: "monthly",
        programme: "nutrition",
        message: {
          en: "Helps keep nutrition support available month after month.",
          zh: "協助每月持續提供營養支援。",
        },
      },
      {
        frequency: "one-time",
        programme: "family",
        message: {
          en: "Helps fund counselling and carer support.",
          zh: "協助支援輔導與照顧者服務。",
        },
      },
      {
        frequency: "monthly",
        programme: "family",
        message: {
          en: "Helps Love 21 stay beside carers through the year.",
          zh: "協助 Love 21 全年陪伴照顧者。",
        },
      },
    ],
    defaultImpact: {
      en: "Keeps Love 21 programmes free for families.",
      zh: "維持 Love 21 計劃對家庭免費。",
    },
    cta: {
      label: { en: "Donate now", zh: "立即捐助" },
      href: routes.donate,
    },
    note: {
      en: "Preview only — nothing is charged here.",
      zh: "僅供預覽 — 此處不會收費。",
    },
  },
  help: {
    id: "help",
    eyebrow: {
      en: "05 · Get involved",
      zh: "05 · 參與",
    },
    title: {
      en: "Give time. Give funds. Open a door.",
      zh: "付出時間。捐出資金。打開一扇門。",
    },
    description: {
      en: "",
      zh: "",
    },
    plannedLabel: {
      en: "Coming soon",
      zh: "即將推出",
    },
    actions: [
      {
        id: "donate",
        status: "live",
        title: { en: "Donate", zh: "捐助" },
        description: {
          en: "Fund free sport, nutrition and family support.",
          zh: "資助免費體育、營養與家庭支援。",
        },
        action: {
          label: { en: "Donate", zh: "捐助" },
          href: routes.donate,
        },
      },
      {
        id: "volunteer",
        status: "live",
        title: { en: "Volunteer", zh: "義工" },
        description: {
          en: "Join a Saturday class, kitchen or sports session.",
          zh: "加入星期六課堂、廚房或體育活動。",
        },
        action: {
          label: { en: "Volunteer", zh: "做義工" },
          href: routes.volunteer,
        },
      },
      {
        id: "campaign",
        status: "planned",
        title: { en: "Start a campaign", zh: "發起籌款" },
        description: {
          en: "Rally friends and colleagues around Love 21.",
          zh: "凝聚親友與同事支持 Love 21。",
        },
        action: {
          label: { en: "Ask us", zh: "向我們查詢" },
          href: routes.contact,
        },
      },
      {
        id: "wishlist",
        status: "planned",
        title: { en: "Wishlist", zh: "心願清單" },
        description: {
          en: "Sponsor kit, kitchen supplies and class materials.",
          zh: "贊助器材、廚房物資與課堂用品。",
        },
        action: {
          label: { en: "Ask us", zh: "向我們查詢" },
          href: routes.contact,
        },
      },
    ],
  },
  trust: {
    id: "trust",
    eyebrow: {
      en: "06 · Trust",
      zh: "06 · 信任",
    },
    title: {
      en: "Section 88 charity. Open books. Clear governance.",
      zh: "第 88 條慈善機構。公開帳目。清晰管治。",
    },
    section88: {
      en: "Registered under Section 88 of Hong Kong’s Inland Revenue Ordinance.",
      zh: "根據香港《稅務條例》第 88 條註冊。",
    },
    dignityStatement: {
      en: "Stories and photos are used with consent. Full policy wording awaits Love 21 approval.",
      zh: "故事與照片均經同意使用。完整政策措辭尚待 Love 21 核准。",
    },
    dignityBadge: {
      en: "Policy pending approval",
      zh: "政策尚待核准",
    },
    metrics: proofPoints,
    links: [
      {
        label: { en: "Annual report", zh: "年度報告" },
        href: routes.finance,
      },
      {
        label: { en: "Board", zh: "董事局" },
        href: routes.board,
      },
      {
        label: { en: "Media", zh: "媒體" },
        href: routes.media,
      },
    ],
    communityLabel: {
      en: "In the news",
      zh: "媒體報導",
    },
    partnersLabel: {
      en: "Recognised by",
      zh: "獲認可於",
    },
    partners: [
      {
        src: "/assets/images/partner-ccma.png",
        alt: { en: "Caring Company", zh: "商界展關懷" },
        width: 230,
        height: 99,
      },
      {
        src: "/assets/images/partner-hkcss.jpeg",
        alt: {
          en: "Hong Kong Council of Social Service agency member",
          zh: "香港社會服務聯會機構會員",
        },
        width: 220,
        height: 189,
      },
    ],
    updates: curatedUpdates,
  },
  finalCta: {
    eyebrow: {
      en: "Join us",
      zh: "加入我們",
    },
    title: {
      en: "Ready for your first Saturday?",
      zh: "準備好第一個星期六了嗎？",
    },
    actions: [
      {
        label: { en: "Contact Love 21", zh: "聯絡 Love 21" },
        href: routes.contact,
      },
      {
        label: { en: "Volunteer", zh: "做義工" },
        href: routes.volunteer,
      },
      {
        label: { en: "Donate", zh: "捐助" },
        href: routes.donate,
      },
    ],
  },
};

export function t(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

export function hrefFor(link: HomepageLink, locale: Locale): string {
  return link.href[locale];
}
