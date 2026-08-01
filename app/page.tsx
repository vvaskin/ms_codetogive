import { HomeExperience } from "../components/HomeExperience";

export const revalidate = 60;

export default function HomePage() {
  return <HomeExperience locale="en" />;
}
