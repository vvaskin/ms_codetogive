"use client";

import { FormEvent, useState } from "react";
import { recordDonation } from "@/app/actions/donations";
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
}

/**
 * Name/email fields are shown for logged-out visitors (e.g. the public
 * /donate page). Pass `guest` to force the mode; otherwise it's auto-detected
 * from the current session (the portal donor is always signed in).
 */
export function DonationForm({ guest }: { guest?: boolean }) {
  const { user, loading } = useUser();
  const isGuest = guest ?? (!loading && !user);
  const [kind, setKind] = useState<Kind>("one-time");
  const [amount, setAmount] = useState<number>(presetAmounts[1]);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<Frequency>(frequencies[0].value);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
    });
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
            We&apos;ve created an account for you and emailed a link to set your
            password so you can track your giving.
          </p>
        )}
        <p className="donation-confirm-note">
          This is a demo — no payment has been taken.
        </p>
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
            <small>
              We&apos;ll create an account so you can track your donations.
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
