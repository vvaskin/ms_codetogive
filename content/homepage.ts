import { images, mediaArticles, type Locale } from "./site-data";

export type StoryStatus = "existing" | "placeholder";

export type ProgrammePillarKey = "sports" | "nutrition" | "family";

export type DonationFrequency = "one-time" | "monthly";

export type DonationProgramme = "most-needed" | ProgrammePillarKey;

export interface LocalizedString {
  en: string;
  zh: string;
  cn: string;
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
  contact: { en: "/contact-us/", zh: "/zh/contact-us-hk/", cn: "/cn/contact-us/" },
  volunteer: { en: "/our-volunteer/", zh: "/zh/our-volunteer-hk/", cn: "/cn/our-volunteer/" },
  donate: { en: "/donate/", zh: "/zh/donate-hk/", cn: "/cn/donate/" },
  programmes: { en: "/#what-we-do", zh: "/zh/#what-we-do", cn: "/cn/#what-we-do" },
  finance: { en: "/our-finance/", zh: "/zh/our-finance-hk/", cn: "/cn/our-finance/" },
  board: { en: "/board-of-directors/", zh: "/zh/board-of-directors-hk/", cn: "/cn/board-of-directors/" },
  media: { en: "/media/", zh: "/zh/media-hk/", cn: "/cn/media/" },
} as const;

const proofPoints: HomepageMetric[] = [
  {
    value: "600+",
    label: {
      en: "members and families",
      zh: "會員及家庭",
      cn: "会员及家庭",
    },
  },
  {
    value: "≈1,000",
    label: {
      en: "monthly activities",
      zh: "每月活動節數",
      cn: "每月活动节数",
    },
  },
  {
    value: "HK$0",
    label: {
      en: "charged to families",
      zh: "不向家庭收費",
      cn: "不向家庭收费",
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
      cn: "Beyond Limits 晚宴座位现已开放。",
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
      cn: "慈善抽奖收益支援 Love 21 Space。",
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
      cn: "聚焦健康活动与社群支援。",
    },
  },
];

