"use client";

import { useState } from "react";
import {
  buildVolunteerCertificateHtml,
  generateVolunteerCertId,
} from "@/lib/volunteer-certificate";
import styles from "./VolunteerCertificateButton.module.css";

export function VolunteerCertificateButton({
  name,
  hours,
}: {
  name: string;
  hours: number;
}) {
  const [busy, setBusy] = useState(false);

  async function download() {
    if (busy) return;
    setBusy(true);
    try {
      const certId = generateVolunteerCertId();
      const issueDate = new Date().toLocaleDateString("en-HK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const logoSrc = await logoDataUri();
      const html = buildVolunteerCertificateHtml({
        name: name.trim() || "Valued Volunteer",
        hours,
        certId,
        issueDate,
        logoSrc,
      });
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "volunteer-certificate.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  async function logoDataUri(): Promise<string> {
    try {
      const response = await fetch("/assets/images/love21_logo.png");
      if (!response.ok) return "/assets/images/love21_logo.png";
      const blob = await response.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve("/assets/images/love21_logo.png");
        reader.readAsDataURL(blob);
      });
    } catch {
      return "/assets/images/love21_logo.png";
    }
  }

  return (
    <div className={styles.band}>
      <p className={styles.note}>
        Claim your volunteer certificate
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </p>
      <button
        type="button"
        className={styles.button}
        onClick={download}
        disabled={busy || hours <= 0}
      >
        {busy
          ? "Preparing…"
          : hours > 0
            ? `Download certificate (${hours} ${hours === 1 ? "hour" : "hours"})`
            : "Download certificate"}
      </button>
    </div>
  );
}
