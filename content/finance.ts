export type FinanceLocale = "en" | "zh" | "cn";

type Localized = Record<FinanceLocale, string>;

export const financeReports = [
  {
    id: "fy2024-25",
    label: {
      en: "FY2024-25 Annual Report",
      zh: "2024–25 年度報告",
      cn: "2024–25 年度报告",
    } satisfies Localized,
    href: "/assets/reports/annual-report-2024-2025.pdf",
    latest: true,
  },
  {
    id: "fy2023-24",
    label: {
      en: "FY2023-24 Annual Report",
      zh: "2023–24 年度報告",
      cn: "2023–24 年度报告",
    } satisfies Localized,
    href: "/assets/reports/annual-report-2023-2024.pdf",
    latest: false,
  },
  {
    id: "fy2022-23",
    label: {
      en: "FY2022-23 Annual Report",
      zh: "2022–23 年度報告",
      cn: "2022–23 年度报告",
    } satisfies Localized,
    href: "/assets/reports/annual-report-2022-2023.pdf",
    latest: false,
  },
] as const;

export const financeContent = {
  hero: {
    badge: { en: "Trust & transparency", zh: "信任與透明", cn: "信任与透明" } satisfies Localized,
    title: {
      en: "Trust belongs on the screen, not hidden in a PDF",
      zh: "信任應清晰呈現，而非藏在 PDF 裡",
      cn: "信任应清晰呈现，而非藏在 PDF 里",
    } satisfies Localized,
    description: {
      en: "Governance, financial reports, and real impact numbers — the same figures our board sees, in plain language.",
      zh: "管治、財務報告與真實影響數據 — 與董事局審閱的同一套數字，以清楚語言呈現。",
      cn: "管治、财务报告与真实影响数据 — 与董事局审阅的同一套数字，以清楚语言呈现。",
    } satisfies Localized,
  },
  allocation: {
    eyebrow: {
      en: "Financial impact · FY2024-25",
      zh: "財務影響 · 2024–25 年度",
      cn: "财务影响 · 2024–25 年度",
    } satisfies Localized,
    title: { en: "Where support goes", zh: "支持如何運用", cn: "支持如何运用" } satisfies Localized,
    viewReports: { en: "View reports", zh: "查看報告", cn: "查看报告" } satisfies Localized,
    bars: [
      {
        key: "programme",
        label: { en: "Programme", zh: "計劃項目", cn: "计划项目" } satisfies Localized,
        percent: 86,
        tone: "blue",
      },
      {
        key: "fundraising",
        label: { en: "Fundraising", zh: "籌款", cn: "筹款" } satisfies Localized,
        percent: 8,
        tone: "blueMid",
      },
      {
        key: "admin",
        label: { en: "Administrative", zh: "行政", cn: "行政" } satisfies Localized,
        percent: 6,
        tone: "blueDark",
      },
    ],
    footnote: {
      en: "Total expenditures: HK$11,490,000. Figures from our audited FY2024-25 Annual Report.",
      zh: "總開支：港幣 11,490,000 元。數字來自經審核的 2024–25 年度報告。",
      cn: "总开支：港币 11,490,000 元。数字来自经审核的 2024–25 年度报告。",
    } satisfies Localized,
  },
  roadmap: {
    eyebrow: {
      en: "What we're building",
      zh: "我們正在建設",
      cn: "我们正在建设",
    } satisfies Localized,
    title: { en: "What's next", zh: "下一步", cn: "下一步" } satisfies Localized,
    readMore: { en: "Read more", zh: "了解更多", cn: "了解更多" } satisfies Localized,
    items: [
      {
        key: "living-room",
        title: { en: "Family Living Room", zh: "家庭客廳", cn: "家庭客厅" } satisfies Localized,
        detail: { en: "New facility", zh: "新設施", cn: "新设施" } satisfies Localized,
        tone: "pink",
      },
      {
        key: "education",
        title: {
          en: "Expanded education & volunteering",
          zh: "擴展教育與義工計劃",
          cn: "扩展教育与义工计划",
        } satisfies Localized,
        detail: { en: "To reduce stigma", zh: "減少污名", cn: "减少污名" } satisfies Localized,
        tone: "blue",
      },
      {
        key: "family-support",
        title: {
          en: "Growing Family Support Services",
          zh: "擴展家庭支援服務",
          cn: "扩展家庭支援服务",
        } satisfies Localized,
        detail: {
          en: "Launched Oct 2024",
          zh: "於 2024 年 10 月推出",
          cn: "于 2024 年 10 月推出",
        } satisfies Localized,
        tone: "teal",
      },
    ],
    footnote: {
      en: "Straight from our Founder & CEO’s and Board’s messages in the FY2024-25 Annual Report.",
      zh: "摘自創辦人兼行政總裁與董事局於 2024–25 年度報告的寄語。",
      cn: "摘自创办人兼行政总裁与董事局于 2024–25 年度报告的寄语。",
    } satisfies Localized,
  },
  impact: {
    items: [
      {
        value: "490",
        label: { en: "Families supported", zh: "受惠家庭", cn: "受惠家庭" } satisfies Localized,
      },
      {
        value: "6,859",
        label: { en: "Sessions delivered", zh: "活動節數", cn: "活动节数" } satisfies Localized,
      },
      {
        value: "84",
        label: {
          en: "Activity types offered",
          zh: "活動種類",
          cn: "活动种类",
        } satisfies Localized,
      },
      {
        value: "HK$3.8M+",
        label: {
          en: "Raised at our first Gala Dinner",
          zh: "首屆慈善晚會籌得款項",
          cn: "首届慈善晚会筹得款项",
        } satisfies Localized,
      },
    ],
  },
  statements: {
    title: {
      en: "Income & Expenditure, in full",
      zh: "完整收入與開支",
      cn: "完整收入与开支",
    } satisfies Localized,
    lead: {
      en: "FY2024–25, audited. Every category, no rounding tricks.",
      zh: "2024–25 年度，經審核。各分類完整列出。",
      cn: "2024–25 年度，经审核。各分类完整列出。",
    } satisfies Localized,
    income: {
      title: { en: "Income", zh: "收入", cn: "收入" } satisfies Localized,
      total: "HK$13,495,000",
      rows: [
        {
          label: { en: "Unrestricted funds", zh: "非限定資金", cn: "非限定资金" } satisfies Localized,
          amount: "HK$6.7M",
          percent: "49%",
        },
        {
          label: { en: "Restricted funds", zh: "限定資金", cn: "限定资金" } satisfies Localized,
          amount: "HK$6.6M",
          percent: "49%",
        },
        {
          label: { en: "Other income", zh: "其他收入", cn: "其他收入" } satisfies Localized,
          amount: "HK$165k",
          percent: "2%",
        },
      ],
    },
    expenditure: {
      title: { en: "Expenditure", zh: "開支", cn: "开支" } satisfies Localized,
      total: "HK$11,490,000",
      rows: [
        {
          label: { en: "Programme", zh: "計劃項目", cn: "计划项目" } satisfies Localized,
          amount: "HK$9.9M",
          percent: "86%",
        },
        {
          label: { en: "Fundraising", zh: "籌款", cn: "筹款" } satisfies Localized,
          amount: "HK$903k",
          percent: "8%",
        },
        {
          label: { en: "Administrative", zh: "行政", cn: "行政" } satisfies Localized,
          amount: "HK$651k",
          percent: "6%",
        },
      ],
    },
  },
  governance: {
    badge: { en: "Governance", zh: "管治", cn: "管治" } satisfies Localized,
    title: {
      en: "Run by volunteers, held to account.",
      zh: "由義工領導，向社群負責。",
      cn: "由义工领导，向社群负责。",
    } satisfies Localized,
    paragraphs: [
      {
        en: "Love 21 is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong. Support goes to sport, nutrition, and family programmes — and to the people who make them possible.",
        zh: "Love 21 是香港《稅務條例》第 88 條下的註冊慈善機構。支持用於體育、營養及家庭計劃 — 以及令這些計劃得以實現的人。",
        cn: "Love 21 是香港《税务条例》第 88 条下的注册慈善机构。支持用于体育、营养及家庭计划 — 以及令这些计划得以实现的人。",
      },
      {
        en: "The Board of Directors, chaired by Matthew Hosford and including Founder & CEO Jeff Rotmeyer, are volunteers who hold the organisation to account.",
        zh: "董事局由 Matthew Hosford 擔任主席，成員包括創辦人兼行政總裁 Jeff Rotmeyer；全體均為義工，並對機構問責。",
        cn: "董事局由 Matthew Hosford 担任主席，成员包括创办人兼行政总裁 Jeff Rotmeyer；全体均为义工，并对机构问责。",
      },
    ] satisfies Localized[],
    reportsTitle: { en: "Annual reports", zh: "年度報告", cn: "年度报告" } satisfies Localized,
    latestBadge: { en: "Latest", zh: "最新", cn: "最新" } satisfies Localized,
    viewLabel: { en: "View", zh: "查看", cn: "查看" } satisfies Localized,
  },
} as const;

export function t(value: Localized, locale: FinanceLocale): string {
  return value[locale];
}
