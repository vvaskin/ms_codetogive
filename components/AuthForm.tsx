"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { VOLUNTEER_SIGNUP_DRAFT_KEY } from "@/lib/volunteer-signup-draft";
import { createClient } from "@/lib/supabase/client";
import { USER_ROLES, type UserRole } from "@/lib/roles";
import styles from "./AuthForm.module.css";

type AuthMode = "login" | "signup";
type Locale = "en" | "zh" | "cn";

const copy = {
  en: {
    eyebrow: "LOVE 21 PORTAL",
    welcomeBack: "Welcome back",
    createYourAccount: "Create your account",
    loginIntro: "Log in to continue to your personal portal.",
    signupIntro:
      "Choose the account type that best describes how you connect with Love 21.",
    fullName: "Full name",
    emailAddress: "Email address",
    password: "Password",
    passwordHelp: "Use at least 8 characters.",
    accountType: "Account type",
    showPassword: "Show password",
    hidePassword: "Hide password",
    roles: {
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
    },
    genericError: "Something went wrong. Please try again.",
    invalidCredentials: "The email or password is incorrect.",
    emailExists: "An account with this email already exists.",
    emailNotConfirmed:
      "Please confirm your email address first — check your inbox for the link.",
    networkError:
      "We could not reach the authentication service. Please try again.",
    loggingIn: "Logging in…",
    creatingAccount: "Creating account…",
    logIn: "Log in",
    createAccount: "Create account",
    alreadyHaveAccount: "Already have an account?",
    newToPortal: "New to the portal?",
  },
  zh: {
    eyebrow: "LOVE 21 會員平台",
    welcomeBack: "歡迎回來",
    createYourAccount: "建立帳戶",
    loginIntro: "登入以繼續前往您的個人頁面。",
    signupIntro: "請選擇最能描述您與 Love 21 關係的帳戶類型。",
    fullName: "姓名",
    emailAddress: "電郵地址",
    password: "密碼",
    passwordHelp: "請使用至少 8 個字元。",
    accountType: "帳戶類型",
    showPassword: "顯示密碼",
    hidePassword: "隱藏密碼",
    roles: {
      member: {
        label: "會員",
        description: "以唐氏綜合症人士身份加入 Love 21。",
      },
      donor: {
        label: "捐贈者",
        description: "透過捐贈支持 Love 21 及其社群。",
      },
      volunteer: {
        label: "義工",
        description: "協助課堂、活動及項目。",
      },
    },
    genericError: "發生錯誤，請再試一次。",
    invalidCredentials: "電郵或密碼不正確。",
    emailExists: "此電郵已註冊帳戶。",
    emailNotConfirmed: "請先確認您的電郵地址——請查看收件箱中的連結。",
    networkError: "無法連接驗證服務，請再試一次。",
    loggingIn: "登入中…",
    creatingAccount: "建立帳戶中…",
    logIn: "登入",
    createAccount: "建立帳戶",
    alreadyHaveAccount: "已有帳戶？",
    newToPortal: "新用戶？",
  },
  cn: {
    eyebrow: "LOVE 21 会员平台",
    welcomeBack: "欢迎回来",
    createYourAccount: "创建账户",
    loginIntro: "登录以继续前往您的个人页面。",
    signupIntro: "请选择最能描述您与 Love 21 关系的账户类型。",
    fullName: "姓名",
    emailAddress: "电邮地址",
    password: "密码",
    passwordHelp: "请使用至少 8 个字符。",
    accountType: "账户类型",
    showPassword: "显示密码",
    hidePassword: "隐藏密码",
    roles: {
      member: {
        label: "会员",
        description: "以唐氏综合症人士身份加入 Love 21。",
      },
      donor: {
        label: "捐赠者",
        description: "通过捐赠支持 Love 21 及其社群。",
      },
      volunteer: {
        label: "义工",
        description: "协助课堂、活动及项目。",
      },
    },
    genericError: "发生错误，请再试一次。",
    invalidCredentials: "电邮或密码不正确。",
    emailExists: "此电邮已注册账户。",
    emailNotConfirmed: "请先确认您的电邮地址——请查看收件箱中的连结。",
    networkError: "无法连接验证服务，请再试一次。",
    checkInboxTitle: "请查看您的电邮",
    checkInboxBody:
      "我们已向 {email} 发送确认连结。请点击连结启用账户，然后登录。",
    loggingIn: "登录中…",
    creatingAccount: "创建账户中…",
    logIn: "登录",
    createAccount: "创建账户",
    alreadyHaveAccount: "已有账户？",
    newToPortal: "新用户？",
  },
};

