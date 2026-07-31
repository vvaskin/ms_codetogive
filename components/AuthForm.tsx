"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  USER_ROLES,
  type UserRole,
} from "@/lib/db/schema";

type AuthMode = "login" | "signup";

const roleDetails: Record<
  UserRole,
  { label: string; description: string }
> = {
  member: {
    label: "Member",
    description: "Join Love 21 as a person with Down syndrome.",
  },
  donor: {
    label: "Donor",
    description: "Support Love 21 and its community through donations.",
  },
  volunteer: {
    label: "Volunteer",
    description: "Help with classes, activities, and events.",
  },
};

function readableError(message: string | undefined) {
  if (!message) return "Something went wrong. Please try again.";

  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid email or password") ||
    normalized.includes("invalid credentials")
  ) {
    return "The email or password is incorrect.";
  }

  if (
    normalized.includes("already exists") ||
    normalized.includes("already registered")
  ) {
    return "An account with this email already exists.";
  }

  return message;
}

export function AuthForm({
  mode,
  redirectTo = "/portal",
}: {
  mode: AuthMode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("member");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const result = isSignup
        ? await authClient.signUp.email({
            name: String(formData.get("name") ?? "").trim(),
            email,
            password,
            role,
          })
        : await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
          });

      if (result.error) {
        setError(readableError(result.error.message));
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("We could not reach the authentication service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" method="post" onSubmit={onSubmit}>
      <div className="auth-form-heading">
        <p className="eyebrow">LOVE 21 PORTAL</p>
        <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p>
          {isSignup
            ? "Choose the account type that best describes how you connect with Love 21."
            : "Log in to continue to your personal portal."}
        </p>
      </div>

      {isSignup && (
        <label>
          Full name
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={isSubmitting}
          />
        </label>
      )}

      <label>
        Email address
        <input
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          disabled={isSubmitting}
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={8}
          required
          disabled={isSubmitting}
          aria-describedby={isSignup ? "password-help" : undefined}
        />
      </label>

      {isSignup && (
        <>
          <p className="field-help" id="password-help">
            Use at least 8 characters.
          </p>
          <fieldset className="role-picker">
            <legend>Account type</legend>
            <div className="role-options">
              {USER_ROLES.map((value) => (
                <label
                  className={`role-option ${role === value ? "selected" : ""}`}
                  key={value}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    checked={role === value}
                    onChange={() => setRole(value)}
                    disabled={isSubmitting}
                  />
                  <span>
                    <strong>{roleDetails[value].label}</strong>
                    <small>{roleDetails[value].description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <button className="auth-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? isSignup
            ? "Creating account…"
            : "Logging in…"
          : isSignup
            ? "Create account"
            : "Log in"}
        {!isSubmitting && <span aria-hidden="true">➜</span>}
      </button>

      <p className="auth-switch">
        {isSignup ? "Already have an account?" : "New to the portal?"}{" "}
        <Link href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
