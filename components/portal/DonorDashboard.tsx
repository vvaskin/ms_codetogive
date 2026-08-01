import Link from "next/link";
import { upcomingEvents } from "@/lib/portal/mock-data";
import { EventCarousel } from "./EventCarousel";
import { ImpactPanel } from "./ImpactPanel";

export function DonorDashboard({ name }: { name: string }) {
  return (
    <div className="portal-dashboard">
      <header className="portal-dashboard-head">
        <p className="eyebrow">YOUR LOVE 21 PORTAL</p>
        <h1>Welcome back, {name}</h1>
        <p>Here is what is happening and the difference you are making.</p>
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
            <h2>My impact</h2>
            <Link href="/portal/impact">Details ➜</Link>
          </div>
          <ImpactPanel variant="compact" />
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-head">
            <h2>My profile</h2>
            <Link href="/portal/profile">Edit ➜</Link>
          </div>
          <p className="dashboard-card-note">
            Keep your contact details up to date so we can reach you about the
            programmes you support.
          </p>
          <Link className="dashboard-cta" href="/portal/profile">
            Update profile
          </Link>
        </section>

        <section className="dashboard-card dashboard-card-donate">
          <div className="dashboard-card-head">
            <h2>Make a donation</h2>
            <Link href="/portal/donate">Give ➜</Link>
          </div>
          <p className="dashboard-card-note">
            Support Love 21 with a one-time gift or set up recurring giving.
          </p>
          <Link className="dashboard-cta dashboard-cta-primary" href="/portal/donate">
            Donate now
          </Link>
        </section>
      </div>
    </div>
  );
}
