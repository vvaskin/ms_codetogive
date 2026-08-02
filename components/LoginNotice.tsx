import type { Locale } from "@/content/site-data";

interface Props {
  locale: Locale;
  notice: string | string[] | undefined;
}

/**
 * Small notice banner rendered above the AuthForm on login pages, driven by
 * the `notice` query param (e.g. after a guest volunteer signup that hit an
 * already-existing account). Keyed by notice value so new copies can be
 * added without needing another component.
 */
export function LoginNotice({ locale, notice }: Props) {
  const value = Array.isArray(notice) ? notice[0] : notice;
  if (!value) return null;
  const text = messages[value]?.[locale];
  if (!text) return null;

  return (
    <div
      role="status"
      style={{
        margin: "0 0 1rem",
        padding: "0.75rem 1rem",
        border: "1px solid var(--color-border, #e4e4e4)",
        borderRadius: "0.75rem",
        background: "var(--color-canvas, #fafafa)",
        color: "var(--color-ink, #1a1a1a)",
        fontSize: "0.95rem",
        lineHeight: 1.4,
      }}
    >
      {text}
    </div>
  );
}

const messages: Record<string, Record<Locale, string>> = {
  account_exists: {
    en: "An account may already exist for this email. Please log in to continue.",
    zh: "此電郵可能已有帳戶。請登入以繼續。",
    cn: "此电邮可能已有账户。请登录以继续。",
  },
};
