import type { Locale } from "./site-data";

export interface ContactCopy {
  intro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  form: {
    title: string;
    nameLabel: string;
    emailLabel: string;
    topicLabel: string;
    messageLabel: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    topicPlaceholder: string;
    topics: string[];
    submit: string;
    privacyNote: string;
    successTitle: string;
    successDescription: string;
  };
  direct: {
    title: string;
    emailLabel: string;
    addressLabel: string;
    socialLabel: string;
    spaceLabel: string;
    officeLabel: string;
  };
}

export const contactContent: Record<Locale, ContactCopy> = {
  en: {
    intro: {
      eyebrow: "we'd love to hear from you",
      title: "Come say hi.",
      description:
        "Questions, ideas, volunteering, partnerships or press — whatever it is, we’d love to hear from you.",
    },
    form: {
      title: "Send us a message",
      nameLabel: "Your name",
      emailLabel: "Email",
      topicLabel: "I’m reaching out about",
      messageLabel: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "you@example.com",
      messagePlaceholder: "Tell us how we can help…",
      topicPlaceholder: "Select a topic",
      topics: ["General enquiry", "Programmes", "Volunteering", "Partnerships", "Press"],
      submit: "Send message",
      privacyNote:
        "Development copy: this form validates locally and does not transmit or store personal information.",
      successTitle: "Thank you for your message!",
      successDescription:
        "This is a development copy. Your information was not transmitted.",
    },
    direct: {
      title: "Reach us directly",
      emailLabel: "Email",
      addressLabel: "Visit us",
      socialLabel: "Follow along",
      spaceLabel: "Love 21 Space",
      officeLabel: "Love 21 Office",
    },
  },
  zh: {
    intro: {
      eyebrow: "我們很想聽聽你的想法",
      title: "歡迎聯絡我們。",
      description:
        "無論你想了解計劃、捐款、做義工、合作或傳媒查詢，歡迎與我們聯絡。",
    },
    form: {
      title: "傳送訊息給我們",
      nameLabel: "你的姓名",
      emailLabel: "電郵地址",
      topicLabel: "查詢類別",
      messageLabel: "訊息",
      namePlaceholder: "你的姓名",
      emailPlaceholder: "you@example.com",
      messagePlaceholder: "告訴我們如何協助你…",
      topicPlaceholder: "請選擇類別",
      topics: ["一般查詢", "計劃", "義工服務", "合作", "傳媒查詢"],
      submit: "傳送訊息",
      privacyNote: "開發版本：此表格只會在本機驗證，不會傳送或儲存個人資料。",
      successTitle: "謝謝你的訊息！",
      successDescription: "這是開發版本，資料並未傳送。",
    },
    direct: {
      title: "直接聯絡我們",
      emailLabel: "電郵",
      addressLabel: "到訪地址",
      socialLabel: "追蹤我們",
      spaceLabel: "Love 21 Space",
      officeLabel: "Love 21 Office",
    },
  },
};
