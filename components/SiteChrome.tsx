"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { localePaths, normalizePath, type Locale } from "../content/site-data";
import { useUser } from "../lib/supabase/use-user";
import { SignOutButton } from "./SignOutButton";
import { BrandLockup } from "./ui/BrandLockup";
import { HeartIcon } from "./ui/HeartIcon";
import styles from "./SiteChrome.module.css";

const SIMPLE_VIEW_KEY = "simple-view";
const SIMPLE_VIEW_EVENT = "love21-simple-view";
const HIGH_CONTRAST_KEY = "high-contrast";
const HIGH_CONTRAST_EVENT = "love21-high-contrast";
const TEXT_SIZE_KEY = "text-size";
const TEXT_SIZE_EVENT = "love21-text-size";
const TEXT_SIZE_MAX = 2;

function subscribeLocalStorage(eventName: string, onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(eventName, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(eventName, onStoreChange);
  };
}

function getBoolSnapshot(key: string) {
  return window.localStorage.getItem(key) === "on";
}

function getNumberSnapshot(key: string, min: number, max: number) {
  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.round(value)))
    : 0;
}

const simpleViewStore = {
  subscribe: (onStoreChange: () => void) =>
    subscribeLocalStorage(SIMPLE_VIEW_EVENT, onStoreChange),
  getSnapshot: () => getBoolSnapshot(SIMPLE_VIEW_KEY),
  getServerSnapshot: () => false,
};

const highContrastStore = {
  subscribe: (onStoreChange: () => void) =>
    subscribeLocalStorage(HIGH_CONTRAST_EVENT, onStoreChange),
  getSnapshot: () => getBoolSnapshot(HIGH_CONTRAST_KEY),
  getServerSnapshot: () => false,
};

const textSizeStore = {
  subscribe: (onStoreChange: () => void) =>
    subscribeLocalStorage(TEXT_SIZE_EVENT, onStoreChange),
  getSnapshot: () => getNumberSnapshot(TEXT_SIZE_KEY, 0, TEXT_SIZE_MAX),
  getServerSnapshot: () => 0,
};

const enAbout = [
  ["Our Story", "/our-story/"],
  ["Trust & Transparency", "/our-finance/"],
  ["Leadership & Staff", "/leadership/"],
  ["Media", "/media/"],
];

const zhAbout = [
  ["關於我們", "/zh/our-story-hk/"],
  ["信任與透明", "/zh/our-finance-hk/"],
  ["管理層與員工", "/zh/leadership-hk/"],
  ["媒體報導", "/zh/media-hk/"],
];

const cnAbout = [
  ["关于我们", "/cn/our-story/"],
  ["信任与透明", "/cn/our-finance/"],
  ["管理层与员工", "/cn/leadership/"],
  ["媒体报道", "/cn/media/"],
];

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M3.5 12h17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
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

