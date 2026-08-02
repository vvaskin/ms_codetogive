"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { SignOutButton } from "@/components/SignOutButton";
import {
  AccessibilityMenu,
  useAccessibilityPrefs,
} from "@/components/SiteTools";
import toolsStyles from "@/components/SiteTools.module.css";
import { recordDonation } from "@/app/actions/donations";
import { registerForEvent } from "@/app/actions/registrations";
import { submitVolunteerApplication } from "@/app/actions/volunteer-applications";
import {
  buildDonorCertificateHtml,
  generateDonorCertId,
} from "@/lib/donor-certificate";
import {
  formatDayMonthYearAt,
  formatEventTime,
  formatWeekdayDayMonthAt,
} from "@/lib/format-date";
import {
  formatCurrency,
  frequencies,
  type Frequency,
} from "@/lib/portal/mock-data";
import type {
  ContributorPortalData,
  PortalEventCard,
} from "@/lib/portal/contributor-data";
import type { ParticipationStatus } from "@/lib/supabase/types";
import { DonorCertificateButton } from "./DonorCertificateButton";
import { VolunteerCertificateButton } from "./VolunteerCertificateButton";
import styles from "./ContributorPortalExperience.module.css";

type Locale = "en" | "zh" | "cn";

const STRINGS: Record<string, { en: string; zh: string; cn: string }> = {
  portalLabel: { en: "Contributor Portal", zh: "貢獻者平台", cn: "贡献者平台" },
  goToWebsite: { en: "Go to website", zh: "前往主網站", cn: "前往主网站" },
  logOut: { en: "Log out", zh: "登出", cn: "登出" },
  loggingOut: { en: "Logging out…", zh: "登出中…", cn: "登出中…" },
  notifications: { en: "Notifications", zh: "通知", cn: "通知" },
  siteTools: { en: "Site tools", zh: "網站工具", cn: "网站工具" },
  navMyPortal: { en: "My Portal", zh: "我的主頁", cn: "我的主页" },
  navMyDonations: { en: "My Donations", zh: "我的捐款", cn: "我的捐款" },
  navMyVolunteer: { en: "My Volunteer", zh: "我的義工", cn: "我的义工" },
  navEvents: { en: "Events", zh: "活動", cn: "活动" },
  navDonate: { en: "Donate", zh: "捐款", cn: "捐款" },
  thankYouPill: { en: "Thank you for showing up", zh: "感謝你的參與", cn: "感谢你的参与" },
  welcomeBack: { en: "Welcome back, {name}.", zh: "歡迎回來，{name}。", cn: "欢迎回来，{name}。" },
  welcomeSub: {
    en: "Because of people like you, more families get to show the world #somuchability. Seriously - thank you.",
    zh: "因為有你這樣的人，更多家庭得以向世界展現 #somuchability。衷心感謝你。",
    cn: "因为有你这样的人，更多家庭得以向世界展现 #somuchability。衷心感谢你。",
  },
  joiningOne: { en: "event you're joining", zh: "個你正在參與的活動", cn: "个你正在参与的活动" },
  joiningMany: { en: "events you're joining", zh: "個你正在參與的活動", cn: "个你正在参与的活动" },
  whatsOn: { en: "What's On", zh: "最新動態", cn: "最新动态" },
  seeAllEvents: { en: "See all events →", zh: "查看全部活動 →", cn: "查看全部活动 →" },
  upcomingEvents: { en: "Upcoming events.", zh: "即將舉行的活動。", cn: "即将举行的活动。" },
  noUpcomingEvents: { en: "No upcoming events yet", zh: "暫無即將舉行的活動", cn: "暂无即将举行的活动" },
  noUpcomingSub: {
    en: "New sport, nutrition and family activities go up every week.",
    zh: "每週都會新增體育、營養及家庭活動。",
    cn: "每周都会新增体育、营养及家庭活动。",
  },
  donorDashboard: { en: "Donor Dashboard", zh: "捐款者概覽", cn: "捐赠者概览" },
  myDonationsTitle: { en: "My Donations.", zh: "我的捐款。", cn: "我的捐款。" },
  myDonationsSub: {
    en: "See your giving history, your impact, and how your money is put to work.",
    zh: "查看你的捐款紀錄、影響力，以及你的捐款如何被運用。",
    cn: "查看你的捐款记录、影响力，以及你的捐款如何被运用。",
  },
  yourImpact: { en: "Your Impact", zh: "你的影響", cn: "你的影响" },
  impactTitle: { en: "What your generosity has made possible.", zh: "你的慷慨所帶來的一切。", cn: "你的慷慨所带来的一切。" },
  statTotalDonated: { en: "total donated", zh: "累計捐款", cn: "累计捐款" },
  statDonationsMade: { en: "donations made", zh: "捐款次數", cn: "捐款次数" },
  statActiveRecurring: { en: "active recurring plans", zh: "進行中的定期捐款", cn: "进行中的定期捐款" },
  statMonthlyCommitment: { en: "monthly commitment", zh: "每月捐款", cn: "每月捐款" },
  givingHistory: { en: "Giving History", zh: "捐款紀錄", cn: "捐款记录" },
  givingHistoryTitle: { en: "Your giving over the last 6 months.", zh: "你過去 6 個月的捐款。", cn: "你过去 6 个月的捐款。" },
  noDonationsYet: {
    en: "No donations yet - your giving will appear here once you make your first gift.",
    zh: "暫無捐款——作出首次捐款後，你的紀錄會顯示在這裡。",
    cn: "暂无捐款——作出首次捐款后，你的记录会显示在这里。",
  },
  monthlyGiving: { en: "Monthly giving", zh: "每月捐款", cn: "每月捐款" },
  monthlyGivingSub: { en: "Completed gifts per month", zh: "每個月的已完成捐款", cn: "每个月的已完成捐款" },
  recentDonations: { en: "Recent donations", zh: "最近捐款", cn: "最近捐款" },
  recentDonationsSub: { en: "Your latest gifts", zh: "你最近的捐款", cn: "你最近的捐款" },
  nothingHereYet: { en: "Nothing here yet.", zh: "暫無紀錄。", cn: "暂无记录。" },
  recurringTag: { en: "Recurring", zh: "定期", cn: "定期" },
  oneTimeTag: { en: "One-time", zh: "單次", cn: "单次" },
  donorBadges: { en: "Donor Badges", zh: "捐款者徽章", cn: "捐赠者徽章" },
  badgesEarnedCount: { en: "{earned} of {total} earned", zh: "已獲得 {earned}/{total}", cn: "已获得 {earned}/{total}" },
  badgesTitle: { en: "Celebrating your generosity.", zh: "表揚你的慷慨。", cn: "表扬你的慷慨。" },
  earnedTag: { en: "Earned", zh: "已獲得", cn: "已获得" },
  badgeFirstGive: { en: "First Give", zh: "首次捐款", cn: "首次捐款" },
  badgeFirstGiveDesc: { en: "Made your first donation", zh: "作出首次捐款", cn: "作出首次捐款" },
  badgeRegular: { en: "Regular", zh: "定期支持者", cn: "定期支持者" },
  badgeRegularDesc: { en: "Donated in 3 different months", zh: "在 3 個不同月份捐款", cn: "在 3 个不同月份捐款" },
  badgeSupporter: { en: "Supporter", zh: "支持者", cn: "支持者" },
  badgeSupporterDesc: { en: "Total giving reaches HK$500", zh: "累計捐款達 HK$500", cn: "累计捐款达 HK$500" },
  badgeChampion: { en: "Champion", zh: "冠軍", cn: "冠军" },
  badgeChampionDesc: { en: "One gift of HK$1,000 or more", zh: "單筆捐款 HK$1,000 或以上", cn: "单笔捐款 HK$1,000 或以上" },
  badgePatron: { en: "Patron", zh: "贊助人", cn: "赞助人" },
  badgePatronDesc: { en: "Total giving exceeds HK$5,000", zh: "累計捐款超過 HK$5,000", cn: "累计捐款超过 HK$5,000" },
  badgeYearOne: { en: "Year One", zh: "週年之友", cn: "周年之友" },
  badgeYearOneDesc: { en: "Donated in 6 different months", zh: "在 6 個不同月份捐款", cn: "在 6 个不同月份捐款" },
  approvedTitle: { en: "You're an approved volunteer!", zh: "你已成為獲批義工！", cn: "你已成为获批义工！" },
  submittedTitle: { en: "Application submitted!", zh: "申請已提交！", cn: "申请已提交！" },
  statusSubmitted: {
    en: "Your application has been submitted. Our team will review it and reach out within 5 business days.",
    zh: "你的申請已提交。我們的團隊會在 5 個工作天內審核並聯絡你。",
    cn: "你的申请已提交。我们的团队会在 5 个工作天内审核并联系你。",
  },
  statusUnderReview: {
    en: "Your application is being reviewed by our team. We'll reach out once it's approved.",
    zh: "你的申請正在審核中。獲批後我們會與你聯絡。",
    cn: "你的申请正在审核中。获批后我们会与你联系。",
  },
  statusApproved: {
    en: "You're an approved volunteer. Volunteer events are now unlocked for you.",
    zh: "你已成為獲批義工，義工活動現已開放予你。",
    cn: "你已成为获批义工，义工活动现已开放予你。",
  },
  statusFallback: { en: "We've received your application.", zh: "我們已收到你的申請。", cn: "我们已收到你的申请。" },
  submittedOn: { en: "Submitted {date}", zh: "提交日期：{date}", cn: "提交日期：{date}" },
  browseEvents: { en: "Browse events", zh: "瀏覽活動", cn: "浏览活动" },
  willNotify: {
    en: "You'll be notified when a staff member reviews your application.",
    zh: "工作人員審核你的申請後，你便會收到通知。",
    cn: "工作人员审核你的申请后，你便会收到通知。",
  },
  getInvolved: { en: "Get Involved", zh: "參與其中", cn: "参与其中" },
  becomeVolunteerTitle: { en: "Become a Volunteer.", zh: "成為義工。", cn: "成为义工。" },
  becomeVolunteerSub: {
    en: "Join our community and make a real difference for local families.",
    zh: "加入我們的社區，為本地家庭帶來真正的改變。",
    cn: "加入我们的社区，为本地家庭带来真正的改变。",
  },
  rejectedBanner: { en: "Your previous application wasn't approved.", zh: "你之前的申請未獲批准。", cn: "你之前的申请未获批准。" },
  chineseName: { en: "Chinese name", zh: "中文姓名", cn: "中文姓名" },
  optionalChineseName: { en: "(optional - 中文姓名)", zh: "（選填 - 中文姓名）", cn: "（选填 - 中文姓名）" },
  ageGroup: { en: "Age group", zh: "年齡組別", cn: "年龄组别" },
  age1415: { en: "14-15 yrs", zh: "14-15 歲", cn: "14-15 岁" },
  age1617: { en: "16-17 yrs", zh: "16-17 歲", cn: "16-17 岁" },
  age18: { en: "18 or above", zh: "18 歲或以上", cn: "18 岁或以上" },
  gender: { en: "Gender", zh: "性別", cn: "性别" },
  genderFemale: { en: "Female", zh: "女性", cn: "女性" },
  genderMale: { en: "Male", zh: "男性", cn: "男性" },
  genderPreferNot: { en: "Prefer not to say", zh: "不便透露", cn: "不便透露" },
  aboutYou: { en: "About you", zh: "關於你", cn: "关于你" },
  aboutHint: {
    en: "Tell us about your skills or why you want to volunteer...",
    zh: "告訴我們你的技能，或你為何想成為義工……",
    cn: "告诉我们你的技能，或你为何想成为义工……",
  },
  aboutPlaceholder: {
    en: "I'm passionate about community sport and want to use my background in coaching to help young athletes build confidence...",
    zh: "我熱愛社區體育，希望以我的教練背景協助年輕運動員建立自信……",
    cn: "我热爱社区体育，希望以我的教练背景协助年轻运动员建立自信……",
  },
  hearAbout: { en: "How did you hear about us?", zh: "你如何認識我們？", cn: "你如何认识我们？" },
  hearExisting: { en: "Existing Love 21 volunteer", zh: "現有 Love 21 義工", cn: "现有 Love 21 义工" },
  hearSocial: { en: "Love 21 social media", zh: "Love 21 社交媒體", cn: "Love 21 社交媒体" },
  hearEmail: { en: "Love 21 email newsletter", zh: "Love 21 電子通訊", cn: "Love 21 电子通讯" },
  hearCompany: { en: "Company referral", zh: "公司轉介", cn: "公司转介" },
  hearOther: { en: "Other", zh: "其他", cn: "其他" },
  scrcLabel: { en: "SCRC certificate (Working with Children Check)", zh: "SCRC 證書（與兒童工作查核）", cn: "SCRC 证书（与儿童工作查核）" },
  scrcHint: {
    en: "Upload a clear scan or photo of your SCRC certificate (PDF, JPG or PNG).",
    zh: "上載 SCRC 證書的清晰掃描或照片（PDF、JPG 或 PNG）。",
    cn: "上传 SCRC 证书的清晰扫描或照片（PDF、JPG 或 PNG）。",
  },
  consentLabel: { en: "Parental / guardian consent form", zh: "家長／監護人同意書", cn: "家长／监护人同意书" },
  consentHint: {
    en: "Upload a signed consent form from your parent or guardian (PDF, JPG or PNG).",
    zh: "上載由家長或監護人簽署的同意書（PDF、JPG 或 PNG）。",
    cn: "上传由家长或监护人签署的同意书（PDF、JPG 或 PNG）。",
  },
  requiredToSubmit: { en: "Required to submit your application.", zh: "提交申請必須提供。", cn: "提交申请必须提供。" },
  submitApplication: { en: "Submit application", zh: "提交申請", cn: "提交申请" },
  submitting: { en: "Submitting…", zh: "提交中…", cn: "提交中…" },
  errorGeneric: { en: "Something went wrong. Please try again.", zh: "發生錯誤，請再試一次。", cn: "发生错误，请再试一次。" },
  eventsLockedTitle: { en: "Events are locked for now.", zh: "活動暫未開放。", cn: "活动暂未开放。" },
  eventsLockedSub: {
    en: "Volunteer events unlock once a staff member approves your volunteer application.",
    zh: "義工活動會在你獲批義工申請後開放。",
    cn: "义工活动会在你获批义工申请后开放。",
  },
  lockedSubmitted: {
    en: "Your volunteer application is under review. Once a staff member approves it, upcoming events will unlock here.",
    zh: "你的義工申請正在審核。獲批後，即將舉行的活動便會在這裡開放。",
    cn: "你的义工申请正在审核。获批后，即将举行的活动便会在这里开放。",
  },
  lockedRejected: {
    en: "Your volunteer application wasn't approved, so volunteer event sign-ups are locked.",
    zh: "你的義工申請未獲批准，因此義工活動報名暫未開放。",
    cn: "你的义工申请未获批准，因此义工活动报名暂未开放。",
  },
  lockedWithdrawn: {
    en: "You withdrew your volunteer application, so volunteer event sign-ups are locked.",
    zh: "你已撤回義工申請，因此義工活動報名暫未開放。",
    cn: "你已撤回义工申请，因此义工活动报名暂未开放。",
  },
  viewMyApplication: { en: "View my application", zh: "查看我的申請", cn: "查看我的申请" },
  upcomingEventsTitle: { en: "Upcoming Events", zh: "即將舉行的活動", cn: "即将举行的活动" },
  upcomingEventsSub: {
    en: "Find a session that fits your schedule and register your spot.",
    zh: "找出配合你時間的活動並報名留位。",
    cn: "找出配合你时间的活动并报名留位。",
  },
  searchPlaceholder: { en: "Search by event name...", zh: "按活動名稱搜尋……", cn: "按活动名称搜索……" },
  allProgrammes: { en: "All programmes", zh: "全部計劃", cn: "全部计划" },
  tagSport: { en: "Sport", zh: "體育", cn: "体育" },
  tagNutrition: { en: "Nutrition", zh: "營養", cn: "营养" },
  tagFamilySupport: { en: "Family Support", zh: "家庭支援", cn: "家庭支援" },
  tagCommunity: { en: "Community", zh: "社區", cn: "社区" },
  clearFilters: { en: "Clear", zh: "清除", cn: "清除" },
  eventsAvailable: { en: "{count} events available", zh: "共有 {count} 個活動", cn: "共有 {count} 个活动" },
  eventsShown: { en: "{shown} of {total} events", zh: "顯示 {shown}/{total} 個活動", cn: "显示 {shown}/{total} 个活动" },
  noMatch: { en: "No events match your search", zh: "沒有符合搜尋條件的活動", cn: "没有符合搜索条件的活动" },
  noMatchSub: { en: "Try adjusting your filters", zh: "試試調整篩選條件", cn: "试试调整筛选条件" },
  registerForEvent: { en: "Register for this event", zh: "報名參加此活動", cn: "报名参加此活动" },
  registering: { en: "Registering…", zh: "報名中…", cn: "报名中…" },
  registerError: { en: "Could not register. Please try again.", zh: "報名失敗，請再試一次。", cn: "报名失败，请再试一次。" },
  myEventsEyebrow: { en: "My Events", zh: "我的活動", cn: "我的活动" },
  myEventsTitle: { en: "Events you're part of.", zh: "你參與的活動。", cn: "你参与的活动。" },
  statusRegistered: { en: "Registered", zh: "已報名", cn: "已报名" },
  statusAttended: { en: "Attended", zh: "已出席", cn: "已出席" },
  statusPending: { en: "Pending review", zh: "待審核", cn: "待审核" },
  statusCancelled: { en: "Cancelled", zh: "已取消", cn: "已取消" },
  statusNoShow: { en: "No-show", zh: "缺席", cn: "缺席" },
  statusNotApproved: { en: "Not approved", zh: "未獲批准", cn: "未获批准" },
  giveBack: { en: "Give Back", zh: "回饋社會", cn: "回馈社会" },
  donationMattersTitle: { en: "Your donation matters.", zh: "你的捐款舉足輕重。", cn: "你的捐款举足轻重。" },
  donationMattersSub: {
    en: "Every dollar goes directly to programmes supporting children and families in our community.",
    zh: "每分捐款都直接投入支援我們社區兒童與家庭的計劃。",
    cn: "每分捐款都直接投入支援我们社区儿童与家庭的计划。",
  },
  oneTimeTab: { en: "One-time", zh: "單次捐款", cn: "单次捐款" },
  recurringTab: { en: "Recurring", zh: "定期捐款", cn: "定期捐款" },
  chooseImpact: { en: "Choose your impact", zh: "選擇你的影響", cn: "选择你的影响" },
  tierHero: { en: "Hero", zh: "英雄", cn: "英雄" },
  tierHeroDesc: { en: "Sponsors a full volunteer shift for one programme", zh: "資助一個計劃的完整義工班次", cn: "资助一个计划的完整义工班次" },
  tierPatron: { en: "Patron", zh: "贊助人", cn: "赞助人" },
  tierPatronDesc: { en: "Covers a week of family support for one household", zh: "資助一個家庭一星期的家庭支援", cn: "资助一个家庭一星期的家庭支援" },
  tierGuardian: { en: "Guardian", zh: "守護者", cn: "守护者" },
  tierGuardianDesc: { en: "Funds a full programme day for a group of families", zh: "資助一群家庭一整天的計劃活動", cn: "资助一群家庭一整天的计划活动" },
  customAmount: { en: "Custom amount", zh: "自訂金額", cn: "自订金额" },
  customAmountDesc: { en: "You choose the amount", zh: "金額由你決定", cn: "金额由你决定" },
  enterAmount: { en: "Enter an amount", zh: "輸入金額", cn: "输入金额" },
  customAmountAria: { en: "Custom amount in HKD", zh: "自訂港幣金額", cn: "自订港币金额" },
  frequencyLabel: { en: "Frequency", zh: "捐款頻率", cn: "捐款频率" },
  freqMonthly: { en: "Monthly", zh: "每月", cn: "每月" },
  freqQuarterly: { en: "Quarterly", zh: "每季", cn: "每季" },
  freqYearly: { en: "Yearly", zh: "每年", cn: "每年" },
  yourGift: { en: "Your gift", zh: "你的捐款", cn: "你的捐款" },
  recurringDonation: { en: "Recurring donation", zh: "定期捐款", cn: "定期捐款" },
  donationAmount: { en: "Donation amount", zh: "捐款金額", cn: "捐款金额" },
  processingFee: { en: "Processing fee", zh: "處理費", cn: "处理费" },
  donateNow: { en: "Donate {amount}", zh: "捐款 {amount}", cn: "捐款 {amount}" },
  recording: { en: "Recording…", zh: "處理中…", cn: "处理中…" },
  securePayment: { en: "Secure payment - receipt emailed automatically", zh: "安全付款——收據會自動電郵給您", cn: "安全付款——收据会自动电邮给您" },
  thankYouTitle: { en: "Thank you, {name}!", zh: "多謝你，{name}！", cn: "多谢你，{name}！" },
  confirmationBody: {
    en: "Your {kind} donation of {amount} is making a real difference for families in our community.",
    zh: "你的{kind}捐款 {amount} 正在為我們社區的家庭帶來真正的改變。",
    cn: "你的{kind}捐款 {amount} 正在为我们社区的家庭带来真正的改变。",
  },
  kindRecurring: { en: "recurring", zh: "定期", cn: "定期" },
  kindOneTime: { en: "one-time", zh: "單次", cn: "单次" },
  demoNote: { en: "This is a demo - no payment has been taken.", zh: "這是示範——未收取任何款項。", cn: "这是示范——未收取任何款项。" },
  downloadCertificate: { en: "Download certificate", zh: "下載證書", cn: "下载证书" },
  donateAgain: { en: "Donate again", zh: "再次捐款", cn: "再次捐款" },
  backToPortal: { en: "Back to portal", zh: "返回主頁", cn: "返回主页" },
  friend: { en: "friend", zh: "朋友", cn: "朋友" },
  roleContributor: { en: "Contributor", zh: "貢獻者", cn: "贡献者" },
  badgeContributor: { en: "Contributor", zh: "貢獻者", cn: "贡献者" },
  badgeApprovedVolunteer: { en: "Approved volunteer", zh: "獲批義工", cn: "获批义工" },
  badgeDonor: { en: "Donor", zh: "捐款者", cn: "捐赠者" },
  statHoursGiven: { en: "Hours given", zh: "義工時數", cn: "义工时数" },
  statSessions: { en: "Sessions", zh: "參與次數", cn: "参与次数" },
  statTotalGiven: { en: "Total donated", zh: "累計捐款", cn: "累计捐款" },
  statDonations: { en: "Donations", zh: "捐款次數", cn: "捐款次数" },
  yourCertificates: { en: "Your certificates", zh: "你的證書", cn: "你的证书" },
  certificateNote: {
    en: "Certificates reflect the hours you've logged at attended sessions and your completed donations.",
    zh: "證書反映你於已出席活動所記錄的時數及已完成的捐款。",
    cn: "证书反映你于已出席活动所记录的时数及已完成的捐款。",
  },
  languageLabel: { en: "Language", zh: "語言", cn: "语言" },
};

