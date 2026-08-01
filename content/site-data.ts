export type Locale = "en" | "zh";

export type PageTemplate =
  | "standard"
  | "programmes"
  | "reports"
  | "media-index"
  | "article"
  | "people-index"
  | "person"
  | "volunteer"
  | "contact"
  | "donate"
  | "account"
  | "calendar"
  | "join";

export interface MediaArticle {
  slug: string;
  title: string;
  date: string;
  image?: string;
  excerpt?: string;
  paragraphs: string[];
}

export interface PersonProfile {
  slug: string;
  name: string;
  image: string;
  paragraphs: string[];
}

export interface SitePage {
  path: string;
  locale: Locale;
  alternatePath: string;
  template: PageTemplate;
  title: string;
  description?: string;
  image?: string;
  paragraphs?: string[];
}

export const images = {
  logo: "/assets/images/logo.png",
  hero: "/assets/images/hero.jpg",
  story: "/assets/images/story.jpg",
  sports: "/assets/images/programme-sports.jpeg",
  nutrition: "/assets/images/programme-nutrition.jpeg",
  family: "/assets/images/programme-family.jpg",
  csr: "/assets/images/programme-csr.jpg",
};

export const mediaArticles: MediaArticle[] = [
  {
    slug: "beyond-limits-banquet",
    title: "Tables & Seats Now Open for Beyond Limits Banquet",
    date: "May 11, 2026",
    image: "/assets/images/media-beyond.png",
    excerpt: "We are excited to invite you to Beyond Limits.",
    paragraphs: [
      "We are excited to invite you to the Love 21 Foundation Beyond Limits Banquet, a special evening celebrating our community and the possibilities created through opportunity, inclusion and support.",
      "This development copy reproduces the public article presentation. Event enquiries and bookings should continue through Love 21’s official channels.",
    ],
  },
  {
    slug: "raffle2025-2",
    title: "Love 21 Foundation Charity Raffle 2025",
    date: "November 27, 2025",
    image: "/assets/images/media-raffle.png",
    excerpt: "Support the neurodiverse community, win great prizes and make a difference.",
    paragraphs: [
      "Support the neurodiverse community, win great prizes and make a difference. Proceeds support the growing service needs of Love 21 Foundation and the operation of Love 21 Space.",
    ],
  },
  {
    slug: "【繞場一週】守護特殊兒童對抗疫境",
    title: "【繞場一週】守護特殊兒童對抗疫境",
    date: "May 25, 2022",
    image: "/assets/images/media-loop.png",
    paragraphs: [
      "A media feature highlighting the Love 21 community and the support provided to families during challenging circumstances.",
    ],
  },
  {
    slug: "精靈一點-健康人物專訪-愛·很簡單",
    title: "精靈一點 健康人物專訪- 愛·很簡單",
    date: "December 16, 2021",
    image: "/assets/images/media-radio.png",
    paragraphs: [
      "A radio and media interview introducing Love 21’s work, programmes and community in Hong Kong.",
    ],
  },
  {
    slug: "love-21s-open-secret-to-a-long-happy-life",
    title: "Love 21’s Open Secret to a Long, Happy Life",
    date: "November 9, 2021",
    image: "/assets/images/media-secret.png",
    paragraphs: [
      "A feature on the role of healthy activity, nutrition and community support in helping Love 21 members and families thrive.",
    ],
  },
  {
    slug: "hong-kongs-love-21-foundation-aims",
    title:
      "Hong Kong’s Love 21 Foundation aims to prove those with Down’s syndrome, autism ready for purposeful employment",
    date: "November 8, 2021",
    image: "/assets/images/media-employment.png",
    paragraphs: [
      "A media feature about creating meaningful opportunities and recognising people for their abilities, interests and potential.",
    ],
  },
  {
    slug:
      "hong-kong-yacht-club-and-charity-team-up-to-help-special-needs-teens-learn-dragon-boating",
    title:
      "Hong Kong yacht club and charity team up to help special needs teens learn dragon boating",
    date: "September 30, 2021",
    image: "/assets/images/media-dragonboat.png",
    paragraphs: [
      "A media feature covering an inclusive dragon-boating experience created with the Love 21 community.",
    ],
  },
  {
    slug:
      "hong-kong-charity-offers-free-diet-advice-and-guidance-for-children-with-intellectual-disabilities-in-low-income-families",
    title:
      "Hong Kong charity offers free diet advice and guidance for children with intellectual disabilities in low-income families",
    date: "May 22, 2021",
    image: "/assets/images/programme-nutrition.jpeg",
    paragraphs: [
      "A feature on Love 21’s nutrition support and the practical guidance offered to members and families.",
    ],
  },
];

