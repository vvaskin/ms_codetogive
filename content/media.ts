import { mediaArticles, type Locale, type MediaArticle } from "./site-data";

export interface LocalizedMediaText {
  en: string;
  zh: string;
  cn: string;
}

export interface MediaContent {
  hero: {
    badge: LocalizedMediaText;
    title: LocalizedMediaText;
    description: LocalizedMediaText;
    facebook: LocalizedMediaText;
    instagram: LocalizedMediaText;
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
    badge: { en: "Member stories", zh: "會員故事", cn: "会员故事" },
    title: { en: "#somuchability as it happens", zh: "一起看見每一個可能", cn: "一起看见每一个可能" },
    description: {
      en: "Read from our press and explore the stories our community is sharing from Hong Kong.",
      zh: "閱讀媒體報導，探索 Love 21 在香港分享的故事。",
      cn: "阅读媒体报道，探索 Love 21 在香港分享的故事。",
    },
    facebook: { en: "Facebook", zh: "Facebook", cn: "Facebook" },
    instagram: { en: "Instagram", zh: "Instagram", cn: "Instagram" },
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
