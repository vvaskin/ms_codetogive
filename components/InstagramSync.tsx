"use client";

import { useState } from "react";
import styles from "./AdminPost.module.css";

export function InstagramSync({ configured }: { configured: boolean }) {
  const [status, setStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function sync() {
    if (!configured) return;
    setStatus("syncing");
    setMessage("");

    try {
      const response = await fetch("/api/instagram/sync", { method: "POST" });
      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(result.error ?? "Sync failed.");
        return;
      }

      setStatus("success");
      setMessage(`Synced ${result.added} new post(s). ${result.total} total.`);
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <div className={styles.insta}>
      <h2>Instagram</h2>
      <p>Pull the latest posts from the Love 21 Instagram account.</p>
      {!configured && (
        <div className={styles.notice}>
          INSTAGRAM_USERNAME is not set in .env.local — the button is disabled
          until you add the username.
        </div>
      )}
      <button
        type="button"
        className={styles.submit}
        onClick={sync}
        disabled={!configured || status === "syncing"}
      >
        {status === "syncing" ? "Syncing…" : "Sync from Instagram"}
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
    </div>
  );
}
