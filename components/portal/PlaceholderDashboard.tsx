import Link from "next/link";
import { upcomingEvents } from "@/lib/portal/mock-data";
import { EventCarousel } from "./EventCarousel";
import type { UserRole } from "@/lib/db/schema";

const roleContent: Record<UserRole, { intro: string; placeholder: string }> = {
  member: {
    intro: "Your personal Love 21 member space.",
    placeholder: "Member updates and programme information will appear here.",
  },
  donor: {
    intro: "Your personal Love 21 supporter space.",
    placeholder: "Donation information and supporter updates will appear here.",
  },
  volunteer: {
    intro: "Your personal Love 21 volunteer space.",
    placeholder:
      "Volunteer opportunities and event information will appear here.",
  },
};

export function PlaceholderDashboard({
  name,
  role,
}: {
  name: string;
  role: UserRole;
}) {
  const content = roleContent[role] ?? roleContent.member;

  return (
    <div className="portal-dashboard">
      <header className="portal-dashboard-head">
        <p className="eyebrow">YOUR LOVE 21 PORTAL</p>
        <h1>Welcome, {name}</h1>
        <p>{content.intro}</p>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-card dashboard-card-wide">
          <div className="dashboard-card-head">
            <h2>Upcoming events</h2>
            <Link href="/events">View all ➜</Link>
          </div>
          <EventCarousel events={upcomingEvents} />
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-head">
            <h2>My profile</h2>
            <Link href="/portal/profile">Edit ➜</Link>
          </div>
          <p className="dashboard-card-note">
            Keep your contact details up to date so we can reach you.
          </p>
          <Link className="dashboard-cta" href="/portal/profile">
            Update profile
          </Link>
        </section>

        <section className="dashboard-card portal-placeholder-card">
          <span aria-hidden="true">♡</span>
          <div>
            <h2>Your portal is ready</h2>
            <p>{content.placeholder}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
