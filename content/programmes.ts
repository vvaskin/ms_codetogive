import { images, type Locale } from "./site-data";

type Localized = Record<Locale, string>;

interface Link {
  label: Localized;
  href: Localized;
}

interface Programme {
  id: "sport" | "nutrition" | "family" | "csr";
  eyebrow: Localized;
  title: Localized;
  paragraphs: Localized[];
  activities: Localized[];
  image: string;
  imageAlt: Localized;
  action: Link;
}

export const programmesContent: {
  hero: {
    eyebrow: Localized;
    title: Localized;
    accent: Localized;
    description: Localized;
    scriptNote: Localized;
    activities: Localized[];
    primaryCta: Link;
    secondaryCta: Link;
  };
  metrics: { value: string; label: Localized }[];
  programmes: Programme[];
  community: {
    eyebrow: Localized;
    title: Localized;
    description: Localized;
    volunteerCta: Link;
    calendarCta: Link;
  };
  donate: {
    eyebrow: Localized;
    title: Localized;
    description: Localized;
    cta: Link;
  };
} = {
  hero: {
    eyebrow: {
      en: "What we do",
      zh: "我們的工作",
      cn: "我们的工作",
    },
    title: {
      en: "More than a class.",
      zh: "不只是一堂課。",
      cn: "不只是一堂课。",
    },
    accent: {
      en: "A community where people can grow.",
      zh: "一個讓每個人成長的社群。",
      cn: "一个让每个人成长的社群。",
    },
    description: {
      en: "Love 21 brings sport, nutrition, family support and inclusive partnerships together for people with Down syndrome, autism and neurodiversity in Hong Kong.",
      zh: "Love 21 為香港的唐氏綜合症、自閉症及神經多樣性人士，連繫體育、營養、家庭支援及共融合作夥伴。",
      cn: "Love 21 为香港的唐氏综合症、自闭症及神经多样性人士，连系体育、营养、家庭支援及共融合作伙伴。",
    },
    scriptNote: {
      en: "move, learn and belong — together",
      zh: "一起運動、學習、歸屬",
      cn: "一起运动、学习、归属",
    },
    activities: [
      { en: "Football", zh: "足球", cn: "足球" },
      { en: "Cooking", zh: "烹飪", cn: "烹饪" },
      { en: "Family support", zh: "家庭支援", cn: "家庭支援" },
      { en: "Community partnerships", zh: "社群合作", cn: "社群合作" },
    ],
    primaryCta: {
      label: { en: "Join the community", zh: "加入社群", cn: "加入社群" },
      href: { en: "/contact-us/", zh: "/zh/contact-us-hk/", cn: "/cn/contact-us/" },
    },
    secondaryCta: {
      label: { en: "Explore programmes", zh: "探索計劃", cn: "探索计划" },
      href: { en: "#sport", zh: "#sport", cn: "#sport" },
    },
  },
  metrics: [
    {
      value: "600+",
      label: { en: "members and families", zh: "會員及家庭", cn: "会员及家庭" },
    },
    {
      value: "≈1,000",
      label: { en: "monthly activities", zh: "每月活動節數", cn: "每月活动节数" },
    },
    {
      value: "HK$0",
      label: { en: "charged to families", zh: "不向家庭收費", cn: "不向家庭收费" },
    },
  ],
  programmes: [
    {
      id: "sport",
      eyebrow: { en: "01 · Sports", zh: "01 · 體育", cn: "01 · 体育" },
      title: { en: "Sport without limits.", zh: "無限可能的體育。", cn: "无限可能的体育。" },
      paragraphs: [
        {
          en: "Our sports programme is designed without limitations. We aim to give our beneficiaries the greatest opportunity to reach their full potential by offering a comprehensive range of activities while also striving for excellence in each sport.",
          zh: "我們的體育計劃不設限制，致力為會員提供充分發揮潛能的機會。",
          cn: "我们的体育计划不设限制，致力于为会员提供充分发挥潜能的机会。",
        },
        {
          en: "In addition to sport classes, we also focus on strength training, coordination and mental health activities.",
          zh: "除了運動課堂，我們亦注重力量訓練、協調能力及心理健康活動。",
          cn: "除了运动课堂，我们也注重力量训练、协调能力及心理健康活动。",
        },
      ],
      activities: [
        { en: "Football", zh: "足球", cn: "足球" },
        { en: "Climbing", zh: "攀石", cn: "攀岩" },
        { en: "Boxing", zh: "拳擊", cn: "拳击" },
        { en: "Movement", zh: "運動", cn: "运动" },
      ],
      image: images.sports,
      imageAlt: {
        en: "Love 21 members taking part in a sports activity",
        zh: "Love 21 會員參與體育活動",
        cn: "Love 21 会员参与体育活动",
      },
      action: {
        label: { en: "Get in touch", zh: "聯絡我們", cn: "联系我们" },
        href: { en: "/contact-us/", zh: "/zh/contact-us-hk/", cn: "/cn/contact-us/" },
      },
    },
    {
      id: "nutrition",
      eyebrow: { en: "02 · Nutrition", zh: "02 · 飲食與營養", cn: "02 · 饮食与营养" },
      title: { en: "Healthy habits, made together.", zh: "一起建立健康習慣。", cn: "一起建立健康习惯。" },
      paragraphs: [
        {
          en: "Sport classes alone are not enough to significantly extend the life expectancy of our beneficiaries. This is why we’ve developed a well thought out nutrition programme to give our community the support and guidance needed to make healthy lifestyle changes.",
          zh: "我們提供個人營養支援和指導，協助會員及家庭建立健康生活方式。",
          cn: "我们提供个人营养支援和指导，协助会员及家庭建立健康生活方式。",
        },
        {
          en: "We also run regular cooking and food preparation lessons for families.",
          zh: "我們亦定期舉辦烹飪及食物準備課堂。",
          cn: "我们也定期举办烹饪及食物准备课堂。",
        },
      ],
      activities: [
        { en: "Nutrition guidance", zh: "營養指導", cn: "营养指导" },
        { en: "Cooking", zh: "烹飪", cn: "烹饪" },
        { en: "Food preparation", zh: "食物準備", cn: "食物准备" },
      ],
      image: images.nutrition,
      imageAlt: {
        en: "Love 21 members cooking together",
        zh: "Love 21 會員一起烹飪",
        cn: "Love 21 会员一起烹饪",
      },
      action: {
        label: { en: "Get in touch", zh: "聯絡我們", cn: "联系我们" },
        href: { en: "/contact-us/", zh: "/zh/contact-us-hk/", cn: "/cn/contact-us/" },
      },
    },
    {
      id: "family",
      eyebrow: { en: "03 · Family", zh: "03 · 家庭", cn: "03 · 家庭" },
      title: { en: "Support for the whole family.", zh: "支援每一個家庭。", cn: "支援每一个家庭。" },
      paragraphs: [
        {
          en: "Love 21’s focus on family sets us apart. We offer specialty classes for parents and allow parental participation in many sport and healthy lifestyle classes.",
          zh: "Love 21 重視整個家庭，為家長提供專屬課堂、輔導和參與活動的機會。",
          cn: "Love 21 重视整个家庭，为家长提供专属课堂、辅导和参与活动的机会。",
        },
      ],
      activities: [
        { en: "Parent classes", zh: "家長課堂", cn: "家长课堂" },
        { en: "Counselling", zh: "輔導", cn: "辅导" },
        { en: "Shared activities", zh: "共同活動", cn: "共同活动" },
      ],
      image: images.family,
      imageAlt: {
        en: "Families connected through Love 21",
        zh: "透過 Love 21 連繫的家庭",
        cn: "透过 Love 21 连系的家庭",
      },
      action: {
        label: { en: "Get in touch", zh: "聯絡我們", cn: "联系我们" },
        href: { en: "/contact-us/", zh: "/zh/contact-us-hk/", cn: "/cn/contact-us/" },
      },
    },
    {
      id: "csr",
      eyebrow: { en: "04 · CSR", zh: "04 · 企業社會責任", cn: "04 · 企业社会责任" },
      title: { en: "Inclusion grows through connection.", zh: "連繫讓共融成長。", cn: "连系让共融成长。" },
      paragraphs: [
        {
          en: "Our Corporate Social Responsibility Programme helps Hong Kong organisations learn about the community through shared activity and human connection.",
          zh: "企業夥伴透過共同活動了解會員的能力，建立更共融的香港。",
          cn: "企业伙伴通过共同活动了解会员的能力，建立更共融的香港。",
        },
      ],
      activities: [
        { en: "Team activities", zh: "團隊活動", cn: "团队活动" },
        { en: "Shared learning", zh: "共同學習", cn: "共同学习" },
        { en: "Inclusive partnerships", zh: "共融合作", cn: "共融合作" },
      ],
      image: images.csr,
      imageAlt: {
        en: "Love 21 community partners taking part in an activity",
        zh: "Love 21 社群夥伴參與活動",
        cn: "Love 21 社群伙伴参与活动",
      },
      action: {
        label: { en: "Partner with us", zh: "與我們合作", cn: "与我们合作" },
        href: { en: "/contact-us/", zh: "/zh/contact-us-hk/", cn: "/cn/contact-us/" },
      },
    },
  ],
  community: {
    eyebrow: { en: "Get involved", zh: "參與其中", cn: "参与其中" },
    title: {
      en: "Bring your time, energy and ideas.",
      zh: "帶著你的時間、熱誠與想法同行。",
      cn: "带着你的时间、热诚与想法同行。",
    },
    description: {
      en: "Volunteers and community partners help make every Love 21 activity feel possible.",
      zh: "義工與社群夥伴讓每個 Love 21 活動都有更多可能。",
      cn: "义工与社群伙伴让每个 Love 21 活动都有更多可能。",
    },
    volunteerCta: {
      label: { en: "Volunteer with us", zh: "成為義工", cn: "成为义工" },
      href: { en: "/our-volunteer/", zh: "/zh/our-volunteer-hk/", cn: "/cn/our-volunteer/" },
    },
    calendarCta: {
      label: { en: "View volunteer calendar", zh: "查看義工日曆", cn: "查看义工日历" },
      href: { en: "/volunteer/calendar/", zh: "/zh/volunteer-calendar-hk/", cn: "/cn/volunteer/calendar/" },
    },
  },
  donate: {
    eyebrow: { en: "Keep the door open", zh: "讓大門一直敞開", cn: "让大门一直敞开" },
    title: {
      en: "Help keep Love 21 programmes free.",
      zh: "一起讓 Love 21 計劃持續免費。",
      cn: "一起让 Love 21 计划持续免费。",
    },
    description: {
      en: "Your support helps our community move, learn and connect together.",
      zh: "你的支持讓我們的社群可以一起運動、學習和連結。",
      cn: "你的支持让我们的社群可以一起运动、学习和连结。",
    },
    cta: {
      label: { en: "Donate now", zh: "立即捐助", cn: "立即捐助" },
      href: { en: "/donate/", zh: "/zh/donate-hk/", cn: "/cn/donate/" },
    },
  },
};

export function programmeText(value: Localized, locale: Locale): string {
  return value[locale];
}
