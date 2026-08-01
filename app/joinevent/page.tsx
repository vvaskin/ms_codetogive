import type { Metadata } from "next";
import VolunteerActivity from "../portal/profile/VolunteerActivity";

export const metadata: Metadata = {
  title: "Join event",
  description: "Browse volunteer activities and register quickly.",
};

export default function JoinEventPage() {
  return <VolunteerActivity />;
}