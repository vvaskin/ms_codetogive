export type VolunteerInterest = "Coach" | "Class Assistant" | "Event Helper";

export const VOLUNTEER_INTERESTS: {
  value: VolunteerInterest;
  label: string;
  desc: string;
  icon: string;
  minAge?: string;
}[] = [
  {
    value: "Coach",
    label: "Coach",
    desc: "Lead and plan sessions",
    icon: "🏆",
    minAge: "Age 16+",
  },
  {
    value: "Class Assistant",
    label: "Class Assistant",
    desc: "Support coaches in class",
    icon: "🤝",
  },
  {
    value: "Event Helper",
    label: "Event Helper",
    desc: "Help at one-off events",
    icon: "🎯",
  },
];

// derived from the same source so server-side validation of submitted values
// can never drift from what the UI offered
export const VOLUNTEER_INTEREST_VALUES = VOLUNTEER_INTERESTS.map(
  (option) => option.value,
);