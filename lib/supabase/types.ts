/** Stable application aliases derived from the generated Supabase schema. */

import type { Database as GeneratedDatabase } from "./types.generated";

export type Database = GeneratedDatabase;
export type UserRole = Database["public"]["Enums"]["user_role"];
export type EventType = Database["public"]["Enums"]["event_type"];
export type EventStatus = Database["public"]["Enums"]["event_status"];
export type EventAudience = Database["public"]["Enums"]["event_audience"];
export type ParticipationStatus =
  Database["public"]["Enums"]["participation_status"];
export type DonationKind = Database["public"]["Enums"]["donation_kind"];
export type DonationFrequency =
  Database["public"]["Enums"]["donation_frequency"];
export type DonationStatus = Database["public"]["Enums"]["donation_status"];
export type VolunteerApplicationStatus =
  Database["public"]["Enums"]["volunteer_application_status"];

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type VolunteerApplicationRow =
  Database["public"]["Tables"]["volunteer_applications"]["Row"];
export type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type EventParticipationRow =
  Database["public"]["Tables"]["event_participations"]["Row"];
export type EventGuestSignupRow =
  Database["public"]["Tables"]["event_guest_signups"]["Row"];
export type DonationRow = Database["public"]["Tables"]["donations"]["Row"];
export type InstagramPostRow =
  Database["public"]["Tables"]["instagram_posts"]["Row"];
export type VolunteerApplicationRow =
  Database["public"]["Tables"]["volunteer_applications"]["Row"];
export type VolunteerApplicationStatus =
  Database["public"]["Enums"]["volunteer_application_status"];