interface LocaleCtxValue {
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleCtxValue>({
  locale: "en",
  t: (key: string) => key,
});

function makeT(locale: Locale) {
  return (key: string, vars?: Record<string, string | number>): string => {
    const entry = STRINGS[key];
    const value = entry?.[locale] ?? entry?.en ?? key;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, k: string) =>
      k in vars ? String(vars[k]) : match,
    );
  };
}

function usePortalText(): LocaleCtxValue {
  return useContext(LocaleContext);
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      className={toolsStyles.languageIcon}
      fill="none"
      focusable="false"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path d="M3.5 12h17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.75" />
      <path
        d="M12 3c2.5 2.6 3.75 5.6 3.75 9S14.5 18.4 12 21c-2.5-2.6-3.75-5.6-3.75-9S9.5 5.6 12 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function PortalLangMenu({ locale, onChange }: { locale: Locale; onChange: (l: Locale) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = usePortalText();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const options = [
    { id: "en" as const, name: "English", short: "EN" },
    { id: "zh" as const, name: "繁體中文", short: "繁" },
    { id: "cn" as const, name: "简体中文", short: "简" },
  ];

  return (
    <div ref={rootRef} className={toolsStyles.languageMenu}>
      <button
        type="button"
        className={`${toolsStyles.accessTrigger} ${open ? toolsStyles.accessTriggerOpen : ""}`}
        aria-label={t("languageLabel")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        style={{ color: "var(--portal-muted-3)" }}
      >
        <GlobeIcon />
      </button>
      {open ? (
        <div
          className={toolsStyles.languagePanel}
          role="menu"
          aria-label={t("languageLabel")}
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="menuitem"
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`${toolsStyles.languageOption} ${locale === option.id ? toolsStyles.languageOptionActive : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                width: "100%",
                minHeight: 44,
                padding: "0.45rem 0.7rem",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <span className={toolsStyles.languageOptionName}>{option.name}</span>
              <span className={toolsStyles.languageOptionShort}>{option.short}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const s = (w = 20) => ({ width: w, height: w, display: "block" as const });
const ico = (strokeWidth = 2) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const IcoCalendar = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <rect x={3} y={4} width={18} height={18} rx={2} />
    <line x1={16} y1={2} x2={16} y2={6} />
    <line x1={8} y1={2} x2={8} y2={6} />
    <line x1={3} y1={10} x2={21} y2={10} />
  </svg>
);
const IcoHeart = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IcoLeaf = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 0 0 4.69 21A13 13 0 0 0 19 12.68" />
    <path d="M17 8L12 3 7 8" />
    <line x1={12} y1={3} x2={12} y2={19} />
  </svg>
);
const IcoStar = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IcoUsers = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx={9} cy={7} r={4} />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoLock = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IcoDollar = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <line x1={12} y1={1} x2={12} y2={23} />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IcoHome = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IcoRefresh = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const IcoAward = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={12} cy={8} r={6} />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
const IcoTrophy = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polyline points="8 6 2 6 2 12 8 12" />
    <polyline points="16 6 22 6 22 12 16 12" />
    <path d="M12 19v3" />
    <path d="M8 21h8" />
    <path d="M8 6v7a4 4 0 0 0 8 0V6" />
  </svg>
);
const IcoNutrition = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const IcoBell = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IcoSearch = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={11} cy={11} r={8} />
    <line x1={21} y1={21} x2={16.65} y2={16.65} />
  </svg>
);
const IcoMapPin = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);
const IcoShield = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcoCheck = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico(2.5)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoUser = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={12} cy={8} r={4} />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IcoMessage = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IcoShare = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={18} cy={5} r={3} />
    <circle cx={6} cy={12} r={3} />
    <circle cx={18} cy={19} r={3} />
    <line x1={8.59} y1={13.51} x2={15.42} y2={17.49} />
    <line x1={15.41} y1={6.51} x2={8.59} y2={10.49} />
  </svg>
);
const IcoSparkle = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    <line x1={12} y1={12} x2={12} y2={12} />
  </svg>
);
const IcoChevronLeft = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const navLinks = ["My Portal", "My Donations", "My Volunteer", "Events", "Donate"] as const;

type Nav = (typeof navLinks)[number];

const NAV_LABEL_KEYS: Record<Nav, string> = {
  "My Portal": "navMyPortal",
  "My Donations": "navMyDonations",
  "My Volunteer": "navMyVolunteer",
  Events: "navEvents",
  Donate: "navDonate",
};

const PORTAL_LOCALE_KEY = "portal-locale";
const PORTAL_LOCALE_EVENT = "love21-portal-locale";

const portalLocaleStore = {
  subscribe: (onStoreChange: () => void) => {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener(PORTAL_LOCALE_EVENT, onStoreChange);
    return () => {
      window.removeEventListener("storage", onStoreChange);
      window.removeEventListener(PORTAL_LOCALE_EVENT, onStoreChange);
    };
  },
  getSnapshot: (): Locale => {
    const value = window.localStorage.getItem(PORTAL_LOCALE_KEY);
    return value === "zh" || value === "cn" ? value : "en";
  },
  getServerSnapshot: () => "en" as const,
};

const MONTHS_LOCALIZED: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  zh: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  cn: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

function eventTag(type: PortalEventCard["type"]) {
  switch (type) {
    case "sport":
      return { labelKey: "tagSport", color: "var(--portal-pink-deep)", bg: "var(--portal-pink-chip)" };
    case "nutrition":
      return { labelKey: "tagNutrition", color: "var(--portal-teal-deep)", bg: "var(--portal-teal-soft)" };
    case "family_support":
      return { labelKey: "tagFamilySupport", color: "var(--portal-purple)", bg: "var(--portal-purple-soft)" };
    default:
      return { labelKey: "tagCommunity", color: "var(--portal-gold-deep)", bg: "var(--portal-gold-soft)" };
  }
}

const statusMeta: Record<string, { labelKey: string; color: string; bg: string }> = {
  accepted: { labelKey: "statusRegistered", color: "var(--portal-teal-deep)", bg: "var(--portal-teal-soft)" },
  attended: { labelKey: "statusAttended", color: "var(--portal-blue-deep)", bg: "var(--portal-blue-soft)" },
  pending: { labelKey: "statusPending", color: "var(--portal-gold-deep)", bg: "var(--portal-gold-soft)" },
  cancelled: { labelKey: "statusCancelled", color: "var(--portal-muted-4)", bg: "var(--portal-neutral)" },
  no_show: { labelKey: "statusNoShow", color: "var(--portal-pink-deep)", bg: "var(--portal-pink-chip)" },
  rejected: { labelKey: "statusNotApproved", color: "var(--portal-pink-deep)", bg: "var(--portal-pink-chip)" },
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid var(--portal-border-2)",
  borderRadius: 10,
  fontSize: "0.875rem",
  color: "var(--portal-ink)",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: "#fff",
  fontFamily: "inherit",
  transition: "border-color 0.15s",
};

const pageStyle: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
};

const eyebrowStyle: React.CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  color: "var(--portal-pink)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: "0 0 6px",
};

const pageTitleStyle: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: 700,
  color: "var(--portal-ink)",
  margin: "0 0 8px",
};

const pageSubtitleStyle: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--portal-muted-3)",
  margin: 0,
};

const sectionEyebrowStyle: React.CSSProperties = {
  fontSize: "0.6875rem",
  fontWeight: 700,
  color: "var(--portal-blue)",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: "0 0 6px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: "1.625rem",
  fontWeight: 700,
  color: "var(--portal-ink)",
  margin: "0 0 8px",
};

function Dashboard({ name, data, go }: { name: string; data: ContributorPortalData; go: (nav: Nav) => void }) {
  const { t, locale } = usePortalText();
  const upcoming = data.events.filter((ev) => new Date(ev.startsAt) >= new Date());
  const attending = data.participations.filter((p) => p.status === "accepted").length;

  return (
    <main className={styles.page} style={pageStyle}>
      <section
        className={styles.welcomeCard}
        style={{
          backgroundColor: "var(--portal-pink-soft)",
          borderRadius: 16,
          padding: "36px 40px",
          marginBottom: 48,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div className={styles.deco} style={{ position: "absolute", right: 140, top: -18, width: 60, height: 60, borderRadius: "50%", backgroundColor: "var(--portal-mint)", opacity: 0.6, zIndex: 0 }} />
        <div className={styles.deco} style={{ position: "absolute", right: 108, bottom: -12, width: 36, height: 36, borderRadius: "50%", backgroundColor: "var(--portal-mint)", opacity: 0.45, zIndex: 0 }} />
        <div style={{ zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "var(--portal-pink-chip)", borderRadius: 20, padding: "4px 12px", marginBottom: 14 }}>
            <span style={{ color: "var(--portal-pink-deep)", display: "flex" }}><IcoSparkle size={12} /></span>
            <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "var(--portal-pink-deep)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{t("thankYouPill")}</span>
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--portal-ink)", margin: "0 0 10px" }}>{t("welcomeBack", { name: firstName(name) })}</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--portal-muted)", lineHeight: 1.6, maxWidth: 380, margin: 0 }}>
            {t("welcomeSub")}
          </p>
        </div>
        <div style={{ zIndex: 1, backgroundColor: "var(--portal-pink)", borderRadius: 14, padding: "24px 32px", textAlign: "center", minWidth: 140, color: "#fff", flexShrink: 0 }}>
          <div style={{ fontSize: "3.25rem", fontWeight: 800, lineHeight: 1 }}>{attending}</div>
          <div style={{ fontSize: "0.8125rem", marginTop: 6, opacity: 0.9 }}>
            {attending === 1 ? t("joiningOne") : t("joiningMany")}
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={sectionEyebrowStyle}>{t("whatsOn")}</p>
          <button
            type="button"
            onClick={() => go("Events")}
            style={{ fontSize: "0.75rem", color: "var(--portal-pink)", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}
          >
            {t("seeAllEvents")}
          </button>
        </div>
        <h2 style={{ ...sectionTitleStyle, marginBottom: 24 }}>{t("upcomingEvents")}</h2>

        {upcoming.length === 0 ? (
          <div
            style={{
              backgroundColor: "var(--portal-soft-bg)",
              border: "1px solid var(--portal-border)",
              borderRadius: 16,
              padding: "40px",
              textAlign: "center",
              color: "var(--portal-muted-4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "var(--portal-muted-7)" }}><IcoCalendar size={40} /></div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--portal-muted-5)" }}>{t("noUpcomingEvents")}</div>
            <div style={{ fontSize: "0.8125rem", marginTop: 6 }}>{t("noUpcomingSub")}</div>
          </div>
        ) : (
          <div className={styles.threeColumnGrid} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {upcoming.slice(0, 6).map((ev) => {
              const tag = eventTag(ev.type);
              return (
                <div key={ev.id} style={{ backgroundColor: "#fff", border: "1px solid var(--portal-border)", borderRadius: 16, padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: tag.color, backgroundColor: tag.bg, borderRadius: 20, padding: "3px 10px" }}>{t(tag.labelKey)}</span>
                    <span style={{ color: "var(--portal-muted-5)", display: "flex" }}><IcoCalendar size={15} /></span>
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--portal-ink)", lineHeight: 1.45, marginBottom: 10 }}>{ev.title}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--portal-muted-strong)", fontWeight: 600 }}>{formatWeekdayDayMonthAt(ev.startsAt, locale)}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--portal-muted-3)" }}>
                      {formatEventTime(ev.startsAt, ev.endsAt)}
                      {ev.location ? <span> · {ev.location}</span> : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function lastMonths(count: number, locale: Locale): { key: string; label: string }[] {
  const now = new Date();
  const months = MONTHS_LOCALIZED[locale];
  const out: { key: string; label: string }[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: months[d.getMonth()],
    });
  }
  return out;
}

function MyDonationsPage({ data }: { data: ContributorPortalData }) {
  const { t, locale } = usePortalText();
  const { donations, totalDonationCents, donationCount, activeRecurringCount, monthlyRecurringCents } = data;
  const giving = donations.filter((d) => d.status === "completed" || d.status === "active");

  const stats = [
    { icon: <IcoDollar size={22} />, value: formatCurrency(totalDonationCents / 100), label: t("statTotalDonated"), color: "var(--portal-pink)" },
    { icon: <IcoCalendar size={22} />, value: String(donationCount), label: t("statDonationsMade"), color: "var(--portal-blue)" },
    { icon: <IcoRefresh size={22} />, value: String(activeRecurringCount), label: t("statActiveRecurring"), color: "var(--portal-teal)" },
    { icon: <IcoHome size={22} />, value: monthlyRecurringCents ? `${formatCurrency(monthlyRecurringCents / 100)}/mo` : "—", label: t("statMonthlyCommitment"), color: "var(--portal-gold)" },
  ];

  const months = lastMonths(6, locale);
  const byMonth = months.map((m) => ({
    ...m,
    value: giving
      .filter((d) => new Date(d.createdAt).toISOString().slice(0, 7) === m.key)
      .reduce((sum, d) => sum + d.amountCents, 0),
  }));
  const maxMonth = Math.max(...byMonth.map((m) => m.value), 1);

  const monthsSet = new Set(giving.map((d) => new Date(d.createdAt).toISOString().slice(0, 7)));
  const maxSingle = giving.reduce((m, d) => Math.max(m, d.amountCents), 0);
  const badges = [
    { labelKey: "badgeFirstGive", descKey: "badgeFirstGiveDesc", earned: donationCount >= 1, icon: <IcoHeart size={20} />, bg: "var(--portal-gold-soft)", iconColor: "var(--portal-gold-deep)" },
    { labelKey: "badgeRegular", descKey: "badgeRegularDesc", earned: monthsSet.size >= 3, icon: <IcoRefresh size={20} />, bg: "#edf7f0", iconColor: "var(--portal-teal-deep)" },
    { labelKey: "badgeSupporter", descKey: "badgeSupporterDesc", earned: totalDonationCents >= 50000, icon: <IcoAward size={20} />, bg: "var(--portal-pink-soft)", iconColor: "var(--portal-pink-deep)" },
    { labelKey: "badgeChampion", descKey: "badgeChampionDesc", earned: maxSingle >= 100000, icon: <IcoTrophy size={20} />, bg: "#e8f2fb", iconColor: "var(--portal-blue-deep)" },
    { labelKey: "badgePatron", descKey: "badgePatronDesc", earned: totalDonationCents >= 500000, icon: <IcoLock size={20} />, bg: "#f7f5f3", iconColor: "var(--portal-muted-3)" },
    { labelKey: "badgeYearOne", descKey: "badgeYearOneDesc", earned: monthsSet.size >= 6, icon: <IcoStar size={20} />, bg: "#f7f5f3", iconColor: "var(--portal-muted-3)" },
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <main className={styles.page} style={pageStyle}>
      <div style={{ marginBottom: 40 }}>
        <p style={eyebrowStyle}>{t("donorDashboard")}</p>
        <h1 style={pageTitleStyle}>{t("myDonationsTitle")}</h1>
        <p style={pageSubtitleStyle}>{t("myDonationsSub")}</p>
      </div>

      <section style={{ marginBottom: 56 }}>
        <p style={sectionEyebrowStyle}>{t("yourImpact")}</p>
        <h2 style={{ ...sectionTitleStyle, marginBottom: 24 }}>{t("impactTitle")}</h2>
        <div className={styles.fourColumnGrid} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ backgroundColor: "#fff", border: "1px solid var(--portal-border)", borderRadius: 14, padding: "24px 20px" }}>
              <div style={{ color: stat.color, marginBottom: 10 }}>{stat.icon}</div>
              <div style={{ fontSize: "1.625rem", fontWeight: 800, color: stat.color, marginBottom: 4, lineHeight: 1.2 }}>{stat.value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--portal-muted-2)", lineHeight: 1.4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 56 }}>
        <p style={sectionEyebrowStyle}>{t("givingHistory")}</p>
        <h2 style={{ ...sectionTitleStyle, marginBottom: 24 }}>{t("givingHistoryTitle")}</h2>
        {giving.length === 0 ? (
          <div style={{ backgroundColor: "var(--portal-soft-bg)", border: "1px solid var(--portal-border)", borderRadius: 16, padding: "32px", textAlign: "center", color: "var(--portal-muted-4)" }}>
            {t("noDonationsYet")}
          </div>
        ) : (
          <div className={styles.twoColumnGrid} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ backgroundColor: "#fff", border: "1px solid var(--portal-border)", borderRadius: 16, padding: "28px 32px" }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--portal-ink)", marginBottom: 2 }}>{t("monthlyGiving")}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--portal-muted-3)", marginBottom: 24 }}>{t("monthlyGivingSub")}</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 140, paddingBottom: 4 }}>
                {byMonth.map((bar) => (
                  <div key={bar.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: bar.value > 0 ? 700 : 400, color: bar.value > 0 ? "var(--portal-blue)" : "var(--portal-muted-5)" }}>
                      {bar.value > 0 ? formatCurrency(bar.value / 100) : ""}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        height: `${Math.max((bar.value / maxMonth) * 100, bar.value > 0 ? 8 : 2)}px`,
                        backgroundColor: bar.value > 0 ? "var(--portal-blue)" : "var(--portal-neutral-soft)",
                        borderRadius: "5px 5px 0 0",
                      }}
                    />
                    <span style={{ fontSize: "0.6875rem", color: "var(--portal-muted-3)" }}>{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: "var(--portal-soft-bg-2)", borderRadius: 16, padding: "28px 32px" }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--portal-ink)", marginBottom: 2 }}>{t("recentDonations")}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--portal-muted-3)", marginBottom: 20 }}>{t("recentDonationsSub")}</div>
              {donations.slice(0, 5).length === 0 ? (
                <p style={{ fontSize: "0.8125rem", color: "var(--portal-muted-4)", margin: 0 }}>{t("nothingHereYet")}</p>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {donations.slice(0, 5).map((donation) => (
                    <li key={donation.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--portal-border)" }}>
                      <div>
                        <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--portal-ink)" }}>{formatCurrency(donation.amountCents / 100)}</div>
                        <div style={{ fontSize: "0.6875rem", color: "var(--portal-muted-4)" }}>{formatDayMonthYearAt(donation.createdAt, locale)}</div>
                      </div>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: donation.kind === "recurring" ? "var(--portal-blue-deep)" : "var(--portal-teal-deep)", backgroundColor: donation.kind === "recurring" ? "var(--portal-blue-soft)" : "var(--portal-teal-soft)", borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>
                        {donation.kind === "recurring" ? t("recurringTag") : t("oneTimeTag")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>

      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={sectionEyebrowStyle}>{t("donorBadges")}</p>
          <div style={{ backgroundColor: "var(--portal-blue-soft)", color: "var(--portal-blue-deep)", fontSize: "0.75rem", fontWeight: 600, borderRadius: 20, padding: "4px 12px" }}>
            {t("badgesEarnedCount", { earned: earnedCount, total: badges.length })}
          </div>
        </div>
        <h2 style={{ ...sectionTitleStyle, marginBottom: 24 }}>{t("badgesTitle")}</h2>
        <div className={styles.badgeGrid} style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
          {badges.map((badge) => (
            <div key={badge.labelKey} style={{ backgroundColor: badge.bg, borderRadius: 14, padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: badge.iconColor, boxShadow: badge.earned ? "0 2px 8px var(--portal-shadow-soft)" : "none" }}>{badge.icon}</div>
                {badge.earned && <span style={{ fontSize: "0.625rem", fontWeight: 700, color: "var(--portal-teal)", letterSpacing: "0.06em", textTransform: "uppercase" as const, backgroundColor: "var(--portal-chip-overlay)", padding: "3px 8px", borderRadius: 10 }}>{t("earnedTag")}</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: badge.earned ? "var(--portal-ink)" : "var(--portal-muted-3)", marginBottom: 4 }}>{t(badge.labelKey)}</div>
              <div style={{ fontSize: "0.6875rem", color: badge.earned ? "var(--portal-muted-strong)" : "var(--portal-muted-5)", lineHeight: 1.4 }}>{t(badge.descKey)}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function VolunteerStatusCard({ data, go }: { data: ContributorPortalData; go: (nav: Nav) => void }) {
  const { t, locale } = usePortalText();
  const app = data.application;
  const status = app?.status;
  const statusText: Record<string, string> = {
    submitted: t("statusSubmitted"),
    under_review: t("statusUnderReview"),
    approved: t("statusApproved"),
  };

  return (
    <main className={`${styles.page} ${styles.centeredPage}`} style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: status === "approved" ? "var(--portal-teal-soft)" : "var(--portal-blue-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: status === "approved" ? "var(--portal-teal-deep)" : "var(--portal-blue-deep)" }}>
        <IcoCheck size={28} />
      </div>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--portal-ink)", marginBottom: 12 }}>
        {status === "approved" ? t("approvedTitle") : t("submittedTitle")}
      </h1>
      <p style={{ fontSize: "1rem", color: "var(--portal-muted)", maxWidth: 440, margin: "0 auto 24px", lineHeight: 1.7 }}>
        {statusText[status ?? ""] ?? t("statusFallback")}
      </p>
      {app?.submitted_at && (
        <p style={{ fontSize: "0.8125rem", color: "var(--portal-muted-4)", marginBottom: 32 }}>
          {t("submittedOn", { date: formatDayMonthYearAt(app.submitted_at, locale) })}
        </p>
      )}
      {status === "approved" ? (
        <button
          type="button"
          onClick={() => go("Events")}
          style={{ padding: "12px 32px", borderRadius: 12, border: "none", backgroundColor: "var(--portal-pink)", color: "#fff", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}
        >
          {t("browseEvents")}
        </button>
      ) : (
        <div style={{ fontSize: "0.8125rem", color: "var(--portal-muted-4)" }}>{t("willNotify")}</div>
      )}
    </main>
  );
}

function MyVolunteerPage({ data, go }: { data: ContributorPortalData; go: (nav: Nav) => void }) {
  const router = useRouter();
  const { t } = usePortalText();
  const status = data.application?.status;

  const [form, setForm] = useState({ chineseName: "", ageGroup: "", gender: "", about: "", hearAbout: "" });
  const [scrcFile, setScrcFile] = useState<File | null>(null);
  const [parentalConsentFile, setParentalConsentFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  const labelStyle: React.CSSProperties = { fontSize: "0.8125rem", fontWeight: 600, color: "var(--portal-ink)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 };

  const AGE_GROUPS = [
    { label: t("age1415"), value: "14-15" },
    { label: t("age1617"), value: "16-17" },
    { label: t("age18"), value: "18+" },
  ];
  const GENDERS = [
    { label: t("genderFemale"), value: "Female" },
    { label: t("genderMale"), value: "Male" },
    { label: t("genderPreferNot"), value: "Prefer not to say" },
  ];
  const HEAR_ABOUT = [
    { label: t("hearExisting"), value: "Existing Love 21 volunteer" },
    { label: t("hearSocial"), value: "Love 21 social media" },
    { label: t("hearEmail"), value: "Love 21 email newsletter" },
    { label: t("hearCompany"), value: "Company referral" },
    { label: t("hearOther"), value: "Other" },
  ];

  const isAdult = form.ageGroup === "18+";
  const isMinor = form.ageGroup === "14-15" || form.ageGroup === "16-17";
  const canSubmit = Boolean(form.ageGroup && form.gender && form.hearAbout) && !submitting;

  const RadioOption = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) => (
    <div onClick={onSelect} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${selected ? "var(--portal-pink)" : "var(--portal-border-2)"}`, backgroundColor: selected ? "var(--portal-pink-soft)" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? "var(--portal-pink)" : "var(--portal-border-3)"}`, backgroundColor: selected ? "var(--portal-pink)" : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
        {selected && <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#fff" }} />}
      </div>
      <span style={{ fontSize: "0.875rem", color: selected ? "var(--portal-pink-deep)" : "var(--portal-ink-soft)", fontWeight: selected ? 600 : 400 }}>{label}</span>
    </div>
  );

  async function onSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const result = await submitVolunteerApplication({
      ageGroup: form.ageGroup,
      gender: form.gender,
      referralSource: form.hearAbout,
      bio: form.about.trim() || null,
      chineseName: form.chineseName.trim() || null,
      scrcFile: isAdult ? scrcFile : null,
      parentalConsentFile: isMinor ? parentalConsentFile : null,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? t("errorGeneric"));
      return;
    }
    setJustSubmitted(true);
    router.refresh();
  }

  if (status === "approved" || justSubmitted) {
    return <VolunteerStatusCard data={data} go={go} />;
  }

  if (status === "submitted" || status === "under_review") {
    return <VolunteerStatusCard data={data} go={go} />;
  }

  return (
    <main className={`${styles.page} ${styles.formPage}`} style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 36 }}>
        <p style={eyebrowStyle}>{t("getInvolved")}</p>
        <h1 style={pageTitleStyle}>{t("becomeVolunteerTitle")}</h1>
        <p style={pageSubtitleStyle}>{t("becomeVolunteerSub")}</p>
      </div>

      {status === "rejected" && data.application?.rejection_reason_visible && data.application?.rejection_reason && (
        <div style={{ backgroundColor: "var(--portal-pink-soft)", border: "1px solid var(--portal-pink-chip)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, fontSize: "0.8125rem", color: "var(--portal-pink-deep)", lineHeight: 1.6 }}>
          <strong>{t("rejectedBanner")}</strong>{" "}
          {data.application.rejection_reason}
        </div>
      )}

      <div style={{ backgroundColor: "#fff", border: "1px solid var(--portal-border)", borderRadius: 16, padding: "36px 40px", display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <div style={labelStyle}><span style={{ color: "var(--portal-muted-3)", display: "flex" }}><IcoUser size={16} /></span>{t("chineseName")}<span style={{ fontSize: "0.75rem", color: "var(--portal-muted-6)", fontWeight: 400 }}>{t("optionalChineseName")}</span></div>
          <input value={form.chineseName} onChange={(e) => setForm({ ...form, chineseName: e.target.value })} placeholder="陳大文" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = "var(--portal-pink)"; }} onBlur={(e) => { e.target.style.borderColor = "var(--portal-border-2)"; }} />
        </div>
        <div>
          <div style={labelStyle}><span style={{ color: "var(--portal-muted-3)", display: "flex" }}><IcoCalendar size={16} /></span>{t("ageGroup")}<span style={{ color: "var(--portal-pink)" }}>*</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {AGE_GROUPS.map((opt) => <RadioOption key={opt.value} label={opt.label} selected={form.ageGroup === opt.value} onSelect={() => setForm({ ...form, ageGroup: opt.value })} />)}
          </div>
        </div>
        <div>
          <div style={labelStyle}><span style={{ color: "var(--portal-muted-3)", display: "flex" }}><IcoUsers size={16} /></span>{t("gender")}<span style={{ color: "var(--portal-pink)" }}>*</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GENDERS.map((opt) => <RadioOption key={opt.value} label={opt.label} selected={form.gender === opt.value} onSelect={() => setForm({ ...form, gender: opt.value })} />)}
          </div>
        </div>
        <div>
          <div style={labelStyle}><span style={{ color: "var(--portal-muted-3)", display: "flex" }}><IcoMessage size={16} /></span>{t("aboutYou")}</div>
          <p style={{ fontSize: "0.75rem", color: "var(--portal-muted-4)", margin: "0 0 10px" }}>{t("aboutHint")}</p>
          <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={5} placeholder={t("aboutPlaceholder")} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }} onFocus={(e) => { e.target.style.borderColor = "var(--portal-pink)"; }} onBlur={(e) => { e.target.style.borderColor = "var(--portal-border-2)"; }} />
        </div>
        <div>
          <div style={labelStyle}><span style={{ color: "var(--portal-muted-3)", display: "flex" }}><IcoShare size={16} /></span>{t("hearAbout")}<span style={{ color: "var(--portal-pink)" }}>*</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {HEAR_ABOUT.map((opt) => (
              <RadioOption key={opt.value} label={opt.label} selected={form.hearAbout === opt.value} onSelect={() => setForm({ ...form, hearAbout: opt.value })} />
            ))}
          </div>
        </div>

        {isAdult && (
          <div>
            <div style={labelStyle}><span style={{ color: "var(--portal-muted-3)", display: "flex" }}><IcoAward size={16} /></span>{t("scrcLabel")}<span style={{ color: "var(--portal-pink)" }}>*</span></div>
            <p style={{ fontSize: "0.75rem", color: "var(--portal-muted-4)", margin: "0 0 10px" }}>{t("scrcHint")}</p>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setScrcFile(e.target.files?.[0] ?? null)}
              style={{ fontSize: "0.8125rem", color: "var(--portal-muted-strong)", fontFamily: "inherit" }}
            />
            {isAdult && !scrcFile && <div style={{ fontSize: "0.6875rem", color: "var(--portal-pink-deep)", marginTop: 6 }}>{t("requiredToSubmit")}</div>}
          </div>
        )}

        {isMinor && (
          <div>
            <div style={labelStyle}><span style={{ color: "var(--portal-muted-3)", display: "flex" }}><IcoLeaf size={16} /></span>{t("consentLabel")}<span style={{ color: "var(--portal-pink)" }}>*</span></div>
            <p style={{ fontSize: "0.75rem", color: "var(--portal-muted-4)", margin: "0 0 10px" }}>{t("consentHint")}</p>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={(e) => setParentalConsentFile(e.target.files?.[0] ?? null)}
              style={{ fontSize: "0.8125rem", color: "var(--portal-muted-strong)", fontFamily: "inherit" }}
            />
            {isMinor && !parentalConsentFile && <div style={{ fontSize: "0.6875rem", color: "var(--portal-pink-deep)", marginTop: 6 }}>{t("requiredToSubmit")}</div>}
          </div>
        )}

        {error && (
          <div role="alert" style={{ backgroundColor: "var(--portal-pink-soft)", border: "1px solid var(--portal-pink-chip)", borderRadius: 10, padding: "12px 16px", fontSize: "0.8125rem", color: "var(--portal-pink-deep)" }}>
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          style={{ padding: "13px", borderRadius: 11, border: "none", backgroundColor: canSubmit ? "var(--portal-pink)" : "var(--portal-neutral)", color: canSubmit ? "#fff" : "var(--portal-muted-6)", fontSize: "0.9375rem", fontWeight: 700, cursor: canSubmit ? "pointer" : "default", transition: "all 0.15s", marginTop: 4 }}
        >
          {submitting ? t("submitting") : t("submitApplication")}
        </button>
      </div>
    </main>
  );
}

function EventsLockedPage({ data, go }: { data: ContributorPortalData; go: (nav: Nav) => void }) {
  const { t } = usePortalText();
  const status = data.application?.status;
  const message: Record<string, string> = {
    submitted: t("lockedSubmitted"),
    under_review: t("lockedSubmitted"),
    rejected: t("lockedRejected"),
    withdrawn: t("lockedWithdrawn"),
  };

  return (
    <main className={`${styles.page} ${styles.centeredPage}`} style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "var(--portal-pink-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--portal-pink-deep)" }}>
        <IcoLock size={28} />
      </div>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--portal-ink)", marginBottom: 12 }}>{t("eventsLockedTitle")}</h1>
      <p style={{ fontSize: "0.9375rem", color: "var(--portal-muted)", maxWidth: 460, margin: "0 auto 8px", lineHeight: 1.7 }}>
        {t("eventsLockedSub")}
      </p>
      <p style={{ fontSize: "0.8125rem", color: "var(--portal-muted-4)", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.7 }}>{message[status ?? ""] ?? ""}</p>
      <button
        type="button"
        onClick={() => go("My Volunteer")}
        style={{ padding: "12px 32px", borderRadius: 12, border: "none", backgroundColor: "var(--portal-pink)", color: "#fff", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}
      >
        {t("viewMyApplication")}
      </button>
    </main>
  );
}

function EventsPage({ data, go }: { data: ContributorPortalData; go: (nav: Nav) => void }) {
  const router = useRouter();
  const { t, locale } = usePortalText();
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [busyEvent, setBusyEvent] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const byEventId = new Map(data.events.map((ev) => [ev.id, ev]));
  const mine = data.participations
    .map((p) => ({ event: byEventId.get(p.eventId), status: p.status }))
    .filter(
      (entry): entry is { event: PortalEventCard; status: ParticipationStatus } =>
        Boolean(entry.event),
    );

  const filtered = data.events.filter((ev) => {
    const matchSearch = !search || ev.title.toLowerCase().includes(search.toLowerCase());
    const matchDate = !dateFrom || ev.startsAt.slice(0, 10) >= dateFrom;
    const matchType = !typeFilter || ev.type === typeFilter;
    return matchSearch && matchDate && matchType;
  });

  async function register(eventId: number) {
    if (busyEvent != null) return;
    setBusyEvent(eventId);
    setError(null);
    const result = await registerForEvent({ eventId });
    setBusyEvent(null);
    if (!result.ok) {
      setError(result.error ?? t("registerError"));
      return;
    }
    router.refresh();
  }

  if (data.application?.status !== "approved") {
    return <EventsLockedPage data={data} go={go} />;
  }

  const typeOptions = [
    { value: "", label: t("allProgrammes") },
    { value: "sport", label: t("tagSport") },
    { value: "nutrition", label: t("tagNutrition") },
    { value: "family_support", label: t("tagFamilySupport") },
  ];

  return (
    <main className={styles.page} style={pageStyle}>
      <div style={{ marginBottom: 32 }}>
        <p style={eyebrowStyle}>{t("getInvolved")}</p>
        <h1 style={pageTitleStyle}>{t("upcomingEventsTitle")}</h1>
        <p style={pageSubtitleStyle}>{t("upcomingEventsSub")}</p>
      </div>

      <div style={{ backgroundColor: "var(--portal-soft-bg)", border: "1px solid var(--portal-border)", borderRadius: 16, padding: "20px 24px", marginBottom: 28 }}>
        <div className={styles.filterRow} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--portal-muted-6)", display: "flex", pointerEvents: "none" }}><IcoSearch size={16} /></span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchPlaceholder")} style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ ...inputStyle, maxWidth: 160, cursor: "pointer" }} />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={{ ...inputStyle, maxWidth: 180, cursor: "pointer" }}>
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {(search || dateFrom || typeFilter) && (
            <button type="button" onClick={() => { setSearch(""); setDateFrom(""); setTypeFilter(""); }} style={{ padding: "10px 16px", borderRadius: 10, border: "1.5px solid var(--portal-border-2)", backgroundColor: "#fff", color: "var(--portal-muted-3)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>{t("clearFilters")}</button>
          )}
        </div>
        {error && (
          <div role="alert" style={{ backgroundColor: "var(--portal-pink-soft)", border: "1px solid var(--portal-pink-chip)", borderRadius: 10, padding: "10px 14px", fontSize: "0.8125rem", color: "var(--portal-pink-deep)" }}>
            {error}
          </div>
        )}
      </div>

      <p style={{ fontSize: "0.8125rem", color: "var(--portal-muted-4)", marginBottom: 20 }}>
        {filtered.length === data.events.length ? t("eventsAvailable", { count: data.events.length }) : t("eventsShown", { shown: filtered.length, total: data.events.length })}
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--portal-muted-6)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "var(--portal-muted-7)" }}><IcoSearch size={40} /></div>
          <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--portal-muted-5)" }}>{t("noMatch")}</div>
          <div style={{ fontSize: "0.8125rem", marginTop: 6 }}>{t("noMatchSub")}</div>
        </div>
      ) : (
        <div className={styles.threeColumnGrid} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {filtered.map((ev) => {
            const tag = eventTag(ev.type);
            const participation = mine.find((m) => m.event.id === ev.id);
            return (
              <div key={ev.id} style={{ backgroundColor: "#fff", border: "1px solid var(--portal-border)", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ height: 88, backgroundColor: tag.bg, position: "relative", display: "flex", alignItems: "center", padding: "0 22px" }}>
                  <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: tag.color, backgroundColor: "#fff", borderRadius: 20, padding: "4px 12px" }}>{t(tag.labelKey)}</span>
                </div>
                <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--portal-ink)", margin: 0, lineHeight: 1.4 }}>{ev.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--portal-muted-strong)" }}>
                      <span style={{ color: "var(--portal-muted-5)", display: "flex" }}><IcoCalendar size={13} /></span>
                      <span style={{ fontWeight: 600 }}>{formatWeekdayDayMonthAt(ev.startsAt, locale)}</span><span style={{ color: "var(--portal-muted-6)" }}>·</span><span>{formatEventTime(ev.startsAt, ev.endsAt)}</span>
                    </div>
                    {ev.location && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--portal-muted-3)" }}>
                        <span style={{ color: "var(--portal-muted-5)", display: "flex" }}><IcoMapPin size={13} /></span><span>{ev.location}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: "auto", paddingTop: 12 }}>
                    {participation ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: statusMeta[participation.status]?.color ?? "var(--portal-muted-strong)",
                          backgroundColor: statusMeta[participation.status]?.bg ?? "var(--portal-neutral)",
                          borderRadius: 20,
                          padding: "8px 14px",
                        }}
                      >
                        <IcoCheck size={12} />
                        {statusMeta[participation.status] ? t(statusMeta[participation.status].labelKey) : participation.status}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => register(ev.id)}
                        disabled={busyEvent != null}
                        style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", cursor: busyEvent == null ? "pointer" : "default", fontSize: "0.8125rem", fontWeight: 700, backgroundColor: "var(--portal-pink)", color: "#fff", transition: "all 0.15s", opacity: busyEvent != null ? 0.6 : 1 }}
                      >
                        {busyEvent === ev.id ? t("registering") : t("registerForEvent")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {mine.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <p style={sectionEyebrowStyle}>{t("myEventsEyebrow")}</p>
          <h2 style={{ ...sectionTitleStyle, marginBottom: 20 }}>{t("myEventsTitle")}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mine.map(({ event, status: pStatus }) => {
              const tag = eventTag(event.type);
              const meta = statusMeta[pStatus] ?? { labelKey: pStatus, color: "var(--portal-muted-strong)", bg: "var(--portal-neutral)" };
              return (
                <div key={event.id} style={{ backgroundColor: "#fff", border: "1px solid var(--portal-border)", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: tag.color, backgroundColor: tag.bg, borderRadius: 20, padding: "3px 10px", flexShrink: 0 }}>{t(tag.labelKey)}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--portal-ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{event.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--portal-muted-3)" }}>{formatWeekdayDayMonthAt(event.startsAt, locale)} · {formatEventTime(event.startsAt, event.endsAt)}</div>
                    </div>
                  </div>
                  <span style={{ flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, color: meta.color, backgroundColor: meta.bg, borderRadius: 20, padding: "5px 12px", whiteSpace: "nowrap" }}>{statusMeta[pStatus] ? t(meta.labelKey) : meta.labelKey}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}

function DonatePage({ name }: { name: string }) {
  const router = useRouter();
  const { t } = usePortalText();
  const [kind, setKind] = useState<"one-time" | "recurring">("one-time");
  const [amount, setAmount] = useState(100);
  const [customActive, setCustomActive] = useState(false);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ amount: number } | null>(null);

  const customNumber = Number(custom);
  const customValid = Number.isFinite(customNumber) && customNumber > 0;
  const finalAmount = customActive ? (customValid ? customNumber : 0) : amount;
  const canSubmit = finalAmount > 0 && !submitting;

  const freqLabel = (value: Frequency) => {
    switch (value) {
      case "monthly":
        return t("freqMonthly");
      case "quarterly":
        return t("freqQuarterly");
      default:
        return t("freqYearly");
    }
  };

  const tiers = [
    { amount: 100, labelKey: "tierHero", descKey: "tierHeroDesc", icon: <IcoStar size={22} /> },
    { amount: 250, labelKey: "tierPatron", descKey: "tierPatronDesc", icon: <IcoTrophy size={22} /> },
    { amount: 500, labelKey: "tierGuardian", descKey: "tierGuardianDesc", icon: <IcoNutrition size={22} /> },
  ];

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const result = await recordDonation({
      amountCents: Math.round(finalAmount * 100),
      kind: kind === "recurring" ? "recurring" : "one_time",
      frequency: kind === "recurring" ? frequency : null,
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? t("errorGeneric"));
      return;
    }
    setConfirmation({ amount: finalAmount });
    router.refresh();
  }

  async function downloadCertificate() {
    const certId = generateDonorCertId();
    const issueDate = new Date().toLocaleDateString("en-HK", { year: "numeric", month: "long", day: "numeric" });
    const html = buildDonorCertificateHtml({
      name: name.trim() || "Valued Donor",
      amount: confirmation?.amount ?? finalAmount,
      certId,
      issueDate,
      logoSrc: "/assets/images/love21_logo.png",
    });
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "donor-certificate.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  if (confirmation) {
    return (
      <main className={`${styles.page} ${styles.centeredPage}`} style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, color: "var(--portal-pink)" }}><IcoHeart size={56} /></div>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--portal-ink)", marginBottom: 12 }}>{t("thankYouTitle", { name: name.trim() ? firstName(name) : t("friend") })}</h1>
        <p style={{ fontSize: "1rem", color: "var(--portal-muted)", maxWidth: 480, margin: "0 auto 8px" }}>
          {t("confirmationBody", {
            kind: kind === "recurring" ? `${freqLabel(frequency)} ${t("kindRecurring")}` : t("kindOneTime"),
            amount: formatCurrency(confirmation.amount),
          })}
        </p>
        <p style={{ fontSize: "0.8125rem", color: "var(--portal-muted-4)", maxWidth: 480, margin: "0 auto 32px" }}>
          {t("demoNote")}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button type="button" onClick={downloadCertificate} style={{ padding: "12px 24px", borderRadius: 12, border: "1.5px solid var(--portal-pink)", backgroundColor: "#fff", color: "var(--portal-pink)", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}>
            {t("downloadCertificate")}
          </button>
          <button type="button" onClick={() => setConfirmation(null)} style={{ padding: "12px 24px", borderRadius: 12, border: "none", backgroundColor: "var(--portal-pink)", color: "#fff", fontSize: "0.875rem", fontWeight: 700, cursor: "pointer" }}>
            {t("donateAgain")}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page} style={pageStyle}>
      <div style={{ marginBottom: 40 }}>
        <p style={eyebrowStyle}>{t("giveBack")}</p>
        <h1 style={pageTitleStyle}>{t("donationMattersTitle")}</h1>
        <p style={{ ...pageSubtitleStyle, maxWidth: 520 }}>{t("donationMattersSub")}</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {(["one-time", "recurring"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            style={{ padding: "9px 18px", borderRadius: 20, border: `1.5px solid ${kind === value ? "var(--portal-pink)" : "var(--portal-border-2)"}`, backgroundColor: kind === value ? "var(--portal-pink-soft)" : "#fff", color: kind === value ? "var(--portal-pink-deep)" : "var(--portal-muted-2)", fontSize: "0.8125rem", fontWeight: kind === value ? 700 : 500, cursor: "pointer" }}
          >
            {value === "one-time" ? t("oneTimeTab") : t("recurringTab")}
          </button>
        ))}
      </div>

      <div className={styles.donationLayout} style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32, alignItems: "start" }}>
        <div>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--portal-pink)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>{t("chooseImpact")}</p>
          <div className={styles.twoColumnGrid} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {tiers.map((tier) => {
              const active = !customActive && amount === tier.amount;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => { setAmount(tier.amount); setCustomActive(false); setCustom(""); }}
                  style={{ padding: "20px", borderRadius: 14, textAlign: "left", cursor: "pointer", border: `2px solid ${active ? "var(--portal-pink)" : "var(--portal-border)"}`, backgroundColor: active ? "var(--portal-pink-soft)" : "#fff", boxShadow: active ? "0 0 0 3px var(--portal-pink-border)" : "none", transition: "all 0.15s" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color: active ? "var(--portal-pink)" : "var(--portal-muted-3)", display: "flex" }}>{tier.icon}</span>
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: active ? "var(--portal-pink)" : "var(--portal-ink)" }}>{formatCurrency(tier.amount)}</span>
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--portal-ink)", marginBottom: 4 }}>{t(tier.labelKey)}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--portal-muted-3)", lineHeight: 1.5 }}>{t(tier.descKey)}</div>
                </button>
              );
            })}
            <div
              onClick={() => { setCustomActive(true); setAmount(0); }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCustomActive(true); setAmount(0); } }}
              style={{ padding: "20px", borderRadius: 14, cursor: "pointer", border: `2px solid ${customActive ? "var(--portal-pink)" : "var(--portal-border)"}`, backgroundColor: customActive ? "var(--portal-pink-soft)" : "#fff", boxShadow: customActive ? "0 0 0 3px var(--portal-pink-border)" : "none", transition: "all 0.15s" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: customActive ? "var(--portal-pink)" : "var(--portal-muted-3)", display: "flex" }}><IcoDollar size={22} /></span>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, color: customActive ? "var(--portal-pink)" : "var(--portal-ink)" }}>{customActive && customValid ? formatCurrency(customNumber) : t("customAmount")}</span>
              </div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--portal-ink)", marginBottom: 4 }}>{t("customAmount")}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--portal-muted-3)", lineHeight: 1.5 }}>{t("customAmountDesc")}</div>
              {customActive && (
                <input
                  type="number"
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  placeholder={t("enterAmount")}
                  autoFocus
                  aria-label={t("customAmountAria")}
                  style={{ ...inputStyle, marginTop: 12, border: `1.5px solid ${customValid ? "var(--portal-pink)" : "var(--portal-border-2)"}` }}
                />
              )}
            </div>
          </div>
          {kind === "recurring" && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.6875rem", color: "var(--portal-muted-4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{t("frequencyLabel")}</p>
              <select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)} style={inputStyle}>
                {frequencies.map((f) => (
                  <option key={f.value} value={f.value}>{freqLabel(f.value)}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: "var(--portal-soft-bg)", border: "1px solid var(--portal-border)", borderRadius: 18, padding: "28px" }}>
          <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--portal-pink)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 20px" }}>{t("yourGift")}</p>
          <div style={{ backgroundColor: "#fff", border: "1px solid var(--portal-border)", borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "var(--portal-muted-strong)", marginBottom: 6 }}>
              <span>{kind === "recurring" ? t("recurringDonation") : t("donationAmount")}</span>
              <span style={{ fontWeight: 700, color: "var(--portal-ink)" }}>{finalAmount > 0 ? formatCurrency(finalAmount) : "-"}</span>
            </div>
            {kind === "recurring" && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--portal-muted-5)" }}>
                <span>{freqLabel(frequency)}</span>
                <span />
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--portal-muted-5)", marginTop: 6 }}>
              <span>{t("processingFee")}</span>
              <span>$0.00</span>
            </div>
          </div>
          {error && (
            <div role="alert" style={{ backgroundColor: "var(--portal-pink-soft)", border: "1px solid var(--portal-pink-chip)", borderRadius: 10, padding: "10px 14px", fontSize: "0.8125rem", color: "var(--portal-pink-deep)", marginBottom: 12 }}>
              {error}
            </div>
          )}
          <button type="button" onClick={submit} disabled={!canSubmit} style={{ width: "100%", padding: "13px", borderRadius: 11, border: "none", backgroundColor: canSubmit ? "var(--portal-pink)" : "var(--portal-neutral)", color: canSubmit ? "#fff" : "var(--portal-muted-6)", fontSize: "0.9375rem", fontWeight: 700, cursor: canSubmit ? "pointer" : "default", transition: "all 0.15s" }}>
            {submitting ? t("recording") : t("donateNow", { amount: finalAmount > 0 ? formatCurrency(finalAmount) : "" })}
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, color: "var(--portal-muted-6)", fontSize: 11 }}>
            <IcoShield size={13} /> {t("securePayment")}
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfilePage({ name, data, onBack }: { name: string; data: ContributorPortalData; onBack: () => void }) {
  const { t, locale } = usePortalText();
  const isApproved = data.application?.status === "approved";
  const isDonor = data.donationCount > 0;
  const totalDonated = formatCurrency(data.totalDonationCents / 100);

  const stats = [
    { value: `${data.totalHours}`, label: t("statHoursGiven"), color: "var(--portal-pink)" },
    { value: String(data.attendedSessions), label: t("statSessions"), color: "var(--portal-blue)" },
    { value: totalDonated, label: t("statTotalGiven"), color: "var(--portal-orange)" },
    { value: String(data.donationCount), label: t("statDonations"), color: "var(--portal-gold)" },
  ];

  return (
    <main className={styles.page} style={pageStyle}>
      <button type="button" onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8125rem", color: "var(--portal-muted-3)", display: "flex", alignItems: "center", gap: 6, marginBottom: 28, padding: 0 }}>
        <IcoChevronLeft size={14} /> {t("backToPortal")}
      </button>

      <div style={{ backgroundColor: "var(--portal-pink-soft)", borderRadius: 20, padding: "36px 40px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div className={styles.deco} style={{ position: "absolute", right: -20, top: -30, width: 140, height: 140, borderRadius: "50%", backgroundColor: "var(--portal-mint)", opacity: 0.18 }} />
        <div className={styles.deco} style={{ position: "absolute", right: 60, bottom: -40, width: 100, height: 100, borderRadius: "50%", backgroundColor: "var(--portal-pink)", opacity: 0.1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 28, position: "relative", zIndex: 1 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", backgroundColor: "var(--portal-avatar)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", fontWeight: 800, color: "#fff", border: "4px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>{initials(name)}</div>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 700, color: "var(--portal-ink)", margin: "0 0 4px" }}>{name}</h1>
            <p style={{ fontSize: "0.8125rem", color: "var(--portal-muted-3)", margin: "0 0 12px" }}>{t("roleContributor")}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
              <span style={{ fontSize: "0.75rem", backgroundColor: "var(--portal-pink-chip)", color: "var(--portal-pink-deep)", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>{t("badgeContributor")}</span>
              {isApproved && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem", backgroundColor: "var(--portal-teal-soft)", color: "var(--portal-teal-deep)", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}><IcoLeaf size={11} />{t("badgeApprovedVolunteer")}</span>
              )}
              {isDonor && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.75rem", backgroundColor: "var(--portal-blue-soft)", color: "var(--portal-blue-deep)", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}><IcoHeart size={11} />{t("badgeDonor")}</span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--portal-hairline)", position: "relative", zIndex: 1, flexWrap: "wrap" as const }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: "1.375rem", fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--portal-muted-3)", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid var(--portal-border)", borderRadius: 14, padding: "28px", marginBottom: 20 }}>
        <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--portal-pink)", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 20px" }}>{t("yourCertificates")}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
          <VolunteerCertificateButton name={name} hours={data.totalHours} locale={locale} />
          <DonorCertificateButton name={name} totalCents={data.totalDonationCents} locale={locale} />
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--portal-muted-4)", margin: "16px 0 0" }}>
          {t("certificateNote")}
        </p>
      </div>
    </main>
  );
}

export function ContributorPortalExperience({
  initialNav,
  name: nameProp,
  data,
}: {
  initialNav: "My Portal" | "My Donations" | "My Volunteer" | "Events" | "Donate" | "Profile";
  name?: string;
  data: ContributorPortalData;
}) {
  const name = nameProp?.trim() || "Contributor";
  const [activeNav, setActiveNav] = useState(initialNav === "Profile" ? "My Portal" : initialNav);
  const [showProfile, setShowProfile] = useState(initialNav === "Profile");
  const locale = useSyncExternalStore(
    portalLocaleStore.subscribe,
    portalLocaleStore.getSnapshot,
    portalLocaleStore.getServerSnapshot,
  );
  const prefs = useAccessibilityPrefs();

  const t = useMemo(() => makeT(locale), [locale]);

  function changeLocale(next: Locale) {
    try {
      window.localStorage.setItem(PORTAL_LOCALE_KEY, next);
      window.dispatchEvent(new Event(PORTAL_LOCALE_EVENT));
    } catch {
      // localStorage unavailable
    }
  }

  function go(nav: Nav) {
    setActiveNav(nav);
    setShowProfile(false);
  }

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      <div className={styles.portal}>
        <header className={styles.portalHeader} aria-label={t("portalLabel")}>
          <div className={styles.brandGroup}>
            <Link href="/" aria-label="Go to Love 21 website" className={styles.brandLink}>
              <Image
                src="/assets/images/love21_logo.png?v=3"
                alt="Love 21 Foundation"
                width={330}
                height={202}
                priority
                className={styles.brandLogo}
              />
            </Link>
            <span className={styles.portalLabel}>{t("portalLabel")}</span>
          </div>
          <nav className={styles.portalNav} aria-label={t("portalLabel")}>
            {navLinks.map((link) => (
              <button
                type="button"
                key={link}
                onClick={() => { setActiveNav(link); setShowProfile(false); }}
                className={`${styles.navButton} ${!showProfile && activeNav === link ? styles.navButtonActive : ""}`}
                aria-current={!showProfile && activeNav === link ? "page" : undefined}
              >
                {t(NAV_LABEL_KEYS[link])}
              </button>
            ))}
          </nav>
          <div className={styles.headerUtility}>
            <button type="button" aria-label={t("notifications")} className={styles.iconButton}><IcoBell size={20} /></button>
            <button type="button" onClick={() => setShowProfile(!showProfile)} className={`${styles.profileButton} ${showProfile ? styles.profileButtonActive : ""}`} aria-current={showProfile ? "page" : undefined} aria-label={name}>
              <div className={styles.avatar}>{initials(name)}</div>
              <span className={styles.profileName}>{name}</span>
            </button>
            <div className={styles.headerActions}>
              <Link href="/" className={styles.websiteButton}>
                {t("goToWebsite")}
              </Link>
              <SignOutButton className={styles.logoutButton} label={t("logOut")} pendingLabel={t("loggingOut")} />
            </div>
          </div>
        </header>

        <div className={toolsStyles.floatingTools} aria-label={t("siteTools")}>
          <AccessibilityMenu
            locale={locale}
            simpleView={prefs.simpleView}
            highContrast={prefs.highContrast}
            textSize={prefs.textSize}
            onToggleSimpleView={prefs.toggleSimpleView}
            onToggleHighContrast={prefs.toggleHighContrast}
            onAdjustTextSize={prefs.adjustTextSize}
          />
          <PortalLangMenu locale={locale} onChange={changeLocale} />
        </div>

        {showProfile ? <ProfilePage name={name} data={data} onBack={() => setShowProfile(false)} />
          : activeNav === "My Donations" ? <MyDonationsPage data={data} />
          : activeNav === "My Volunteer" ? <MyVolunteerPage data={data} go={go} />
          : activeNav === "Events" ? <EventsPage data={data} go={go} />
          : activeNav === "Donate" ? <DonatePage name={name} />
          : <Dashboard name={name} data={data} go={go} />}
      </div>
    </LocaleContext.Provider>
  );
}
