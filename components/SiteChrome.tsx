"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { alternatePaths, normalizePath } from "../content/site-data";
import { authClient } from "../lib/auth-client";

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
  ["Volunteer Opportunities", "/volunteer/"],
  ["Corporate Partnerships", "/corporate/"],
];

const zhInvolved = [
  ["義工機會", "/zh/volunteer-hk/"],
  ["企業夥伴", "/zh/corporate-hk/"],
];

function MenuGroup({
  label,
  items,
  open,
  onToggle,
}: {
  label: string;
  items: string[][];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`nav-group ${open ? "is-open" : ""}`}>
      <button
        className="nav-group-trigger"
        type="button"
        aria-expanded={open}
        onClick={onToggle}
      >
        {label}
        <span aria-hidden="true">⌄</span>
      </button>
      <div className="nav-dropdown">
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
  const [simpleView, setSimpleView] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem("simple-view") === "on",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("simple-view", simpleView);
  }, [simpleView]);

  useEffect(() => {
    document.documentElement.lang = zh ? "zh-Hant" : "en";
  }, [zh]);

  const alternate =
    alternatePaths[pathname] || (zh ? "/" : "/zh/");
  const aboutItems = zh ? zhAbout : enAbout;
  const programmeItems = zh ? zhProgrammes : enProgrammes;
  const activityItems = zh ? zhActivities : enActivities;
  const involvedItems = zh ? zhInvolved : enInvolved;
  const contactPath = zh ? "/zh/contact-us-hk/" : "/contact-us/";
  const loginPath = session ? "/portal" : "/login/";
  const volunteerLabel = session
    ? zh
      ? "個人頁面"
      : "My portal"
    : zh
      ? "做義工"
      : "Volunteer";
  const donatePath = zh ? "/zh/donate-hk/" : "/donate/";

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href={zh ? "/zh/" : "/"} className="brand" aria-label="Love 21 Foundation">
            <Image
              src="/assets/images/logo.png"
              width={165}
              height={101}
              priority
              unoptimized
              alt="Love 21 Foundation Logo"
            />
          </Link>

          <div className="header-content">
            <div className="header-utility">
              <div className="header-ctas">
                <Link href={donatePath} className="utility-donate">
                  <Image
                    src="/assets/images/donation-symbol.png"
                    width={20}
                    height={20}
                    alt=""
                    unoptimized
                  />
                  {zh ? "捐贈" : "Donate"}
                </Link>
                <Link href={loginPath} className="utility-volunteer">
                  <Image
                    src="/assets/images/volunteer-symbol.png"
                    width={20}
                    height={20}
                    alt=""
                    unoptimized
                  />
                  {volunteerLabel}
                </Link>
              </div>
              <button
                type="button"
                className="simple-view-toggle"
                aria-label={zh ? "切換簡易檢視" : "Toggle simple view"}
                aria-pressed={simpleView}
                title={zh ? "簡易檢視" : "Simple View"}
                onClick={() =>
                  setSimpleView((value) => {
                    const next = !value;
                    window.localStorage.setItem(
                      "simple-view",
                      next ? "on" : "off",
                    );
                    return next;
                  })
                }
              >
                <Image
                  src="/assets/images/accessibility-symbol.png"
                  width={24}
                  height={24}
                  alt=""
                  unoptimized
                />
              </button>
              <div className="language-links" aria-label="Language">
                <Link href={zh ? alternate : pathname} className={!zh ? "active" : ""}>
                  EN
                </Link>
                <span>|</span>
                <Link href={zh ? pathname : alternate} className={zh ? "active" : ""}>
                  繁
                </Link>
              </div>
            </div>

            <button
              type="button"
              className="mobile-toggle"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>

            <nav
              className={`main-nav ${mobileOpen ? "is-open" : ""}`}
              aria-label="Primary"
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a")) {
                  setMobileOpen(false);
                  setOpenGroup(null);
                }
              }}
            >
              <MenuGroup
                label={zh ? "關於我們" : "About Us"}
                items={aboutItems}
                open={openGroup === "about"}
                onToggle={() => setOpenGroup(openGroup === "about" ? null : "about")}
              />
              <MenuGroup
                label={zh ? "我們的計劃" : "Our Programmes"}
                items={programmeItems}
                open={openGroup === "programmes"}
                onToggle={() =>
                  setOpenGroup(openGroup === "programmes" ? null : "programmes")
                }
              />
              <MenuGroup
                label={zh ? "活動與行事曆" : "Activities & Calendar"}
                items={activityItems}
                open={openGroup === "activities"}
                onToggle={() =>
                  setOpenGroup(openGroup === "activities" ? null : "activities")
                }
              />
              <MenuGroup
                label={zh ? "參與我們" : "Get Involved"}
                items={involvedItems}
                open={openGroup === "involved"}
                onToggle={() =>
                  setOpenGroup(openGroup === "involved" ? null : "involved")
                }
              />
              <Link href={contactPath}>{zh ? "聯絡我們" : "Contact Us"}</Link>
              <div className="mobile-utility">
                <Link href={donatePath}>{zh ? "捐贈" : "Donate"}</Link>
                <Link href={loginPath}>{volunteerLabel}</Link>
                <button
                  type="button"
                  className="simple-view-toggle"
                  aria-label={zh ? "切換簡易檢視" : "Toggle simple view"}
                  aria-pressed={simpleView}
                  title={zh ? "簡易檢視" : "Simple View"}
                  onClick={() =>
                    setSimpleView((value) => {
                      const next = !value;
                      window.localStorage.setItem(
                        "simple-view",
                        next ? "on" : "off",
                      );
                      return next;
                    })
                  }
                >
                  <Image
                    src="/assets/images/accessibility-symbol.png"
                    width={24}
                    height={24}
                    alt=""
                    unoptimized
                  />
                  {zh ? "簡易檢視" : "Simple View"}
                </button>
                <Link href={alternate}>{zh ? "EN" : "繁"}</Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <Link className="floating-donate" href={donatePath}>
        {zh ? "捐贈" : "DONATE"} <span aria-hidden="true">➜</span>
      </Link>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-top">
          <Link href={zh ? "/zh/" : "/"} className="footer-brand">
            <Image
              src="/assets/images/logo.png"
              width={132}
              height={81}
              unoptimized
              alt="Love 21 Foundation"
            />
          </Link>
          <div className="footer-groups">
            <div>
              <strong>{zh ? "關於我們" : "About Us"}</strong>
              {aboutItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
            </div>
            <div>
              <strong>{zh ? "我們的計劃" : "Our Programmes"}</strong>
              {programmeItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
            </div>
            <div>
              <strong>{zh ? "活動與行事曆" : "Activities & Calendar"}</strong>
              {activityItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
            </div>
            <div>
              <strong>{zh ? "參與我們" : "Get Involved"}</strong>
              {involvedItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
            </div>
            <div className="footer-direct">
              <Link href={contactPath}>{zh ? "聯絡我們" : "Contact Us"}</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="social-links">
            <a href="https://www.facebook.com/Love21foundation/" target="_blank" rel="noreferrer">
              Facebook
            </a>
            <a href="https://www.instagram.com/love21foundation/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
          <span>© 2019 - 2026 Love 21 Foundation</span>
          <span>
            Website donated by{" "}
            <a href="https://five.co/" target="_blank" rel="noreferrer">
              Five Software Pty Ltd.
            </a>
          </span>
        </div>
      </footer>
    </>
  );
}