export const boardMembers: PersonProfile[] = [
  {
    slug: "carol-chan",
    name: "Carol Shun Lai Chan",
    image: "/assets/images/board-carol.png",
    paragraphs: [
      "Carol has a passion for sports and healthy lifestyles, and embraces a mission in developing young people and promoting healthy family functioning. Professionally, Carol is experienced in nonprofit governance as a seasoned administrator serving one of Hong Kong’s leading NGOs supporting children and youth.",
      "With 20 years of netball experience, Carol has been a national player, certified coach and one of Hong Kong’s top umpires. She earned her Master of Philosophy in Psychology from the Chinese University of Hong Kong and a Bachelor of Economics and Finance from the University of Hong Kong.",
    ],
  },
  {
    slug: "elenisymeonidou",
    name: "Eleni Symeonidou",
    image: "/assets/images/board-eleni.jpeg",
    paragraphs: [
      "Originally from Greece, Eleni has lived in Asia since 2013. Her career has been dedicated to developing people, driven by a deep commitment to fostering inclusive communities.",
      "She has over 25 years of volunteer experience in mental health, homelessness and supporting minority groups, and has championed diversity and inclusion initiatives across Mainland China and Hong Kong.",
    ],
  },
  {
    slug: "jeff-sayed",
    name: "Jeff Sayed",
    image: "/assets/images/board-jeff.jpg",
    paragraphs: [
      "Jeff has lived in Hong Kong since 2005. He works in financial services and has held senior roles across risk, operations and technology.",
      "Jeff enjoys exercise and in particular cycles, runs and swims. He earned a Master of Business Administration from Kellogg School of Management and the Hong Kong University of Science & Technology.",
    ],
  },
  {
    slug: "matthew-hosford",
    name: "Matthew Hosford",
    image: "/assets/images/board-matthew.jpg",
    paragraphs: [
      "Matthew has lived in Hong Kong with his family for more than two decades and has built a career in financial services across Asia. His passion for Love 21 is to give to a group that is often overlooked but offers so much.",
    ],
  },
  {
    slug: "kevin-wong",
    name: "Kevin Wong",
    image: "/assets/images/board-carol.png",
    paragraphs: [
      "As treasurer on the Love 21 board, Kevin brings his accounting and finance experience to support the continual and sustained growth of Love 21.",
    ],
  },
  {
    slug: "young-sook-stewart",
    name: "Young-Sook Stewart",
    image: "/assets/images/board-young-sook.jpeg",
    paragraphs: [
      "Young-Sook is an Asia-Pacific talent leader whose value-centred approach emphasises sustainable practices, diversity, equity, inclusion, wellbeing and social equity.",
      "Her experience in organisational development and coaching aligns with her passion for nurturing future leaders and uplifting social equity.",
    ],
  },
  {
    slug: "lobo-cheung",
    name: "Lobo Cheung",
    image: "/assets/images/board-lobo.jpeg",
    paragraphs: [
      "Lobo grew up in Hong Kong and built a career in the technology sector. He has always felt a calling towards building a better future for the Down syndrome and autistic community.",
    ],
  },
  {
    slug: "dan-maley",
    name: "Dan Maley",
    image: "/assets/images/board-dan.jpg",
    paragraphs: [
      "Dan has resided in Hong Kong since 2019. He began volunteering at Love 21 Foundation in 2020, initially attending fitness classes and eventually helping teach a weekly boxing class.",
      "He is an active fundraiser and works in the financial sector in Asia-Pacific.",
    ],
  },
  {
    slug: "edith-chen",
    name: "Edith Chen",
    image: "/assets/images/board-edith.jpeg",
    paragraphs: [
      "Edith brings over 27 years of executive expertise in business transformation, multi-market expansion, brand development and governance across the Asia-Pacific region.",
      "As a non-profit leader, she actively champions social impact and uses her corporate experience to support organisational resilience.",
    ],
  },
  {
    slug: "james-barrett",
    name: "James Barrett",
    image: "/assets/images/board-james.jpeg",
    paragraphs: [
      "Originally from Australia, James has lived in Hong Kong since 2008. His commitment to the neurodiverse community is deeply personal and his family’s involvement dates back to 1953.",
      "Professionally, James is a data scientist focusing on financial data.",
    ],
  },
  {
    slug: "raymond-tam",
    name: "Raymond Tam",
    image: "/assets/images/board-raymond.jpeg",
    paragraphs: [
      "Raymond is a seasoned financial executive with nearly 30 years of leadership experience in digital wealth, pensions and asset management.",
      "Passionate about community impact, he actively mentors university students and is committed to advancing inclusion through Love 21’s work.",
    ],
  },
  {
    slug: "dr-ruby-ng",
    name: "Dr. Ruby Ng",
    image: "/assets/images/story.jpg",
    paragraphs: [
      "Dr. Ruby Ng is a Biofeedback Specialist at Stanford Medicine Children’s Health. Throughout her career, she has been dedicated to improving the physical and emotional wellbeing of children and families through compassionate, patient-centred care.",
      "Born and raised in Hong Kong, she is passionate about inclusion, lifelong learning, health, wellness and education.",
    ],
  },
];

