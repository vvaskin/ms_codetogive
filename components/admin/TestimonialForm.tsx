"use client";

import { useState, type ReactNode } from "react";
import type { AdminTestimonialRecord } from "@/lib/testimonials";
import type { TestimonialLocale } from "@/lib/supabase/types";
import styles from "./TestimonialForm.module.css";

type TranslationDraft = {
  locale: TestimonialLocale;
  storyLabel: string;
  body: string;
  quote: string;
  attribution: string;
  imageAlt: string;
};

type TranslationField = Exclude<keyof TranslationDraft, "locale">;

const locales = ["en", "zh", "cn"] as const satisfies readonly TestimonialLocale[];

const localeLabels: Record<TestimonialLocale, string> = {
  en: "English",
  zh: "Traditional Chinese",
  cn: "Simplified Chinese",
};

function initialTranslations(record?: AdminTestimonialRecord): TranslationDraft[] {
  return locales.map((locale) => {
    const translation = record?.translations.find((item) => item.locale === locale);
    return {
      locale,
      storyLabel: translation?.story_label ?? "",
      body: translation?.body ?? "",
      quote: translation?.quote ?? "",
      attribution: translation?.attribution ?? "",
      imageAlt: translation?.image_alt ?? "",
    };
  });
}

export function TestimonialForm({
  action,
  record,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  record?: AdminTestimonialRecord;
  submitLabel: string;
}) {
  const [translations, setTranslations] = useState(() => initialTranslations(record));

  function updateField(
    locale: TestimonialLocale,
    field: TranslationField,
    value: string,
  ) {
    setTranslations((current) =>
      current.map((translation) => {
        if (translation.locale !== locale) return translation;
        const next = { ...translation, [field]: value };
        // An attribution has nothing to attribute once its quote is gone.
        if (field === "quote" && !value.trim()) next.attribution = "";
        return next;
      }),
    );
  }

  function fields(translation: TranslationDraft): ReactNode {
    const isEnglish = translation.locale === "en";
    return (
      <>
        <label>
          <span>Story label</span>
          <input
            value={translation.storyLabel}
            onChange={(event) =>
              updateField(translation.locale, "storyLabel", event.target.value)
            }
            placeholder="Crystal’s story"
            required={isEnglish}
            maxLength={80}
          />
        </label>

        <label>
          <span>Story text</span>
          <textarea
            value={translation.body}
            onChange={(event) =>
              updateField(translation.locale, "body", event.target.value)
            }
            rows={4}
            placeholder="Tell this member’s story in a couple of sentences…"
            required={isEnglish}
            maxLength={1000}
          />
        </label>

        <label>
          <span>Quote (optional)</span>
          <textarea
            value={translation.quote}
            onChange={(event) =>
              updateField(translation.locale, "quote", event.target.value)
            }
            rows={2}
            placeholder="I am very proud of how steadily she performs."
            maxLength={500}
          />
        </label>

        <div className={styles.fieldGrid}>
          <label>
            <span>Quote attribution (optional)</span>
            <input
              value={translation.attribution}
              onChange={(event) =>
                updateField(translation.locale, "attribution", event.target.value)
              }
              placeholder="Crystal’s mother · FY2024–25 Annual Report"
              maxLength={160}
              disabled={!translation.quote.trim()}
            />
          </label>
          <label>
            <span>Photo description (optional)</span>
            <input
              value={translation.imageAlt}
              onChange={(event) =>
                updateField(translation.locale, "imageAlt", event.target.value)
              }
              placeholder="Defaults to the story label"
              maxLength={200}
            />
          </label>
        </div>
      </>
    );
  }

  const [english, ...otherLanguages] = translations;

  return (
    <form action={action} className={styles.form} encType="multipart/form-data">
      {record ? <input type="hidden" name="id" value={record.id} /> : null}
      <input type="hidden" name="translations" value={JSON.stringify(translations)} />

      <div className={styles.settings}>
        <label>
          <span>
            Photo {record ? "(leave empty to keep the current one)" : "(optional)"}
          </span>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" />
        </label>
      </div>

      {/* English stays expanded: the browser cannot report a validation error
          on a required field hidden inside a collapsed <details>. */}
      <section className={styles.primaryLanguage} aria-label="English story">
        <h4>{localeLabels.en}</h4>
        {fields(english)}
      </section>

      <div className={styles.translations}>
        {otherLanguages.map((translation) => (
          <details className={styles.translation} key={translation.locale}>
            <summary>
              <strong>{localeLabels[translation.locale]}</strong>
              <span>Optional</span>
            </summary>
            <div className={styles.translationBody}>
              <p className={styles.translationHint}>
                Leave every field blank to show the English version in this language.
              </p>
              {fields(translation)}
            </div>
          </details>
        ))}
      </div>

      <button className={styles.submit} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}
