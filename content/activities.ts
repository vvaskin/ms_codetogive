import type { Locale } from "./site-data";

export type ActivityCategory = "sports" | "nutrition" | "family" | "csr";

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface ActivityEvent {
  id: string;
  date: string;
  time: string;
  category: ActivityCategory;
  title: LocalizedText;
  location: LocalizedText;
  summary: LocalizedText;
}

export interface ActivityCard extends ActivityEvent {
  dayLabel: LocalizedText;
}

export const activityText = (text: LocalizedText, locale: Locale) => text[locale];

export const activityCategories: Array<{
  id: ActivityCategory;
  label: LocalizedText;
  color: string;
}> = [
  { id: "sports", label: { en: "Sports", zh: "體育" }, color: "var(--color-blue)" },
  { id: "nutrition", label: { en: "Nutrition", zh: "營養" }, color: "var(--color-teal)" },
  { id: "family", label: { en: "Family", zh: "家庭" }, color: "var(--color-pink)" },
  { id: "csr", label: { en: "CSR", zh: "CSR" }, color: "var(--color-purple)" },
];

const event = (
  id: string,
  date: string,
  time: string,
  category: ActivityCategory,
  title: LocalizedText,
  location: LocalizedText,
  summary: LocalizedText,
): ActivityEvent => ({ id, date, time, category, title, location, summary });

export const august2026Events: ActivityEvent[] = [
  event("yoga-04", "2026-08-04", "10:00–11:00", "sports", { en: "Inclusive Yoga", zh: "共融瑜伽" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "A gentle movement session for members.", zh: "為會員而設的溫和運動課。" }),
  event("food-06", "2026-08-06", "15:30–16:30", "nutrition", { en: "Food Explorers", zh: "食物探索小組" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "A practical, social nutrition activity.", zh: "結合實用營養知識及社交互動的活動。" }),
  event("family-08", "2026-08-08", "11:00–12:30", "family", { en: "Family Coffee Morning", zh: "家庭咖啡早晨" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "Time to connect with other families.", zh: "與其他家庭交流的時光。" }),
  event("fitness-11", "2026-08-11", "17:00–18:00", "sports", { en: "Fitness Club", zh: "健體俱樂部" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "Movement and games with the community.", zh: "與社群一起做運動及玩遊戲。" }),
  event("csr-14", "2026-08-14", "14:00–16:00", "csr", { en: "Corporate Volunteer Visit", zh: "企業義工探訪" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "A shared afternoon of activities and connection.", zh: "一起參與活動、建立連繫的下午。" }),
  event("dance-18", "2026-08-18", "16:00–17:00", "sports", { en: "Dance & Rhythm", zh: "舞蹈與節奏" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "Move, listen and have fun together.", zh: "一起律動、聆聽及享受樂趣。" }),
  event("food-18", "2026-08-18", "17:30–18:30", "nutrition", { en: "Kitchen Skills", zh: "廚房小技能" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "A simple food-preparation activity.", zh: "簡單的食物準備活動。" }),
  event("family-22", "2026-08-22", "10:30–12:00", "family", { en: "Weekend Family Club", zh: "週末家庭俱樂部" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "A relaxed social session for families.", zh: "輕鬆的家庭社交活動。" }),
  event("sports-27", "2026-08-27", "18:00–19:00", "sports", { en: "Team Sports", zh: "團隊運動" }, { en: "Love 21 Space", zh: "Love 21 Space" }, { en: "An inclusive session built around play.", zh: "以遊戲為本的共融活動。" }),
];

export const upcomingActivities: ActivityCard[] = august2026Events.slice(0, 6).map((item) => ({
  ...item,
  dayLabel: {
    en: new Intl.DateTimeFormat("en-HK", { month: "short", day: "numeric" }).format(new Date(`${item.date}T12:00:00`)),
    zh: new Intl.DateTimeFormat("zh-HK", { month: "numeric", day: "numeric" }).format(new Date(`${item.date}T12:00:00`)),
  },
}));

export const activitiesContent = {
  hero: {
    eyebrow: { en: "Activities & calendar", zh: "活動與日曆" },
    title: { en: "See what’s happening.", zh: "看看最近有甚麼活動。" },
    accent: { en: "Then come be part of it.", zh: "一起參與吧。" },
    description: {
      en: "Explore a demo view of Love 21 activities for our community. Choose a date to see what is planned, or discover ways to get involved.",
      zh: "探索Love 21社群活動的示範時間表。選擇日期查看當日安排，或了解如何參與。",
    },
    primary: { en: "Explore the calendar", zh: "查看日曆" },
    secondary: { en: "Volunteer with us", zh: "成為義工" },
  },
  metrics: [
    { value: "600+", label: { en: "members and families in our community", zh: "社群中的會員及家庭" } },
    { value: "≈1,000", label: { en: "activities every month", zh: "每月約有的活動" } },
    { value: "HK$0", label: { en: "cost to families for our programmes", zh: "家庭參與計劃的費用" } },
  ],
  quickStart: {
    eyebrow: { en: "Quick start", zh: "快速開始" },
    title: { en: "Find the right way to join in.", zh: "找到合適的參與方式。" },
    items: [
      { title: { en: "For members & families", zh: "會員及家庭" }, copy: { en: "Explore activities with your Love 21 community.", zh: "探索適合Love 21社群的活動。" } },
      { title: { en: "For volunteers", zh: "義工" }, copy: { en: "Share your time and skills at a future activity.", zh: "在未來活動中分享你的時間和技能。" } },
      { title: { en: "For corporate teams", zh: "企業團隊" }, copy: { en: "Create a meaningful day of connection together.", zh: "一起創造有意義的交流時光。" } },
    ],
  },
  recentlyWrapped: {
    eyebrow: { en: "Just in", zh: "剛剛結束" },
    title: { en: "Recently wrapped up", zh: "最近完成的活動" },
    note: { en: "Demo activity highlights — not a record of live bookings.", zh: "示範活動精選，並非即時報名紀錄。" },
    items: [
      { date: "26 Jul", title: { en: "Community sports afternoon", zh: "社群運動下午" }, category: "sports" as ActivityCategory },
      { date: "19 Jul", title: { en: "Family storytelling circle", zh: "家庭故事分享圈" }, category: "family" as ActivityCategory },
      { date: "12 Jul", title: { en: "Nutrition workshop", zh: "營養工作坊" }, category: "nutrition" as ActivityCategory },
    ],
  },
  volunteer: {
    title: { en: "Every activity grows through people who show up.", zh: "每個活動都由願意同行的人一起成就。" },
    description: { en: "There are many ways to share your time, skills and encouragement with the Love 21 community.", zh: "你可以用時間、技能和鼓勵，與Love 21社群同行。" },
    primary: { en: "Explore volunteering", zh: "了解義工機會" },
    secondary: { en: "Talk to our team", zh: "聯絡我們的團隊" },
  },
} as const;
