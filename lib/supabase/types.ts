/**
 * Database types matching supabase/migrations.
 *
 * Hand-written for now. Once the project is linked you can regenerate with:
 *   npm run db:types
 * which overwrites this file from the live schema.
 */

export type UserRole = "member" | "donor" | "volunteer";
export type EventType = "sport" | "nutrition" | "family_support";
export type ParticipationStatus =
  | "registered"
  | "attended"
  | "no_show"
  | "cancelled";
export type DonationKind = "one_time" | "recurring";
export type DonationFrequency = "monthly" | "quarterly" | "yearly";
export type DonationStatus = "completed" | "active" | "paused" | "cancelled";

export type UserRow = {
  id: string;
  email: string | null;
  name: string;
  phone_number: string | null;
  address: string | null;
  role: UserRole;
  profile_image: string | null;
  created_at: string;
  updated_at: string;
}

export type EventRow = {
  id: number;
  title: string;
  image: string | null;
  date: string;
  type: EventType;
  subtype: string | null;
  location: string | null;
  location_link: string | null;
  slug: string | null;
  created_at: string;
}

export type EventParticipationRow = {
  id: number;
  user_id: string;
  event_id: number;
  status: ParticipationStatus;
  certificate_path: string | null;
  created_at: string;
  updated_at: string;
}

export type DonationRow = {
  id: number;
  donor_id: string;
  event_id: number | null;
  kind: DonationKind;
  amount_cents: number;
  currency: string;
  frequency: DonationFrequency | null;
  status: DonationStatus;
  certificate_path: string | null;
  note: string | null;
  created_at: string;
}

type Writable<T, Optional extends keyof T> = Omit<T, Optional> &
  Partial<Pick<T, Optional>>;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: UserRow;
        Insert: Writable<
          UserRow,
          | "email"
          | "phone_number"
          | "address"
          | "profile_image"
          | "created_at"
          | "updated_at"
        >;
        Update: Partial<UserRow>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Writable<
          EventRow,
          | "id"
          | "image"
          | "subtype"
          | "location"
          | "location_link"
          | "slug"
          | "created_at"
        >;
        Update: Partial<EventRow>;
        Relationships: [];
      };
      event_participations: {
        Row: EventParticipationRow;
        Insert: Writable<
          EventParticipationRow,
          "id" | "status" | "certificate_path" | "created_at" | "updated_at"
        >;
        Update: Partial<EventParticipationRow>;
        Relationships: [];
      };
      donations: {
        Row: DonationRow;
        Insert: Writable<
          DonationRow,
          | "id"
          | "event_id"
          | "currency"
          | "frequency"
          | "certificate_path"
          | "note"
          | "created_at"
        >;
        Update: Partial<DonationRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      user_role: UserRole;
      event_type: EventType;
      participation_status: ParticipationStatus;
      donation_kind: DonationKind;
      donation_frequency: DonationFrequency;
      donation_status: DonationStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
}
