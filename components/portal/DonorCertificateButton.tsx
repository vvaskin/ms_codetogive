"use client";

import { useState } from "react";
import {
  buildDonorCertificateHtml,
  generateDonorCertId,
} from "@/lib/donor-certificate";
import styles from "./VolunteerCertificateButton.module.css";

type Locale = "en" | "zh" | "cn";

const COPY: Record<Locale, { note: string; preparing: string; download: string }> = {
  en: { note: "Claim your donor certificate", preparing: "Preparing…", download: "Download certificate" },
  zh: { note: "領取你的捐款者證書", preparing: "準備中…", download: "下載證書" },
  cn: { note: "领取你的捐赠者证书", preparing: "准备中…", download: "下载证书" },
};

/**
 * Client-side donor e-certificate download, backed by the same builder as the
 * public donate flow. Disabled until the donor has a completed/active gift.
 */
export function DonorCertificateButton({
  name,
  totalCents,
  locale = "en",
}: {
  name: string;
  totalCents: number;
  locale?: Locale;
}) {
  const [busy, setBusy] = useState(false);
  const copy = COPY[locale];

  async function download() {
    if (busy || totalCents <= 0) return;
    setBusy(true);
    try {
      const certId = generateDonorCertId();
      const issueDate = new Date().toLocaleDateString("en-HK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const logoSrc = await logoDataUri();
      const html = buildDonorCertificateHtml({
        name: name.trim() || "Valued Donor",
        amount: totalCents / 100,
        certId,
        issueDate,
        logoSrc,
      });
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "donor-certificate.html";
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
      <p className={`${styles.note} ${styles.noteBlue}`}>
        {copy.note}
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </p>
      <button
        type="button"
        className={`${styles.button} ${styles.buttonBlue}`}
        onClick={download}
        disabled={busy || totalCents <= 0}
      >
        {busy ? copy.preparing : copy.download}
      </button>
    </div>
  );
}
