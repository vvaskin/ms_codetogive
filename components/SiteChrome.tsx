"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { alternatePaths, normalizePath } from "../content/site-data";
import { authClient } from "../lib/auth-client";

const enLove = [
  ["Our Story", "/our-story/"],
  ["Our Reports", "/our-finance/"],
  ["Our Volunteers", "/our-volunteer/"],
  ["Media", "/media/"],
  ["Join Us", "/join-us/"],
];

const zhLove = [
  ["關於我們", "/zh/our-story-hk/"],
  ["我們的報告", "/zh/our-finance-hk/"],
  ["我們的義工團隊", "/zh/our-volunteer-hk/"],
  ["媒體報導", "/zh/媒體報導/"],
  ["加入我們", "/zh/加入我們/"],
];

const enLeadership = [
  ["Board of Directors", "/board-of-directors/"],
  ["Staff", "/staff/"],
];

const zhLeadership = [
  ["我們的董事", "/zh/board-of-directors-hk/"],
  ["工作人員", "/zh/staff-hk/"],
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

  useEffect(() => {
    document.documentElement.lang = zh ? "zh-Hant" : "en";
  }, [zh]);

  const alternate =
    alternatePaths[pathname] || (zh ? "/" : "/zh/");
  const loveItems = zh ? zhLove : enLove;
  const leadershipItems = zh ? zhLeadership : enLeadership;
  const programmePath = zh ? "/zh/our-programmes-hk/" : "/our-programmes/";
  const calendarPath = zh ? "/events" : "/events";
  const contactPath = zh ? "/zh/contact-us-hk/" : "/contact-us/";
  const loginPath = session ? "/portal" : "/login/";
  const accountLabel = session
    ? zh
      ? "個人頁面"
      : "My portal"
    : zh
      ? "登入 / 註冊"
      : "Login / Sign up";
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
              <Link href={loginPath}>{accountLabel}</Link>
              <Link href={donatePath} className="utility-donate">
                {zh ? "捐贈" : "Donate"}
              </Link>
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
                label="LOVE 21"
                items={loveItems}
                open={openGroup === "love"}
                onToggle={() => setOpenGroup(openGroup === "love" ? null : "love")}
              />
              <MenuGroup
                label={zh ? "管理層" : "Leadership"}
                items={leadershipItems}
                open={openGroup === "leadership"}
                onToggle={() =>
                  setOpenGroup(openGroup === "leadership" ? null : "leadership")
                }
              />
              <MenuGroup
                label={zh ? "我們的計劃" : "Our Programmes"}
                items={
                  zh
                    ? [
                        ["體育", programmePath],
                        ["飲食與營養", programmePath],
                        ["家庭", programmePath],
                        ["企業社會責任", programmePath],
                      ]
                    : [
                        ["Sport", programmePath],
                        ["Nutrition", programmePath],
                        ["Family", programmePath],
                        ["CSR", programmePath],
                      ]
                }
                open={openGroup === "programmes"}
                onToggle={() =>
                  setOpenGroup(openGroup === "programmes" ? null : "programmes")
                }
              />
              <Link href={calendarPath}>{zh ? "行事曆" : "Our Calendar"}</Link>
              <Link href={contactPath}>{zh ? "聯絡我們" : "Contact Us"}</Link>
              <div className="mobile-utility">
                <Link href={loginPath}>{accountLabel}</Link>
                <Link href={donatePath}>{zh ? "捐贈" : "Donate"}</Link>
                <Link href={alternate}>{zh ? "EN" : "繁"}</Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {!pathname.startsWith("/portal") && (
        <Link className="floating-donate" href={donatePath}>
          {zh ? "捐贈" : "DONATE"} <span aria-hidden="true">➜</span>
        </Link>
      )}

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
              <strong>LOVE 21</strong>
              {loveItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
            </div>
            <div>
              <strong>{zh ? "管理層" : "Leadership"}</strong>
              {leadershipItems.map(([text, href]) => (
                <Link key={href} href={href}>
                  {text}
                </Link>
              ))}
            </div>
            <div>
              <strong>{zh ? "我們的計劃" : "Our Programmes"}</strong>
              <Link href={programmePath}>{zh ? "體育" : "Sport"}</Link>
              <Link href={programmePath}>{zh ? "飲食與營養" : "Nutrition"}</Link>
              <Link href={programmePath}>{zh ? "家庭" : "Family"}</Link>
              <Link href={programmePath}>{zh ? "企業社會責任" : "CSR"}</Link>
            </div>
            <div className="footer-direct">
              <Link href={calendarPath}>{zh ? "行事曆" : "Our Calendar"}</Link>
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
