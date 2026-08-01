"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UserRow } from "@/lib/supabase/table-types";

const MAX_IMAGE_BYTES = 2_000_000; // 2 MB

export interface ProfileValues {
  userId: string;
  name: string;
  email: string;
  /** Public URL of the current avatar, or null. */
  avatarUrl: string | null;
  phone: string | null;
  address: string | null;
}

export function ProfileEditor({ initial }: { initial: ProfileValues }) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  // Preview shows either the saved avatar or the locally-picked file.
  const [preview, setPreview] = useState<string | null>(initial.avatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  function onPickImage(event: React.ChangeEvent<HTMLInputElement>) {
    const picked = event.target.files?.[0];
    if (!picked) return;
    if (picked.size > MAX_IMAGE_BYTES) {
      setError("Please choose an image smaller than 2 MB.");
      return;
    }
    setFile(picked);
    setRemoveAvatar(false);
    setPreview(URL.createObjectURL(picked));
    setError(null);
    setStatus("idle");
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError(null);

    const supabase = createClient();
    const update: Partial<UserRow> = {
      name: name.trim(),
      phone_number: phone.trim() || null,
      address: address.trim() || null,
    };

    // Upload a newly picked avatar into this user's own folder.
    if (file) {
      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${initial.userId}/avatar-${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        setStatus("idle");
        return;
      }
      update.profile_image = path;
    } else if (removeAvatar) {
      update.profile_image = null;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update(update)
      .eq("id", initial.userId);

    if (updateError) {
      setError(updateError.message);
      setStatus("idle");
      return;
    }

    setFile(null);
    setStatus("saved");
    router.refresh();
  }

  return (
    <form className="profile-form" onSubmit={onSubmit}>
      <div className="profile-photo">
        <div className="portal-avatar portal-avatar-lg">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt={name} />
          ) : (
            <span aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>
          )}
        </div>
        <div className="profile-photo-actions">
          <label className="profile-photo-upload">
            Change photo
            <input type="file" accept="image/*" onChange={onPickImage} hidden />
          </label>
          {preview && (
            <button
              type="button"
              className="profile-photo-remove"
              onClick={() => {
                setPreview(null);
                setFile(null);
                setRemoveAvatar(true);
                setStatus("idle");
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <label className="profile-field">
        Full name
        <input
          type="text"
          value={name}
          autoComplete="name"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="profile-field">
        Email address
        <input type="email" value={initial.email} readOnly disabled />
        <small>Contact us to change the email on your account.</small>
      </label>

      <label className="profile-field">
        Phone
        <input
          type="tel"
          value={phone}
          autoComplete="tel"
          placeholder="+852 1234 5678"
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>

      <label className="profile-field">
        Address
        <textarea
          value={address}
          autoComplete="street-address"
          rows={3}
          placeholder="Flat, building, street, district"
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}
      {status === "saved" && !error && (
        <div className="profile-saved" role="status">
          Your profile has been updated.
        </div>
      )}

      <button
        className="auth-submit"
        type="submit"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
