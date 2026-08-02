"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { submitVolunteerApplication } from "@/app/actions/volunteer-applications";
import { createClient } from "@/lib/supabase/client";
import type { VolunteerApplicationRow } from "@/lib/supabase/types";
import styles from "./VolunteerApplicationForm.module.css";

const MAX_DOC_BYTES = 10_000_000; // 10 MB

const AGE_GROUPS = [
  "Under 18",
  "18–25",
  "26–35",
  "36–45",
  "46–55",
  "56+",
];

const GENDERS = [
  "Female",
  "Male",
  "Non-binary",
  "Prefer not to say",
];

export function VolunteerApplicationForm({
  application,
}: {
  application: VolunteerApplicationRow;
}) {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState(application.age_group ?? "");
  const [gender, setGender] = useState(application.gender ?? "");
  const [bio, setBio] = useState(application.bio ?? "");
  const [referralSource, setReferralSource] = useState(
    application.referral_source ?? "",
  );
  const [policyDoc, setPolicyDoc] = useState<File | null>(null);
  const [scrcDoc, setScrcDoc] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  function pickDoc(
    field: "policy" | "scrc",
  ): (event: React.ChangeEvent<HTMLInputElement>) => void {
    return (event) => {
      const picked = event.target.files?.[0];
      if (!picked) return;
      if (picked.size > MAX_DOC_BYTES) {
        setError("Please choose a document smaller than 10 MB.");
        return;
      }
      if (field === "policy") setPolicyDoc(picked);
      else setScrcDoc(picked);
      setError(null);
      setStatus("idle");
    };
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError(null);

    const supabase = createClient();

    async function upload(file: File, kind: "policy" | "scrc"): Promise<string> {
      const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
      const path = `${application.user_id}/${
        kind === "policy" ? "volunteer-policy" : "scrc-check"
      }-${Date.now()}.${extension}`;
      const { error } = await supabase.storage
        .from("volunteer-applications")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw new Error(error.message);
      return path;
    }

    try {
      const policyPath = policyDoc
        ? await upload(policyDoc, "policy")
        : application.volunteer_policy_doc;
      const scrcPath = scrcDoc
        ? await upload(scrcDoc, "scrc")
        : application.scrc_check_doc;

      const result = await submitVolunteerApplication({
        ageGroup,
        gender,
        bio,
        referralSource,
        volunteerPolicyDoc: policyPath,
        scrcCheckDoc: scrcPath,
      });

      if (!result.ok) throw new Error(result.error);

      setStatus("saved");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again.",
      );
      setStatus("idle");
    }
  }

  return (
    <form className="profile-form" onSubmit={onSubmit}>
      <p>
        Tell us a little about yourself so we can find the right volunteering
        opportunities for you.
      </p>

      <label className="profile-field">
        Age group
        <select
          className={styles.fieldSelect}
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          required
        >
          <option value="" disabled>
            Select your age group
          </option>
          {AGE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </label>

      <label className="profile-field">
        Gender
        <select
          className={styles.fieldSelect}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="" disabled>
            Select your gender
          </option>
          {GENDERS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="profile-field">
        About you
        <textarea
          value={bio}
          rows={5}
          placeholder="Interests, experience, or anything you would like us to know."
          onChange={(e) => setBio(e.target.value)}
          required
        />
      </label>

      <label className="profile-field">
        How did you hear about us?
        <input
          type="text"
          value={referralSource}
          placeholder="e.g. Friend, social media, an event"
          onChange={(e) => setReferralSource(e.target.value)}
          required
        />
      </label>

      <label className="profile-field">
        Volunteer Policy
        <input type="file" accept=".pdf,.doc,.docx" onChange={pickDoc("policy")} />
        <small>
          {policyDoc
            ? `Selected: ${policyDoc.name}`
            : application.volunteer_policy_doc
              ? "A document is already on file — uploading a new one replaces it."
              : "Upload the signed volunteer policy document."}
        </small>
      </label>

      <label className="profile-field">
        SCRC Check
        <input type="file" accept=".pdf,.doc,.docx" onChange={pickDoc("scrc")} />
        <small>
          {scrcDoc
            ? `Selected: ${scrcDoc.name}`
            : application.scrc_check_doc
              ? "A document is already on file — uploading a new one replaces it."
              : "Upload your Sexual Conviction Record Check."}
        </small>
      </label>

      {error && (
        <div className={styles.error} role="alert">
          {error}
        </div>
      )}
      {status === "saved" && !error && (
        <div className={styles.saved} role="status">
          Your application has been submitted.
        </div>
      )}

      <button
        className={styles.submit}
        type="submit"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
