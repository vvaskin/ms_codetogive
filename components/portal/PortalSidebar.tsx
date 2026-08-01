"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
  donor: "Donor",
  volunteer: "Volunteer",
};

const consoleLabels: Record<UserRole, string> = {
  member: "Member Console",
  donor: "Donor Console",
  volunteer: "Volunteer Console",
};

type NavItem = { href: string; label: string; icon: string; external?: boolean };
type NavSection = { label: string; items: NavItem[] };

// Only items we actually have routes for. Matches the Figma design's
// MY LOVE 21 / ADMIN grouping.
function navSectionsFor(role: UserRole): NavSection[] {
  const primary: NavItem[] = [{ href: "/portal", label: "Home", icon: "🏠" }];

  if (role === "donor") {
    primary.push(
      { href: "/portal/impact", label: "Impact", icon: "✦" },
      { href: "/events", label: "Events", icon: "📅", external: true },
      { href: "/portal/donate", label: "Donate", icon: "♡" },
    );
  } else if (role === "volunteer") {
    primary.push(
      { href: "/events", label: "Events", icon: "📅", external: true },
      { href: "/volunteer-events", label: "Sign-Ups", icon: "🙌", external: true },
    );
  } else {
    primary.push({ href: "/events", label: "Events", icon: "📅", external: true });
  }

  const admin: NavItem[] = [
    { href: "/portal/profile", label: "Profile", icon: "☺" },
  ];

  return [
    { label: "My Love 21", items: primary },
    { label: "Admin", items: admin },
  ];
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
  const sections = navSectionsFor(user.role);

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className={styles.sidebar} aria-label="Portal navigation">
      <Link href="/portal" className={styles.brand}>
        <span className={styles.brandMark} aria-hidden="true">
          21
        </span>
        <span className={styles.brandText}>
          <span className={styles.brandName}>Love 21</span>
          <span className={styles.brandSubtitle}>{consoleLabels[user.role]}</span>
        </span>
      </Link>

      <nav className={styles.nav} aria-label="Portal sections">
        {sections.map((section) => (
          <div className={styles.navSection} key={section.label}>
            <p className={styles.sectionLabel}>{section.label}</p>
            {section.items.map((item) => {
              const active = isItemActive(pathname, item);
              return (
                <Link
                  key={`${section.label}-${item.href}-${item.label}`}
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
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
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
    </aside>
  );
}
