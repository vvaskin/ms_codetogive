"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localePaths, normalizePath, type Locale } from "../content/site-data";
import { useUser } from "../lib/supabase/use-user";
import { SignOutButton } from "./SignOutButton";
import { SiteToolsTray } from "./SiteTools";
import { BrandLockup } from "./ui/BrandLockup";
import { HeartIcon } from "./ui/HeartIcon";
import styles from "./SiteChrome.module.css";

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

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = normalizePath(usePathname() || "/");
  const locale: Locale = pathname.startsWith("/cn/")
    ? "cn"
    : pathname.startsWith("/zh/")
      ? "zh"
      : "en";
  const zh = locale === "zh";
  const cn = locale === "cn";
  const pick = (en: string, zht: string, zhc: string) =>
    cn ? zhc : zh ? zht : en;
  // Portal pages use a slim header: logo + accessibility + language only,
  // with the marketing navigation removed.
  const isPortal = pathname.startsWith("/portal");
  const isAdmin = pathname.startsWith("/admin");
  const { user: session } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang =
      locale === "zh" ? "zh-Hant" : locale === "cn" ? "zh-Hans" : "en";
  }, [locale]);

  const trio = localePaths(pathname);
  const aboutPath = pick("/about/", "/zh/about-hk/", "/cn/about/");
  const aboutLabel = pick("About", "關於", "关于");
  const contactPath = pick("/contact-us/", "/zh/contact-us-hk/", "/cn/contact-us/");
  const eventsPath = pick("/events", "/zh/events-hk/", "/cn/events");
  const storiesPath = pick("/stories/", "/zh/stories-hk/", "/cn/stories/");
  const hubPath = "/neurodiversity-hub/";
  const portalPath = "/portal";
  const loginPath = pick("/login/", "/zh/login-hk/", "/cn/login-hk/");
  const portalLabel = pick("My portal", "個人頁面", "个人页面");
  const loginLabel = pick("Login", "登入", "登录");
  const joinLabel = pick("Make a difference", "一起帶來改變", "一起带来改变");
  const signOutLabel = pick("Sign out", "登出", "退出登录");
  const signOutPendingLabel = pick("Signing out…", "登出中…", "退出中…");
  const volunteerSignupPath = pick(
    "/signup?role=contributor",
    "/zh/signup-hk/?role=contributor",
    "/cn/signup-hk/?role=contributor",
  );
  const volunteerLabel = pick("Volunteer", "做義工", "做义工");
  const donatePath = pick("/donate/", "/zh/donate-hk/", "/cn/donate/");
  const donateLabel = pick("Donate", "捐贈", "捐赠");
  const eventsLabel = pick("Events", "活動", "活动");
  const storiesLabel = pick("Member Stories", "會員故事", "会员故事");
  const hubLabel = pick("Neurodiversity Hub", "神經多樣性中心", "神经多样性中心");
  const homePath = cn ? "/cn/" : zh ? "/zh/" : "/";
  const missionLine = cn
    ? "通过运动、营养及全面支援，为唐氏综合症和自闭症社群带来机会与包容。"
    : zh
      ? "透過運動、營養及全面支援，為唐氏綜合症和自閉症社群帶來機會與包容。"
      : "Opportunity, inclusion and support for the Down syndrome and autistic community through sport, nutrition and holistic programmes.";

  const closeMobileNav = () => {
    setMobileOpen(false);
  };

  // Portal and admin routes render their own chrome (PortalShell / AdminLayout);
  // the site header and footer are hidden entirely.
  if (isPortal || isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <header className={`${styles.header} ${isPortal ? styles.headerPortal : ""}`}>
        <div className={styles.headerInner}>
          <div className={styles.headerBrand}>
            <BrandLockup href={homePath} compact />
          </div>

          {!isPortal && (
          <nav className={styles.primaryNav} aria-label="Primary">
            <Link href={aboutPath} className={styles.navLink}>
              {aboutLabel}
            </Link>
            <Link href={eventsPath} className={styles.navLink}>
              {eventsLabel}
            </Link>
            <Link href={storiesPath} className={styles.navLink}>
              {storiesLabel}
            </Link>
            <Link href={hubPath} className={styles.navLink}>
              {hubLabel}
            </Link>
            <Link href={contactPath} className={styles.navLink}>
              {pick("Contact Us", "聯絡我們", "联系我们")}
            </Link>
          </nav>
          )}

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

        {!isPortal && (
        <nav
          className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ""}`}
          aria-label="Mobile"
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) {
              closeMobileNav();
            }
          }}
        >
          <Link href={hubPath} className={styles.mobileNavLink}>
            {hubLabel}
          </Link>
          <Link href={aboutPath} className={styles.mobileNavLink}>
            {aboutLabel}
          </Link>
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
        )}
      </header>

      <SiteToolsTray locale={locale} paths={trio} />

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
              <Link href={aboutPath}>{aboutLabel}</Link>
              <Link href={eventsPath}>{eventsLabel}</Link>
              <Link href={storiesPath}>{storiesLabel}</Link>
            </div>

            <div className={styles.footerColumn}>
              <strong className={styles.footerColumnTitle}>
                {pick("Support", "支持", "支持")}
              </strong>
              <Link href={volunteerSignupPath}>{volunteerLabel}</Link>
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
