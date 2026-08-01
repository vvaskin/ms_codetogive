"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/SignOutButton";
import type { UserRole } from "@/lib/roles";

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

type NavItem = {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
  donorOnly?: boolean;
};

const navItems: NavItem[] = [
  { href: "/portal", label: "Dashboard", icon: "▤" },
  { href: "/portal/profile", label: "My Profile", icon: "☺" },
  { href: "/portal/impact", label: "My Impact", icon: "✦", donorOnly: true },
  { href: "/portal/donate", label: "Donation", icon: "♡", donorOnly: true },
  { href: "/events", label: "Events", icon: "◷", external: true },
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function PortalSidebar({ user }: { user: PortalUser }) {
  const pathname = usePathname();
  const isDonor = user.role === "donor";

  return (
    <aside className="portal-sidebar">
      <div className="portal-sidebar-profile">
        <div className="portal-avatar">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name} />
          ) : (
            <span aria-hidden="true">{initials(user.name)}</span>
          )}
        </div>
        <p className="portal-avatar-name">{user.name}</p>
        <span className={`role-badge role-${user.role}`}>
          {roleLabels[user.role]}
        </span>
      </div>

      <nav className="portal-nav" aria-label="Portal">
        {navItems
          .filter((item) => !item.donorOnly || isDonor)
          .map((item) => {
            const active = item.external
              ? false
              : item.href === "/portal"
                ? pathname === "/portal"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`portal-nav-link ${active ? "is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="portal-nav-icon" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="portal-sidebar-footer">
        <SignOutButton />
      </div>
    </aside>
  );
}
