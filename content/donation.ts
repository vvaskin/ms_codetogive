export type DonationLocale = "en" | "zh" | "cn";

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
      cn: "每一份支持都打开一扇门",
    },
    title: { en: "Give in a way that feels good.", zh: "用舒服的方式去支持。", cn: "用舒服的方式去支持。" },
    description: {
      en: "Your support helps Love 21 create inclusive opportunities through sports, nutrition and holistic programmes.",
      zh: "你的支持讓 Love 21 能透過體育、營養及全人發展計劃，創造更多共融機會。",
      cn: "你的支持让 Love 21 能透过体育、营养及全人发展计划，创造更多共融机会。",
    },
    scriptNote: {
      en: "— and thank you for standing with our families",
      zh: "— 謝謝你與我們的家庭同行",
      cn: "— 谢谢你与我们的家庭同行",
    },
  },
  modes: [
    { title: { en: "Give money", zh: "金錢捐贈", cn: "金钱捐赠" }, label: { en: "monthly or one-time", zh: "每月或一次性", cn: "每月或一次性" }, description: { en: "Choose a donation that suits you.", zh: "選擇適合你的捐贈方式。", cn: "选择适合你的捐赠方式。" } },
    { title: { en: "Support a programme", zh: "支持計劃", cn: "支持计划" }, label: { en: "pick a focus", zh: "選擇重點", cn: "选择重点" }, description: { en: "Direct your support to an area of activity.", zh: "把支持投向你關心的活動範疇。", cn: "把支持投向你关心的活动范畴。" } },
    { title: { en: "Donate items", zh: "物資捐贈", cn: "物资捐赠" }, label: { en: "our wish list", zh: "我們的心願清單", cn: "我们的心愿清单" }, description: { en: "Explore a future partner wishlist.", zh: "瀏覽未來的合作夥伴心願清單。", cn: "浏览未来的合作伙伴心愿清单。" } },
  ],
  configurator: {
    eyebrow: { en: "Donation preview", zh: "捐贈預覽", cn: "捐赠预览" },
    title: { en: "Shape your support", zh: "選擇支持方式", cn: "选择支持方式" },
    frequency: [{ en: "Monthly", zh: "每月", cn: "每月" }, { en: "One-time", zh: "一次性", cn: "一次性" }],
    amountLabel: { en: "Choose an amount", zh: "選擇金額", cn: "选择金额" },
    amounts: [{ en: "HK$100", zh: "港幣 100 元", cn: "港币 100 元" }, { en: "HK$500", zh: "港幣 500 元", cn: "港币 500 元" }, { en: "HK$1,000", zh: "港幣 1,000 元", cn: "港币 1,000 元" }],
    customAmount: { en: "Custom", zh: "自訂金額", cn: "自定金额" },
    programmeLabel: { en: "Choose a programme", zh: "選擇計劃", cn: "选择计划" },
    programmes: [{ en: "Where it is needed most", zh: "最需要的地方", cn: "最需要的地方" }, { en: "Sports", zh: "體育", cn: "体育" }, { en: "Nutrition", zh: "營養", cn: "营养" }, { en: "Family", zh: "家庭", cn: "家庭" }],
    detailsTitle: { en: "Your details", zh: "你的資料", cn: "你的资料" },
    fields: [{ en: "Full name", zh: "姓名", cn: "姓名" }, { en: "Email address", zh: "電郵地址", cn: "电邮地址" }],
    walletsTitle: { en: "Wallet options", zh: "電子錢包選項", cn: "电子钱包选项" },
    wallets: [{ en: "Apple Pay", zh: "Apple Pay", cn: "Apple Pay" }, { en: "Google Pay", zh: "Google Pay", cn: "Google Pay" }],
    cardLabel: { en: "Card number", zh: "信用卡號碼", cn: "信用卡号码" },
    action: { en: "Continue to donate", zh: "繼續捐贈", cn: "继续捐赠" },
    trustLine: { en: "This is a visual preview. Use the live options below to donate today.", zh: "這是視覺預覽。請使用下方的即時捐贈方式立即支持。", cn: "这是视觉预览。请使用下方的即时捐赠方式立即支持。" },
  },
  impact: {
    eyebrow: { en: "your impact", zh: "你的影響力", cn: "你的影响力" },
    title: { en: "Every contribution supports belonging", zh: "每一份支持都讓共融發生", cn: "每一份支持都让共融发生" },
    selectedAmount: { en: "A gift of HK$500 can help sustain our shared programmes.", zh: "港幣 500 元的支持有助延續我們的共融計劃。", cn: "港币 500 元的支持有助延续我们的共融计划。" },
    description: { en: "Love 21 is building a community where people can move, learn and connect together.", zh: "Love 21 正建立一個讓大家一起運動、學習和連結的社群。", cn: "Love 21 正建立一个让大家一起运动、学习和连结的社群。" },
    points: [
      { value: "600+", label: { en: "members and families", zh: "會員及家庭", cn: "会员及家庭" } },
      { value: "≈1,000", label: { en: "monthly activities", zh: "每月活動節數", cn: "每月活动节数" } },
      { value: "HK$0", label: { en: "charged to families", zh: "不向家庭收費", cn: "不向家庭收费" } },
    ],
    previewNote: { en: "Preview only — choose a live donation option below when you are ready.", zh: "僅供預覽 — 準備好時請選擇下方的即時捐贈方式。", cn: "仅供预览 — 准备好时请选择下方的即时捐赠方式。" },
  },
  wishlist: {
    eyebrow: { en: "Partner wishlist", zh: "合作夥伴心願清單", cn: "合作伙伴心愿清单" },
    title: { en: "Give useful things a second life", zh: "讓實用物資延續價值", cn: "让实用物资延续价值" },
    description: { en: "A future wishlist will help connect useful items with Love 21 activities.", zh: "未來的心願清單將協助把實用物資帶到 Love 21 的活動中。", cn: "未来的心愿清单将协助把实用物资带到 Love 21 的活动中。" },
    action: { en: "Donate this", zh: "捐贈此物資", cn: "捐赠此物资" },
    items: [
      { title: { en: "Sports and activity equipment", zh: "體育及活動用品", cn: "体育及活动用品" }, status: { en: "Future wish", zh: "未來心願", cn: "未来心愿" } },
      { title: { en: "Healthy cooking supplies", zh: "健康烹飪用品", cn: "健康烹饪用品" }, status: { en: "Future wish", zh: "未來心願", cn: "未来心愿" } },
      { title: { en: "Art and learning materials", zh: "藝術及學習材料", cn: "艺术及学习材料" }, status: { en: "Future wish", zh: "未來心願", cn: "未来心愿" } },
      { title: { en: "Comfortable team essentials", zh: "舒適的團隊必需品", cn: "舒适的团队必需品" }, status: { en: "Future wish", zh: "未來心願", cn: "未来心愿" } },
    ],
  },
  fundraiser: {
    eyebrow: { en: "bring people together", zh: "凝聚大家", cn: "凝聚大家" },
    title: { en: "Fundraise with your community", zh: "與你的社群一起籌款", cn: "与你的社群一起筹款" },
    description: { en: "Bring people together around a challenge, celebration or shared cause.", zh: "以挑戰、慶祝活動或共同目標凝聚大家。", cn: "以挑战、庆祝活动或共同目标凝聚大家。" },
    action: { en: "Start a fundraiser", zh: "開始籌款", cn: "开始筹款" },
  },
  preview: { en: "Preview — coming later", zh: "預覽功能 — 即將推出", cn: "预览功能 — 即将推出" },
  payment: {
    heading: { en: "Donate today", zh: "立即捐贈", cn: "立即捐赠" },
    description: { en: "Use PayMe or continue securely with Love 21’s existing online donation provider.", zh: "使用 PayMe，或透過 Love 21 現有的網上捐贈服務安全捐款。", cn: "使用 PayMe，或透过 Love 21 现有的网上捐赠服务安全捐款。" },
    payme: { en: "Scan to donate with PayMe", zh: "掃描以 PayMe 捐款", cn: "扫描以 PayMe 捐款" },
    moonclerk: { en: "Donate online", zh: "網上捐贈", cn: "网上捐赠" },
  },
};
