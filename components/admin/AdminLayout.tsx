"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SignOutButton } from "@/components/SignOutButton";
import { BrandLockup } from "@/components/ui/BrandLockup";
import styles from "./AdminLayout.module.css";

type NavigationItem = {
  href: string;
  label: string;
};

type NavigationGroup = {
  label: string;
  items: readonly NavigationItem[];
};

const navigationGroups: readonly NavigationGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard" }],
  },
  {
    label: "People",
    items: [
      { href: "/admin/people/applications", label: "Applications" },
      { href: "/admin/people/members", label: "Members & Families" },
      { href: "/admin/people/contributors", label: "Contributors" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/events", label: "Events" },
      { href: "/admin/content/news", label: "News & Stories" },
    ],
  },
];

function isNavigationItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function adminInitial(email: string) {
  return email.trim().charAt(0).toUpperCase() || "A";
}

export function AdminLayout({
  admin,
  children,
}: {
  admin: {
    name: string;
    email: string;
  };
  children: ReactNode;
}) {
  const pathname = usePathname() || "/admin";
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const sidebar = sidebarRef.current;
    const mobileToggle = mobileToggleRef.current;
    const focusable = sidebar
      ? Array.from(
          sidebar.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        )
      : [];
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    focusable[0]?.focus();

    const handleDrawerKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleDrawerKeys);
    return () => {
      document.removeEventListener("keydown", handleDrawerKeys);
      document.body.style.overflow = previousOverflow;
      mobileToggle?.focus();
    };
  }, [mobileOpen]);

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#admin-main">
        Skip to admin content
      </a>

      <aside
        className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ""}`}
        id="admin-navigation"
        ref={sidebarRef}
        aria-label="Admin navigation drawer"
      >
        <div className={styles.sidebarInner}>
          <div className={styles.brandArea}>
            <BrandLockup href="/admin" compact />
            <span className={styles.portalLabel}>Admin portal</span>
            <button
              className={styles.drawerClose}
              type="button"
              aria-label="Close admin navigation"
              onClick={() => setMobileOpen(false)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <nav
            className={styles.navigation}
            aria-label="Admin portal"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) {
                setMobileOpen(false);
              }
            }}
          >
            {navigationGroups.map((group) => (
              <div className={styles.navigationGroup} key={group.label}>
                <p className={styles.navigationGroupLabel}>{group.label}</p>
                <div className={styles.navigationItems}>
                  {group.items.map((item) => {
                    const active = isNavigationItemActive(pathname, item.href);
                    return (
                      <Link
                        className={`${styles.navigationLink} ${active ? styles.navigationLinkActive : ""}`}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        key={item.href}
                      >
                        <span className={styles.navigationMarker} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <Link className={styles.publicWebsiteLink} href="/">
              <span>View public website</span>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          className={styles.drawerBackdrop}
          type="button"
          aria-label="Close admin navigation"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div
        className={styles.workspace}
        inert={mobileOpen ? true : undefined}
        aria-hidden={mobileOpen ? true : undefined}
      >
        <header className={styles.topbar}>
          <div className={styles.topbarStart}>
            <button
              className={styles.mobileToggle}
              type="button"
              ref={mobileToggleRef}
              aria-label={mobileOpen ? "Close admin navigation" : "Open admin navigation"}
              aria-controls="admin-navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
            <div>
              <p className={styles.topbarEyebrow}>Love 21</p>
              <p className={styles.topbarTitle}>Administration</p>
            </div>
          </div>

          <div className={styles.adminActions}>
            <div className={styles.adminIdentity} title={`${admin.name} — ${admin.email}`}>
              <span className={styles.adminAvatar} aria-hidden="true">
                {adminInitial(admin.name || admin.email)}
              </span>
              <span className={styles.adminIdentityText}>
                <strong>{admin.name}</strong>
                <span>{admin.email}</span>
              </span>
            </div>
            <SignOutButton
              className={styles.logoutButton}
              redirectTo="/admin/login"
            />
          </div>
        </header>

        <main className={styles.content} id="admin-main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