export const homepageContent: HomepageContent = {
  locale: "en",
  hero: {
    eyebrow: {
      en: "Love 21 Foundation · Hong Kong",
      zh: "Love 21 Foundation · 香港",
      cn: "Love 21 Foundation · 香港",
    },
    headline: {
      en: "Our community trains, cooks and grows together.",
      zh: "我們的社群一起訓練、烹飪、成長。",
      cn: "我们的社群一起训练、烹饪、成长。",
    },
    supporting: {
      en: "Free sport, nutrition and family support for people with Down syndrome and autism — and the families beside them.",
      zh: "為唐氏綜合症及自閉症人士與家人，提供免費的體育、營養與家庭支援。",
      cn: "为唐氏综合症及自闭症人士与家人，提供免费的体育、营养与家庭支援。",
    },
    image: images.hero,
    imageAlt: {
      en: "Love 21 members moving together in a ribbon class",
      zh: "Love 21 會員在絲帶課堂中一起活動",
      cn: "Love 21 会员在丝带课堂中一起活动",
    },
    caption: {
      en: "Saturday movement class",
      zh: "星期六運動課堂",
      cn: "星期六运动课堂",
    },
    stickers: [
      { en: "JOY", zh: "喜悅", cn: "喜悦" },
      { en: "SKILL", zh: "技能", cn: "技能" },
      { en: "BELONGING", zh: "歸屬", cn: "归属" },
    ],
    primaryCta: {
      label: { en: "Meet the community", zh: "認識社群", cn: "认识社群" },
      href: { en: "#stories", zh: "#stories", cn: "#stories" },
    },
    secondaryCta: {
      label: { en: "Get involved", zh: "參與其中", cn: "参与其中" },
      href: { en: "/get-involved/", zh: "/zh/get-involved-hk/", cn: "/cn/get-involved/" },
    },
    metrics: proofPoints,
  },
  stakeholderPaths: {
    label: {
      en: "I want to…",
      zh: "我想…",
      cn: "我想…",
    },
    items: [
      {
        label: { en: "Support my family", zh: "支援我家", cn: "支援我家" },
        href: routes.contact,
      },
      {
        label: { en: "Volunteer", zh: "做義工", cn: "做义工" },
        href: { en: "#opportunities", zh: "#opportunities", cn: "#opportunities" },
      },
      {
        label: { en: "Donate", zh: "捐助", cn: "捐助" },
        href: { en: "#donate-preview", zh: "#donate-preview", cn: "#donate-preview" },
      },
      {
        label: { en: "Partner with us", zh: "成為夥伴", cn: "成为伙伴" },
        href: routes.contact,
      },
    ],
  },
  journey: {
    label: {
      en: "On this page",
      zh: "本頁導覽",
      cn: "本页导览",
    },
    steps: [
      { en: "Moments", zh: "時刻", cn: "时刻" },
      { en: "Programmes", zh: "計劃", cn: "计划" },
      { en: "Volunteer", zh: "義工", cn: "义工" },
      { en: "Give", zh: "捐助", cn: "捐助" },
    ],
  },
  stories: {
    id: "stories",
    eyebrow: {
      en: "02 · Community",
      zh: "02 · 社群",
      cn: "02 · 社群",
    },
    title: {
      en: "On the pitch. In the kitchen. With family.",
      zh: "在球場。在廚房。與家人一起。",
      cn: "在球场。在厨房。与家人一起。",
    },
    lead: {
      en: "",
      zh: "",
      cn: "",
    },
    previousLabel: { en: "Previous story", zh: "上一個故事", cn: "上一个故事" },
    nextLabel: { en: "Next story", zh: "下一個故事", cn: "下一个故事" },
    tabLabel: { en: "Show story", zh: "顯示故事", cn: "显示故事" },
    items: [
      {
        id: "sports-team",
        status: "existing",
        image: images.sports,
        imageAlt: {
          en: "Love 21 sports team outdoors after training",
          zh: "Love 21 體育隊伍戶外訓練後合照",
          cn: "Love 21 体育队伍户外训练后合照",
        },
        category: {
          en: "Sports",
          zh: "體育",
          cn: "体育",
        },
        achievement: {
          en: "Weekly training became a team.",
          zh: "每週訓練，練成一支隊伍。",
          cn: "每周训练，练成一支队伍。",
        },
        summary: {
          en: "Members practise together, week after week — then take that confidence onto the field.",
          zh: "會員每週一起練習，再把自信帶到場上。",
          cn: "会员每周一起练习，再把自信带到场上。",
        },
        shortMilestones: [
          { en: "First class", zh: "第一次課堂", cn: "第一次课堂" },
          { en: "Weekly drills", zh: "每週練習", cn: "每周练习" },
          { en: "Match day", zh: "比賽日", cn: "比赛日" },
        ],
        milestones: [
          {
            en: "Members join regular sports classes.",
            zh: "會員參與常規體育課堂。",
            cn: "会员参与常规体育课堂。",
          },
          {
            en: "Coaches and volunteers train alongside them.",
            zh: "教練與義工並肩訓練。",
            cn: "教练与义工并肩训练。",
          },
          {
            en: "The team competes and celebrates together.",
            zh: "隊伍一起比賽、一起慶祝。",
            cn: "队伍一起比赛、一起庆祝。",
          },
        ],
        supportingProgramme: {
          en: "Sports programme",
          zh: "體育計劃",
          cn: "体育计划",
        },
        action: {
          label: { en: "Sports programmes", zh: "體育計劃", cn: "体育计划" },
          href: routes.programmes,
        },
        source: {
          label: {
            en: "Love 21 programme photography",
            zh: "Love 21 計劃影像",
            cn: "Love 21 计划影像",
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
          cn: "Love 21 会员在厨房一起烹饪",
        },
        category: {
          en: "Nutrition",
          zh: "營養",
          cn: "营养",
        },
        achievement: {
          en: "They cook the meal they planned.",
          zh: "他們煮出自己計劃的一餐。",
          cn: "他们煮出自己计划的一餐。",
        },
        summary: {
          en: "Nutrition guidance moves from advice to chopping boards, recipes and shared meals.",
          zh: "營養指導從建議走進砧板、食譜與共享一餐。",
          cn: "营养指导从建议走进砧板、食谱与共享一餐。",
        },
        shortMilestones: [
          { en: "Plan", zh: "計劃", cn: "计划" },
          { en: "Cook", zh: "烹飪", cn: "烹饪" },
          { en: "Share", zh: "分享", cn: "分享" },
        ],
        milestones: [
          {
            en: "Families receive practical nutrition guidance.",
            zh: "家庭獲得實用營養指導。",
            cn: "家庭获得实用营养指导。",
          },
          {
            en: "Members cook together in class.",
            zh: "會員在課堂一起烹飪。",
            cn: "会员在课堂一起烹饪。",
          },
          {
            en: "Healthier habits carry into daily life.",
            zh: "更健康的習慣走進日常生活。",
            cn: "更健康的习惯走进日常生活。",
          },
        ],
        supportingProgramme: {
          en: "Nutrition programme",
          zh: "營養計劃",
          cn: "营养计划",
        },
        action: {
          label: { en: "Nutrition programmes", zh: "營養計劃", cn: "营养计划" },
          href: routes.programmes,
        },
        source: {
          label: {
            en: "Love 21 programme photography",
            zh: "Love 21 計劃影像",
            cn: "Love 21 计划影像",
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
          cn: "Love 21 会员练习丝带动作",
        },
        category: {
          en: "Performance",
          zh: "表演",
          cn: "表演",
        },
        achievement: {
          en: "Practice became a performance.",
          zh: "練習，走到了舞台。",
          cn: "练习，走到了舞台。",
        },
        summary: {
          en: "A placeholder for a consent-approved story of weekly practice leading to a shared stage moment.",
          zh: "佔位內容：經同意後可替換為「每週練習走到舞台」的真實故事。",
          cn: "占位内容：经同意后可替换为「每周练习走到舞台」的真实故事。",
        },
        shortMilestones: [
          { en: "Practice", zh: "練習", cn: "练习" },
          { en: "Rehearse", zh: "綵排", cn: "彩排" },
          { en: "Perform", zh: "演出", cn: "演出" },
        ],
        milestones: [
          {
            en: "Weekly practice builds skill and confidence.",
            zh: "每週練習建立技能與自信。",
            cn: "每周练习建立技能与自信。",
          },
          {
            en: "Family and volunteers walk the journey.",
            zh: "家人與義工一路同行。",
            cn: "家人与义工一路同行。",
          },
          {
            en: "A shared performance marks the progress.",
            zh: "共享演出標記進步。",
            cn: "共享演出标记进步。",
          },
        ],
        supportingProgramme: {
          en: "Family support",
          zh: "家庭支援",
          cn: "家庭支援",
        },
        action: {
          label: { en: "Support Love 21", zh: "支持 Love 21", cn: "支持 Love 21" },
          href: routes.donate,
        },
        placeholderBadge: {
          en: "Placeholder — replace with approved story",
          zh: "佔位 — 請替換為核准故事",
          cn: "占位 — 请替换为核准故事",
        },
      },
    ],
  },
  model: {
    id: "what-we-do",
    eyebrow: {
      en: "01 · What we run",
      zh: "01 · 我們的計劃",
      cn: "01 · 我们的计划",
    },
    title: {
      en: "Sport. Nutrition. Family support.",
      zh: "體育。營養。家庭支援。",
      cn: "体育。营养。家庭支援。",
    },
    detailsLabel: {
      en: "Learn more",
      zh: "了解更多",
      cn: "了解更多",
    },
    centre: {
      title: {
        en: "Built around members and families",
        zh: "以會員與家庭為本",
        cn: "以会员与家庭为本",
      },
      description: {
        en: "Three programmes work as one — free for every Love 21 family.",
        zh: "三項計劃一體運作 — 每位 Love 21 家庭均可免費參與。",
        cn: "三项计划一体运作 — 每位 Love 21 家庭均可免费参与。",
      },
    },
    pillars: [
      {
        key: "sports",
        title: { en: "Sports", zh: "體育", cn: "体育" },
        image: images.sports,
        imageAlt: {
          en: "Members in a Love 21 sports session",
          zh: "會員參與 Love 21 體育課堂",
          cn: "会员参与 Love 21 体育课堂",
        },
        explanation: {
          en: "Weekly classes, team sports and movement for every level.",
          zh: "每週課堂、團隊運動，適合不同程度。",
          cn: "每周课堂、团队运动，适合不同程度。",
        },
        example: {
          en: "Football, climbing, boxing and ribbon class.",
          zh: "足球、攀石、拳擊與絲帶課堂。",
          cn: "足球、攀岩、拳击与丝带课堂。",
        },
        href: routes.programmes,
      },
      {
        key: "nutrition",
        title: { en: "Nutrition", zh: "營養", cn: "营养" },
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 cooking and nutrition session",
          zh: "Love 21 烹飪與營養課堂",
          cn: "Love 21 烹饪与营养课堂",
        },
        explanation: {
          en: "One-to-one guidance plus hands-on cooking.",
          zh: "一對一指導，加上動手烹飪。",
          cn: "一对一指导，加上动手烹饪。",
        },
        example: {
          en: "Meal planning, kitchen skills and healthier habits.",
          zh: "餐單規劃、廚房技能與健康習慣。",
          cn: "菜单规划、厨房技能与健康习惯。",
        },
        href: routes.programmes,
      },
      {
        key: "family",
        title: { en: "Family support", zh: "家庭支援", cn: "家庭支援" },
        image: images.family,
        imageAlt: {
          en: "Families connected through Love 21",
          zh: "透過 Love 21 連繫的家庭",
          cn: "透过 Love 21 连系的家庭",
        },
        explanation: {
          en: "Counselling and community for parents and carers.",
          zh: "為家長與照顧者提供輔導與社群。",
          cn: "为家长与照顾者提供辅导与社群。",
        },
        example: {
          en: "Support that strengthens the whole household.",
          zh: "強化整個家庭的支援。",
          cn: "强化整个家庭的支援。",
        },
        href: routes.programmes,
      },
    ],
    programmeChips: [
      {
        label: { en: "Football", zh: "足球", cn: "足球" },
        href: routes.programmes,
      },
      {
        label: { en: "Climbing", zh: "攀石", cn: "攀岩" },
        href: routes.programmes,
      },
      {
        label: { en: "Cooking", zh: "烹飪", cn: "烹饪" },
        href: routes.programmes,
      },
      {
        label: { en: "Counselling", zh: "輔導", cn: "辅导" },
        href: routes.programmes,
      },
    ],
  },
  opportunities: {
    id: "opportunities",
    eyebrow: {
      en: "04 · Volunteer",
      zh: "04 · 義工",
      cn: "04 · 义工",
    },
    title: {
      en: "Come for a Saturday. Stay for the community.",
      zh: "來一個星期六，留下一份社群。",
      cn: "来一个星期六，留下一份社群。",
    },
    lead: {
      en: "",
      zh: "",
      cn: "",
    },
    demoNote: {
      en: "Demo dates — not live bookings.",
      zh: "示範日期 — 非真實預約。",
      cn: "示范日期 — 非真实预约。",
    },
    filterLabel: {
      en: "This month",
      zh: "本月",
      cn: "本月",
    },
    emptyBadge: {
      en: "Coming soon",
      zh: "即將開放",
      cn: "即将开放",
    },
    emptyTitle: {
      en: "New sessions will appear here.",
      zh: "新課堂將顯示於此。",
      cn: "新课堂将显示于此。",
    },
    emptyDescription: {
      en: "Register interest and we will help you find a role.",
      zh: "請登記興趣，我們會協助你找到合適角色。",
      cn: "请登记兴趣，我们会协助你找到合适角色。",
    },
    volunteerCta: {
      label: { en: "Volunteer info", zh: "義工資訊", cn: "义工资讯" },
      href: routes.volunteer,
    },
    contactCta: {
      label: { en: "Corporate volunteering", zh: "企業義工", cn: "企业义工" },
      href: { en: "/get-involved/#corporate", zh: "/zh/get-involved-hk/#corporate", cn: "/cn/get-involved/#corporate" },
    },
    activities: [
      {
        id: "saturday-movement",
        title: {
          en: "Saturday movement crew",
          zh: "星期六運動小組",
          cn: "星期六运动小组",
        },
        role: {
          en: "Cheer on, join in, keep the class moving.",
          zh: "打氣、一起參與、協助課堂流暢。",
          cn: "打气、一起参与、协助课堂流畅。",
        },
        day: "08",
        month: { en: "AUG", zh: "8月", cn: "8月" },
        time: {
          en: "10:00–12:00",
          zh: "10:00–12:00",
          cn: "10:00–12:00",
        },
        location: {
          en: "Love 21 Space",
          zh: "Love 21 Space",
          cn: "Love 21 Space",
        },
        image: images.hero,
        imageAlt: {
          en: "Love 21 movement class with ribbons",
          zh: "Love 21 絲帶運動課堂",
          cn: "Love 21 丝带运动课堂",
        },
        badge: {
          en: "First-timer friendly",
          zh: "適合新手",
          cn: "适合新手",
        },
        action: {
          label: { en: "Reserve a spot", zh: "預留名額", cn: "预留名额" },
          href: routes.volunteer,
        },
      },
      {
        id: "climbing-confidence",
        title: {
          en: "Climbing session",
          zh: "攀石課堂",
          cn: "攀岩课堂",
        },
        role: {
          en: "Help with warm-up, kit and high-fives.",
          zh: "協助熱身、器材與打氣。",
          cn: "协助热身、器材与打气。",
        },
        day: "15",
        month: { en: "AUG", zh: "8月", cn: "8月" },
        time: {
          en: "14:00–16:30",
          zh: "14:00–16:30",
          cn: "14:00–16:30",
        },
        location: {
          en: "Kowloon",
          zh: "九龍",
          cn: "九龙",
        },
        image: images.sports,
        imageAlt: {
          en: "Love 21 sports programme activity",
          zh: "Love 21 體育計劃活動",
          cn: "Love 21 体育计划活动",
        },
        action: {
          label: { en: "Reserve a spot", zh: "預留名額", cn: "预留名额" },
          href: routes.volunteer,
        },
      },
      {
        id: "community-kitchen",
        title: {
          en: "Community kitchen",
          zh: "社區廚房",
          cn: "社区厨房",
        },
        role: {
          en: "Prep stations and cook with members.",
          zh: "準備工作站，與會員一起煮。",
          cn: "准备工作站，与会员一起煮。",
        },
        day: "22",
        month: { en: "AUG", zh: "8月", cn: "8月" },
        time: {
          en: "11:00–13:00",
          zh: "11:00–13:00",
          cn: "11:00–13:00",
        },
        location: {
          en: "Love 21 Space",
          zh: "Love 21 Space",
          cn: "Love 21 Space",
        },
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 nutrition and cooking activity",
          zh: "Love 21 營養與烹飪活動",
          cn: "Love 21 营养与烹饪活动",
        },
        badge: {
          en: "First-timer friendly",
          zh: "適合新手",
          cn: "适合新手",
        },
        action: {
          label: { en: "Reserve a spot", zh: "預留名額", cn: "预留名额" },
          href: routes.volunteer,
        },
      },
    ],
  },
  donatePreview: {
    id: "donate-preview",
    eyebrow: {
      en: "05 · Give",
      zh: "05 · 捐助",
      cn: "05 · 捐助",
    },
    title: {
      en: "Keep every programme free.",
      zh: "讓每一項計劃繼續免費。",
      cn: "让每一项计划继续免费。",
    },
    description: {
      en: "Pick an amount and focus. Finish on the donation page.",
      zh: "選擇金額與用途，再到捐助頁完成。",
      cn: "选择金额与用途，再到捐助页完成。",
    },
    supportLabel: {
      en: "Your gift",
      zh: "你的捐助",
      cn: "你的捐助",
    },
    frequencyLabel: { en: "Frequency", zh: "頻率", cn: "频率" },
    oneTimeLabel: { en: "One-time", zh: "一次性", cn: "一次性" },
    monthlyLabel: { en: "Monthly", zh: "每月", cn: "每月" },
    amountLabel: { en: "Amount", zh: "金額", cn: "金额" },
    customAmountLabel: { en: "Custom amount (HK$)", zh: "自訂金額（港元）", cn: "自定义金额（港元）" },
    customAmountPlaceholder: { en: "Enter amount", zh: "輸入金額", cn: "输入金额" },
    customAmountError: {
      en: "Enter a whole-number amount of at least HK$1.",
      zh: "請輸入至少港幣 1 元的整數金額。",
      cn: "请输入至少港币 1 元的整数金额。",
    },
    programmeLabel: { en: "Direct my gift to", zh: "將捐助用於", cn: "将捐助用于" },
    programmeOptions: [
      {
        value: "most-needed",
        label: { en: "Where most needed", zh: "最有需要的地方", cn: "最有需要的地方" },
      },
      { value: "sports", label: { en: "Sports", zh: "體育", cn: "体育" } },
      { value: "nutrition", label: { en: "Nutrition", zh: "營養", cn: "营养" } },
      {
        value: "family",
        label: { en: "Family support", zh: "家庭支援", cn: "家庭支援" },
      },
    ],
    amounts: [
      { value: 250, label: { en: "HK$250", zh: "港幣 250 元", cn: "港币 250 元" } },
      { value: 500, label: { en: "HK$500", zh: "港幣 500 元", cn: "港币 500 元" } },
      { value: 1000, label: { en: "HK$1,000", zh: "港幣 1,000 元", cn: "港币 1,000 元" } },
    ],
    impactMessages: [
      {
        frequency: "one-time",
        programme: "most-needed",
        message: {
          en: "Helps keep free classes running where families need them most.",
          zh: "協助在最有需要的地方維持免費課堂。",
          cn: "协助在最有需要的地方维持免费课堂。",
        },
      },
      {
        frequency: "monthly",
        programme: "most-needed",
        message: {
          en: "Gives Love 21 steady support for the programmes families count on.",
          zh: "為家庭倚賴的計劃提供穩定支援。",
          cn: "为家庭依赖的计划提供稳定支援。",
        },
      },
      {
        frequency: "one-time",
        programme: "sports",
        message: {
          en: "Helps fund sports sessions, kit and coaching time.",
          zh: "協助支援體育課堂、器材與教練時間。",
          cn: "协助支援体育课堂、器材与教练时间。",
        },
      },
      {
        frequency: "monthly",
        programme: "sports",
        message: {
          en: "Helps keep weekly sports sessions going all year.",
          zh: "協助全年維持每週體育課堂。",
          cn: "协助全年维持每周体育课堂。",
        },
      },
      {
        frequency: "one-time",
        programme: "nutrition",
        message: {
          en: "Helps fund cooking classes and nutrition guidance.",
          zh: "協助支援烹飪課堂與營養指導。",
          cn: "协助支援烹饪课堂与营养指导。",
        },
      },
      {
        frequency: "monthly",
        programme: "nutrition",
        message: {
          en: "Helps keep nutrition support available month after month.",
          zh: "協助每月持續提供營養支援。",
          cn: "协助每月持续提供营养支援。",
        },
      },
      {
        frequency: "one-time",
        programme: "family",
        message: {
          en: "Helps fund counselling and carer support.",
          zh: "協助支援輔導與照顧者服務。",
          cn: "协助支援辅导与照顾者服务。",
        },
      },
      {
        frequency: "monthly",
        programme: "family",
        message: {
          en: "Helps Love 21 stay beside carers through the year.",
          zh: "協助 Love 21 全年陪伴照顧者。",
          cn: "协助 Love 21 全年陪伴照顾者。",
        },
      },
    ],
    defaultImpact: {
      en: "Keeps Love 21 programmes free for families.",
      zh: "維持 Love 21 計劃對家庭免費。",
      cn: "维持 Love 21 计划对家庭免费。",
    },
    cta: {
      label: { en: "Donate now", zh: "立即捐助", cn: "立即捐助" },
      href: routes.donate,
    },
    note: {
      en: "Preview only — nothing is charged here.",
      zh: "僅供預覽 — 此處不會收費。",
      cn: "仅供预览 — 此处不会收费。",
    },
  },
  help: {
    id: "help",
    eyebrow: {
      en: "05 · Get involved",
      zh: "05 · 參與",
      cn: "05 · 参与",
    },
    title: {
      en: "Give time. Give funds. Open a door.",
      zh: "付出時間。捐出資金。打開一扇門。",
      cn: "付出时间。捐出资金。打开一扇门。",
    },
    description: {
      en: "",
      zh: "",
      cn: "",
    },
    plannedLabel: {
      en: "Coming soon",
      zh: "即將推出",
      cn: "即将推出",
    },
    actions: [
      {
        id: "donate",
        status: "live",
        title: { en: "Donate", zh: "捐助", cn: "捐助" },
        description: {
          en: "Fund free sport, nutrition and family support.",
          zh: "資助免費體育、營養與家庭支援。",
          cn: "资助免费体育、营养与家庭支援。",
        },
        action: {
          label: { en: "Donate", zh: "捐助", cn: "捐助" },
          href: routes.donate,
        },
      },
      {
        id: "volunteer",
        status: "live",
        title: { en: "Volunteer", zh: "義工", cn: "义工" },
        description: {
          en: "Join a Saturday class, kitchen or sports session.",
          zh: "加入星期六課堂、廚房或體育活動。",
          cn: "加入星期六课堂、厨房或体育活动。",
        },
        action: {
          label: { en: "Volunteer", zh: "做義工", cn: "做义工" },
          href: routes.volunteer,
        },
      },
      {
        id: "campaign",
        status: "planned",
        title: { en: "Start a campaign", zh: "發起籌款", cn: "发起筹款" },
        description: {
          en: "Rally friends and colleagues around Love 21.",
          zh: "凝聚親友與同事支持 Love 21。",
          cn: "凝聚亲友与同事支持 Love 21。",
        },
        action: {
          label: { en: "Ask us", zh: "向我們查詢", cn: "向我们查询" },
          href: routes.contact,
        },
      },
      {
        id: "wishlist",
        status: "planned",
        title: { en: "Wishlist", zh: "心願清單", cn: "心愿清单" },
        description: {
          en: "Sponsor kit, kitchen supplies and class materials.",
          zh: "贊助器材、廚房物資與課堂用品。",
          cn: "赞助器材、厨房物资与课堂用品。",
        },
        action: {
          label: { en: "Ask us", zh: "向我們查詢", cn: "向我们查询" },
          href: routes.contact,
        },
      },
    ],
  },
  trust: {
    id: "trust",
    eyebrow: {
      en: "03 · Trust",
      zh: "03 · 信任",
      cn: "03 · 信任",
    },
    title: {
      en: "Section 88 charity. Open books. Clear governance.",
      zh: "第 88 條慈善機構。公開帳目。清晰管治。",
      cn: "第 88 条慈善机构。公开账目。清晰管治。",
    },
    section88: {
      en: "Registered under Section 88 of Hong Kong’s Inland Revenue Ordinance.",
      zh: "根據香港《稅務條例》第 88 條註冊。",
      cn: "根据香港《税务条例》第 88 条注册。",
    },
    dignityStatement: {
      en: "Stories and photos are used with consent. Full policy wording awaits Love 21 approval.",
      zh: "故事與照片均經同意使用。完整政策措辭尚待 Love 21 核准。",
      cn: "故事与照片均经同意使用。完整政策措辞尚待 Love 21 核准。",
    },
    dignityBadge: {
      en: "Policy pending approval",
      zh: "政策尚待核准",
      cn: "政策尚待核准",
    },
    metrics: proofPoints,
    links: [
      {
        label: { en: "Annual report", zh: "年度報告", cn: "年度报告" },
        href: routes.finance,
      },
      {
        label: { en: "Board", zh: "董事局", cn: "董事局" },
        href: routes.board,
      },
      {
        label: { en: "Media", zh: "媒體", cn: "媒体" },
        href: routes.media,
      },
    ],
    communityLabel: {
      en: "In the news",
      zh: "媒體報導",
      cn: "媒体报道",
    },
    partnersLabel: {
      en: "Recognised by",
      zh: "獲認可於",
      cn: "获认可于",
    },
    partners: [
      {
        src: "/assets/images/partner-ccma.png",
        alt: { en: "Caring Company", zh: "商界展關懷", cn: "商界展关怀" },
        width: 230,
        height: 99,
      },
      {
        src: "/assets/images/partner-hkcss.jpeg",
        alt: {
          en: "Hong Kong Council of Social Service agency member",
          zh: "香港社會服務聯會機構會員",
          cn: "香港社会服务联会机构会员",
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
      cn: "加入我们",
    },
    title: {
      en: "Ready for your first Saturday?",
      zh: "準備好第一個星期六了嗎？",
      cn: "准备好第一个星期六了吗？",
    },
    actions: [
      {
        label: { en: "Contact Love 21", zh: "聯絡 Love 21", cn: "联系 Love 21" },
        href: routes.contact,
      },
      {
        label: { en: "Volunteer", zh: "做義工", cn: "做义工" },
        href: routes.volunteer,
      },
      {
        label: { en: "Donate", zh: "捐助", cn: "捐助" },
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
