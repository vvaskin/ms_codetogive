"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "../content/site-data";
import styles from "./SiteTools.module.css";

const SIMPLE_VIEW_KEY = "simple-view";
const SIMPLE_VIEW_EVENT = "love21-simple-view";
const HIGH_CONTRAST_KEY = "high-contrast";
const HIGH_CONTRAST_EVENT = "love21-high-contrast";
const TEXT_SIZE_KEY = "text-size";
const TEXT_SIZE_EVENT = "love21-text-size";
const TEXT_SIZE_MAX = 2;

function subscribeLocalStorage(eventName: string, onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(eventName, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(eventName, onStoreChange);
  };
}

function getBoolSnapshot(key: string) {
  return window.localStorage.getItem(key) === "on";
}

function getNumberSnapshot(key: string, min: number, max: number) {
  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.round(value)))
    : 0;
}

const simpleViewStore = {
  subscribe: (onStoreChange: () => void) =>
    subscribeLocalStorage(SIMPLE_VIEW_EVENT, onStoreChange),
  getSnapshot: () => getBoolSnapshot(SIMPLE_VIEW_KEY),
  getServerSnapshot: () => false,
};

const highContrastStore = {
  subscribe: (onStoreChange: () => void) =>
    subscribeLocalStorage(HIGH_CONTRAST_EVENT, onStoreChange),
  getSnapshot: () => getBoolSnapshot(HIGH_CONTRAST_KEY),
  getServerSnapshot: () => false,
};

const textSizeStore = {
  subscribe: (onStoreChange: () => void) =>
    subscribeLocalStorage(TEXT_SIZE_EVENT, onStoreChange),
  getSnapshot: () => getNumberSnapshot(TEXT_SIZE_KEY, 0, TEXT_SIZE_MAX),
  getServerSnapshot: () => 0,
};

/**
 * Shared accessibility-preference state (simple view / high contrast / text
 * size), synced to localStorage and cross-tab via storage events. Both
 * SiteChrome and the portal shell apply these as classes on <html>.
 */
