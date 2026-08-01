"use client";

import { useEffect, useRef, useState } from "react";

type ParsedStat = {
  readonly prefix: string;
  readonly value: number;
  readonly suffix: string;
  readonly useGrouping: boolean;
};

/** Split display strings like "≈1,000", "HK$0", "600+", "1 goal", "90%+". */
export function parseStatValue(raw: string): ParsedStat {
  const trimmed = raw.trim();
  // Keep leading suffix whitespace (e.g. "1 goal" → suffix " goal").
  const match = trimmed.match(/^(≈|~|HK\$|\$)?\s*([\d,]+(?:\.\d+)?)(.*)$/u);

  if (!match) {
    return { prefix: "", value: NaN, suffix: trimmed, useGrouping: false };
  }

  const prefix = match[1] ?? "";
  const numStr = match[2] ?? "0";
  const suffix = match[3] ?? "";
  const useGrouping = numStr.includes(",");
  const value = Number(numStr.replace(/,/g, ""));

  return {
    prefix,
    value: Number.isFinite(value) ? value : NaN,
    suffix,
    useGrouping,
  };
}

function formatNumber(value: number, useGrouping: boolean): string {
  const rounded = Math.round(value);
  if (useGrouping) {
    return rounded.toLocaleString("en-US");
  }
  return String(rounded);
}

function compose(parsed: ParsedStat, value: number): string {
  return `${parsed.prefix}${formatNumber(value, parsed.useGrouping)}${parsed.suffix}`;
}

function shouldSkipAnimation(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  return document.documentElement.classList.contains("simple-view");
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

type CountUpProps = {
  readonly value: string;
  readonly className?: string;
};

/**
 * Animates the numeric portion of a stat string when it enters the viewport.
 * Prefix/suffix stay static. Calm mode and reduced motion show the final value immediately.
 * Animation runs once per mount / value change; intersection does not restart it.
 */
export function CountUp({ value, className }: CountUpProps) {
  const parsed = parseStatValue(value);
  const canAnimate = Number.isFinite(parsed.value);
  const finalDisplay = canAnimate ? compose(parsed, parsed.value) : value;

  const elementRef = useRef<HTMLSpanElement>(null);
  // null = show the final string (SSR, reduced motion, Calm mode, or pre-mount)
  const [current, setCurrent] = useState<number | null>(null);
  const [fadedIn, setFadedIn] = useState(true);

  useEffect(() => {
    const element = elementRef.current;
    const next = parseStatValue(value);
    const animate = Number.isFinite(next.value);

    if (!element || !animate || shouldSkipAnimation()) {
      return;
    }

    let frameId = 0;
    let started = false;
    let cancelled = false;

    // Prep non-zero stats at 0 (and zero stats as faded) before they enter view.
    // Async so we do not call setState synchronously inside the effect body.
    // Skip if intersection already started the animation this effect cycle.
    const prepId = requestAnimationFrame(() => {
      if (cancelled || started) {
        return;
      }
      if (next.value === 0) {
        setFadedIn(false);
      } else {
        setCurrent(0);
      }
    });

    const run = () => {
      if (started || cancelled) {
        return;
      }
      started = true;

      if (next.value === 0) {
        setCurrent(0);
        frameId = requestAnimationFrame(() => {
          if (!cancelled) {
            setFadedIn(true);
          }
        });
        return;
      }

      const duration =
        next.value <= 1 ? 700 : Math.min(1600, 900 + Math.log10(next.value + 1) * 280);
      const start = performance.now();

      const tick = (now: number) => {
        if (cancelled) {
          return;
        }
        const progress = Math.min(1, (now - start) / duration);
        setCurrent(next.value * easeOutCubic(progress));
        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          setCurrent(next.value);
        }
      };

      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(element);

    return () => {
      cancelled = true;
      observer.disconnect();
      cancelAnimationFrame(prepId);
      cancelAnimationFrame(frameId);
    };
    // Depend on `value` only — never on a freshly allocated `parsed` object, or every
    // setState during the animation would re-run this effect and reset to 0.
  }, [value]);

  const display =
    !canAnimate || current === null ? finalDisplay : compose(parsed, current);

  return (
    <span
      ref={elementRef}
      className={className}
      aria-label={value}
      data-faded={fadedIn ? "true" : "false"}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
