"use client";

import { FormEvent, useState } from "react";
import { jsPDF } from "jspdf";
import { recordDonation } from "@/app/actions/donations";
import {
  generateDonorCertId,
  renderDonorCertificate,
} from "@/lib/donor-certificate";
import { useUser } from "@/lib/supabase/use-user";
import {
  formatCurrency,
  frequencies,
  presetAmounts,
  type Frequency,
} from "@/lib/portal/mock-data";

type Kind = "one-time" | "recurring";

interface Confirmation {
  amount: number;
  kind: Kind;
  frequency: Frequency | null;
  createdAccount: boolean;
  notifiedVia?: "sms" | "email" | "none";
  warning?: string;
}

/**
 * Name/email fields are shown for logged-out visitors (e.g. the public
 * /donate page). Pass `guest` to force the mode; otherwise it's auto-detected
 * from the current session (the portal donor is always signed in).
 * `donorName` is the authenticated donor's profile name, used on the
 * certificate issued after the donation.
 */
export function DonationForm({
  guest,
  donorName,
}: {
  guest?: boolean;
  donorName?: string;
}) {
  const { user, loading } = useUser();
  const isGuest = guest ?? (!loading && !user);
  const [kind, setKind] = useState<Kind>("one-time");
  const [amount, setAmount] = useState<number>(presetAmounts[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>(frequencies[0].value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [certifying, setCertifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const effectiveAmount = customAmount
    ? Math.max(0, Math.round(Number(customAmount)))
    : amount;
  const canSubmit = effectiveAmount > 0 && !submitting;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (effectiveAmount <= 0) return;
    setSubmitting(true);
    setError(null);

    const result = await recordDonation({
      amountCents: effectiveAmount * 100,
      kind: kind === "recurring" ? "recurring" : "one_time",
      frequency: kind === "recurring" ? frequency : null,
      email: isGuest ? email : undefined,
      name: isGuest ? name : undefined,
      phone: isGuest ? phone : undefined,
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setConfirmation({
      amount: effectiveAmount,
      kind,
      frequency: kind === "recurring" ? frequency : null,
      createdAccount: Boolean(result.createdAccount),
      notifiedVia: result.notifiedVia,
      warning: result.warning,
    });
  }

  async function downloadCertificate() {
    if (!confirmation) return;
    setCertifying(true);
    try {
      const certId = generateDonorCertId();
      const issueDate = new Date().toLocaleDateString("en-HK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const recipient = donorName?.trim() || name.trim() || "Valued Donor";
      const logo = await loadLogoImage();

      await ensureCertFonts();

      const canvas = renderDonorCertificate({
        name: recipient,
        amount: confirmation.amount,
        certId,
        issueDate,
        logo,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(
        `Love21_Donor_Certificate_${recipient.replace(/\s+/g, "_")}.pdf`,
      );
    } catch (err) {
      console.error("Error generating certificate PDF:", err);
      setError("Could not generate the certificate. Please try again.");
    } finally {
      setCertifying(false);
    }
  }

  async function loadLogoImage(): Promise<HTMLImageElement | null> {
    try {
      const src = await logoDataUri();
      const img = new Image();
      img.src = src;
      await img.decode();
      return img;
    } catch {
      return null;
    }
  }

  async function ensureCertFonts(): Promise<void> {
    try {
      if (!document.querySelector('link[data-cert-fonts]')) {
        const link = document.createElement("link");
        link.dataset.certFonts = "true";
        link.href =
          "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Space+Mono:wght@400;700&family=Work+Sans:wght@400;500;600;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
      }
      if (document.fonts) {
        await document.fonts.ready;
        await Promise.all([
          document.fonts.load('800 36px "Baloo 2"'),
          document.fonts.load('800 48px "Baloo 2"'),
          document.fonts.load('700 20px "Baloo 2"'),
          document.fonts.load('700 12px "Space Mono"'),
          document.fonts.load('400 10px "Space Mono"'),
          document.fonts.load('600 12px "Work Sans"'),
          document.fonts.load('400 14px "Work Sans"'),
          document.fonts.load('700 12px "Work Sans"'),
        ]);
        await document.fonts.ready;
      }
    } catch {
      // Fonts are a nice-to-have; fall back to system fonts if unavailable.
    }
  }

  async function logoDataUri(): Promise<string> {
    try {
      const response = await fetch("/assets/images/love21_logo.png?v=2");
      if (!response.ok) return "/assets/images/love21_logo.png?v=2";
      const blob = await response.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () =>
          resolve(reader.result as string);
        reader.onerror = () =>
          resolve("/assets/images/love21_logo.png?v=2");
        reader.readAsDataURL(blob);
      });
    } catch {
      return "/assets/images/love21_logo.png?v=2";
    }
  }

  if (confirmation) {
    return (
      <div className="donation-confirm" role="status">
        <span className="donation-confirm-mark" aria-hidden="true">
          ♡
        </span>
        <h2>Thank you for your support!</h2>
        <p>
          {confirmation.kind === "recurring" ? (
            <>
              We have recorded your{" "}
              <strong>
                {frequencies.find((f) => f.value === confirmation.frequency)
                  ?.label ?? "recurring"}
              </strong>{" "}
              gift of <strong>{formatCurrency(confirmation.amount)}</strong>.
            </>
          ) : (
            <>
              We have recorded your one-time gift of{" "}
              <strong>{formatCurrency(confirmation.amount)}</strong>.
            </>
          )}
        </p>
        {confirmation.createdAccount && (
          <p className="donation-confirm-note">
            {confirmation.warning
              ? confirmation.warning
              : confirmation.notifiedVia === "email"
                ? "We've created an account for you and emailed a link to set your password so you can track your giving."
                : "We've created an account for you and texted a link to set your password so you can track your giving."}
          </p>
        )}
        <p className="donation-confirm-note">
          This is a demo — no payment has been taken.
        </p>
        <button
          type="button"
          className="donation-cert-btn"
          onClick={downloadCertificate}
          disabled={certifying}
        >
          {certifying ? "Preparing PDF…" : "Download certificate (PDF)"}
        </button>
        <button
          type="button"
          className="auth-submit"
          onClick={() => setConfirmation(null)}
        >
          Make another donation
        </button>
      </div>
    );
  }

  return (
    <form className="donation-form" onSubmit={onSubmit}>
      <fieldset className="donation-kind">
        <legend>Donation type</legend>
        <div className="donation-toggle">
          {(["one-time", "recurring"] as Kind[]).map((value) => (
            <label
              key={value}
              className={`donation-toggle-option ${kind === value ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="kind"
                value={value}
                checked={kind === value}
                onChange={() => setKind(value)}
              />
              {value === "one-time" ? "One-time" : "Recurring"}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="donation-amount">
        <legend>Amount (HKD)</legend>
        <div className="donation-presets">
          {presetAmounts.map((value) => (
            <button
              type="button"
              key={value}
              className={`donation-preset ${
                !customAmount && amount === value ? "selected" : ""
              }`}
              onClick={() => {
                setAmount(value);
                setCustomAmount("");
              }}
            >
              {formatCurrency(value)}
            </button>
          ))}
        </div>
        <label className="donation-custom">
          Or enter a custom amount
          <input
            type="number"
            min={1}
            step={1}
            inputMode="numeric"
            placeholder="e.g. 750"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
        </label>
      </fieldset>

      {kind === "recurring" && (
        <label className="donation-frequency">
          Frequency
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as Frequency)}
          >
            {frequencies.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {isGuest && (
        <div className="donation-guest-fields">
          <label className="donation-frequency">
            Your name
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="donation-frequency">
            Email address
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="donation-frequency">
            Phone number
            <input
              type="tel"
              autoComplete="tel"
              placeholder="+852 XXXX XXXX"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <small>
              We&apos;ll text you a link to set your password so you can track
              your donations.
            </small>
          </label>
        </div>
      )}

      <div className="donation-summary">
        <span>You are giving</span>
        <strong>
          {formatCurrency(effectiveAmount)}
          {kind === "recurring"
            ? ` · ${frequencies.find((f) => f.value === frequency)?.label}`
            : ""}
        </strong>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <button className="auth-submit" type="submit" disabled={!canSubmit}>
        {submitting ? "Recording…" : `Donate ${formatCurrency(effectiveAmount)}`}
        {!submitting && <span aria-hidden="true">➜</span>}
      </button>
    </form>
  );
}