export function useAccessibilityPrefs() {
  const simpleView = useSyncExternalStore(
    simpleViewStore.subscribe,
    simpleViewStore.getSnapshot,
    simpleViewStore.getServerSnapshot,
  );
  const highContrast = useSyncExternalStore(
    highContrastStore.subscribe,
    highContrastStore.getSnapshot,
    highContrastStore.getServerSnapshot,
  );
  const textSize = useSyncExternalStore(
    textSizeStore.subscribe,
    textSizeStore.getSnapshot,
    textSizeStore.getServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("simple-view", simpleView);
  }, [simpleView]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("text-large", textSize === 1);
    root.classList.toggle("text-largest", textSize === 2);
  }, [textSize]);

  const toggleSimpleView = () => {
    const next = !simpleView;
    window.localStorage.setItem(SIMPLE_VIEW_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event(SIMPLE_VIEW_EVENT));
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    window.localStorage.setItem(HIGH_CONTRAST_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event(HIGH_CONTRAST_EVENT));
  };

  const adjustTextSize = (delta: number) => {
    const next = Math.min(TEXT_SIZE_MAX, Math.max(0, textSize + delta));
    window.localStorage.setItem(TEXT_SIZE_KEY, String(next));
    window.dispatchEvent(new Event(TEXT_SIZE_EVENT));
  };

  return {
    simpleView,
    highContrast,
    textSize,
    toggleSimpleView,
    toggleHighContrast,
    adjustTextSize,
  };
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
      <path
        d="M3.5 12h17"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
      <path
        d="M12 3c2.5 2.6 3.75 5.6 3.75 9S14.5 18.4 12 21c-2.5-2.6-3.75-5.6-3.75-9S9.5 5.6 12 3Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function LanguageMenu({
  locale,
  paths,
}: {
  locale: Locale;
  paths: { en: string; zh: string; cn: string };
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const label = (zh: string, cn: string, en: string) =>
    locale === "zh" ? zh : locale === "cn" ? cn : en;

  const options = [
    { id: "en" as const, href: paths.en, short: "EN", name: "English" },
    { id: "zh" as const, href: paths.zh, short: "繁", name: "繁體中文" },
    { id: "cn" as const, href: paths.cn, short: "简", name: "简体中文" },
  ].filter((option) => Boolean(option.href));

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.languageMenu}>
      <button
        type="button"
        className={`${styles.accessTrigger} ${open ? styles.accessTriggerOpen : ""}`}
        aria-label={label("語言", "语言", "Language")}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <GlobeIcon className={styles.languageIcon} />
      </button>
      {open ? (
        <div
          className={styles.languagePanel}
          role="menu"
          aria-label={label("語言", "语言", "Language")}
        >
          {options.map((option) => (
            <Link
              key={option.id}
              href={option.href}
              role="menuitem"
              className={`${styles.languageOption} ${locale === option.id ? styles.languageOptionActive : ""}`}
              aria-current={locale === option.id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              <span className={styles.languageOptionName}>{option.name}</span>
              <span className={styles.languageOptionShort}>{option.short}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function AccessibilityMenu({
  locale,
  simpleView,
  highContrast,
  textSize,
  onToggleSimpleView,
  onToggleHighContrast,
  onAdjustTextSize,
  className,
}: {
  locale: Locale;
  simpleView: boolean;
  highContrast: boolean;
  textSize: number;
  onToggleSimpleView: () => void;
  onToggleHighContrast: () => void;
  onAdjustTextSize: (delta: number) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const a11y = (zh: string, cn: string, en: string) =>
    locale === "zh" ? zh : locale === "cn" ? cn : en;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const contrastLabel = a11y("高對比度", "高对比度", "High contrast");
  const textLabel = a11y("文字大小", "文字大小", "Text size");
  const calmLabel = a11y("舒適模式", "舒适模式", "Calm mode");

  const panel = (
    <div
      className={styles.accessPanel}
      role="group"
      aria-label={a11y("無障礙設定", "无障碍设置", "Accessibility settings")}
    >
      <p className={styles.accessHeading}>{a11y("無障礙設定", "无障碍设置", "Accessibility")}</p>

      <div className={styles.accessRow}>
        <span className={styles.accessLabel}>{contrastLabel}</span>
        <button
          type="button"
          className={`${styles.accessToggle} ${highContrast ? styles.accessToggleOn : ""}`}
          aria-pressed={highContrast}
          onClick={onToggleHighContrast}
        >
          {highContrast ? a11y("已開啟", "已开启", "On") : a11y("已關閉", "已关闭", "Off")}
        </button>
      </div>

      <div className={styles.accessRow}>
        <span className={styles.accessLabel}>{textLabel}</span>
        <span className={styles.accessTextSize}>
          <button
            type="button"
            className={styles.accessTextBtn}
            aria-label={a11y("減小文字", "减小文字", "Decrease text size")}
            disabled={textSize === 0}
            onClick={() => onAdjustTextSize(-1)}
          >
            A−
          </button>
          <button
            type="button"
            className={styles.accessTextBtn}
            aria-label={a11y("增大文字", "增大文字", "Increase text size")}
            disabled={textSize === TEXT_SIZE_MAX}
            onClick={() => onAdjustTextSize(1)}
          >
            A+
          </button>
        </span>
      </div>

      <div className={styles.accessRow}>
        <span className={styles.accessLabel}>{calmLabel}</span>
        <button
          type="button"
          className={`${styles.accessToggle} ${simpleView ? styles.accessToggleOn : ""}`}
          aria-pressed={simpleView}
          onClick={onToggleSimpleView}
        >
          {simpleView ? a11y("已開啟", "已开启", "On") : a11y("已關閉", "已关闭", "Off")}
        </button>
      </div>
    </div>
  );

  return (
    <div ref={rootRef} className={`${styles.accessMenu} ${className ?? ""}`}>
      <button
        type="button"
        className={`${styles.accessTrigger} ${open ? styles.accessTriggerOpen : ""}`}
        aria-label={a11y("無障礙設定", "无障碍设置", "Accessibility settings")}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Image
          src="/assets/images/accessibility-symbol.png"
          alt=""
          width={250}
          height={250}
          className={styles.accessIcon}
        />
      </button>
      {open ? panel : null}
    </div>
  );
}

/**
 * The floating bottom-right pink pill combining accessibility + language
 * controls. Single integration point — owns its own preference state via
 * `useAccessibilityPrefs`, so callers just supply locale + language paths.
 */
export function SiteToolsTray({
  locale,
  paths,
}: {
  locale: Locale;
  paths: { en: string; zh: string; cn: string };
}) {
  const prefs = useAccessibilityPrefs();
  const label =
    locale === "zh" ? "網站工具" : locale === "cn" ? "网站工具" : "Site tools";

  return (
    <div className={styles.floatingTools} aria-label={label}>
      <AccessibilityMenu
        locale={locale}
        simpleView={prefs.simpleView}
        highContrast={prefs.highContrast}
        textSize={prefs.textSize}
        onToggleSimpleView={prefs.toggleSimpleView}
        onToggleHighContrast={prefs.toggleHighContrast}
        onAdjustTextSize={prefs.adjustTextSize}
      />
      <LanguageMenu locale={locale} paths={paths} />
    </div>
  );
}
