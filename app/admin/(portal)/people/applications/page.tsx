import { redirect } from "next/navigation";

export default function VolunteerApplicationsRedirect() {
  redirect("/admin/people/volunteers?view=applications");
}