function JoinMenu({
  locale,
  loginPath,
  donatePath,
  volunteerPath,
  loginLabel,
  donateLabel,
  volunteerLabel,
  triggerLabel,
  className,
}: {
  locale: Locale;
  loginPath: string;
  donatePath: string;
  volunteerPath: string;
  loginLabel: string;
  donateLabel: string;
  volunteerLabel: string;
  triggerLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`${styles.joinMenu} ${className ?? ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${styles.joinTrigger} ${open ? styles.joinTriggerOpen : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={triggerLabel}
        onClick={() => setOpen(true)}
      >
        <span className={styles.joinTriggerLabel}>
          {triggerLabel}
          <HeartIcon className={styles.joinInlineHeart} />
        </span>
      </button>
      {open ? (
        <div
          className={styles.joinPanel}
          role="menu"
          aria-label={
            locale === "zh" ? "加入選項" : locale === "cn" ? "加入选项" : "Join options"
          }
        >
          <span className={styles.joinHearts} aria-hidden="true">
            <HeartIcon className={`${styles.joinHeart} ${styles.joinHeartOne}`} />
            <HeartIcon className={`${styles.joinHeart} ${styles.joinHeartTwo}`} />
            <HeartIcon className={`${styles.joinHeart} ${styles.joinHeartThree}`} />
            <HeartIcon className={`${styles.joinHeart} ${styles.joinHeartFour}`} />
            <HeartIcon className={`${styles.joinHeart} ${styles.joinHeartFive}`} />
            <HeartIcon className={`${styles.joinHeart} ${styles.joinHeartSix}`} />
          </span>
          <Link
            href={donatePath}
            role="menuitem"
            className={`${styles.joinOption} ${styles.joinOptionDonate}`}
            onClick={() => setOpen(false)}
          >
            {donateLabel}
          </Link>
          <Link
            href={volunteerPath}
            role="menuitem"
            className={`${styles.joinOption} ${styles.joinOptionVolunteer}`}
            onClick={() => setOpen(false)}
          >
            {volunteerLabel}
          </Link>
          <Link
            href={loginPath}
            role="menuitem"
            className={`${styles.joinOption} ${styles.joinOptionLogin}`}
            onClick={() => setOpen(false)}
          >
            {loginLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function LanguageMenu({
  locale,
  paths,
}: {
  locale: Locale;
  paths: { en: string; zh: string; cn: string };
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const label = (zh: string, cn: string, en: string) =>
    locale === "zh" ? zh : locale === "cn" ? cn : en;

  const options = [
    { id: "en" as const, href: paths.en, short: "EN", name: "English" },
    { id: "zh" as const, href: paths.zh, short: "繁", name: "繁體中文" },
    { id: "cn" as const, href: paths.cn, short: "简", name: "简体中文" },
  ].filter((option) => Boolean(option.href));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.languageMenu}>
      <button
        type="button"
        className={`${styles.accessTrigger} ${open ? styles.accessTriggerOpen : ""}`}
        aria-label={label("語言", "语言", "Language")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <GlobeIcon className={styles.languageIcon} />
      </button>
      {open ? (
        <div
          className={styles.languagePanel}
          role="menu"
          aria-label={label("語言", "语言", "Language")}
        >
          {options.map((option) => (
            <Link
              key={option.id}
              href={option.href}
              role="menuitem"
              className={`${styles.languageOption} ${locale === option.id ? styles.languageOptionActive : ""}`}
              aria-current={locale === option.id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className={styles.languageOptionName}>{option.name}</span>
              <span className={styles.languageOptionShort}>{option.short}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AccessibilityMenu({
  locale,
  simpleView,
  highContrast,
  textSize,
  onToggleSimpleView,
  onToggleHighContrast,
  onAdjustTextSize,
}: {
  locale: Locale;
  simpleView: boolean;
  highContrast: boolean;
  textSize: number;
  onToggleSimpleView: () => void;
  onToggleHighContrast: () => void;
  onAdjustTextSize: (delta: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const a11y = (zh: string, cn: string, en: string) =>
    locale === "zh" ? zh : locale === "cn" ? cn : en;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const contrastLabel = a11y("高對比度", "高对比度", "High contrast");
  const textLabel = a11y("文字大小", "文字大小", "Text size");
  const calmLabel = a11y("舒適模式", "舒适模式", "Calm mode");

  const panel = (
    <div
      className={styles.accessPanel}
      role="group"
      aria-label={a11y("無障礙設定", "无障碍设置", "Accessibility settings")}
    >
      <p className={styles.accessHeading}>{a11y("無障礙設定", "无障碍设置", "Accessibility")}</p>

      <div className={styles.accessRow}>
        <span className={styles.accessLabel}>{contrastLabel}</span>
        <button
          type="button"
          className={`${styles.accessToggle} ${highContrast ? styles.accessToggleOn : ""}`}
          aria-pressed={highContrast}
          onClick={onToggleHighContrast}
        >
          {highContrast ? a11y("已開啟", "已开启", "On") : a11y("已關閉", "已关闭", "Off")}
        </button>
      </div>

      <div className={styles.accessRow}>
        <span className={styles.accessLabel}>{textLabel}</span>
        <span className={styles.accessTextSize}>
          <button
            type="button"
            className={styles.accessTextBtn}
            aria-label={a11y("減小文字", "减小文字", "Decrease text size")}
            disabled={textSize === 0}
            onClick={() => onAdjustTextSize(-1)}
          >
            A−
          </button>
          <button
            type="button"
            className={styles.accessTextBtn}
            aria-label={a11y("增大文字", "增大文字", "Increase text size")}
            disabled={textSize === TEXT_SIZE_MAX}
            onClick={() => onAdjustTextSize(1)}
          >
            A+
          </button>
        </span>
      </div>

      <div className={styles.accessRow}>
        <span className={styles.accessLabel}>{calmLabel}</span>
        <button
          type="button"
          className={`${styles.accessToggle} ${simpleView ? styles.accessToggleOn : ""}`}
          aria-pressed={simpleView}
          onClick={onToggleSimpleView}
        >
          {simpleView ? a11y("已開啟", "已开启", "On") : a11y("已關閉", "已关闭", "Off")}
        </button>
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className={styles.accessMenu}>
      <button
        type="button"
        className={`${styles.accessTrigger} ${open ? styles.accessTriggerOpen : ""}`}
        aria-label={a11y("無障礙設定", "无障碍设置", "Accessibility settings")}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Image
          src="/assets/images/accessibility-symbol.png"
          alt=""
          width={250}
          height={250}
          className={styles.accessIcon}
        />
      </button>
      {open ? panel : null}
    </div>
  );
}

function MenuGroup({
  locale,
  label,
  href,
  items,
  open = false,
  onToggle,
  variant = "desktop",
}: {
  locale: Locale;
  label: string;
  href: string;
  items: string[][];
  open?: boolean;
  onToggle?: () => void;
  variant?: "desktop" | "mobile";
}) {
  if (variant === "mobile") {
    return (
      <div className={`${styles.mobileNavGroup} ${open ? styles.mobileNavGroupOpen : ""}`}>
        <div className={styles.mobileNavGroupHeader}>
          <Link href={href} className={styles.mobileNavGroupLink}>
            {label}
          </Link>
          <button
            type="button"
            className={styles.mobileNavGroupTrigger}
            aria-expanded={open}
            aria-label={
              open
                ? locale === "zh"
                  ? "收起選單"
                  : locale === "cn"
                    ? "收起选单"
                    : "Collapse menu"
                : locale === "zh"
                  ? "展開選單"
                  : locale === "cn"
                    ? "展开选单"
                    : "Expand menu"
            }
            onClick={onToggle}
          >
            <span aria-hidden="true">⌄</span>
          </button>
        </div>
        <div className={styles.mobileNavDropdown}>
          {items.map(([text, href]) => (
            <Link href={href} key={`${text}-${href}`}>
              {text}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.navGroup}>
      <Link href={href} className={styles.navGroupLink}>
        {label}
      </Link>
      <div className={styles.navDropdown}>
        {items.map(([text, href]) => (
          <Link href={href} key={`${text}-${href}`}>
            {text}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = normalizePath(usePathname() || "/");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const locale: Locale = pathname.startsWith("/cn/")
    ? "cn"
    : pathname.startsWith("/zh/")
      ? "zh"
      : "en";
  const zh = locale === "zh";
  const cn = locale === "cn";
  const pick = (en: string, zht: string, zhc: string) =>
    cn ? zhc : zh ? zht : en;
  const { user: session } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const simpleView = useSyncExternalStore(
    simpleViewStore.subscribe,
    simpleViewStore.getSnapshot,
    simpleViewStore.getServerSnapshot,
  );
  const highContrast = useSyncExternalStore(
    highContrastStore.subscribe,
    highContrastStore.getSnapshot,
    highContrastStore.getServerSnapshot,
  );
  const textSize = useSyncExternalStore(
    textSizeStore.subscribe,
    textSizeStore.getSnapshot,
    textSizeStore.getServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("simple-view", simpleView);
  }, [simpleView]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("text-large", textSize === 1);
    root.classList.toggle("text-largest", textSize === 2);
  }, [textSize]);

  useEffect(() => {
    document.documentElement.lang =
      locale === "zh" ? "zh-Hant" : locale === "cn" ? "zh-Hans" : "en";
  }, [locale]);

  useEffect(() => {
    document.body.classList.toggle("admin-view", isAdminRoute);
    return () => document.body.classList.remove("admin-view");
  }, [isAdminRoute]);

  if (isAdminRoute) return <>{children}</>;

  const toggleSimpleView = () => {
    const next = !simpleView;
    window.localStorage.setItem(SIMPLE_VIEW_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event(SIMPLE_VIEW_EVENT));
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    window.localStorage.setItem(HIGH_CONTRAST_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event(HIGH_CONTRAST_EVENT));
  };

  const adjustTextSize = (delta: number) => {
    const next = Math.min(TEXT_SIZE_MAX, Math.max(0, textSize + delta));
    window.localStorage.setItem(TEXT_SIZE_KEY, String(next));
    window.dispatchEvent(new Event(TEXT_SIZE_EVENT));
  };

  const trio = localePaths(pathname);
  const aboutItems = cn ? cnAbout : zh ? zhAbout : enAbout;
  const contactPath = pick("/contact-us/", "/zh/contact-us-hk/", "/cn/contact-us/");
  const eventsPath = pick("/events", "/zh/events-hk/", "/cn/events");
  const storiesPath = pick("/stories/", "/zh/stories-hk/", "/cn/stories/");
  const portalPath = "/portal";
  const loginPath = pick("/login/", "/zh/login-hk/", "/cn/login-hk/");
  const portalLabel = pick("My portal", "個人頁面", "个人页面");
  const loginLabel = pick("Login", "登入", "登录");
  const joinLabel = pick("Make a difference", "一起帶來改變", "一起带来改变");
  const signOutLabel = pick("Sign out", "登出", "退出登录");
  const signOutPendingLabel = pick("Signing out…", "登出中…", "退出中…");
  const volunteerPath = pick("/our-volunteer/", "/zh/our-volunteer-hk/", "/cn/our-volunteer/");
  const volunteerSignupPath = pick(
    "/signup?role=volunteer",
    "/zh/signup-hk/?role=volunteer",
    "/cn/signup-hk/?role=volunteer",
  );
  const volunteerLabel = pick("Volunteer", "做義工", "做义工");
  const donatePath = pick("/donate/", "/zh/donate-hk/", "/cn/donate/");
  const donateLabel = pick("Donate", "捐贈", "捐赠");
  const eventsLabel = pick("Events", "活動", "活动");
  const storiesLabel = pick("Member Stories", "會員故事", "会员故事");
  const homePath = cn ? "/cn/" : zh ? "/zh/" : "/";
  const missionLine = cn
    ? "通过运动、营养及全面支援，为唐氏综合症和自闭症社群带来机会与包容。"
    : zh
      ? "透過運動、營養及全面支援，為唐氏綜合症和自閉症社群帶來機會與包容。"
      : "Opportunity, inclusion and support for the Down syndrome and autistic community through sport, nutrition and holistic programmes.";

  const closeMobileNav = () => {
    setMobileOpen(false);
    setOpenGroup(null);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerBrand}>
            <BrandLockup href={homePath} compact />
          </div>

          <nav className={styles.primaryNav} aria-label="Primary">
            <MenuGroup
              locale={locale}
              label={pick("About", "關於", "关于")}
              href={pick("/our-story/", "/zh/our-story-hk/", "/cn/our-story/")}
              items={aboutItems}
            />
            <Link href={eventsPath} className={styles.navLink}>
              {eventsLabel}
            </Link>
            <Link href={storiesPath} className={styles.navLink}>
              {storiesLabel}
            </Link>
            <Link href={contactPath} className={styles.navLink}>
              {pick("Contact Us", "聯絡我們", "联系我们")}
            </Link>
          </nav>

          <div className={styles.headerActions}>
            {session ? (
              <>
                <Link href={portalPath} className={styles.memberLogin}>
                  {portalLabel}
                </Link>
                <SignOutButton
                  className={styles.signOutPill}
                  label={signOutLabel}
                  pendingLabel={signOutPendingLabel}
                />
                <Link
                  href={portalPath}
                  className={`${styles.memberLogin} ${styles.memberLoginCompact}`}
                >
                  {portalLabel}
                </Link>
              </>
            ) : (
              <JoinMenu
                locale={locale}
                loginPath={loginPath}
                donatePath={donatePath}
                volunteerPath={volunteerSignupPath}
                loginLabel={loginLabel}
                donateLabel={donateLabel}
                volunteerLabel={volunteerLabel}
                triggerLabel={joinLabel}
              />
            )}

            <button
              type="button"
              className={`${styles.mobileToggle} ${mobileOpen ? styles.mobileToggleOpen : ""}`}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav
          className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ""}`}
          aria-label="Mobile"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) {
              closeMobileNav();
            }
          }}
        >
          <MenuGroup
            locale={locale}
            label={pick("About", "關於", "关于")}
            href={pick("/our-story/", "/zh/our-story-hk/", "/cn/our-story/")}
            items={aboutItems}
            open={openGroup === "about"}
            onToggle={() => setOpenGroup(openGroup === "about" ? null : "about")}
            variant="mobile"
          />
          <Link href={eventsPath} className={styles.mobileNavLink}>
            {eventsLabel}
          </Link>
          <Link href={storiesPath} className={styles.mobileNavLink}>
            {storiesLabel}
          </Link>
          <Link href={contactPath} className={styles.mobileNavLink}>
            {pick("Contact Us", "聯絡我們", "联系我们")}
          </Link>

          <div className={styles.mobileUtility}>
            <div className={styles.mobileUtilityRow}>
              {session ? (
                <>
                  <Link href={portalPath} className={styles.memberLogin}>
                    {portalLabel}
                  </Link>
                  <SignOutButton
                    className={styles.signOutPill}
                    label={signOutLabel}
                    pendingLabel={signOutPendingLabel}
                  />
                </>
              ) : (
                <>
                  <Link href={loginPath} className={styles.memberLogin}>
                    {loginLabel}
                  </Link>
                  <Link href={donatePath} className={styles.mobileUtilityDonate}>
                    {donateLabel}
                  </Link>
                  <Link href={volunteerSignupPath} className={styles.volunteerPill}>
                    {volunteerLabel}
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div className={styles.floatingTools} aria-label={pick("Site tools", "網站工具", "网站工具")}>
        <AccessibilityMenu
          locale={locale}
          simpleView={simpleView}
          highContrast={highContrast}
          textSize={textSize}
          onToggleSimpleView={toggleSimpleView}
          onToggleHighContrast={toggleHighContrast}
          onAdjustTextSize={adjustTextSize}
        />
        <LanguageMenu locale={locale} paths={trio} />
      </div>

      <main>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <BrandLockup href={homePath} />
            <p className={styles.footerMission}>{missionLine}</p>
            <span className={styles.footerBadge}>
              {pick("Support Love 21", "支持 Love 21", "支持 Love 21")}
            </span>
          </div>

          <div className={styles.footerColumns}>
            <div className={styles.footerColumn}>
              <strong className={styles.footerColumnTitle}>
                {pick("Explore", "探索", "探索")}
              </strong>
              <span className={styles.footerSubheading}>
                {pick("About Us", "關於我們", "关于我们")}
              </span>
              {aboutItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
              <Link href={eventsPath}>{eventsLabel}</Link>
              <Link href={storiesPath}>{storiesLabel}</Link>
            </div>

            <div className={styles.footerColumn}>
              <strong className={styles.footerColumnTitle}>
                {pick("Support", "支持", "支持")}
              </strong>
              <Link href={volunteerPath}>{volunteerLabel}</Link>
              <Link href={donatePath}>{donateLabel}</Link>
            </div>

            <div className={styles.footerColumn}>
              <strong className={styles.footerColumnTitle}>
                {pick("Connect", "聯繫", "联系")}
              </strong>
              <Link href={contactPath}>{pick("Contact Us", "聯絡我們", "联系我们")}</Link>
              <a
                href="https://www.facebook.com/Love21foundation/"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/love21foundation/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBottomRow}>
            <div className={styles.footerLanguage} aria-label="Language">
              <Link
                href={trio.en}
                className={locale === "en" ? styles.footerLanguageActive : undefined}
              >
                EN
              </Link>
              <span className={styles.languageDivider} aria-hidden="true">
                |
              </span>
              <Link
                href={trio.zh}
                className={locale === "zh" ? styles.footerLanguageActive : undefined}
              >
                繁
              </Link>
              <span className={styles.languageDivider} aria-hidden="true">
                |
              </span>
              <Link
                href={trio.cn}
                className={locale === "cn" ? styles.footerLanguageActive : undefined}
              >
                简
              </Link>
            </div>

            <div className={styles.socialLinks}>
              <a
                className={styles.socialLink}
                href="https://www.facebook.com/Love21foundation/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                FB
              </a>
              <a
                className={styles.socialLink}
                href="https://www.instagram.com/love21foundation/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                IG
              </a>
            </div>
          </div>

          <div className={styles.footerMeta}>
            <span>© 2019 - 2026 Love 21 Foundation</span>
            <span>
              Website donated by{" "}
              <a href="https://five.co/" target="_blank" rel="noreferrer">
                Five Software Pty Ltd.
              </a>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
