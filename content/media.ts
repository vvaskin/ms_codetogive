import { mediaArticles, type Locale, type MediaArticle } from "./site-data";

export interface LocalizedMediaText {
  en: string;
  zh: string;
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
  instagram: {
    eyebrow: LocalizedMediaText;
    title: LocalizedMediaText;
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
    badge: { en: "News & media", zh: "新聞與媒體" },
    title: { en: "See #somechability as it happens", zh: "一起看見每一個可能" },
    description: {
      en: "Read from our press, watch our moments, and explore the stories our community is sharing from Hong Kong.",
      zh: "閱讀媒體報導、重溫社群時刻，探索 Love 21 在香港分享的故事。",
    },
    facebook: { en: "Facebook", zh: "Facebook" },
    instagram: { en: "Instagram", zh: "Instagram" },
  },
  reels: {
    eyebrow: { en: "Event Reels", zh: "活動短片" },
    title: { en: "Small moments, shared big.", zh: "細小片刻，滿載分享。" },
    hint: { en: "Swipe to explore →", zh: "左右滑動探索 →" },
    items: [
      {
        title: { en: "Beyond Limits", zh: "超越界限" },
        label: { en: "Community night", zh: "社群之夜" },
        image: "/assets/images/media-beyond.png",
        accent: "#98275e",
        icon: "✦",
      },
      {
        title: { en: "Charity Raffle", zh: "慈善獎券" },
        label: { en: "Giving together", zh: "一起支持" },
        image: "/assets/images/media-raffle.png",
        accent: "#2d679b",
        icon: "♥",
      },
      {
        title: { en: "Dragon boating", zh: "龍舟體驗" },
        label: { en: "On the water", zh: "水上時光" },
        image: "/assets/images/media-dragonboat.png",
        accent: "#895129",
        icon: "⌁",
      },
      {
        title: { en: "Healthy together", zh: "一起健康生活" },
        label: { en: "Nutrition support", zh: "營養支援" },
        image: "/assets/images/programme-nutrition.jpeg",
        accent: "#287d61",
        icon: "●",
      },
    ],
  },
  feeds: {
    eyebrow: { en: "All social, all Love", zh: "Love 21 社群動態" },
    title: { en: "From our feeds", zh: "來自我們的社群動態" },
    description: {
      en: "A presentational selection inspired by Love 21 updates. Follow us for the latest posts.",
      zh: "以下為 Love 21 社群動態的展示選集；歡迎追蹤我們，獲取最新消息。",
    },
  },
  instagram: {
    eyebrow: { en: "Instagram", zh: "Instagram" },
    title: { en: "Latest from Instagram", zh: "最新 Instagram 貼文" },
  },
  press: {
    eyebrow: { en: "Our story in the news", zh: "媒體中的 Love 21" },
    title: { en: "In the press", zh: "媒體報導" },
    read: { en: "Read", zh: "閱讀" },
  },
};

export function mediaText(value: LocalizedMediaText, locale: Locale) {
  return value[locale];
}

export function mediaFeedItems(): MediaArticle[] {
  return mediaArticles.slice(0, 6);
}
