import { images, type Locale } from "./site-data";

export type ActivityCategory = "sports" | "nutrition" | "family" | "csr" | "event";

export interface LocalizedText {
  en: string;
  zh: string;
  cn: string;
}

export interface ActivityEvent {
  id: string;
  /** Numeric primary key in `public.events`. Absent for static demo content. */
  dbId?: number;
  date: string;
  time: string;
  category: ActivityCategory;
  title: LocalizedText;
  location: LocalizedText;
  summary: LocalizedText;
}

export const activityText = (text: LocalizedText, locale: Locale) => text[locale];

export const activityCategories: Array<{
  id: ActivityCategory;
  label: LocalizedText;
  color: string;
}> = [
  { id: "sports", label: { en: "Sports", zh: "體育", cn: "体育" }, color: "var(--color-blue)" },
  { id: "nutrition", label: { en: "Nutrition", zh: "營養", cn: "营养" }, color: "var(--color-teal)" },
  { id: "family", label: { en: "Family", zh: "家庭", cn: "家庭" }, color: "var(--color-pink)" },
  { id: "csr", label: { en: "CSR", zh: "CSR", cn: "CSR" }, color: "var(--color-purple)" },
  { id: "event", label: { en: "Event", zh: "活動", cn: "活动" }, color: "var(--color-purple)" },
];

export const activitiesContent = {
  hero: {
    eyebrow: { en: "Events", zh: "活動", cn: "活动" },
    title: { en: "See what’s happening.", zh: "看看最近有甚麼活動。", cn: "看看最近有什么活动。" },
    accent: { en: "Then come be part of it.", zh: "一起參與吧。", cn: "一起参与吧。" },
    description: {
      en: "Explore Love 21 activities for our community. Choose a date to see what is planned, or discover ways to get involved.",
      zh: "探索Love 21社群活動時間表。選擇日期查看當日安排，或了解如何參與。",
      cn: "探索 Love 21 社群活动时间表。选择日期查看当日安排，或了解如何参与。",
    },
    primary: { en: "Explore the calendar", zh: "查看日曆", cn: "查看日历" },
    secondary: { en: "Volunteer with us", zh: "成為義工", cn: "成为义工" },
  },
  programmes: {
    eyebrow: { en: "Our programmes", zh: "我們的計劃", cn: "我们的计划" },
    title: {
      en: "Sport, nutrition and family care.",
      zh: "體育、營養與家庭支援。",
      cn: "体育、营养与家庭支援。",
    },
    description: {
      en: "Activities on the calendar grow from Love 21’s three programme pillars.",
      zh: "日曆上的活動，來自 Love 21 三大計劃支柱。",
      cn: "日历上的活动，来自 Love 21 三大计划支柱。",
    },
    pillars: [
      {
        id: "sports",
        title: { en: "Sports", zh: "體育", cn: "体育" },
        description: {
          en: "Designed without limitations — a comprehensive range of activities, plus strength training, coordination and mental health support.",
          zh: "不設限制的體育計劃，涵蓋多元活動，並注重力量訓練、協調能力及心理健康。",
          cn: "不设限制的体育计划，涵盖多元活动，并注重力量训练、协调能力及心理健康。",
        },
        image: images.sports,
        imageAlt: {
          en: "Love 21 members taking part in a sports activity",
          zh: "Love 21 會員參與體育活動",
          cn: "Love 21 会员参与体育活动",
        },
      },
      {
        id: "nutrition",
        title: { en: "Nutrition", zh: "營養", cn: "营养" },
        description: {
          en: "Support and guidance for healthy lifestyle changes, with regular cooking and food-prep lessons for families.",
          zh: "提供健康生活支援與指導，並定期舉辦烹飪及食物準備課堂。",
          cn: "提供健康生活支援与指导，并定期举办烹饪及食物准备课堂。",
        },
        image: images.nutrition,
        imageAlt: {
          en: "Love 21 members cooking together",
          zh: "Love 21 會員一起烹飪",
          cn: "Love 21 会员一起烹饪",
        },
      },
      {
        id: "family",
        title: { en: "Family Care", zh: "家庭支援", cn: "家庭支援" },
        description: {
          en: "Specialty classes for parents, and parental participation in many sport and healthy lifestyle sessions.",
          zh: "為家長提供專屬課堂，並歡迎家長參與多項體育及健康生活活動。",
          cn: "为家长提供专属课堂，并欢迎家长参与多项体育及健康生活活动。",
        },
        image: images.family,
        imageAlt: {
          en: "Families connected through Love 21",
          zh: "透過 Love 21 連繫的家庭",
          cn: "透过 Love 21 连系的家庭",
        },
      },
    ],
  },
  quickStart: {
    eyebrow: { en: "Quick start", zh: "快速開始", cn: "快速开始" },
    title: { en: "Find the right way to join in.", zh: "找到合適的參與方式。", cn: "找到合适的参与方式。" },
    items: [
      { title: { en: "For members & families", zh: "會員及家庭", cn: "会员及家庭" }, copy: { en: "Explore activities with your Love 21 community.", zh: "探索適合Love 21社群的活動。", cn: "探索适合 Love 21 社群的活动。" } },
      { title: { en: "For volunteers", zh: "義工", cn: "义工" }, copy: { en: "Share your time and skills at a future activity.", zh: "在未來活動中分享你的時間和技能。", cn: "在未来活动中分享你的时间和技能。" } },
      { title: { en: "For corporate teams", zh: "企業團隊", cn: "企业团队" }, copy: { en: "Create a meaningful day of connection together.", zh: "一起創造有意義的交流時光。", cn: "一起创造有意义的交流时光。" } },
    ],
  },
  recentlyWrapped: {
    eyebrow: { en: "Just in", zh: "剛剛結束", cn: "刚刚结束" },
    title: { en: "Recently wrapped up", zh: "最近完成的活動", cn: "最近完成的活动" },
    note: { en: "Demo activity highlights — not a record of live bookings.", zh: "示範活動精選，並非即時報名紀錄。", cn: "示范活动精选，并非即时报名纪录。" },
    items: [
      { date: "26 Jul", title: { en: "Community sports afternoon", zh: "社群運動下午", cn: "社群运动下午" }, category: "sports" as ActivityCategory },
      { date: "19 Jul", title: { en: "Family storytelling circle", zh: "家庭故事分享圈", cn: "家庭故事分享圈" }, category: "family" as ActivityCategory },
      { date: "12 Jul", title: { en: "Nutrition workshop", zh: "營養工作坊", cn: "营养工作坊" }, category: "nutrition" as ActivityCategory },
    ],
  },
  volunteer: {
    title: { en: "Every activity grows through people who show up.", zh: "每個活動都由願意同行的人一起成就。", cn: "每个活动都由愿意同行的人一起成就。" },
    description: { en: "There are many ways to share your time, skills and encouragement with the Love 21 community.", zh: "你可以用時間、技能和鼓勵，與Love 21社群同行。", cn: "你可以用时间、技能和鼓励，与 Love 21 社群同行。" },
    primary: { en: "Explore volunteering", zh: "了解義工機會", cn: "了解义工机会" },
    secondary: { en: "Talk to our team", zh: "聯絡我們的團隊", cn: "联系我们的团队" },
  },
} as const;
