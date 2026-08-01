export type DonationLocale = "en" | "zh";
export type DonationModeId = "money" | "events" | "items";
export type DonationFrequency = "monthly" | "one-time";
export type PaymentMethodId = "payme" | "moonclerk";

export type Localized = Record<DonationLocale, string>;

export interface FundingNeed {
  readonly label: Localized;
  readonly detail: Localized;
}

export interface FundableEvent {
  readonly id: string;
  readonly activityId?: string;
  readonly category: "sports" | "nutrition" | "family";
  readonly categoryLabel: Localized;
  readonly title: Localized;
  readonly schedule: Localized;
  readonly description: Localized;
  readonly needs: readonly FundingNeed[];
  readonly goalHkd: number;
  readonly progressPercent: number;
}

export interface WishlistItem {
  readonly id: string;
  readonly title: Localized;
  readonly status: Localized;
}

export const donationContent = {
  intro: {
    eyebrow: {
      en: "every dollar becomes a hug, a class, a chance ♡",
      zh: "每一元都化成一個擁抱、一堂課、一次機會 ♡",
    },
    title: { en: "Give in a way that feels good.", zh: "用舒服的方式去支持。" },
    description: {
      en: "Your gift funds sports, nutrition and holistic programmes for our Down syndrome and autistic community.",
      zh: "你的捐款為我們的唐氏綜合症及自閉症社群提供體育、營養及全人發展計劃。",
    },
  },
  modes: [
    {
      id: "money" as const,
      title: { en: "Give money", zh: "金錢捐贈" },
      label: { en: "monthly or one-time", zh: "每月或一次性" },
    },
    {
      id: "events" as const,
      title: { en: "Fund events", zh: "資助活動" },
      label: { en: "pick a focus", zh: "選擇重點" },
    },
    {
      id: "items" as const,
      title: { en: "Donate items", zh: "物資捐贈" },
      label: { en: "our wish list", zh: "我們的心願清單" },
    },
  ],
  money: {
    frequencyLabel: { en: "Donation frequency", zh: "捐款頻率" },
    frequency: {
      monthly: { en: "Monthly", zh: "每月" },
      "one-time": { en: "One-time", zh: "一次性" },
    },
    mostImpact: { en: "most impact", zh: "影響最大" },
    amountLabel: { en: "Choose an amount", zh: "選擇金額" },
    amounts: [100, 400, 500],
    amountDescriptions: {
      100: { en: "a month of healthy snacks for a member", zh: "為一位會員提供一個月健康小食" },
      400: { en: "supports an under-funded programme", zh: "支持資源不足的計劃" },
      500: { en: "helps fund a class for 15 members", zh: "協助資助十五位會員的一堂課" },
    } as Record<number, Localized>,
    custom: { en: "Custom", zh: "自訂" },
    customHint: { en: "You choose the number", zh: "由你選擇金額" },
    customLabel: { en: "Custom amount in HKD", zh: "自訂港幣金額" },
    customPlaceholder: { en: "Enter an amount", zh: "輸入金額" },
    programmeLabel: { en: "Support a specific programme (optional)", zh: "支持指定計劃（可選）" },
    programmes: [
      { id: "greatest-need", label: { en: "Where it’s needed most", zh: "最有需要的地方" } },
      { id: "sports", label: { en: "Sports", zh: "體育" } },
      { id: "nutrition", label: { en: "Nutrition", zh: "營養" } },
      { id: "family", label: { en: "Family Care", zh: "家庭支援" } },
    ],
    paymentTitle: { en: "Choose how to complete your donation", zh: "選擇完成捐款的方式" },
    paymeLabel: { en: "PayMe", zh: "PayMe" },
    paymeDescription: { en: "Scan the verified Love 21 QR code", zh: "掃描 Love 21 已核實的二維碼" },
    paymeInstruction: { en: "Scan to donate with PayMe", zh: "使用 PayMe 掃描捐款" },
    moonclerkLabel: { en: "Secure online form", zh: "安全網上表格" },
    moonclerkDescription: { en: "Continue with Love 21’s hosted provider", zh: "前往 Love 21 的託管付款服務" },
    moonclerkAction: { en: "Continue to MoonClerk", zh: "前往 MoonClerk" },
    moonclerkNote: {
      en: "Weekly and monthly giving are available. Confirm your amount and frequency on the secure hosted form.",
      zh: "安全託管表格提供每週及每月捐款選項。請在表格內再次確認金額及頻率。",
    },
    receipt: {
      title: { en: "Need an official receipt?", zh: "需要正式收據？" },
      description: {
        en: "For donations of HK$100 or above, an official receipt can be mailed to you on request.",
        zh: "捐款港幣100元或以上，可按要求獲發並郵寄正式收據。",
      },
      action: { en: "Email Maggie", zh: "電郵聯絡 Maggie" },
      email: "maggie@love21foundation.com",
      subject: { en: "Donation receipt request", zh: "捐款收據申請" },
    },
    alternativePayments: {
      summary: { en: "Other ways to donate", zh: "其他捐款方式" },
      intro: { en: "Bank transfer, FPS or cheque", zh: "銀行轉帳、轉數快或支票" },
      copy: { en: "Copy", zh: "複製" },
      copied: { en: "Copied", zh: "已複製" },
      copyUnavailable: {
        en: "Copy is unavailable. Select the number to copy it manually.",
        zh: "無法自動複製，請選取號碼手動複製。",
      },
      hsbcLabel: { en: "HSBC transfer", zh: "滙豐銀行轉帳" },
      hsbcAccount: "582-350526-838",
      fpsLabel: { en: "FPS ID", zh: "轉數快識別碼" },
      fpsId: "164778151",
      chequeTitle: { en: "Donate by cheque", zh: "支票捐款" },
      payeeLabel: { en: "Payable to", zh: "支票抬頭" },
      payee: "Love 21 Foundation Limited",
      addressLabel: { en: "Mail to", zh: "郵寄至" },
      address: "1102, 11/F, Trium Lab, 21 Luk Hop Street, San Po Kong, Kowloon, HK",
    },
    invalidAmount: { en: "Enter a whole-dollar amount of at least HK$1.", zh: "請輸入至少港幣一元的整數金額。" },
  },
  impact: {
    eyebrow: { en: "your impact ♡", zh: "你的影響力 ♡" },
    monthlyDescription: {
      en: "Recurring support helps Love 21 plan activities and keep programmes running.",
      zh: "每月支持有助 Love 21 規劃活動並持續推行計劃。",
    },
    oneTimeDescription: {
      en: "A one-time gift helps Love 21 respond where support is needed.",
      zh: "一次性捐款協助 Love 21 回應當下最有需要的地方。",
    },
    allocationTitle: { en: "Where your donation goes", zh: "你的捐款用途" },
    allocations: [
      { value: 60, label: { en: "Programmes & activities", zh: "計劃及活動" }, tone: "blue" },
      { value: 25, label: { en: "Family support & nutrition", zh: "家庭支援及營養" }, tone: "purple" },
      { value: 10, label: { en: "Operations & facilities", zh: "營運及設施" }, tone: "yellow" },
      { value: 5, label: { en: "Admin & governance", zh: "行政及管治" }, tone: "neutral" },
    ],
    commitmentTitle: { en: "Our commitment", zh: "我們的承諾" },
    commitments: [
      { en: "Registered charity in Hong Kong — fully audited", zh: "香港註冊慈善機構，帳目經全面審核" },
      { en: "90%+ of every donation reaches our families directly", zh: "超過九成捐款直接用於服務家庭" },
    ],
    reportAction: { en: "Trust & transparency", zh: "信任與透明" },
  },
  events: {
    eyebrow: { en: "pick a focus, make it count", zh: "選擇重點，成就改變" },
    title: { en: "Support an event you believe in.", zh: "支持你認同的活動。" },
    description: {
      en: "Choose an approved event and see the impact your support could make.",
      zh: "選擇已核准的活動，了解你的支持可以帶來的影響。",
    },
    listEyebrow: { en: "what’s coming up", zh: "即將舉行" },
    listTitle: { en: "Fundable events & programmes", zh: "可資助的活動及計劃" },
    needsTitle: { en: "What this event needs", zh: "活動所需" },
    goalLabel: { en: "Goal", zh: "目標" },
    fundedLabel: { en: "funded", zh: "已籌得" },
    action: { en: "Support this event", zh: "支持此活動" },
    previewTitle: { en: "Preview your support", zh: "預覽你的支持" },
    previewAmount: { en: "Preview amount in HKD", zh: "預覽港幣金額" },
    previewAction: { en: "Confirm demo selection", zh: "確認示範選擇" },
    previewNotice: {
      en: "Demo only — no payment, pledge or progress update will be made.",
      zh: "只供示範，不會付款、建立承諾或更新籌款進度。",
    },
    successTitle: { en: "Demo selection confirmed", zh: "示範選擇已確認" },
    successDescription: {
      en: "Nothing was charged or saved, and the published progress has not changed.",
      zh: "沒有收費或儲存資料，已公布的進度亦沒有改變。",
    },
    tryAgain: { en: "Choose another amount", zh: "選擇另一金額" },
    close: { en: "Close preview", zh: "關閉預覽" },
    items: [
      {
        id: "saturday-football-league",
        category: "sports",
        categoryLabel: { en: "Sports", zh: "體育" },
        title: { en: "Saturday Football League", zh: "星期六足球聯賽" },
        schedule: { en: "Every Saturday · Aug–Oct 2026", zh: "逢星期六 · 2026年8月至10月" },
        description: {
          en: "Weekly football sessions for 30 members at Happy Valley. Builds teamwork, fitness and confidence.",
          zh: "每週在跑馬地為三十位會員舉行足球活動，培養團隊合作、體能及自信。",
        },
        needs: [
          { label: { en: "Footballs (size 4)", zh: "四號足球" }, detail: { en: "10 needed", zh: "需要10個" } },
          { label: { en: "Coach transport", zh: "教練交通" }, detail: { en: "HK$800/session", zh: "每節港幣800元" } },
          { label: { en: "Sports drinks & snacks", zh: "運動飲品及小食" }, detail: { en: "30 packs/week", zh: "每週30份" } },
          { label: { en: "Jersey printing", zh: "球衣印製" }, detail: { en: "HK$3,000 total", zh: "合共港幣3,000元" } },
        ],
        goalHkd: 12000,
        progressPercent: 45,
      },
      {
        id: "healthy-cooking-class",
        category: "nutrition",
        categoryLabel: { en: "Nutrition", zh: "營養" },
        title: { en: "Healthy Cooking Class", zh: "健康烹飪班" },
        schedule: { en: "Wednesdays · Sep 2026", zh: "逢星期三 · 2026年9月" },
        description: {
          en: "Teaching members and parents to prepare balanced meals together. A four-week programme for 15 families.",
          zh: "教授會員及家長一起準備均衡膳食，為十五個家庭而設的四週計劃。",
        },
        needs: [
          { label: { en: "Fresh ingredients", zh: "新鮮食材" }, detail: { en: "HK$500/session", zh: "每節港幣500元" } },
          { label: { en: "Aprons (child-sized)", zh: "兒童圍裙" }, detail: { en: "15 needed", zh: "需要15件" } },
          { label: { en: "Recipe booklet printing", zh: "食譜小冊子印製" }, detail: { en: "HK$600 total", zh: "合共港幣600元" } },
          { label: { en: "Kitchen equipment", zh: "廚房設備" }, detail: { en: "See wish list", zh: "見心願清單" } },
        ],
        goalHkd: 5200,
        progressPercent: 20,
      },
      {
        id: "parent-support-circle",
        category: "family",
        categoryLabel: { en: "Family Care", zh: "家庭支援" },
        title: { en: "Parent Support Circle", zh: "家長支援小組" },
        schedule: { en: "Bi-weekly · Aug–Dec 2026", zh: "每兩週一次 · 2026年8月至12月" },
        description: {
          en: "Peer counselling and professional support for parents — especially single mothers navigating care alone.",
          zh: "為家長提供同儕輔導及專業支援，特別支援獨自照顧家庭的單親母親。",
        },
        needs: [
          { label: { en: "Counsellor fees", zh: "輔導員費用" }, detail: { en: "HK$1,500/session", zh: "每節港幣1,500元" } },
          { label: { en: "Venue snacks & tea", zh: "場地小食及茶點" }, detail: { en: "HK$200/session", zh: "每節港幣200元" } },
          { label: { en: "Children’s activity packs", zh: "兒童活動包" }, detail: { en: "20 packs", zh: "20份" } },
          { label: { en: "Transport subsidies", zh: "交通津貼" }, detail: { en: "HK$2,000 total", zh: "合共港幣2,000元" } },
        ],
        goalHkd: 18000,
        progressPercent: 60,
      },
    ] satisfies FundableEvent[],
  },
  wishlist: {
    eyebrow: { en: "prefer to give things, not money?", zh: "想捐物資而非金錢？" },
    title: { en: "Our wish list", zh: "我們的心願清單" },
    description: {
      en: "Select an item to preview, then contact Love 21 before arranging delivery.",
      zh: "選擇物資作預覽，安排送遞前請先聯絡 Love 21。",
    },
    partnerNote: {
      en: "In-kind donations are coordinated with Crossroads Foundation.",
      zh: "物資捐贈由我們與 Crossroads Foundation 協調安排。",
    },
    action: { en: "Donate this", zh: "捐贈此物資" },
    selectedTitle: { en: "Demo item selected", zh: "已選擇示範物資" },
    selectedDescription: {
      en: "Nothing was reserved or submitted. Contact Love 21 before arranging any in-kind donation.",
      zh: "沒有預留或提交任何物資。安排物資捐贈前請先聯絡 Love 21。",
    },
    reset: { en: "Choose another item", zh: "選擇另一物資" },
    items: [
      { id: "exercise-mats", title: { en: "Yoga & exercise mats", zh: "瑜伽及運動墊" }, status: { en: "need 15", zh: "需要15張" } },
      { id: "healthy-snacks", title: { en: "Healthy snacks & fruit", zh: "健康小食及水果" }, status: { en: "monthly", zh: "每月需要" } },
      { id: "sports-shoes", title: { en: "Sports shoes (all sizes)", zh: "運動鞋（所有尺碼）" }, status: { en: "need 20", zh: "需要20對" } },
      { id: "art-supplies", title: { en: "Art & craft supplies", zh: "美術及手工用品" }, status: { en: "ongoing", zh: "持續需要" } },
    ] satisfies WishlistItem[],
  },
  fundraiser: {
    eyebrow: { en: "run it, bake it, celebrate it ✶", zh: "跑步、烘焙、慶祝，一起籌款 ✶" },
    title: { en: "Turn your big moment into theirs.", zh: "把你的重要時刻化成他們的機會。" },
    description: {
      en: "Running a marathon? Having a birthday? Community fundraiser creation is planned for a later release.",
      zh: "參加馬拉松或慶祝生日？社群籌款功能將於日後版本推出。",
    },
    action: { en: "Start your own fundraiser", zh: "發起自己的籌款" },
    comingSoon: { en: "Coming later", zh: "即將推出" },
  },
} as const;
