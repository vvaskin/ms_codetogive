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

export interface AbilityStory {
  id: string;
  status: StoryStatus;
  image: string;
  imageAlt: LocalizedString;
  achievement: LocalizedString;
  milestones: LocalizedString[];
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
    headline: LocalizedString;
    supporting: LocalizedString;
    image: string;
    imageAlt: LocalizedString;
    primaryCta: HomepageLink;
    secondaryCta: HomepageLink;
    metrics: HomepageMetric[];
  };
  stakeholderPaths: {
    label: LocalizedString;
    items: HomepageLink[];
  };
  stories: {
    id: string;
    eyebrow: LocalizedString;
    title: LocalizedString;
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
  };
  opportunities: {
    id: string;
    eyebrow: LocalizedString;
    title: LocalizedString;
    emptyTitle: LocalizedString;
    emptyDescription: LocalizedString;
    volunteerCta: HomepageLink;
    contactCta: HomepageLink;
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
      en: "An evening celebrating the Love 21 community and the possibilities created through opportunity, inclusion and support.",
      zh: "一場慶祝 Love 21 社群的晚宴，展現機會、共融與支援所開創的可能性。",
    },
  },
  {
    slug: mediaArticles[1].slug,
    title: mediaArticles[1].title,
    date: mediaArticles[1].date,
    image: mediaArticles[1].image,
    summary: {
      en: "A community fundraiser supporting Love 21 Foundation’s growing service needs and the operation of Love 21 Space.",
      zh: "社區籌款活動，支援 Love 21 Foundation 持續增長的服務需要及 Love 21 Space 營運。",
    },
  },
  {
    slug: mediaArticles[4].slug,
    title: mediaArticles[4].title,
    date: mediaArticles[4].date,
    image: mediaArticles[4].image,
    summary: {
      en: "A feature on healthy activity, nutrition and community support helping members and families thrive.",
      zh: "專題介紹健康活動、營養支援與社群同行，如何幫助會員及家庭茁壯成長。",
    },
  },
];

