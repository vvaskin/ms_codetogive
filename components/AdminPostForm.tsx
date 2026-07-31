"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import styles from "./AdminPost.module.css";

export function AdminPostForm({ configured }: { configured: boolean }) {
  const [description, setDescription] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function onFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.currentTarget.files ?? []);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    setStatus("submitting");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin-post", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage(
        `Posted! The webhook responded with status ${result.webhookStatus}.`,
      );
      setDescription("");
      setPreviews([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {!configured && (
        <div className={styles.notice}>
          MAKE_WEBHOOK_URL is not set in .env.local — the button is disabled
          until you add the webhook URL.
        </div>
      )}

      <label className={styles.field}>
        Description
        <textarea
          name="description"
          rows={5}
          required
          maxLength={2200}
          placeholder="Write the caption for Instagram and Facebook…"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={!configured || status === "submitting"}
        />
      </label>

      <label className={styles.field}>
        Photos
        <input
          ref={fileInputRef}
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          required
          onChange={onFilesSelected}
          disabled={!configured || status === "submitting"}
        />
      </label>

      {previews.length > 0 && (
        <div className={styles.previewGrid}>
          {previews.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className={styles.preview} />
          ))}
        </div>
      )}

      <button
        className={styles.submit}
        type="submit"
        disabled={!configured || status === "submitting"}
      >
        {status === "submitting" ? "Posting…" : "Post on social media"}
      </button>

      {status === "success" && (
        <p className={styles.success} role="status">
          {message}
        </p>
      )}
      {status === "error" && (
        <p className={styles.error} role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
