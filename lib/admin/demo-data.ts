/**
 * Explicitly isolated demonstration data for the admin application workflow.
 * Supabase currently has no volunteer-application table, so these records must
 * never be presented as production submissions or mixed into real metrics.
 */

export type DemoVolunteerApplicationStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface DemoVolunteerApplication {
  id: string;
  name: string;
  email: string;
  interests: string[];
  availability: string;
  motivation: string;
  experience: string;
  appliedAt: string;
  status: DemoVolunteerApplicationStatus;
}

export const demoVolunteerApplicationsMetadata = {
  isDemo: true,
  label: "Demonstration data",
  description:
    "Volunteer applications are not stored in Supabase yet. These fictional records exist only to demonstrate the proposed review interface.",
} as const;

export const demoVolunteerApplications = [
  {
    id: "demo-application-001",
    name: "Maya Chan",
    email: "maya.chan@example.com",
    interests: ["Inclusive sport", "Event support"],
    availability: "Saturday mornings and one weekday evening",
    motivation:
      "I would like to help create welcoming activities where every participant can contribute.",
    experience:
      "Two years supporting community football sessions and school activity days.",
    appliedAt: "2026-07-29T03:20:00.000Z",
    status: "pending",
  },
  {
    id: "demo-application-002",
    name: "Alex Wong",
    email: "alex.wong@example.com",
    interests: ["Nutrition", "Family activities"],
    availability: "Alternate Sundays",
    motivation:
      "I enjoy practical food education and want to support families through shared learning.",
    experience:
      "Volunteer helper at three neighbourhood cooking workshops.",
    appliedAt: "2026-07-24T08:45:00.000Z",
    status: "approved",
  },
  {
    id: "demo-application-003",
    name: "Sam Lee",
    email: "sam.lee@example.com",
    interests: ["Corporate volunteering", "Event logistics"],
    availability: "Weekday afternoons",
    motivation:
      "I want to use my coordination skills to help community events run smoothly.",
    experience:
      "Organised staff volunteering days and assisted with venue logistics.",
    appliedAt: "2026-07-18T01:10:00.000Z",
    status: "rejected",
  },
] satisfies DemoVolunteerApplication[];
