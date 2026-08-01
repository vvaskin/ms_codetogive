import { boardMembers, images } from "./site-data";

export type AboutLocale = "en" | "zh" | "cn";

type Localized = Record<AboutLocale, string>;

export const aboutContent = {
  hero: {
    badge: { en: "Our story", zh: "我們的故事", cn: "我们的故事" } satisfies Localized,
    title: { en: "About Love 21 Foundation.", zh: "關於 Love 21 Foundation。", cn: "关于 Love 21 Foundation。" } satisfies Localized,
    description: {
      en: "Love 21 is a charity dedicated to empowering the Down syndrome and autistic community in Hong Kong through sport, nutrition, and holistic support programmes.",
      zh: "Love 21 是一間慈善機構，致力透過體育、營養及全面支援計劃，讓唐氏綜合症和自閉症社群在香港充分發揮潛能。",
      cn: "Love 21 是一间慈善机构，致力于通过体育、营养及全面支援计划，让唐氏综合症和自闭症社群在香港充分发挥潜能。",
    } satisfies Localized,
    scriptNote: {
      en: "named for chromosome 21 — and so much ability to celebrate",
      zh: "以第 21 對染色體命名 — 慶祝無限可能",
      cn: "以第 21 对染色体命名 — 庆祝无限可能",
    } satisfies Localized,
  },
  mission: {
    badge: { en: "Our mission", zh: "我們的使命", cn: "我们的使命" } satisfies Localized,
    title: {
      en: "Empowering ability through sport, nutrition, and community.",
      zh: "以體育、營養與社群，發揮能力。",
      cn: "以体育、营养与社群，发挥能力。",
    } satisfies Localized,
    paragraphs: [
      {
        en: "Since the launch of our comprehensive nutrition programme in 2021, we’ve provided one-on-one nutritional support on top of the sports classes that we’ve offered.",
        zh: "自 2021 年推出全面營養計劃以來，我們在體育課堂之外，亦提供一對一營養支援。",
        cn: "自 2021 年推出全面营养计划以来，我们在体育课堂之外，也提供一对一营养支援。",
      },
      {
        en: "We’ve also expanded into providing counselling support for the parents of our community — because Love 21 is built around members and the families beside them.",
        zh: "我們亦擴展至家長輔導支援 — 因為 Love 21 以會員與家庭為本。",
        cn: "我们也扩展至家长辅导支援 — 因为 Love 21 以会员与家庭为本。",
      },
    ] satisfies Localized[],
    storiesLink: {
      label: { en: "Read stories from our community", zh: "閱讀社群故事", cn: "阅读社群故事" } satisfies Localized,
      href: { en: "/stories/", zh: "/zh/stories-hk/", cn: "/cn/stories/" },
    },
    visuals: [
      { image: images.sports, alt: { en: "Love 21 sports programme", zh: "Love 21 體育計劃", cn: "Love 21 体育计划" } },
      { image: images.nutrition, alt: { en: "Love 21 nutrition programme", zh: "Love 21 營養計劃", cn: "Love 21 营养计划" } },
    ],
  },
  programmes: {
    title: { en: "Our Programmes.", zh: "我們的計劃。", cn: "我们的计划。" } satisfies Localized,
    lead: {
      en: "Four ways we show up for our community, every week.",
      zh: "四個方向，每週陪伴我們的社群。",
      cn: "四个方向，每周陪伴我们的社群。",
    } satisfies Localized,
    href: { en: "/our-programmes/", zh: "/zh/our-programmes-hk/", cn: "/cn/our-programmes/" },
    items: [
      {
        key: "sport",
        title: { en: "Sport", zh: "體育", cn: "体育" } satisfies Localized,
        description: {
          en: "Classes and team sports designed without limitations, so members can train, compete and grow.",
          zh: "不設限制的課堂與團隊運動，讓會員訓練、比賽、成長。",
          cn: "不设限制的课堂与团队运动，让会员训练、比赛、成长。",
        } satisfies Localized,
        tone: "pink" as const,
      },
      {
        key: "nutrition",
        title: { en: "Nutrition", zh: "營養", cn: "营养" } satisfies Localized,
        description: {
          en: "One-to-one guidance and cooking classes that help healthier habits take root at home.",
          zh: "一對一指導與烹飪課堂，讓健康習慣走進家庭。",
          cn: "一对一指导与烹饪课堂，让健康习惯走进家庭。",
        } satisfies Localized,
        tone: "teal" as const,
      },
      {
        key: "family",
        title: { en: "Family", zh: "家庭", cn: "家庭" } satisfies Localized,
        description: {
          en: "Support for parents and carers — because the whole household matters.",
          zh: "支援家長與照顧者 — 因為整個家庭同樣重要。",
          cn: "支援家长与照顾者 — 因为整个家庭同样重要。",
        } satisfies Localized,
        tone: "blue" as const,
      },
      {
        key: "csr",
        title: { en: "CSR", zh: "企業社會責任", cn: "企业社会责任" } satisfies Localized,
        description: {
          en: "Shared activity that helps Hong Kong organisations meet our community with openness.",
          zh: "透過共同活動，讓香港機構真誠認識我們的社群。",
          cn: "通过共同活动，让香港机构真诚认识我们的社群。",
        } satisfies Localized,
        tone: "purple" as const,
      },
    ],
  },
  impact: {
    items: [
      { value: "600+", label: { en: "Members and families", zh: "會員及家庭", cn: "会员及家庭" } satisfies Localized },
      { value: "≈1,000", label: { en: "Monthly activities", zh: "每月活動節數", cn: "每月活动节数" } satisfies Localized },
      { value: "HK$0", label: { en: "Charged to families", zh: "不向家庭收費", cn: "不向家庭收费" } satisfies Localized },
      { value: "Section 88", label: { en: "Registered Hong Kong charity", zh: "香港註冊慈善機構", cn: "香港注册慈善机构" } satisfies Localized },
    ],
  },
  governance: {
    badge: { en: "Governance", zh: "管治", cn: "管治" } satisfies Localized,
    title: { en: "Meet Our Board.", zh: "認識董事局。", cn: "认识董事局。" } satisfies Localized,
    messageLabel: {
      en: "Message from the board",
      zh: "董事局寄語",
      cn: "董事局寄语",
    } satisfies Localized,
    quote: {
      en: "The 2023–24 year for Love 21 was well and truly our phoenix year. From the ashes of the fire in January 2023 we emerged stronger and more committed to our mission to the Down syndrome and neurodiverse communities.",
      zh: "對 Love 21 而言，2023–24 年度真正是我們的重生之年。自 2023 年 1 月火災之後，我們更堅強、更堅定地投入支援唐氏綜合症及神經多樣性社群的使命。",
      cn: "对 Love 21 而言，2023–24 年度真正是我们的重生之年。自 2023 年 1 月火灾之后，我们更坚强、更坚定地投入支援唐氏综合症及神经多样性社群的使命。",
    } satisfies Localized,
    quoteAttribution: {
      en: "— Matthew Hosford, Chairman of the Board · FY2023–24 Annual Report",
      zh: "— Matthew Hosford，董事局主席 · 2023–24 年度報告",
      cn: "— Matthew Hosford，董事局主席 · 2023–24 年度报告",
    } satisfies Localized,
    leadership: [
      {
        name: { en: "Jeff Rotmeyer", zh: "Jeff Rotmeyer", cn: "Jeff Rotmeyer" } satisfies Localized,
        role: { en: "Founder & CEO", zh: "創辦人兼行政總裁", cn: "创办人兼行政总裁" } satisfies Localized,
        href: "mailto:jeff@love21foundation.com",
      },
      {
        name: { en: "Matthew Hosford", zh: "Matthew Hosford", cn: "Matthew Hosford" } satisfies Localized,
        role: {
          en: "Chairman of the Board",
          zh: "董事局主席",
          cn: "董事局主席",
        } satisfies Localized,
        slug: "matthew-hosford",
      },
    ],
    boardHeading: { en: "Board of Directors", zh: "董事局", cn: "董事局" } satisfies Localized,
    boardNote: {
      en: "(Listed in alphabetical order of last name)",
      zh: "（按姓氏英文字母排序）",
      cn: "（按姓氏英文字母排序）",
    } satisfies Localized,
    financeLink: {
      label: {
        en: "See our full governance & financials",
        zh: "查看完整管治與財務報告",
        cn: "查看完整管治与财务报告",
      } satisfies Localized,
      href: { en: "/our-finance/", zh: "/zh/our-finance-hk/", cn: "/cn/our-finance/" },
    },
    boardHref: {
      en: "/board-of-directors/",
      zh: "/zh/board-of-directors-hk/",
      cn: "/cn/board-of-directors/",
    },
  },
} as const;

/** Board names for the About grid, excluding leadership callouts, A–Z by last name. */
export function aboutBoardDirectory() {
  const exclude = new Set(["matthew-hosford"]);
  return [...boardMembers]
    .filter((member) => !exclude.has(member.slug))
    .sort((a, b) => {
      const lastA = a.name.split(" ").pop() ?? a.name;
      const lastB = b.name.split(" ").pop() ?? b.name;
      return lastA.localeCompare(lastB);
    })
    .map((member) => ({
      slug: member.slug,
      name: member.slug === "carol-chan" ? "Carol Chan" : member.name,
    }));
}

export function t(value: Localized, locale: AboutLocale): string {
  return value[locale];
}