const enPages: SitePage[] = [
  {
    path: "/our-story/",
    locale: "en",
    alternatePath: "/zh/our-story-hk/",
    template: "standard",
    title: "OUR STORY",
    image: images.story,
    paragraphs: [
      "LOVE 21 is a charity dedicated to empowering the Down syndrome and autistic community in Hong Kong through sport, nutrition, and holistic support programmes.",
      "Since the launch of our comprehensive nutrition programme in 2021, we’ve provided one-on-one nutritional support on top of the sports classes that we’ve offered. We’ve also expanded into providing counselling support for the parents of our community.",
    ],
  },
  {
    path: "/our-finance/",
    locale: "en",
    alternatePath: "/zh/our-finance-hk/",
    template: "reports",
    title: "OUR REPORTS",
    paragraphs: [
      "Love 21 Foundation is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong.",
      "It is our goal to provide the greatest support for the Down syndrome and autistic community through sport and nutrition programmes.",
      "We also strive to be as financially responsible and transparent as possible.",
    ],
  },
  {
    path: "/our-volunteer/",
    locale: "en",
    alternatePath: "/zh/our-volunteer-hk/",
    template: "volunteer",
    title: "OUR VOLUNTEERS",
    image: images.story,
    paragraphs: [
      "Love 21 Foundation is extremely grateful for our loving and dedicated team of volunteers!",
    ],
  },
  {
    path: "/media/",
    locale: "en",
    alternatePath: "/zh/media-hk/",
    template: "media-index",
    title: "MEDIA",
  },
  {
    path: "/join-us/",
    locale: "en",
    alternatePath: "/zh/join-us-hk/",
    template: "join",
    title: "INTERNSHIP OPPORTUNITIES",
  },
  {
    path: "/board-of-directors/",
    locale: "en",
    alternatePath: "/zh/board-of-directors-hk/",
    template: "people-index",
    title: "BOARD OF DIRECTORS",
    paragraphs: [
      "Our Board of Directors is comprised of caring individuals from diverse professional backgrounds in Hong Kong, who bring their talents and passion to support and strengthen Love 21.",
    ],
  },
  {
    path: "/staff/",
    locale: "en",
    alternatePath: "/zh/staff-hk/",
    template: "standard",
    title: "STAFF",
    image: "/assets/images/staff-leadership.jpg",
    paragraphs: [
      "Love 21 Foundation is a registered charity under Section 88 of the Inland Revenue Ordinance in Hong Kong. It is our goal to provide the greatest support for the Down syndrome and autistic community through sport, nutrition and holistic programmes.",
    ],
  },
  {
    path: "/our-programmes/",
    locale: "en",
    alternatePath: "/zh/our-programmes-hk/",
    template: "programmes",
    title: "OUR PROGRAMMES",
  },
  {
    path: "/events",
    locale: "en",
    alternatePath: "/zh/events-hk/",
    template: "calendar",
    title: "OUR CALENDAR",
  },
  {
    path: "/contact-us/",
    locale: "en",
    alternatePath: "/zh/contact-us-hk/",
    template: "contact",
    title: "CONTACT US",
  },
  {
    path: "/donate/",
    locale: "en",
    alternatePath: "/zh/donate-hk/",
    template: "donate",
    title: "DONATE",
  },
  {
    path: "/login/",
    locale: "en",
    alternatePath: "/zh/login-hk/",
    template: "account",
    title: "LOGIN / SIGN UP",
  },
  {
    path: "/signup/",
    locale: "en",
    alternatePath: "/zh/signup-hk/",
    template: "account",
    title: "CREATE ACCOUNT",
  },
  {
    path: "/password-reset/",
    locale: "en",
    alternatePath: "/zh/login-hk/",
    template: "account",
    title: "RESET YOUR PASSWORD",
  },
  {
    path: "/leadership/",
    locale: "en",
    alternatePath: "/zh/管理層與員工/",
    template: "people-index",
    title: "LEADERSHIP & STAFF",
    paragraphs: [
      "Our Board of Directors is comprised of caring individuals from diverse professional backgrounds in Hong Kong, who bring their talents and passion to support and strengthen Love 21.",
    ],
  },
  {
    path: "/stories/",
    locale: "en",
    alternatePath: "/zh/會員故事/",
    template: "media-index",
    title: "MEMBER STORIES",
  },
  {
    path: "/volunteer/",
    locale: "en",
    alternatePath: "/zh/義工機會/",
    template: "volunteer",
    title: "VOLUNTEER OPPORTUNITIES",
    image: images.story,
    paragraphs: [
      "Love 21 Foundation is extremely grateful for our loving and dedicated team of volunteers!",
    ],
  },
  {
    path: "/volunteer/calendar/",
    locale: "en",
    alternatePath: "/zh/義工日曆/",
    template: "calendar",
    title: "VOLUNTEER CALENDAR",
  },
  {
    path: "/corporate/",
    locale: "en",
    alternatePath: "/zh/企業夥伴/",
    template: "standard",
    title: "CORPORATE PARTNERSHIPS",
    paragraphs: [
      "Our Corporate Social Responsibility Programme helps Hong Kong organisations learn about the community through shared activity and human connection.",
      "If you’d like to learn more, please contact our Founder/CEO at jeff@love21foundation.com.",
    ],
  },
];

