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
  cn: {
    intro: {
      eyebrow: "我们很想听听你的想法",
      title: "欢迎联系我们。",
      description:
        "无论你想了解计划、捐款、做义工、合作或传媒查询，欢迎与我们联系。",
    },
    form: {
      title: "发送讯息给我们",
      nameLabel: "你的姓名",
      emailLabel: "电邮地址",
      topicLabel: "查询类别",
      messageLabel: "讯息",
      namePlaceholder: "你的姓名",
      emailPlaceholder: "you@example.com",
      messagePlaceholder: "告诉我们如何协助你…",
      topicPlaceholder: "请选择类别",
      topics: ["一般查询", "计划", "义工服务", "合作", "传媒查询"],
      submit: "发送讯息",
      privacyNote: "开发版本：此表单只会在本机验证，不会传送或储存个人资料。",
      successTitle: "谢谢你的讯息！",
      successDescription: "这是开发版本，资料并未传送。",
    },
    direct: {
      title: "直接联系我们",
      emailLabel: "电邮",
      addressLabel: "到访地址",
      socialLabel: "关注我们",
      spaceLabel: "Love 21 Space",
      officeLabel: "Love 21 Office",
    },
  },
};
