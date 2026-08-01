"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { alternatePaths, normalizePath } from "../content/site-data";
import { authClient } from "../lib/auth-client";
import { BrandLockup } from "./ui/BrandLockup";
import styles from "./SiteChrome.module.css";

const SIMPLE_VIEW_KEY = "simple-view";
const SIMPLE_VIEW_EVENT = "love21-simple-view";

function subscribeSimpleView(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SIMPLE_VIEW_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SIMPLE_VIEW_EVENT, onStoreChange);
  };
}

function getSimpleViewSnapshot() {
  return window.localStorage.getItem(SIMPLE_VIEW_KEY) === "on";
}

function getSimpleViewServerSnapshot() {
  return false;
}

const enAbout = [
  ["Our Story", "/our-story/"],
  ["Impact & Reports", "/our-finance/"],
  ["Leadership & Staff", "/leadership/"],
  ["Media", "/media/"],
];

const zhAbout = [
  ["關於我們", "/zh/our-story-hk/"],
  ["影響與報告", "/zh/our-finance-hk/"],
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
  ["Volunteer Opportunities", "/get-involved/#opportunities"],
  ["Corporate Partnerships", "/get-involved/#corporate"],
];

const zhInvolved = [
  ["參與我們", "/zh/get-involved-hk/"],
  ["義工機會", "/zh/get-involved-hk/#opportunities"],
  ["企業夥伴", "/zh/get-involved-hk/#corporate"],
];

function CalmModeToggle({
  zh,
  simpleView,
  onToggle,
  className,
  showLabel = true,
}: {
  zh: boolean;
  simpleView: boolean;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
}) {
  const calmLabel = zh ? "舒適模式" : "Calm mode";

  return (
    <button
      type="button"
      className={`${styles.calmToggle} ${simpleView ? styles.calmToggleOn : ""} ${className ?? ""}`}
      aria-label={zh ? "切換舒適模式" : "Toggle calm mode"}
      aria-pressed={simpleView}
      title={calmLabel}
      onClick={onToggle}
    >
      <span className={styles.calmIndicator} aria-hidden="true" />
      {showLabel ? (
        <>
          <span className={styles.calmLabel}>
            <span className={styles.calmLabelFull}>{calmLabel}</span>
            <span className={styles.calmLabelShort}>{zh ? "舒適" : "Calm"}</span>
          </span>
        </>
      ) : null}
    </button>
  );
}

function MenuGroup({
  label,
  items,
  open = false,
  onToggle,
  variant = "desktop",
}: {
  label: string;
  items: string[][];
  open?: boolean;
  onToggle?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
  variant?: "desktop" | "mobile";
}) {
  if (variant === "mobile") {
    return (
      <div className={`${styles.mobileNavGroup} ${open ? styles.mobileNavGroupOpen : ""}`}>
        <button
          className={styles.mobileNavGroupTrigger}
          type="button"
          aria-expanded={open}
          onClick={onToggle}
        >
          {label}
          <span aria-hidden="true">⌄</span>
        </button>
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
    <div
      className={styles.navGroup}
      onMouseLeave={(event) => {
        const active = document.activeElement;
        if (
          active instanceof HTMLElement &&
          event.currentTarget.contains(active)
        ) {
          active.blur();
        }
      }}
    >
      <button
        className={styles.navGroupTrigger}
        type="button"
        aria-expanded={false}
        aria-haspopup="true"
      >
        {label}
        <span aria-hidden="true">⌄</span>
      </button>
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
  const { data: session } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const simpleView = useSyncExternalStore(
    subscribeSimpleView,
    getSimpleViewSnapshot,
    getSimpleViewServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("simple-view", simpleView);
  }, [simpleView]);

  useEffect(() => {
    document.documentElement.lang = zh ? "zh-Hant" : "en";
  }, [zh]);

  const toggleSimpleView = () => {
    const next = !simpleView;
    window.localStorage.setItem(SIMPLE_VIEW_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event(SIMPLE_VIEW_EVENT));
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
            <MenuGroup label={zh ? "關於" : "About"} items={aboutItems} />
            <Link
              href={zh ? "/zh/our-programmes-hk/" : "/our-programmes/"}
              className={styles.navLink}
            >
              {zh ? "我們的計劃" : "Our Programmes"}
            </Link>
            <MenuGroup
              label={zh ? "活動與行事曆" : "Activities & Calendar"}
              items={activityItems}
            />
            <MenuGroup
              label={zh ? "參與我們" : "Get Involved"}
              items={involvedItems}
            />
            <Link href={contactPath} className={styles.navLink}>
              {zh ? "聯絡我們" : "Contact Us"}
            </Link>
          </nav>

          <div className={styles.headerActions}>
            <CalmModeToggle
              zh={zh}
              simpleView={simpleView}
              onToggle={toggleSimpleView}
              className={styles.calmToggleHeader}
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
            label={zh ? "關於" : "About"}
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
            label={zh ? "活動與行事曆" : "Activities & Calendar"}
            items={activityItems}
            open={openGroup === "activities"}
            onToggle={() =>
              setOpenGroup(openGroup === "activities" ? null : "activities")
            }
            variant="mobile"
          />
          <MenuGroup
            label={zh ? "參與我們" : "Get Involved"}
            items={involvedItems}
            open={openGroup === "involved"}
            onToggle={() =>
              setOpenGroup(openGroup === "involved" ? null : "involved")
            }
            variant="mobile"
          />
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
            <CalmModeToggle
              zh={zh}
              simpleView={simpleView}
              onToggle={toggleSimpleView}
              className={styles.mobileCalmToggle}
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