export const homepageContent: HomepageContent = {
  locale: "en",
  hero: {
    headline: {
      en: "See what our community can do.",
      zh: "看看我們的社群能做到什麼。",
    },
    supporting: {
      en: "Love 21 empowers people with Down syndrome and autism in Hong Kong through sport, nutrition, and holistic family support — so ability, not limitation, leads the way.",
      zh: "Love 21 透過運動、營養及全面家庭支援，協助香港的唐氏綜合症及自閉症人士發揮潛能——以能力為先，而非限制。",
    },
    image: images.hero,
    imageAlt: {
      en: "Love 21 community members taking part in an activity together",
      zh: "Love 21 社群成員一同參與活動",
    },
    primaryCta: {
      label: { en: "See ability in action", zh: "看看能力如何展現" },
      href: { en: "#stories", zh: "#stories" },
    },
    secondaryCta: {
      label: { en: "Find your way to help", zh: "找到你的參與方式" },
      href: { en: "#help", zh: "#help" },
    },
    metrics: proofPoints,
  },
  stakeholderPaths: {
    label: {
      en: "Looking for a way in?",
      zh: "想找切入點？",
    },
    items: [
      {
        label: { en: "Family support", zh: "家庭支援" },
        href: routes.contact,
      },
      {
        label: { en: "Volunteer", zh: "成為義工" },
        href: { en: "#opportunities", zh: "#opportunities" },
      },
      {
        label: { en: "Give", zh: "捐助" },
        href: { en: "#donate-preview", zh: "#donate-preview" },
      },
      {
        label: { en: "Company or partner", zh: "企業或夥伴" },
        href: routes.contact,
      },
    ],
  },
  stories: {
    id: "stories",
    eyebrow: {
      en: "How awesome we are",
      zh: "我們有多了不起",
    },
    title: {
      en: "Ability shown through real moments.",
      zh: "能力，見於真實時刻。",
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
          en: "Love 21 members taking part in a sports programme",
          zh: "Love 21 會員參與體育計劃",
        },
        achievement: {
          en: "From first session to confident teammates",
          zh: "從第一次課堂到自信的隊友",
        },
        milestones: [
          {
            en: "Members join regular sports classes built around ability and belonging.",
            zh: "會員參與以能力與歸屬感為本的常規體育課堂。",
          },
          {
            en: "Coaches and volunteers practise skills week by week, side by side.",
            zh: "教練與義工每週並肩練習，逐步建立技能。",
          },
          {
            en: "Teams show what consistent opportunity makes possible.",
            zh: "團隊展現持續機會所能成就的可能。",
          },
        ],
        supportingProgramme: {
          en: "Supported by our Sports programme",
          zh: "由我們的體育計劃支援",
        },
        action: {
          label: { en: "Explore sports programmes", zh: "了解體育計劃" },
          href: routes.programmes,
        },
        source: {
          label: {
            en: "Source: Love 21 programme photography",
            zh: "來源：Love 21 計劃影像",
          },
        },
      },
      {
        id: "nutrition-cooking",
        status: "existing",
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 nutrition and cooking activity",
          zh: "Love 21 營養與烹飪活動",
        },
        achievement: {
          en: "Learning to cook with confidence and care",
          zh: "在自信與關懷中學習烹飪",
        },
        milestones: [
          {
            en: "Nutrition guidance helps families build healthier everyday habits.",
            zh: "營養指導協助家庭建立更健康的日常習慣。",
          },
          {
            en: "Hands-on cooking sessions turn advice into practical skills.",
            zh: "動手烹飪課堂把建議轉化為實用技能。",
          },
          {
            en: "Members practise food choices that support wellbeing over time.",
            zh: "會員練習有助長期身心健康的飲食選擇。",
          },
        ],
        supportingProgramme: {
          en: "Supported by our Nutrition programme",
          zh: "由我們的營養計劃支援",
        },
        action: {
          label: { en: "Explore nutrition programmes", zh: "了解營養計劃" },
          href: routes.programmes,
        },
        source: {
          label: {
            en: "Source: Love 21 programme photography",
            zh: "來源：Love 21 計劃影像",
          },
        },
      },
      {
        id: "practice-to-stage",
        status: "placeholder",
        image: images.hero,
        imageAlt: {
          en: "Illustrative image for a placeholder community story",
          zh: "用作佔位社群故事的示範影像",
        },
        achievement: {
          en: "From weekly practice to the stage",
          zh: "從每週練習走到舞台",
        },
        milestones: [
          {
            en: "Example milestone: a member builds confidence through weekly practice.",
            zh: "示例里程碑：會員透過每週練習建立自信。",
          },
          {
            en: "Example milestone: family and volunteers walk alongside the journey.",
            zh: "示例里程碑：家人與義工同行支持。",
          },
          {
            en: "Example milestone: a shared performance moment celebrates progress.",
            zh: "示例里程碑：以共享表演時刻慶祝進步。",
          },
        ],
        supportingProgramme: {
          en: "Example story framed around holistic family support",
          zh: "以全面家庭支援為背景的示例故事",
        },
        action: {
          label: { en: "Support this work", zh: "支持這份工作" },
          href: routes.donate,
        },
        placeholderBadge: {
          en: "Placeholder story — replace with consent-approved content.",
          zh: "佔位故事 — 請替換為經同意及核准的內容。",
        },
      },
    ],
  },
  model: {
    id: "what-we-do",
    eyebrow: {
      en: "The Love 21 model",
      zh: "Love 21 模式",
    },
    title: {
      en: "Connected support around members and families.",
      zh: "圍繞會員與家庭的連貫支援。",
    },
    detailsLabel: {
      en: "Programme details",
      zh: "了解計劃詳情",
    },
    centre: {
      title: {
        en: "Members and families",
        zh: "會員與家庭",
      },
      description: {
        en: "Everything centres on people with Down syndrome and autism, and the families who walk with them. Sport, nutrition and family support work together — not as separate silos.",
        zh: "一切以唐氏綜合症及自閉症人士，以及與他們同行的家庭為中心。運動、營養與家庭支援互相連結，而非各自獨立。",
      },
    },
    pillars: [
      {
        key: "sports",
        title: { en: "Sports", zh: "體育" },
        image: images.sports,
        imageAlt: {
          en: "Members taking part in a Love 21 sports session",
          zh: "會員參與 Love 21 體育課堂",
        },
        explanation: {
          en: "Regular classes build strength, confidence and belonging through movement.",
          zh: "常規課堂透過運動建立力量、自信與歸屬感。",
        },
        example: {
          en: "Example: weekly team sports where members practise skills with coaches and volunteers.",
          zh: "例子：每週團隊運動，會員與教練、義工一同練習技能。",
        },
        href: routes.programmes,
      },
      {
        key: "nutrition",
        title: { en: "Nutrition", zh: "營養" },
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 nutrition support in action",
          zh: "Love 21 營養支援實況",
        },
        explanation: {
          en: "Practical guidance helps members and families make healthier food choices every day.",
          zh: "實用指導協助會員及家庭在日常生活中作出更健康的飲食選擇。",
        },
        example: {
          en: "Example: one-to-one nutrition support alongside cooking-focused sessions.",
          zh: "例子：一對一營養支援，配合以烹飪為重點的課堂。",
        },
        href: routes.programmes,
      },
      {
        key: "family",
        title: { en: "Family support", zh: "家庭支援" },
        image: images.family,
        imageAlt: {
          en: "Families connected through Love 21 support",
          zh: "透過 Love 21 支援連繫的家庭",
        },
        explanation: {
          en: "Holistic support recognises that when families are stronger, members thrive.",
          zh: "全面支援重視一點：家庭更穩健，會員更能茁壯成長。",
        },
        example: {
          en: "Example: counselling and community connection for parents and carers.",
          zh: "例子：為家長及照顧者提供輔導與社群連繫。",
        },
        href: routes.programmes,
      },
    ],
  },
  opportunities: {
    id: "opportunities",
    eyebrow: {
      en: "Upcoming opportunities",
      zh: "即將開放的機會",
    },
    title: {
      en: "Be ready when the next activity opens.",
      zh: "為下一個活動開放作好準備。",
    },
    emptyTitle: {
      en: "No opportunities are published right now.",
      zh: "目前未有已發佈的機會。",
    },
    emptyDescription: {
      en: "We are not listing future dates or reservation slots until real opportunities are available. Register your interest and we will help you find a meaningful way to take part.",
      zh: "在真實機會開放前，我們不會列出虛構日期或預約名額。請登記興趣，我們會協助你找到有意義的參與方式。",
    },
    volunteerCta: {
      label: { en: "Volunteer information", zh: "義工資訊" },
      href: routes.volunteer,
    },
    contactCta: {
      label: { en: "Contact the team", zh: "聯絡團隊" },
      href: routes.contact,
    },
  },
  donatePreview: {
    id: "donate-preview",
    eyebrow: {
      en: "Give",
      zh: "捐助",
    },
    title: {
      en: "Preview how your gift can help.",
      zh: "預覽你的捐助如何帶來幫助。",
    },
    description: {
      en: "Choose a frequency, amount and focus area. This is a preview only — you will complete your gift on the donation page.",
      zh: "選擇捐助頻率、金額及支援範疇。這只是預覽——你將在捐助頁面完成捐款。",
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
          en: "A one-time gift of this size helps Love 21 keep free programmes running where need is greatest.",
          zh: "此金額的一次性捐助，有助 Love 21 在最有需要的地方維持免費計劃運作。",
        },
      },
      {
        frequency: "monthly",
        programme: "most-needed",
        message: {
          en: "A monthly gift of this size helps Love 21 plan steady support across the programmes families rely on.",
          zh: "此金額的每月捐助，有助 Love 21 為家庭所倚賴的計劃規劃穩定支援。",
        },
      },
      {
        frequency: "one-time",
        programme: "sports",
        message: {
          en: "A one-time gift directed to Sports helps sustain inclusive activity spaces for our community.",
          zh: "指定予體育的一次性捐助，有助維持社群共融活動空間。",
        },
      },
      {
        frequency: "monthly",
        programme: "sports",
        message: {
          en: "A monthly gift directed to Sports helps Love 21 sustain regular inclusive activity over time.",
          zh: "指定予體育的每月捐助，有助 Love 21 長期維持常規共融活動。",
        },
      },
      {
        frequency: "one-time",
        programme: "nutrition",
        message: {
          en: "A one-time gift directed to Nutrition helps sustain practical food and wellbeing guidance for families.",
          zh: "指定予營養的一次性捐助，有助維持家庭所需的實用飲食與健康指導。",
        },
      },
      {
        frequency: "monthly",
        programme: "nutrition",
        message: {
          en: "A monthly gift directed to Nutrition helps Love 21 keep food and wellbeing guidance available over time.",
          zh: "指定予營養的每月捐助，有助 Love 21 長期提供飲食與健康指導。",
        },
      },
      {
        frequency: "one-time",
        programme: "family",
        message: {
          en: "A one-time gift directed to Family Support helps sustain care that strengthens the whole household.",
          zh: "指定予家庭支援的一次性捐助，有助維持強化整個家庭的關顧服務。",
        },
      },
      {
        frequency: "monthly",
        programme: "family",
        message: {
          en: "A monthly gift directed to Family Support helps Love 21 walk with carers through the year.",
          zh: "指定予家庭支援的每月捐助，有助 Love 21 整年與照顧者同行。",
        },
      },
    ],
    defaultImpact: {
      en: "Your gift helps Love 21 keep programmes free for members and families.",
      zh: "你的捐助有助 Love 21 維持會員及家庭免費參與計劃。",
    },
    cta: {
      label: { en: "Continue to donate", zh: "前往捐助" },
      href: routes.donate,
    },
    note: {
      en: "Selections are for preview only and are not saved as a payment.",
      zh: "以上選擇僅供預覽，不會儲存為付款資料。",
    },
  },
  help: {
    id: "help",
    eyebrow: {
      en: "How you can help",
      zh: "你可以怎樣幫忙",
    },
    title: {
      en: "Every role strengthens the community.",
      zh: "每一個角色都強化這個社群。",
    },
    description: {
      en: "Choose a live action today, or ask about planned ways to help that are coming next.",
      zh: "今天可選擇已開放的行動，或查詢即將推出的參與方式。",
    },
    plannedLabel: {
      en: "Planned",
      zh: "計劃中",
    },
    actions: [
      {
        id: "donate",
        status: "live",
        title: { en: "Donate", zh: "捐助" },
        description: {
          en: "Help keep programmes free for members and families.",
          zh: "協助維持會員及家庭免費參與計劃。",
        },
        action: {
          label: { en: "Go to donate", zh: "前往捐助" },
          href: routes.donate,
        },
      },
      {
        id: "volunteer",
        status: "live",
        title: { en: "Volunteer", zh: "成為義工" },
        description: {
          en: "Give time, skills and encouragement alongside our community.",
          zh: "以時間、技能與鼓勵與社群同行。",
        },
        action: {
          label: { en: "Learn about volunteering", zh: "了解義工服務" },
          href: routes.volunteer,
        },
      },
      {
        id: "campaign",
        status: "planned",
        title: { en: "Start a campaign", zh: "發起籌款活動" },
        description: {
          en: "A future path for supporters who want to rally friends and colleagues.",
          zh: "未來將開放予希望凝聚親友與同事支持的參與者。",
        },
        action: {
          label: { en: "Enquire about campaigns", zh: "查詢籌款活動" },
          href: routes.contact,
        },
      },
      {
        id: "wishlist",
        status: "planned",
        title: { en: "Contribute to a wishlist", zh: "支持心願清單" },
        description: {
          en: "A planned way to sponsor practical items our programmes need.",
          zh: "計劃中的方式，讓你贊助計劃所需的實用物資。",
        },
        action: {
          label: { en: "Enquire about the wishlist", zh: "查詢心願清單" },
          href: routes.contact,
        },
      },
    ],
  },
  trust: {
    id: "trust",
    eyebrow: {
      en: "Trust and community",
      zh: "信任與社群",
    },
    title: {
      en: "Transparent, community-led, and accountable.",
      zh: "透明、以社群為本、並負責任。",
    },
    section88: {
      en: "Love 21 Foundation is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong.",
      zh: "Love 21 Foundation 是香港《稅務條例》第 88 條下的註冊慈善機構。",
    },
    dignityStatement: {
      en: "We are committed to portraying our community with dignity and to using stories and images only with appropriate consent. Full policy wording awaits organisational approval.",
      zh: "我們致力以尊嚴方式呈現社群，並只在取得適當同意後使用故事與影像。完整政策措辭尚待機構核准。",
    },
    dignityBadge: {
      en: "Awaiting organisational approval",
      zh: "尚待機構核准",
    },
    metrics: proofPoints,
    links: [
      {
        label: { en: "Latest annual report", zh: "最新年度報告" },
        href: routes.finance,
      },
      {
        label: { en: "Board and governance", zh: "董事局與管治" },
        href: routes.board,
      },
      {
        label: { en: "More media coverage", zh: "更多媒體報導" },
        href: routes.media,
      },
    ],
    communityLabel: {
      en: "From the community",
      zh: "社群動態",
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
    title: {
      en: "How will you join the Love 21 community?",
      zh: "你會如何加入 Love 21 社群？",
    },
    actions: [
      {
        label: { en: "Join an activity", zh: "參加活動" },
        href: routes.contact,
      },
      {
        label: { en: "Volunteer", zh: "成為義工" },
        href: routes.volunteer,
      },
      {
        label: { en: "Support Love 21", zh: "支持 Love 21" },
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
