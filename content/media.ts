import { mediaArticles, type Locale, type MediaArticle } from "./site-data";

export interface LocalizedMediaText {
  en: string;
  zh: string;
  cn: string;
}

export interface MediaReel {
  title: LocalizedMediaText;
  label: LocalizedMediaText;
  image?: string;
  accent: string;
  icon: string;
}

export interface MediaContent {
  hero: {
    badge: LocalizedMediaText;
    title: LocalizedMediaText;
    description: LocalizedMediaText;
    facebook: LocalizedMediaText;
    instagram: LocalizedMediaText;
  };
  reels: {
    eyebrow: LocalizedMediaText;
    title: LocalizedMediaText;
    hint: LocalizedMediaText;
    items: MediaReel[];
  };
  feeds: {
    eyebrow: LocalizedMediaText;
    title: LocalizedMediaText;
    description: LocalizedMediaText;
  };
  press: {
    eyebrow: LocalizedMediaText;
    title: LocalizedMediaText;
    read: LocalizedMediaText;
  };
}

export const facebookUrl = "https://www.facebook.com/Love21foundation/";
export const instagramUrl = "https://www.instagram.com/love21foundation/";

export const mediaContent: MediaContent = {
  hero: {
    badge: { en: "News & media", zh: "新聞與媒體", cn: "新闻与媒体" },
    title: { en: "See #somechability as it happens", zh: "一起看見每一個可能", cn: "一起看见每一个可能" },
    description: {
      en: "Read from our press, watch our moments, and explore the stories our community is sharing from Hong Kong.",
      zh: "閱讀媒體報導、重溫社群時刻，探索 Love 21 在香港分享的故事。",
      cn: "阅读媒体报道、重温社群时刻，探索 Love 21 在香港分享的故事。",
    },
    facebook: { en: "Facebook", zh: "Facebook", cn: "Facebook" },
    instagram: { en: "Instagram", zh: "Instagram", cn: "Instagram" },
  },
  reels: {
    eyebrow: { en: "Event Reels", zh: "活動短片", cn: "活动短片" },
    title: { en: "Small moments, shared big.", zh: "細小片刻，滿載分享。", cn: "细小片刻，满载分享。" },
    hint: { en: "Swipe to explore →", zh: "左右滑動探索 →", cn: "左右滑动探索 →" },
    items: [
      {
        title: { en: "Beyond Limits", zh: "超越界限", cn: "超越界限" },
        label: { en: "Community night", zh: "社群之夜", cn: "社群之夜" },
        image: "/assets/images/media-beyond.png",
        accent: "#98275e",
        icon: "✦",
      },
      {
        title: { en: "Charity Raffle", zh: "慈善獎券", cn: "慈善奖券" },
        label: { en: "Giving together", zh: "一起支持", cn: "一起支持" },
        image: "/assets/images/media-raffle.png",
        accent: "#2d679b",
        icon: "♥",
      },
      {
        title: { en: "Dragon boating", zh: "龍舟體驗", cn: "龙舟体验" },
        label: { en: "On the water", zh: "水上時光", cn: "水上时光" },
        image: "/assets/images/media-dragonboat.png",
        accent: "#895129",
        icon: "⌁",
      },
      {
        title: { en: "Healthy together", zh: "一起健康生活", cn: "一起健康生活" },
        label: { en: "Nutrition support", zh: "營養支援", cn: "营养支援" },
        image: "/assets/images/programme-nutrition.jpeg",
        accent: "#287d61",
        icon: "●",
      },
    ],
  },
  feeds: {
    eyebrow: { en: "All social, all Love", zh: "Love 21 社群動態", cn: "Love 21 社群动态" },
    title: { en: "From our feeds", zh: "來自我們的社群動態", cn: "来自我们的社群动态" },
    description: {
      en: "A presentational selection inspired by Love 21 updates. Follow us for the latest posts.",
      zh: "以下為 Love 21 社群動態的展示選集；歡迎追蹤我們，獲取最新消息。",
      cn: "以下为 Love 21 社群动态的展示选集；欢迎关注我们，获取最新消息。",
    },
  },
  press: {
    eyebrow: { en: "Our story in the news", zh: "媒體中的 Love 21", cn: "媒体中的 Love 21" },
    title: { en: "In the press", zh: "媒體報導", cn: "媒体报道" },
    read: { en: "Read", zh: "閱讀", cn: "阅读" },
  },
};

export function mediaText(value: LocalizedMediaText, locale: Locale) {
  return value[locale];
}

export function mediaFeedItems(): MediaArticle[] {
  return mediaArticles.slice(0, 6);
}
