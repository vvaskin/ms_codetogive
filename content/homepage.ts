import { images, type Locale } from "./site-data";

export interface LocalizedString {
  readonly en: string;
  readonly zh: string;
  readonly cn: string;
}

export interface HomepageLink {
  readonly label: LocalizedString;
  readonly href: LocalizedString;
}

export interface HomepageMetric {
  readonly value: string;
  readonly label: LocalizedString;
  readonly source?: LocalizedString;
}

export interface HomepageImpactShowcase {
  readonly eyebrow: LocalizedString;
  /** Large center metric (≈1,000 monthly classes). */
  readonly featured: {
    readonly value: string;
    readonly title: LocalizedString;
    readonly description?: LocalizedString;
  };
  /** Side metrics: [left, right] — e.g. 600+ members, HK$0 cost. */
  readonly sides: readonly [HomepageMetric, HomepageMetric];
}

export interface HomepageFeaturedStory {
  readonly eyebrow: LocalizedString;
  readonly title: LocalizedString;
  readonly image: string;
  readonly imageAlt: LocalizedString;
  readonly panelLabel: LocalizedString;
  readonly panelTitle: LocalizedString;
  readonly context: LocalizedString;
  readonly quote: LocalizedString;
  readonly action: HomepageLink;
  readonly attribution: LocalizedString;
}

export type HomepageCardTone = "pink" | "sky" | "mint" | "yellow";

export interface HomepageStoryCard {
  readonly id: string;
  readonly tone: HomepageCardTone;
  readonly image: string;
  readonly imageAlt: LocalizedString;
  readonly category: LocalizedString;
  readonly title: LocalizedString;
  readonly summary: LocalizedString;
  readonly meta: LocalizedString;
  readonly href: string;
}

export interface HomepageConversationItem {
  readonly id: string;
  readonly side: "left" | "right";
  readonly label: LocalizedString;
  readonly message: LocalizedString;
}

export interface HomepageFeedCard {
  readonly id: string;
  readonly tone: HomepageCardTone;
  readonly network: LocalizedString;
  readonly date: string;
  readonly image: string;
  readonly imageAlt: LocalizedString;
  readonly title: LocalizedString;
  readonly href: string;
}

export interface HomepageCtaBand {
  readonly eyebrow?: LocalizedString;
  readonly title: LocalizedString;
  readonly description: LocalizedString;
  readonly primary: HomepageLink;
  /** Outline / secondary control (e.g. Volunteer on the donate band). */
  readonly volunteer?: HomepageLink;
  readonly secondary?: HomepageLink;
}

interface HomepageEducationPoint {
  readonly value: string;
  readonly description: LocalizedString;
}

export interface HomepageContent {
  readonly locale: Locale;
  readonly hero: {
    readonly eyebrow: LocalizedString;
    readonly title: LocalizedString;
    readonly description: LocalizedString;
    readonly primary: HomepageLink;
    readonly secondary: HomepageLink;
    readonly note: LocalizedString;
    readonly photos: readonly {
      readonly image: string;
      readonly alt: LocalizedString;
      readonly caption: LocalizedString;
    }[];
  };
  readonly impactShowcase: HomepageImpactShowcase;
  readonly featuredStory: HomepageFeaturedStory;
  readonly impactStats: {
    readonly label: LocalizedString;
    readonly items: readonly HomepageMetric[];
  };
  readonly featuredStories: {
    readonly eyebrow: LocalizedString;
    readonly title: LocalizedString;
    readonly action: HomepageLink;
    readonly items: readonly HomepageStoryCard[];
  };
  readonly abilityConversation: {
    readonly eyebrow: LocalizedString;
    readonly title: LocalizedString;
    readonly action: HomepageLink;
    readonly panelEyebrow: LocalizedString;
    readonly panelTitle: LocalizedString;
    readonly panelDescription: LocalizedString;
    readonly chatTitle: LocalizedString;
    readonly chatStatus: LocalizedString;
    readonly items: readonly HomepageConversationItem[];
    readonly readAction: HomepageLink;
  };
  readonly education: {
    readonly eyebrow: LocalizedString;
    readonly title: LocalizedString;
    readonly description: LocalizedString;
    readonly points: readonly HomepageEducationPoint[];
    readonly factsTitle: LocalizedString;
    readonly facts: readonly HomepageMetric[];
    readonly source: LocalizedString;
    readonly action: HomepageLink;
  };
  readonly socialFeed: {
    readonly eyebrow: LocalizedString;
    readonly title: LocalizedString;
    readonly facebook: HomepageLink;
    readonly instagram: HomepageLink;
    readonly items: readonly HomepageFeedCard[];
  };
  readonly volunteerCta: HomepageCtaBand;
  readonly donateCta: HomepageCtaBand;
}

