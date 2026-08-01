export type DonationLocale = "en" | "zh";

type Localized = Record<DonationLocale, string>;

export const donationContent: {
  intro: {
    eyebrow: Localized;
    title: Localized;
    description: Localized;
    scriptNote: Localized;
  };
  modes: { title: Localized; label: Localized; description: Localized }[];
  configurator: {
    eyebrow: Localized;
    title: Localized;
    frequency: Localized[];
    amountLabel: Localized;
    amounts: Localized[];
    customAmount: Localized;
    programmeLabel: Localized;
    programmes: Localized[];
    detailsTitle: Localized;
    fields: Localized[];
    walletsTitle: Localized;
    wallets: Localized[];
    cardLabel: Localized;
    action: Localized;
    trustLine: Localized;
  };
  impact: {
    eyebrow: Localized;
    title: Localized;
    selectedAmount: Localized;
    description: Localized;
    points: { value: string; label: Localized }[];
    previewNote: Localized;
  };
  wishlist: {
    eyebrow: Localized;
    title: Localized;
    description: Localized;
    action: Localized;
    items: { title: Localized; status: Localized }[];
  };
  fundraiser: { eyebrow: Localized; title: Localized; description: Localized; action: Localized };
  preview: Localized;
  payment: { payme: Localized; moonclerk: Localized; heading: Localized; description: Localized };
} = {
  intro: {
    eyebrow: {
      en: "every gift opens a door ♡",
      zh: "每一份支持都打開一扇門",
    },
    title: { en: "Give in a way that feels good.", zh: "用舒服的方式去支持。" },
    description: {
      en: "Your support helps Love 21 create inclusive opportunities through sports, nutrition and holistic programmes.",
      zh: "你的支持讓 Love 21 能透過體育、營養及全人發展計劃，創造更多共融機會。",
    },
    scriptNote: {
      en: "— and thank you for standing with our families",
      zh: "— 謝謝你與我們的家庭同行",
    },
  },
  modes: [
    { title: { en: "Give money", zh: "金錢捐贈" }, label: { en: "monthly or one-time", zh: "每月或一次性" }, description: { en: "Choose a donation that suits you.", zh: "選擇適合你的捐贈方式。" } },
    { title: { en: "Support a programme", zh: "支持計劃" }, label: { en: "pick a focus", zh: "選擇重點" }, description: { en: "Direct your support to an area of activity.", zh: "把支持投向你關心的活動範疇。" } },
    { title: { en: "Donate items", zh: "物資捐贈" }, label: { en: "our wish list", zh: "我們的心願清單" }, description: { en: "Explore a future partner wishlist.", zh: "瀏覽未來的合作夥伴心願清單。" } },
  ],
  configurator: {
    eyebrow: { en: "Donation preview", zh: "捐贈預覽" },
    title: { en: "Shape your support", zh: "選擇支持方式" },
    frequency: [{ en: "Monthly", zh: "每月" }, { en: "One-time", zh: "一次性" }],
    amountLabel: { en: "Choose an amount", zh: "選擇金額" },
    amounts: [{ en: "HK$100", zh: "港幣 100 元" }, { en: "HK$500", zh: "港幣 500 元" }, { en: "HK$1,000", zh: "港幣 1,000 元" }],
    customAmount: { en: "Custom", zh: "自訂金額" },
    programmeLabel: { en: "Choose a programme", zh: "選擇計劃" },
    programmes: [{ en: "Where it is needed most", zh: "最需要的地方" }, { en: "Sports", zh: "體育" }, { en: "Nutrition", zh: "營養" }, { en: "Family", zh: "家庭" }],
    detailsTitle: { en: "Your details", zh: "你的資料" },
    fields: [{ en: "Full name", zh: "姓名" }, { en: "Email address", zh: "電郵地址" }],
    walletsTitle: { en: "Wallet options", zh: "電子錢包選項" },
    wallets: [{ en: "Apple Pay", zh: "Apple Pay" }, { en: "Google Pay", zh: "Google Pay" }],
    cardLabel: { en: "Card number", zh: "信用卡號碼" },
    action: { en: "Continue to donate", zh: "繼續捐贈" },
    trustLine: { en: "This is a visual preview. Use the live options below to donate today.", zh: "這是視覺預覽。請使用下方的即時捐贈方式立即支持。" },
  },
  impact: {
    eyebrow: { en: "your impact", zh: "你的影響力" },
    title: { en: "Every contribution supports belonging", zh: "每一份支持都讓共融發生" },
    selectedAmount: { en: "A gift of HK$500 can help sustain our shared programmes.", zh: "港幣 500 元的支持有助延續我們的共融計劃。" },
    description: { en: "Love 21 is building a community where people can move, learn and connect together.", zh: "Love 21 正建立一個讓大家一起運動、學習和連結的社群。" },
    points: [
      { value: "600+", label: { en: "members and families", zh: "會員及家庭" } },
      { value: "≈1,000", label: { en: "monthly activities", zh: "每月活動節數" } },
      { value: "HK$0", label: { en: "charged to families", zh: "不向家庭收費" } },
    ],
    previewNote: { en: "Preview only — choose a live donation option below when you are ready.", zh: "僅供預覽 — 準備好時請選擇下方的即時捐贈方式。" },
  },
  wishlist: {
    eyebrow: { en: "Partner wishlist", zh: "合作夥伴心願清單" },
    title: { en: "Give useful things a second life", zh: "讓實用物資延續價值" },
    description: { en: "A future wishlist will help connect useful items with Love 21 activities.", zh: "未來的心願清單將協助把實用物資帶到 Love 21 的活動中。" },
    action: { en: "Donate this", zh: "捐贈此物資" },
    items: [
      { title: { en: "Sports and activity equipment", zh: "體育及活動用品" }, status: { en: "Future wish", zh: "未來心願" } },
      { title: { en: "Healthy cooking supplies", zh: "健康烹飪用品" }, status: { en: "Future wish", zh: "未來心願" } },
      { title: { en: "Art and learning materials", zh: "藝術及學習材料" }, status: { en: "Future wish", zh: "未來心願" } },
      { title: { en: "Comfortable team essentials", zh: "舒適的團隊必需品" }, status: { en: "Future wish", zh: "未來心願" } },
    ],
  },
  fundraiser: {
    eyebrow: { en: "bring people together", zh: "凝聚大家" },
    title: { en: "Fundraise with your community", zh: "與你的社群一起籌款" },
    description: { en: "Bring people together around a challenge, celebration or shared cause.", zh: "以挑戰、慶祝活動或共同目標凝聚大家。" },
    action: { en: "Start a fundraiser", zh: "開始籌款" },
  },
  preview: { en: "Preview — coming later", zh: "預覽功能 — 即將推出" },
  payment: {
    heading: { en: "Donate today", zh: "立即捐贈" },
    description: { en: "Use PayMe or continue securely with Love 21’s existing online donation provider.", zh: "使用 PayMe，或透過 Love 21 現有的網上捐贈服務安全捐款。" },
    payme: { en: "Scan to donate with PayMe", zh: "掃描以 PayMe 捐款" },
    moonclerk: { en: "Donate online", zh: "網上捐贈" },
  },
};
