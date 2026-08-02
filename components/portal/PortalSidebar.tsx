"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { localePaths } from "@/content/site-data";
import { SiteToolsTray } from "@/components/SiteTools";
import type { UserRole } from "@/lib/roles";
import styles from "./PortalSidebar.module.css";

export interface PortalUser {
  name: string;
  email: string;
  role: UserRole;
  image?: string | null;
}

const roleLabels: Record<UserRole, string> = {
  member: "Member",
  contributor: "Contributor",
  staff: "Staff",
};

type NavItem = { href: string; label: string; icon: string; external?: boolean };

// Flat nav list per role. Only routes we actually have.
function navItemsFor(role: UserRole): NavItem[] {
  const items: NavItem[] = [
    { href: "/portal", label: "Home", icon: "🏠" },
  ];

  if (role === "contributor") {
    items.push(
      { href: "/portal/impact", label: "My Donations", icon: "♡" },
      { href: "/portal/volunteering", label: "My Volunteering", icon: "✦" },
      { href: "/portal/events", label: "Events", icon: "📅" },
      { href: "/portal/donate", label: "Donate", icon: "＋" },
    );
  } else {
    items.push({ href: "/portal/events", label: "Events", icon: "📅" });
  }

  items.push({ href: "/portal/profile", label: "Profile", icon: "☺" });

  return items;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function isItemActive(pathname: string | null, item: NavItem): boolean {
  if (item.external || !pathname) return false;
  if (item.href === "/portal") return pathname === "/portal";
  return pathname.startsWith(item.href);
}

export function PortalSidebar({ user }: { user: PortalUser }) {
  const router = useRouter();
  const pathname = usePathname();
  const [signingOut, setSigningOut] = useState(false);
  const items = navItemsFor(user.role);

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <header className={styles.sidebar} aria-label="Portal navigation">
        <Link
          href="/"
          className={styles.brand}
          aria-label="Love 21 — return to website"
        >
          <Image
            src="/assets/images/love21_logo.png"
            alt=""
            width={330}
            height={202}
            priority
            className={styles.brandLogo}
          />
        </Link>

        <nav className={styles.nav} aria-label="Portal sections">
          {items.map((item) => {
            const active = isItemActive(pathname, item);
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className={styles.navIcon} aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.footer}>
          <Link href="/" className={styles.backLink}>
            <span className={styles.backIcon} aria-hidden="true">
              ←
            </span>
            Back to website
          </Link>
          <div className={styles.userRow}>
            <div className={styles.avatar}>
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} />
              ) : (
                <span aria-hidden="true">{initials(user.name)}</span>
              )}
            </div>
            <div className={styles.footerText}>
              <span className={styles.footerName}>{user.name}</span>
              <span className={styles.footerRole}>{roleLabels[user.role]}</span>
            </div>
            <button
              type="button"
              className={styles.signOut}
              onClick={signOut}
              disabled={signingOut}
              aria-label={signingOut ? "Signing out" : "Sign out"}
              title="Sign out"
            >
              {signingOut ? "…" : "↦"}
            </button>
          </div>
        </div>
      </header>

      <SiteToolsTray locale="en" paths={localePaths("/portal")} />
    </>
  );
}
