"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { alternatePaths, normalizePath } from "../content/site-data";
import { useUser } from "../lib/supabase/use-user";
import { BrandLockup } from "./ui/BrandLockup";
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

const enProgrammes = [
  ["Sport", "/our-programmes/#sport"],
  ["Nutrition", "/our-programmes/#nutrition"],
  ["Family", "/our-programmes/#family"],
  ["CSR", "/our-programmes/#csr"],
];

const zhProgrammes = [
  ["體育", "/zh/our-programmes-hk/#sport"],
  ["飲食與營養", "/zh/our-programmes-hk/#nutrition"],
  ["家庭", "/zh/our-programmes-hk/#family"],
  ["企業社會責任", "/zh/our-programmes-hk/#csr"],
];

const enActivities = [
  ["Activity Schedule", "/events"],
  ["Member Stories", "/stories/"],
  ["How Families Join", "/join-us/"],
];

const zhActivities = [
  ["活動時間表", "/zh/events-hk/"],
  ["會員故事", "/zh/stories-hk/"],
  ["如何加入", "/zh/join-us-hk/"],
];

const enInvolved = [
  ["Get Involved", "/get-involved/"],
];

const zhInvolved = [
  ["參與我們", "/zh/get-involved-hk/"],
];

function AccessibilityMenu({
  zh,
  mobile = false,
  simpleView,
  highContrast,
  textSize,
  onToggleSimpleView,
  onToggleHighContrast,
  onAdjustTextSize,
  className,
}: {
  zh: boolean;
  mobile?: boolean;
  simpleView: boolean;
  highContrast: boolean;
  textSize: number;
  onToggleSimpleView: () => void;
  onToggleHighContrast: () => void;
  onAdjustTextSize: (delta: number) => void;
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

  const contrastLabel = zh ? "高對比度" : "High contrast";
  const textLabel = zh ? "文字大小" : "Text size";
  const calmLabel = zh ? "舒適模式" : "Calm mode";

  const panel = (
    <div
      className={`${styles.accessPanel} ${mobile ? styles.accessPanelMobile : ""}`}
      role="group"
      aria-label={zh ? "無障礙設定" : "Accessibility settings"}
    >
      <p className={styles.accessHeading}>{zh ? "無障礙設定" : "Accessibility"}</p>

      <div className={styles.accessRow}>
        <span className={styles.accessLabel}>{contrastLabel}</span>
        <button
          type="button"
          className={`${styles.accessToggle} ${highContrast ? styles.accessToggleOn : ""}`}
          aria-pressed={highContrast}
          onClick={onToggleHighContrast}
        >
          {highContrast ? (zh ? "已開啟" : "On") : zh ? "已關閉" : "Off"}
        </button>
      </div>

      <div className={styles.accessRow}>
        <span className={styles.accessLabel}>{textLabel}</span>
        <span className={styles.accessTextSize}>
          <button
            type="button"
            className={styles.accessTextBtn}
            aria-label={zh ? "減小文字" : "Decrease text size"}
            disabled={textSize === 0}
            onClick={() => onAdjustTextSize(-1)}
          >
            A−
          </button>
          <button
            type="button"
            className={styles.accessTextBtn}
            aria-label={zh ? "增大文字" : "Increase text size"}
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
          {simpleView ? (zh ? "已開啟" : "On") : zh ? "已關閉" : "Off"}
        </button>
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className={`${styles.accessMenu} ${className ?? ""}`}>
      {mobile ? (
        panel
      ) : (
        <>
          <button
            type="button"
            className={`${styles.accessTrigger} ${open ? styles.accessTriggerOpen : ""}`}
            aria-label={zh ? "無障礙設定" : "Accessibility settings"}
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
        </>
      )}
    </div>
  );
}

function MenuGroup({
  zh,
  label,
  href,
  items,
  open = false,
  onToggle,
  variant = "desktop",
}: {
  zh: boolean;
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
                ? zh
                  ? "收起選單"
                  : "Collapse menu"
                : zh
                  ? "展開選單"
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
  const zh = pathname.startsWith("/zh/");
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
    document.documentElement.lang = zh ? "zh-Hant" : "en";
  }, [zh]);

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

  const alternate = alternatePaths[pathname] || (zh ? "/" : "/zh/");
  const aboutItems = zh ? zhAbout : enAbout;
  const programmeItems = zh ? zhProgrammes : enProgrammes;
  const activityItems = zh ? zhActivities : enActivities;
  const involvedItems = zh ? zhInvolved : enInvolved;
  const contactPath = zh ? "/zh/contact-us-hk/" : "/contact-us/";
  const loginPath = session ? "/portal" : "/login/";
  const memberLabel = session
    ? zh
      ? "個人頁面"
      : "My portal"
    : zh
      ? "註冊 / 登入"
      : "Sign up / Login";
  const volunteerPath = zh ? "/zh/our-volunteer-hk/" : "/our-volunteer/";
  const volunteerLabel = zh ? "做義工" : "Volunteer";
  const donatePath = zh ? "/zh/donate-hk/" : "/donate/";
  const homePath = zh ? "/zh/" : "/";
  const enPath = zh ? alternate : pathname;
  const zhPath = zh ? pathname : alternate;
  const missionLine = zh
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
              zh={zh}
              label={zh ? "關於" : "About"}
              href={zh ? "/zh/our-story-hk/" : "/our-story/"}
              items={aboutItems}
            />
            <Link
              href={zh ? "/zh/our-programmes-hk/" : "/our-programmes/"}
              className={styles.navLink}
            >
              {zh ? "我們的計劃" : "Our Programmes"}
            </Link>
            <MenuGroup
              zh={zh}
              label={zh ? "活動與行事曆" : "Activities & Calendar"}
              href={zh ? "/zh/events-hk/" : "/events"}
              items={activityItems}
            />
            <Link
              href={zh ? "/zh/get-involved-hk/" : "/get-involved/"}
              className={styles.navLink}
            >
              {zh ? "參與我們" : "Get Involved"}
            </Link>
            <Link href={contactPath} className={styles.navLink}>
              {zh ? "聯絡我們" : "Contact Us"}
            </Link>
          </nav>

          <div className={styles.headerActions}>
            <AccessibilityMenu
              zh={zh}
              simpleView={simpleView}
              highContrast={highContrast}
              textSize={textSize}
              onToggleSimpleView={toggleSimpleView}
              onToggleHighContrast={toggleHighContrast}
              onAdjustTextSize={adjustTextSize}
              className={styles.accessHeader}
            />

            <div className={styles.languageLinks} aria-label="Language">
              <Link
                href={enPath}
                className={!zh ? styles.languageActive : undefined}
              >
                EN
              </Link>
              <span className={styles.languageDivider} aria-hidden="true">
                ·
              </span>
              <Link
                href={zhPath}
                className={zh ? styles.languageActive : undefined}
              >
                繁
              </Link>
              <span className={styles.languageDivider} aria-hidden="true">
                ·
              </span>
              <span
                className={styles.languageSoon}
                aria-disabled="true"
                title={
                  zh ? "簡體中文即將推出" : "Simplified Chinese coming soon"
                }
              >
                简
              </span>
            </div>

            <Link href={loginPath} className={styles.memberLogin}>
              {memberLabel}
            </Link>

            <Link href={donatePath} className={styles.donatePill}>
              {zh ? "捐贈" : "Donate"}
            </Link>

            <Link href={volunteerPath} className={styles.volunteerPill}>
              {volunteerLabel}
            </Link>

            <Link
              href={donatePath}
              className={`${styles.donatePill} ${styles.donatePillCompact}`}
            >
              {zh ? "捐贈" : "Donate"}
            </Link>

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
            zh={zh}
            label={zh ? "關於" : "About"}
            href={zh ? "/zh/our-story-hk/" : "/our-story/"}
            items={aboutItems}
            open={openGroup === "about"}
            onToggle={() => setOpenGroup(openGroup === "about" ? null : "about")}
            variant="mobile"
          />
          <Link
            href={zh ? "/zh/our-programmes-hk/" : "/our-programmes/"}
            className={styles.mobileNavLink}
          >
            {zh ? "我們的計劃" : "Our Programmes"}
          </Link>
          <MenuGroup
            zh={zh}
            label={zh ? "活動與行事曆" : "Activities & Calendar"}
            href={zh ? "/zh/events-hk/" : "/events"}
            items={activityItems}
            open={openGroup === "activities"}
            onToggle={() =>
              setOpenGroup(openGroup === "activities" ? null : "activities")
            }
            variant="mobile"
          />
          <Link
            href={zh ? "/zh/get-involved-hk/" : "/get-involved/"}
            className={styles.mobileNavLink}
          >
            {zh ? "參與我們" : "Get Involved"}
          </Link>
          <Link href={contactPath} className={styles.mobileNavLink}>
            {zh ? "聯絡我們" : "Contact Us"}
          </Link>

          <div className={styles.mobileUtility}>
            <div className={styles.mobileUtilityRow}>
              <Link href={loginPath} className={styles.memberLogin}>
                {memberLabel}
              </Link>
              <Link href={donatePath} className={styles.mobileUtilityDonate}>
                {zh ? "捐贈" : "Donate"}
              </Link>
              <Link href={volunteerPath} className={styles.volunteerPill}>
                {volunteerLabel}
              </Link>
            </div>
            <AccessibilityMenu
              zh={zh}
              mobile
              simpleView={simpleView}
              highContrast={highContrast}
              textSize={textSize}
              onToggleSimpleView={toggleSimpleView}
              onToggleHighContrast={toggleHighContrast}
              onAdjustTextSize={adjustTextSize}
              className={styles.mobileAccess}
            />
            <Link href={alternate} className={styles.mobileNavLink}>
              {zh ? "English (EN)" : "繁體中文 (繁)"}
            </Link>
          </div>
        </nav>
      </header>

      {!pathname.startsWith("/portal") && (
        <Link className="floating-donate" href={donatePath}>
          {zh ? "捐贈" : "DONATE"} <span aria-hidden="true">➜</span>
        </Link>
      )}

      <main>{children}</main>

      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <div className={styles.footerBrand}>
            <BrandLockup href={homePath} />
            <p className={styles.footerMission}>{missionLine}</p>
            <span className={styles.footerBadge}>
              {zh ? "支持 Love 21" : "Support Love 21"}
            </span>
          </div>

          <div className={styles.footerColumns}>
            <div className={styles.footerColumn}>
              <strong className={styles.footerColumnTitle}>
                {zh ? "探索" : "Explore"}
              </strong>
              <span className={styles.footerSubheading}>
                {zh ? "關於我們" : "About Us"}
              </span>
              {aboutItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
              <span className={styles.footerSubheading}>
                {zh ? "我們的計劃" : "Our Programmes"}
              </span>
              {programmeItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
              <span className={styles.footerSubheading}>
                {zh ? "活動與行事曆" : "Activities & Calendar"}
              </span>
              {activityItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
            </div>

            <div className={styles.footerColumn}>
              <strong className={styles.footerColumnTitle}>
                {zh ? "參與" : "Get Involved"}
              </strong>
              {involvedItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
              <Link href={loginPath}>{volunteerLabel}</Link>
              <Link href={donatePath}>{zh ? "捐贈" : "Donate"}</Link>
            </div>

            <div className={styles.footerColumn}>
              <strong className={styles.footerColumnTitle}>
                {zh ? "聯繫" : "Connect"}
              </strong>
              <Link href={contactPath}>{zh ? "聯絡我們" : "Contact Us"}</Link>
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
                href={zh ? alternate : pathname}
                className={!zh ? styles.footerLanguageActive : undefined}
              >
                EN
              </Link>
              <span className={styles.languageDivider} aria-hidden="true">
                |
              </span>
              <Link
                href={zh ? pathname : alternate}
                className={zh ? styles.footerLanguageActive : undefined}
              >
                繁
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