const zhPages: SitePage[] = [
  {
    path: "/zh/our-story-hk/",
    locale: "zh",
    alternatePath: "/our-story/",
    template: "standard",
    title: "關於我們",
    image: images.story,
    paragraphs: [
      "Love 21旨在通過運動、營養及其他全面活動，令唐氏綜合症和自閉症人士得到充分發揮潛力的機會。",
      "我們是在香港的一間慈善機構，希望透過不同活動改善會員及其家庭的生活。",
    ],
  },
  {
    path: "/zh/our-finance-hk/",
    locale: "zh",
    alternatePath: "/our-finance/",
    template: "reports",
    title: "我們的報告",
    paragraphs: [
      "Love 21 Foundation是香港《稅務條例》第88條下的註冊慈善機構。",
      "我們致力以負責任和透明的方式，支援唐氏綜合症、自閉症及神經多樣性社群。",
    ],
  },
  {
    path: "/zh/our-volunteer-hk/",
    locale: "zh",
    alternatePath: "/our-volunteer/",
    template: "volunteer",
    title: "我們的義工團隊",
    image: images.story,
    paragraphs: ["Love 21衷心感謝每一位充滿愛心和熱誠的義工！"],
  },
  {
    path: "/zh/media-hk/",
    locale: "zh",
    alternatePath: "/media/",
    template: "media-index",
    title: "媒體報導",
  },
  {
    path: "/zh/join-us-hk/",
    locale: "zh",
    alternatePath: "/join-us/",
    template: "join",
    title: "實習機會",
  },
  {
    path: "/zh/board-of-directors-hk/",
    locale: "zh",
    alternatePath: "/board-of-directors/",
    template: "people-index",
    title: "我們的董事",
    paragraphs: [
      "董事會成員來自香港不同專業背景，以各自的才能和熱誠支持Love 21的發展。",
    ],
  },
  {
    path: "/zh/staff-hk/",
    locale: "zh",
    alternatePath: "/staff/",
    template: "standard",
    title: "工作人員",
    image: "/assets/images/staff-leadership.jpg",
    paragraphs: [
      "Love 21的工作人員透過運動、營養及全面支援計劃，為會員和家庭提供服務。",
    ],
  },
  {
    path: "/zh/our-programmes-hk/",
    locale: "zh",
    alternatePath: "/our-programmes/",
    template: "programmes",
    title: "我們的計劃",
  },
  {
    path: "/zh/contact-us-hk/",
    locale: "zh",
    alternatePath: "/contact-us/",
    template: "contact",
    title: "聯絡我們",
  },
  {
    path: "/zh/donate-hk/",
    locale: "zh",
    alternatePath: "/donate/",
    template: "donate",
    title: "捐贈",
  },
  {
    path: "/zh/login-hk/",
    locale: "zh",
    alternatePath: "/login/",
    template: "account",
    title: "登入 / 註冊",
  },
  {
    path: "/zh/signup-hk/",
    locale: "zh",
    alternatePath: "/signup/",
    template: "account",
    title: "建立帳戶",
  },
  {
    path: "/zh/events-hk/",
    locale: "zh",
    alternatePath: "/events",
    template: "calendar",
    title: "活動時間表",
  },
  {
    path: "/zh/raffle2025/",
    locale: "zh",
    alternatePath: "/raffle2025-2/",
    template: "article",
    title: "Love 21 Foundation 慈善獎券 2025",
    image: "/assets/images/media-raffle.png",
    paragraphs: [
      "支援神經多樣性社群同時贏取豐富獎品。善款將支持Love 21中心的營運及各項活動和服務。",
    ],
  },
  {
    path: "/zh/leadership-hk/",
    locale: "zh",
    alternatePath: "/leadership/",
    template: "people-index",
    title: "管理層與員工",
    paragraphs: [
      "董事會成員來自香港不同專業背景，以各自的才能和熱誠支持Love 21的發展。",
    ],
  },
  {
    path: "/zh/stories-hk/",
    locale: "zh",
    alternatePath: "/stories/",
    template: "media-index",
    title: "會員故事",
  },
  {
    path: "/zh/volunteer-hk/",
    locale: "zh",
    alternatePath: "/volunteer/",
    template: "volunteer",
    title: "義工機會",
    image: images.story,
    paragraphs: ["Love 21衷心感謝每一位充滿愛心和熱誠的義工！"],
  },
  {
    path: "/zh/volunteer-calendar-hk/",
    locale: "zh",
    alternatePath: "/volunteer/calendar/",
    template: "calendar",
    title: "義工日曆",
  },
  {
    path: "/zh/corporate-hk/",
    locale: "zh",
    alternatePath: "/corporate/",
    template: "standard",
    title: "企業夥伴",
    paragraphs: [
      "我們的企業社會責任計劃透過共同活動和人與人之間的聯繫，讓香港企業認識我們的社群。",
      "如欲了解更多，歡迎聯絡我們的創辦人及行政總監：jeff@love21foundation.com。",
    ],
  },
];

