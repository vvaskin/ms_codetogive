"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

const MAX_IMAGE_BYTES = 1_000_000; // ~1 MB

export interface ProfileValues {
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  address: string | null;
}

export function ProfileEditor({ initial }: { initial: ProfileValues }) {
  const router = useRouter();
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [address, setAddress] = useState(initial.address ?? "");
  const [image, setImage] = useState<string | null>(initial.image);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);

  function onPickImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Please choose an image smaller than 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(typeof reader.result === "string" ? reader.result : null);
      setError(null);
      setStatus("idle");
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setError(null);

    const result = await authClient.updateUser({
      name: name.trim(),
      image: image ?? "",
      phone: phone.trim(),
      address: address.trim(),
    });

    if (result.error) {
      setError(result.error.message ?? "Could not save your profile.");
      setStatus("idle");
      return;
    }

    setStatus("saved");
    router.refresh();
  }

  return (
    <form className="profile-form" onSubmit={onSubmit}>
      <div className="profile-photo">
        <div className="portal-avatar portal-avatar-lg">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} />
          ) : (
            <span aria-hidden="true">{name.slice(0, 1).toUpperCase()}</span>
          )}
        </div>
        <div className="profile-photo-actions">
          <label className="profile-photo-upload">
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={onPickImage}
              hidden
            />
          </label>
          {image && (
            <button
              type="button"
              className="profile-photo-remove"
              onClick={() => {
                setImage(null);
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
