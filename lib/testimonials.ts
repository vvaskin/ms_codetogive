import "server-only";

import { homepageContent, hrefFor, t } from "@/content/homepage";
import type { Locale } from "@/content/site-data";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  TestimonialLocale,
  TestimonialRow,
  TestimonialTranslationRow,
} from "@/lib/supabase/types";

export const testimonialLocales = ["en", "zh", "cn"] as const satisfies
  readonly TestimonialLocale[];

/** A story card ready to render, already resolved to a single language. */
export type PublicTestimonial = {
  id: number | "fallback";
  slug: string;
  image: string;
  imageAlt: string;
  storyLabel: string;
  body: string;
  quote: string | null;
  attribution: string | null;
  ctaLabel: string;
  ctaHref: string;
};

export type AdminTestimonialRecord = TestimonialRow & {
  translations: TestimonialTranslationRow[];
};

/**
 * The repository copy of Crystal's story. Rendered when the table is empty or
 * unreachable so the homepage never loses its testimonial section.
 */
function fallbackStory(locale: Locale): PublicTestimonial {
  const story = homepageContent.featuredStory;
  return {
    id: "fallback",
    slug: "crystal-story",
    image: story.image,
    imageAlt: t(story.imageAlt, locale),
    storyLabel: t(story.panelLabel, locale),
    body: t(story.context, locale),
    quote: t(story.quote, locale),
    attribution: t(story.attribution, locale),
    ctaLabel: t(story.action.label, locale),
    ctaHref: hrefFor(story.action, locale),
  };
}

/**
 * Uploaded images are stored as bucket-relative paths; repository images are
 * already absolute site paths and are passed through untouched.
 */
function publicImageUrl(path: string) {
  if (path.startsWith("/") || /^https?:\/\//i.test(path)) return path;

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return path;

  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${baseUrl}/storage/v1/object/public/testimonial-images/${encodedPath}`;
}

/** Falls back to English when a story has not been translated yet. */
function chooseTranslation(
  translations: TestimonialTranslationRow[],
  locale: Locale,
) {
  return (
    translations.find((translation) => translation.locale === locale) ??
    translations.find((translation) => translation.locale === "en")
  );
}

/** Every card links to the site's donate call to action, as it always has. */
function donateAction(locale: Locale) {
  const action = homepageContent.featuredStory.action;
  return { label: t(action.label, locale), href: hrefFor(action, locale) };
}

/**
 * Reads the published carousel for the public homepage. The homepage is
 * statically revalidated, so this uses the service-role client (like the
 * Instagram feed) rather than the cookie-backed one, and filters to published
 * stories itself. Any failure degrades to the static story instead of breaking
 * the page.
 */
export async function readHomepageTestimonials(
  locale: Locale,
): Promise<PublicTestimonial[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, slug, image_path, sort_order, testimonial_translations(*)")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;

    const cta = donateAction(locale);
    const stories = (data ?? []).flatMap((testimonial) => {
      const translation = chooseTranslation(
        testimonial.testimonial_translations ?? [],
        locale,
      );
      if (!translation) return [];

      return [
        {
          id: testimonial.id,
          slug: testimonial.slug,
          image: publicImageUrl(testimonial.image_path),
          imageAlt: translation.image_alt ?? translation.story_label,
          storyLabel: translation.story_label,
          body: translation.body,
          quote: translation.quote,
          attribution: translation.attribution,
          ctaLabel: cta.label,
          ctaHref: cta.href,
        } satisfies PublicTestimonial,
      ];
    });

    return stories.length ? stories : [fallbackStory(locale)];
  } catch (error) {
    const reason =
      error instanceof Error
        ? error.message
        : ((error as { message?: string })?.message ?? String(error));
    console.error(
      `Unable to load the homepage testimonial carousel, showing the built-in story instead: ${reason}`,
    );
    return [fallbackStory(locale)];
  }
}

/** Reads every testimonial, draft or published, for the admin portal. */
export async function readAdminTestimonials(): Promise<AdminTestimonialRecord[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*, testimonial_translations(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    // The migration has not been applied yet; show an empty portal instead of
    // an error screen.
    if (error.code === "42P01" || error.code === "PGRST205") return [];
    throw new Error(`Unable to load testimonials: ${error.message}`);
  }

  return (data ?? []).map(({ testimonial_translations, ...testimonial }) => ({
    ...testimonial,
    translations: testimonial_translations ?? [],
  }));
}
