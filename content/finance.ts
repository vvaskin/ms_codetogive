export type FinanceLocale = "en" | "zh";

type Localized = Record<FinanceLocale, string>;

export const financeReports = [
  {
    id: "fy2024-25",
    label: {
      en: "FY2024-25 Annual Report",
      zh: "2024–25 年度報告",
    } satisfies Localized,
    href: "/assets/reports/annual-report-2024-2025.pdf",
    latest: true,
  },
  {
    id: "fy2023-24",
    label: {
      en: "FY2023-24 Annual Report",
      zh: "2023–24 年度報告",
    } satisfies Localized,
    href: "/assets/reports/annual-report-2023-2024.pdf",
    latest: false,
  },
  {
    id: "fy2022-23",
    label: {
      en: "FY2022-23 Annual Report",
      zh: "2022–23 年度報告",
    } satisfies Localized,
    href: "/assets/reports/annual-report-2022-2023.pdf",
    latest: false,
  },
] as const;

export const financeContent = {
  hero: {
    badge: { en: "Trust & transparency", zh: "信任與透明" } satisfies Localized,
    title: {
      en: "Trust belongs on the screen, not hidden in a PDF",
      zh: "信任應清晰呈現，而非藏在 PDF 裡",
    } satisfies Localized,
    description: {
      en: "Governance, financial reports, and real impact numbers — the same figures our board sees, in plain language.",
      zh: "管治、財務報告與真實影響數據 — 與董事局審閱的同一套數字，以清楚語言呈現。",
    } satisfies Localized,
  },
  allocation: {
    eyebrow: {
      en: "Financial impact · FY2024-25",
      zh: "財務影響 · 2024–25 年度",
    } satisfies Localized,
    title: { en: "Where support goes", zh: "支持如何運用" } satisfies Localized,
    viewReports: { en: "View reports", zh: "查看報告" } satisfies Localized,
    bars: [
      {
        key: "programme",
        label: { en: "Programme", zh: "計劃項目" } satisfies Localized,
        percent: 86,
        tone: "blue",
      },
      {
        key: "fundraising",
        label: { en: "Fundraising", zh: "籌款" } satisfies Localized,
        percent: 8,
        tone: "blueMid",
      },
      {
        key: "admin",
        label: { en: "Administrative", zh: "行政" } satisfies Localized,
        percent: 6,
        tone: "blueDark",
      },
    ],
    footnote: {
      en: "Total expenditures: HK$11,490,000. Figures from our audited FY2024-25 Annual Report.",
      zh: "總開支：港幣 11,490,000 元。數字來自經審核的 2024–25 年度報告。",
    } satisfies Localized,
  },
  roadmap: {
    eyebrow: {
      en: "What we're building",
      zh: "我們正在建設",
    } satisfies Localized,
    title: { en: "What's next", zh: "下一步" } satisfies Localized,
    readMore: { en: "Read more", zh: "了解更多" } satisfies Localized,
    items: [
      {
        key: "living-room",
        title: { en: "Family Living Room", zh: "家庭客廳" } satisfies Localized,
        detail: { en: "New facility", zh: "新設施" } satisfies Localized,
        tone: "pink",
      },
      {
        key: "education",
        title: {
          en: "Expanded education & volunteering",
          zh: "擴展教育與義工計劃",
        } satisfies Localized,
        detail: { en: "To reduce stigma", zh: "減少污名" } satisfies Localized,
        tone: "blue",
      },
      {
        key: "family-support",
        title: {
          en: "Growing Family Support Services",
          zh: "擴展家庭支援服務",
        } satisfies Localized,
        detail: {
          en: "Launched Oct 2024",
          zh: "於 2024 年 10 月推出",
        } satisfies Localized,
        tone: "teal",
      },
    ],
    footnote: {
      en: "Straight from our Founder & CEO’s and Board’s messages in the FY2024-25 Annual Report.",
      zh: "摘自創辦人兼行政總裁與董事局於 2024–25 年度報告的寄語。",
    } satisfies Localized,
  },
  impact: {
    items: [
      {
        value: "490",
        label: { en: "Families supported", zh: "受惠家庭" } satisfies Localized,
      },
      {
        value: "6,859",
        label: { en: "Sessions delivered", zh: "活動節數" } satisfies Localized,
      },
      {
        value: "84",
        label: {
          en: "Activity types offered",
          zh: "活動種類",
        } satisfies Localized,
      },
      {
        value: "HK$3.8M+",
        label: {
          en: "Raised at our first Gala Dinner",
          zh: "首屆慈善晚會籌得款項",
        } satisfies Localized,
      },
    ],
  },
  statements: {
    title: {
      en: "Income & Expenditure, in full",
      zh: "完整收入與開支",
    } satisfies Localized,
    lead: {
      en: "FY2024–25, audited. Every category, no rounding tricks.",
      zh: "2024–25 年度，經審核。各分類完整列出。",
    } satisfies Localized,
    income: {
      title: { en: "Income", zh: "收入" } satisfies Localized,
      total: "HK$13,495,000",
      rows: [
        {
          label: { en: "Unrestricted funds", zh: "非限定資金" } satisfies Localized,
          amount: "HK$6.7M",
          percent: "49%",
        },
        {
          label: { en: "Restricted funds", zh: "限定資金" } satisfies Localized,
          amount: "HK$6.6M",
          percent: "49%",
        },
        {
          label: { en: "Other income", zh: "其他收入" } satisfies Localized,
          amount: "HK$165k",
          percent: "2%",
        },
      ],
    },
    expenditure: {
      title: { en: "Expenditure", zh: "開支" } satisfies Localized,
      total: "HK$11,490,000",
      rows: [
        {
          label: { en: "Programme", zh: "計劃項目" } satisfies Localized,
          amount: "HK$9.9M",
          percent: "86%",
        },
        {
          label: { en: "Fundraising", zh: "籌款" } satisfies Localized,
          amount: "HK$903k",
          percent: "8%",
        },
        {
          label: { en: "Administrative", zh: "行政" } satisfies Localized,
          amount: "HK$651k",
          percent: "6%",
        },
      ],
    },
  },
  governance: {
    badge: { en: "Governance", zh: "管治" } satisfies Localized,
    title: {
      en: "Run by volunteers, held to account.",
      zh: "由義工領導，向社群負責。",
    } satisfies Localized,
    paragraphs: [
      {
        en: "Love 21 is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong. Support goes to sport, nutrition, and family programmes — and to the people who make them possible.",
        zh: "Love 21 是香港《稅務條例》第 88 條下的註冊慈善機構。支持用於體育、營養及家庭計劃 — 以及令這些計劃得以實現的人。",
      },
      {
        en: "The Board of Directors, chaired by Matthew Hosford and including Founder & CEO Jeff Rotmeyer, are volunteers who hold the organisation to account.",
        zh: "董事局由 Matthew Hosford 擔任主席，成員包括創辦人兼行政總裁 Jeff Rotmeyer；全體均為義工，並對機構問責。",
      },
    ] satisfies Localized[],
    reportsTitle: { en: "Annual reports", zh: "年度報告" } satisfies Localized,
    latestBadge: { en: "Latest", zh: "最新" } satisfies Localized,
    viewLabel: { en: "View", zh: "查看" } satisfies Localized,
  },
} as const;

export function t(value: Localized, locale: FinanceLocale): string {
  return value[locale];
}