type Copy = (typeof copy)["en"];

function readableError(message: string | undefined, lang: Copy) {
  if (!message) return lang.genericError;

  const normalized = message.toLowerCase();

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password") ||
    normalized.includes("invalid credentials")
  ) {
    return lang.invalidCredentials;
  }

  if (normalized.includes("email not confirmed")) {
    return lang.emailNotConfirmed;
  }

  if (
    normalized.includes("already exists") ||
    normalized.includes("already registered")
  ) {
    return lang.emailExists;
  }

  return message;
}

export function AuthForm({
  mode,
  redirectTo = "/portal",
  locale = "en",
  showAccountSwitch = true,
}: {
  mode: AuthMode;
  redirectTo?: string;
  locale?: Locale;
  showAccountSwitch?: boolean;
}) {
  const router = useRouter();
  const lang: Copy =
    locale === "zh" ? copy.zh : locale === "cn" ? copy.cn : copy.en;
  const [role, setRole] = useState<UserRole>("member");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const supabase = createClient();

    if (isSignup && role === "volunteer") {
      window.sessionStorage.setItem(
        VOLUNTEER_SIGNUP_DRAFT_KEY,
        JSON.stringify({ name, email, password }),
      );
      router.push("/signup/volunteer");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Consumed by the handle_new_user() trigger to build the profile.
            data: { name: String(formData.get("name") ?? "").trim(), role },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });

        if (signUpError) {
          setError(readableError(signUpError.message, lang));
          return;
        }

        // Email confirmation is disabled, so signup returns a session and we
        // fall through to the redirect below.
      } else {
        const { error: signInError } =
          await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          setError(readableError(signInError.message, lang));
          return;
        }
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError(lang.networkError);
    } finally {
      setIsSubmitting(false);
    }
  }

  const switchHref =
    locale === "zh"
      ? isSignup
        ? "/zh/login-hk/"
        : "/zh/signup-hk/"
      : locale === "cn"
        ? isSignup
          ? "/cn/login-hk/"
          : "/cn/signup-hk/"
        : isSignup
          ? "/login"
          : "/signup";

  return (
    <form className={styles.authForm} method="post" onSubmit={onSubmit}>
      <div className={styles.authFormHeading}>
        <p className={styles.eyebrow}>{lang.eyebrow}</p>
        <h1>{isSignup ? lang.createYourAccount : lang.welcomeBack}</h1>
        <p>{isSignup ? lang.signupIntro : lang.loginIntro}</p>
      </div>

      {isSignup && (
        <label>
          {lang.fullName}
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
        {lang.emailAddress}
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
        {lang.password}
        <div className={styles.passwordField}>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={8}
            required
            disabled={isSubmitting}
            aria-describedby={isSignup ? "password-help" : undefined}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword((value) => !value)}
            disabled={isSubmitting}
            aria-pressed={showPassword}
            aria-label={showPassword ? lang.hidePassword : lang.showPassword}
            title={showPassword ? lang.hidePassword : lang.showPassword}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.2A9.3 9.3 0 0112 5c5 0 9 4.5 9 7a12 12 0 01-2.4 3.3M6.1 6.1A12 12 0 003 12c0 2.5 4 7 9 7a9 9 0 003.9-.9"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>
      </label>

      {isSignup && (
        <>
          <p className={styles.fieldHelp} id="password-help">
            {lang.passwordHelp}
          </p>
          <fieldset className={styles.rolePicker}>
            <legend>{lang.accountType}</legend>
            <div className={styles.roleOptions}>
              {USER_ROLES.map((value) => (
                <label
                  className={`${styles.roleOption} ${role === value ? styles.selected : ""}`}
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
                    <strong>{lang.roles[value].label}</strong>
                    <small>{lang.roles[value].description}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      {error && (
        <div className={styles.authError} role="alert">
          {error}
        </div>
      )}

      <button className={styles.authSubmit} type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? isSignup
            ? lang.creatingAccount
            : lang.loggingIn
          : isSignup
            ? role === "volunteer"
              ? "Continue"
              : lang.createAccount
            : lang.logIn}
        {!isSubmitting && <span aria-hidden="true">➜</span>}
      </button>

      {showAccountSwitch && (
        <p className={styles.authSwitch}>
          {isSignup ? lang.alreadyHaveAccount : lang.newToPortal}{" "}
          <Link href={switchHref}>
            {isSignup ? lang.logIn : lang.createAccount}
          </Link>
        </p>
      )}
    </form>
  );
}