const routes = {
  donate: { en: "/donate/", zh: "/zh/donate-hk/", cn: "/cn/donate/" },
  donateItems: {
    en: "/donate/?mode=items",
    zh: "/zh/donate-hk/?mode=items",
    cn: "/cn/donate/?mode=items",
  },
  volunteer: {
    en: "/our-volunteer/",
    zh: "/zh/our-volunteer-hk/",
    cn: "/cn/our-volunteer/",
  },
  stories: { en: "/stories/", zh: "/zh/stories-hk/", cn: "/cn/stories/" },
  ourStory: {
    en: "/our-story/",
    zh: "/zh/our-story-hk/",
    cn: "/cn/our-story/",
  },
} as const;

export const homepageContent: HomepageContent = {
  locale: "en",
  hero: {
    eyebrow: {
      en: "real people · real ability · Love 21",
      zh: "真實的人 · 真實的能力 · Love 21",
      cn: "真实的人 · 真实的能力 · Love 21",
    },
    title: {
      en: "See what our community can do.",
      zh: "看見我們社群的能力。",
      cn: "看见我们社群的能力。",
    },
    description: {
      en: "Love 21 empowers Hong Kong’s Down syndrome, autistic and neurodiverse community through free sport, nutrition and holistic family support.",
      zh: "Love 21 透過免費體育、營養及全人家庭支援，為香港唐氏綜合症、自閉症及神經多樣性社群創造機會。",
      cn: "Love 21 通过免费体育、营养及全人家庭支援，为香港唐氏综合症、自闭症及神经多样性社群创造机会。",
    },
    primary: {
      label: { en: "Donate", zh: "捐助", cn: "捐助" },
      href: routes.donate,
    },
    secondary: {
      label: { en: "Volunteer", zh: "做義工", cn: "做义工" },
      href: routes.volunteer,
    },
    note: {
      en: "Meet us in person — opportunity looks different up close.",
      zh: "親身相遇，近距離看見不一樣的可能。",
      cn: "亲身相遇，近距离看见不一样的可能。",
    },
    photos: [
      {
        image: images.hero,
        alt: {
          en: "Love 21 members moving together in a ribbon class",
          zh: "Love 21 會員在絲帶課堂中一起活動",
          cn: "Love 21 会员在丝带课堂中一起活动",
        },
        caption: {
          en: "movement day!",
          zh: "活力滿滿的一天！",
          cn: "活力满满的一天！",
        },
      },
      {
        image: images.sports,
        alt: {
          en: "Love 21 members taking part in a sports programme",
          zh: "Love 21 會員參與體育計劃",
          cn: "Love 21 会员参与体育计划",
        },
        caption: {
          en: "stronger together",
          zh: "一起變得更強",
          cn: "一起变得更强",
        },
      },
      {
        image: images.nutrition,
        alt: {
          en: "Love 21 members cooking together",
          zh: "Love 21 會員一起烹飪",
          cn: "Love 21 会员一起烹饪",
        },
        caption: { en: "cooking together", zh: "一起下廚", cn: "一起下厨" },
      },
    ],
  },
  impactShowcase: {
    eyebrow: {
      en: "our impact, by the numbers",
      zh: "以數字看我們的影響",
      cn: "以数字看我们的影响",
    },
    featured: {
      value: "≈1,000",
      title: {
        en: "classes and activities, every single month",
        zh: "每月約一千節課堂與活動",
        cn: "每月约一千节课堂与活动",
      },
      description: {
        en: "An entire world of opportunity across sport, nutrition, family care and inclusive partnerships.",
        zh: "涵蓋體育、營養、家庭支援及共融夥伴計劃，帶來一整個機會世界。",
        cn: "涵盖体育、营养、家庭支援及共融伙伴计划，带来一整个机会世界。",
      },
    },
    sides: [
      {
        value: "600+",
        label: {
          en: "members and families in our community",
          zh: "社群中的會員及家庭",
          cn: "社群中的会员及家庭",
        },
      },
      {
        value: "HK$0",
        label: {
          en: "cost to families for our programmes",
          zh: "家庭參與計劃的費用",
          cn: "家庭参与计划的费用",
        },
      },
    ],
  },
  featuredStory: {
    eyebrow: { en: "Testimonials", zh: "會員感言", cn: "会员感言" },
    title: {
      en: "Get inspired by our members:",
      zh: "Get inspired by our members:",
      cn: "Get inspired by our members:",
    },
    image: "/assets/images/crystal-fitness.jpg",
    imageAlt: {
      en: "Crystal taking part in a Love 21 movement activity",
      zh: "Crystal 參與 Love 21 運動活動",
      cn: "Crystal 参与 Love 21 运动活动",
    },
    panelLabel: {
      en: "Crystal’s story",
      zh: "Crystal 的故事",
      cn: "Crystal 的故事",
    },
    panelTitle: {
      en: "Steady. Strong. Smiling.",
      zh: "穩健。堅強。笑容滿面。",
      cn: "稳健。坚强。笑容满面。",
    },
    context: {
      en: "Each week Crystal trains with Love 21—planks, push-ups and wall sits—then takes on bocce competitions.",
      zh: "Crystal 每週參與 Love 21 健身訓練——平板支撐、掌上壓、無影櫈，再參加硬地滾球比賽。",
      cn: "Crystal 每周参与 Love 21 健身训练——平板支撑、俯卧撑、靠墙静蹲，再参加硬地滚球比赛。",
    },
    quote: {
      en: "I am very proud of how steadily she performs.",
      zh: "我為她的穩定表現深感驕傲！",
      cn: "我为她的稳定表现深感骄傲！",
    },
    action: {
      label: {
        en: "Help more members thrive",
        zh: "支持更多會員茁壯成長",
        cn: "支持更多会员茁壮成长",
      },
      href: routes.donate,
    },
    attribution: {
      en: "Crystal’s mother · FY2024–25 Annual Report",
      zh: "Crystal 媽媽 · 2024–25 年度報告",
      cn: "Crystal 妈妈 · 2024–25 年度报告",
    },
  },
  impactStats: {
    label: {
      en: "Love 21 impact statistics",
      zh: "Love 21 影響力數據",
      cn: "Love 21 影响力数据",
    },
    items: [
      {
        value: "490",
        label: { en: "families supported", zh: "個受惠家庭", cn: "个受惠家庭" },
        source: { en: "FY2024–25", zh: "2024–25 年度", cn: "2024–25 年度" },
      },
      {
        value: "6,859",
        label: { en: "sessions delivered", zh: "節活動", cn: "节活动" },
        source: { en: "FY2024–25", zh: "2024–25 年度", cn: "2024–25 年度" },
      },
      {
        value: "84",
        label: {
          en: "activity types offered",
          zh: "種活動類型",
          cn: "种活动类型",
        },
        source: { en: "FY2024–25", zh: "2024–25 年度", cn: "2024–25 年度" },
      },
      {
        value: "600+",
        label: {
          en: "members and families",
          zh: "會員及家庭",
          cn: "会员及家庭",
        },
      },
      {
        value: "90%+",
        label: {
          en: "of donations reach families",
          zh: "捐款用於服務家庭",
          cn: "捐款用于服务家庭",
        },
      },
    ],
  },
  featuredStories: {
    eyebrow: { en: "featured stories", zh: "精選故事", cn: "精选故事" },
    title: {
      en: "Moments that say #somuchability",
      zh: "每個時刻，都看見無限能力",
      cn: "每个时刻，都看见无限能力",
    },
    action: {
      label: { en: "See more stories", zh: "查看更多故事", cn: "查看更多故事" },
      href: routes.stories,
    },
    items: [
      {
        id: "sports-team",
        tone: "pink",
        image: images.sports,
        imageAlt: {
          en: "Love 21 sports programme",
          zh: "Love 21 體育計劃",
          cn: "Love 21 体育计划",
        },
        category: { en: "Programme story", zh: "計劃故事", cn: "计划故事" },
        title: {
          en: "Weekly Training Became a Team",
          zh: "每週訓練，練成一支隊伍",
          cn: "每周训练，练成一支队伍",
        },
        summary: {
          en: "Members practise together week after week, then bring that confidence onto the field.",
          zh: "會員每週一起練習，再把自信帶到場上。",
          cn: "会员每周一起练习，再把自信带到场上。",
        },
        meta: { en: "Sports programme", zh: "體育計劃", cn: "体育计划" },
        href: "/stories/",
      },
      {
        id: "dragon-boat",
        tone: "sky",
        image: "/assets/images/media-dragonboat.png",
        imageAlt: {
          en: "Love 21 dragon-boating feature",
          zh: "Love 21 龍舟活動報導",
          cn: "Love 21 龙舟活动报道",
        },
        category: { en: "Real partnership", zh: "共融夥伴", cn: "共融伙伴" },
        title: {
          en: "Dragon Boat Season With the Yacht Club",
          zh: "與遊艇會一起划龍舟",
          cn: "与游艇会一起划龙舟",
        },
        summary: {
          en: "A media feature covering an inclusive dragon-boating experience created with our community.",
          zh: "媒體報導 Love 21 社群參與共融龍舟體驗。",
          cn: "媒体报道 Love 21 社群参与共融龙舟体验。",
        },
        meta: { en: "Media feature", zh: "媒體報導", cn: "媒体报道" },
        href: "/hong-kong-yacht-club-and-charity-team-up-to-help-special-needs-teens-learn-dragon-boating/",
      },
      {
        id: "healthy-life",
        tone: "mint",
        image: "/assets/images/media-secret.png",
        imageAlt: {
          en: "Love 21 healthy-living feature",
          zh: "Love 21 健康生活報導",
          cn: "Love 21 健康生活报道",
        },
        category: { en: "Community spotlight", zh: "社群焦點", cn: "社群焦点" },
        title: {
          en: "The Open Secret to a Long, Happy Life",
          zh: "健康快樂生活的公開秘密",
          cn: "健康快乐生活的公开秘密",
        },
        summary: {
          en: "Healthy activity, nutrition and community support help members and families thrive.",
          zh: "健康活動、營養及社群支援，陪伴會員與家庭茁壯成長。",
          cn: "健康活动、营养及社群支援，陪伴会员与家庭茁壮成长。",
        },
        meta: { en: "Community feature", zh: "社群報導", cn: "社群报道" },
        href: "/love-21s-open-secret-to-a-long-happy-life/",
      },
      {
        id: "nutrition-support",
        tone: "yellow",
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 nutrition class",
          zh: "Love 21 營養課堂",
          cn: "Love 21 营养课堂",
        },
        category: { en: "Nutrition", zh: "營養", cn: "营养" },
        title: {
          en: "Practical Support for Healthier Families",
          zh: "讓家庭更健康的實用支援",
          cn: "让家庭更健康的实用支援",
        },
        summary: {
          en: "Free diet advice and practical guidance turn healthier choices into everyday routines.",
          zh: "免費飲食建議與實用指導，讓健康選擇成為日常。",
          cn: "免费饮食建议与实用指导，让健康选择成为日常。",
        },
        meta: { en: "Nutrition programme", zh: "營養計劃", cn: "营养计划" },
        href: "/hong-kong-charity-offers-free-diet-advice-and-guidance-for-children-with-intellectual-disabilities-in-low-income-families/",
      },
    ],
  },
  abilityConversation: {
    eyebrow: { en: "stories of ability", zh: "能力故事", cn: "能力故事" },
    title: {
      en: "Real breakthroughs, real people.",
      zh: "真實的人，真實的突破。",
      cn: "真实的人，真实的突破。",
    },
    action: {
      label: { en: "See more stories", zh: "查看更多故事", cn: "查看更多故事" },
      href: routes.stories,
    },
    panelEyebrow: { en: "stories of ability", zh: "能力故事", cn: "能力故事" },
    panelTitle: {
      en: "Conversations that say #somuchability",
      zh: "每段同行對話，都看見無限能力",
      cn: "每段同行对话，都看见无限能力",
    },
    panelDescription: {
      en: "Programme moments from sport, nutrition and family support — presented without invented testimonials.",
      zh: "來自體育、營養及家庭支援計劃的時刻，不使用虛構見證。",
      cn: "来自体育、营养及家庭支援计划的时刻，不使用虚构见证。",
    },
    chatTitle: {
      en: "Love 21 programme notes",
      zh: "Love 21 計劃記錄",
      cn: "Love 21 计划记录",
    },
    chatStatus: {
      en: "community in action",
      zh: "社群正在行動",
      cn: "社群正在行动",
    },
    items: [
      {
        id: "sports",
        side: "left",
        label: { en: "Sports", zh: "體育", cn: "体育" },
        message: {
          en: "Regular practice builds skill, confidence and a team that celebrates together.",
          zh: "恆常練習建立技能、自信，以及一支一起慶祝的隊伍。",
          cn: "恒常练习建立技能、自信，以及一支一起庆祝的队伍。",
        },
      },
      {
        id: "nutrition",
        side: "right",
        label: { en: "Nutrition", zh: "營養", cn: "营养" },
        message: {
          en: "Guidance becomes recipes, shared meals and healthier routines at home.",
          zh: "營養指導化成食譜、共享的一餐，以及家中的健康習慣。",
          cn: "营养指导化成食谱、共享的一餐，以及家中的健康习惯。",
        },
      },
      {
        id: "family",
        side: "left",
        label: { en: "Family care", zh: "家庭支援", cn: "家庭支援" },
        message: {
          en: "Counselling and peer support help the whole household feel less alone.",
          zh: "輔導及同儕支援，讓整個家庭不再感到孤單。",
          cn: "辅导及同伴支援，让整个家庭不再感到孤单。",
        },
      },
      {
        id: "community",
        side: "right",
        label: { en: "Community", zh: "社群", cn: "社群" },
        message: {
          en: "Opportunity changes what people can practise, choose and become.",
          zh: "機會改變一個人可以練習、選擇及成為的可能。",
          cn: "机会改变一个人可以练习、选择及成为的可能。",
        },
      },
    ],
    readAction: {
      label: { en: "Read all stories", zh: "閱讀所有故事", cn: "阅读所有故事" },
      href: routes.stories,
    },
  },
  education: {
    eyebrow: {
      en: "learn about our community",
      zh: "認識我們的社群",
      cn: "认识我们的社群",
    },
    title: {
      en: "This isn’t an ability issue. It’s an opportunity issue.",
      zh: "問題不在能力，而在機會。",
      cn: "问题不在能力，而在机会。",
    },
    description: {
      en: "Love 21 creates opportunities for Hong Kong’s Down syndrome, autistic and neurodiverse community to build health, confidence and connection.",
      zh: "Love 21 為香港唐氏綜合症、自閉症及神經多樣性社群創造機會，建立健康、自信與連繫。",
      cn: "Love 21 为香港唐氏综合症、自闭症及神经多样性社群创造机会，建立健康、自信与联系。",
    },
    points: [
      {
        value: "600+",
        description: {
          en: "members and families in our community",
          zh: "位社群會員及家庭",
          cn: "位社群会员及家庭",
        },
      },
      {
        value: "HK$0",
        description: {
          en: "charged to Love 21 families",
          zh: "向 Love 21 家庭收取的費用",
          cn: "向 Love 21 家庭收取的费用",
        },
      },
      {
        value: "1 goal",
        description: {
          en: "opportunity, inclusion and support for every family",
          zh: "為每個家庭帶來機會、共融與支援",
          cn: "为每个家庭带来机会、共融与支援",
        },
      },
    ],
    factsTitle: {
      en: "Love 21, in audited numbers",
      zh: "Love 21 經審核數據",
      cn: "Love 21 经审核数据",
    },
    facts: [
      {
        value: "490",
        label: {
          en: "families supported in FY2024–25",
          zh: "個家庭於 2024–25 年度受惠",
          cn: "个家庭于 2024–25 年度受惠",
        },
      },
      {
        value: "84",
        label: {
          en: "activity types offered in FY2024–25",
          zh: "種活動於 2024–25 年度提供",
          cn: "种活动于 2024–25 年度提供",
        },
      },
    ],
    source: {
      en: "Source: Love 21 FY2024–25 audited Annual Report and approved programme information.",
      zh: "資料來源：Love 21 2024–25 年度經審核年報及已核准計劃資料。",
      cn: "资料来源：Love 21 2024–25 年度经审核年报及已核准计划资料。",
    },
    action: {
      label: {
        en: "Learn about Love 21",
        zh: "認識 Love 21",
        cn: "认识 Love 21",
      },
      href: routes.ourStory,
    },
  },
  socialFeed: {
    eyebrow: { en: "news & social", zh: "新聞與社群", cn: "新闻与社群" },
    title: { en: "Fresh off the feed", zh: "最新動態", cn: "最新动态" },
    facebook: {
      label: {
        en: "Facebook · Follow",
        zh: "Facebook · 追蹤",
        cn: "Facebook · 关注",
      },
      href: {
        en: "https://www.facebook.com/Love21foundation/",
        zh: "https://www.facebook.com/Love21foundation/",
        cn: "https://www.facebook.com/Love21foundation/",
      },
    },
    instagram: {
      label: {
        en: "Instagram · Follow",
        zh: "Instagram · 追蹤",
        cn: "Instagram · 关注",
      },
      href: {
        en: "https://www.instagram.com/love21foundation/",
        zh: "https://www.instagram.com/love21foundation/",
        cn: "https://www.instagram.com/love21foundation/",
      },
    },
    items: [
      {
        id: "beyond-limits",
        tone: "pink",
        network: {
          en: "Love 21 update",
          zh: "Love 21 動態",
          cn: "Love 21 动态",
        },
        date: "May 11, 2026",
        image: "/assets/images/media-beyond.png",
        imageAlt: {
          en: "Beyond Limits banquet announcement",
          zh: "Beyond Limits 晚宴公告",
          cn: "Beyond Limits 晚宴公告",
        },
        title: {
          en: "Tables & Seats Now Open for Beyond Limits Banquet",
          zh: "Beyond Limits 晚宴座位現已開放",
          cn: "Beyond Limits 晚宴座位现已开放",
        },
        href: "/beyond-limits-banquet/",
      },
      {
        id: "raffle",
        tone: "yellow",
        network: {
          en: "Love 21 update",
          zh: "Love 21 動態",
          cn: "Love 21 动态",
        },
        date: "November 27, 2025",
        image: "/assets/images/media-raffle.png",
        imageAlt: {
          en: "Love 21 charity raffle announcement",
          zh: "Love 21 慈善獎券公告",
          cn: "Love 21 慈善奖券公告",
        },
        title: {
          en: "Love 21 Foundation Charity Raffle 2025",
          zh: "Love 21 Foundation 2025 慈善獎券",
          cn: "Love 21 Foundation 2025 慈善奖券",
        },
        href: "/raffle2025-2/",
      },
      {
        id: "dragonboat",
        tone: "sky",
        network: { en: "Media feature", zh: "媒體報導", cn: "媒体报道" },
        date: "September 30, 2021",
        image: "/assets/images/media-dragonboat.png",
        imageAlt: {
          en: "Inclusive dragon-boating experience",
          zh: "共融龍舟體驗",
          cn: "共融龙舟体验",
        },
        title: {
          en: "Dragon-Boating Opportunities for Love 21 Members",
          zh: "Love 21 會員的龍舟體驗",
          cn: "Love 21 会员的龙舟体验",
        },
        href: "/hong-kong-yacht-club-and-charity-team-up-to-help-special-needs-teens-learn-dragon-boating/",
      },
      {
        id: "nutrition",
        tone: "mint",
        network: { en: "Media feature", zh: "媒體報導", cn: "媒体报道" },
        date: "May 22, 2021",
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 nutrition programme",
          zh: "Love 21 營養計劃",
          cn: "Love 21 营养计划",
        },
        title: {
          en: "Free Nutrition Guidance for Love 21 Families",
          zh: "為 Love 21 家庭提供免費營養指導",
          cn: "为 Love 21 家庭提供免费营养指导",
        },
        href: "/hong-kong-charity-offers-free-diet-advice-and-guidance-for-children-with-intellectual-disabilities-in-low-income-families/",
      },
    ],
  },
  volunteerCta: {
    eyebrow: { en: "show up", zh: "親身參與", cn: "亲身参与" },
    title: {
      en: "Meet the community through volunteering.",
      zh: "透過義工服務，親身認識我們的社群。",
      cn: "通过义工服务，亲身认识我们的社群。",
    },
    description: {
      en: "Volunteer as an individual or organisation and help create more opportunities for members and families.",
      zh: "以個人或機構身份參與，為會員及家庭創造更多機會。",
      cn: "以个人或机构身份参与，为会员及家庭创造更多机会。",
    },
    primary: {
      label: { en: "Volunteer", zh: "做義工", cn: "做义工" },
      href: routes.volunteer,
    },
    secondary: {
      label: { en: "Donate", zh: "捐助", cn: "捐助" },
      href: routes.donate,
    },
  },
  donateCta: {
    title: {
      en: "HK$500 helps fund a class for 15 members.",
      zh: "港幣 500 元協助資助十五位會員的一堂課。",
      cn: "港币 500 元协助资助十五位会员的一堂课。",
    },
    description: {
      en: "Give once or monthly and help keep sport, nutrition and family support available to our community.",
      zh: "選擇一次性或每月捐助，支持社群持續獲得體育、營養及家庭支援。",
      cn: "选择一次性或每月捐助，支持社群持续获得体育、营养及家庭支援。",
    },
    primary: {
      label: { en: "Donate now", zh: "立即捐助", cn: "立即捐助" },
      href: routes.donate,
    },
    volunteer: {
      label: { en: "Volunteer", zh: "做義工", cn: "做义工" },
      href: routes.volunteer,
    },
    secondary: {
      label: {
        en: "Prefer to give items? See our wish list →",
        zh: "想捐贈物資？查看心願清單 →",
        cn: "想捐赠物资？查看心愿清单 →",
      },
      href: routes.donateItems,
    },
  },
};

export function t(value: LocalizedString, locale: Locale): string {
  return value[locale];
}

export function hrefFor(link: HomepageLink, locale: Locale): string {
  return link.href[locale];
}