export const pages = [...enPages, ...zhPages];

export const alternatePaths: Record<string, string> = Object.fromEntries(
  pages.map((page) => [page.path, page.alternatePath]),
);

export function normalizePath(path: string) {
  if (path === "/") return "/";
  const normalized = `/${path.replace(/^\/|\/$/g, "")}/`;
  return normalized === "/events/" ? "/events" : normalized;
}

export function getPage(path: string): SitePage | undefined {
  const normalized = normalizePath(path);
  const fixed = pages.find((page) => page.path === normalized);
  if (fixed) return fixed;

  const boardPrefix = "/board-of-directors/";
  if (normalized.startsWith(boardPrefix) && normalized !== boardPrefix) {
    const slug = normalized.slice(boardPrefix.length, -1);
    const member = boardMembers.find((item) => item.slug === slug);
    if (member) {
      return {
        path: normalized,
        locale: "en",
        alternatePath: "/zh/board-of-directors-hk/",
        template: "person",
        title: member.name,
        image: member.image,
        paragraphs: member.paragraphs,
      };
    }
  }

  const article = mediaArticles.find(
    (item) => normalizePath(`/${item.slug}/`) === normalized,
  );
  if (article) {
    return {
      path: normalized,
      locale: "en",
      alternatePath: "/zh/media-hk/",
      template: "article",
      title: article.title,
      image: article.image,
      paragraphs: article.paragraphs,
      description: article.date,
    };
  }

  return undefined;
}

export function getAllStaticPaths() {
  const fixed = pages.map((page) => page.path);
  const people = boardMembers.map((member) => `/board-of-directors/${member.slug}/`);
  const articles = mediaArticles.map((article) => `/${article.slug}/`);
  return [...new Set([...fixed, ...people, ...articles])]
    .filter((path) => path !== "/")
    .map((path) => ({ slug: path.replace(/^\/|\/$/g, "").split("/") }));
}
