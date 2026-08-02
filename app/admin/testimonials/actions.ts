"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient, getAdminAuthState } from "@/lib/supabase/admin";
import { testimonialLocales } from "@/lib/testimonials";
import type { TestimonialLocale } from "@/lib/supabase/types";

const DEFAULT_TESTIMONIAL_IMAGE = "/assets/images/crystal-fitness.jpg";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type SubmittedTranslation = {
  locale: TestimonialLocale;
  storyLabel: string;
  body: string;
  quote: string | null;
  attribution: string | null;
  imageAlt: string | null;
};

type AdminClient = ReturnType<typeof createAdminClient>;

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function requiredString(value: unknown, field: string, maximum: number) {
  if (typeof value !== "string") throw new Error(`${field} must be text.`);
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${field} is required.`);
  if (trimmed.length > maximum) throw new Error(`${field} is too long.`);
  return trimmed;
}

function optionalString(value: unknown, field: string, maximum: number) {
  if (value == null) return null;
  if (typeof value !== "string") throw new Error(`${field} must be text.`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > maximum) throw new Error(`${field} is too long.`);
  return trimmed;
}

function parseId(formData: FormData) {
  const raw = textValue(formData, "id");
  if (!/^\d+$/.test(raw)) throw new Error("Invalid testimonial id.");
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("Invalid testimonial id.");
  return id;
}

/**
 * The editor posts every language as one JSON field so a story and all of its
 * translations are validated and saved together.
 */
function parseTranslations(formData: FormData): SubmittedTranslation[] {
  let raw: unknown;
  try {
    raw = JSON.parse(textValue(formData, "translations"));
  } catch {
    throw new Error("The testimonial content could not be read.");
  }
  if (!Array.isArray(raw)) throw new Error("Invalid testimonial content.");

  const translations = raw.flatMap((item): SubmittedTranslation[] => {
    if (!item || typeof item !== "object") throw new Error("Invalid translation.");
    const candidate = item as Record<string, unknown>;
    const locale = candidate.locale;
    if (!testimonialLocales.includes(locale as TestimonialLocale)) {
      throw new Error("Invalid translation language.");
    }

    // A non-English tab left completely blank is simply not saved.
    const isBlank = ["storyLabel", "body", "quote", "attribution", "imageAlt"]
      .every((key) => {
        const value = candidate[key];
        return typeof value !== "string" || !value.trim();
      });
    if (isBlank && locale !== "en") return [];

    const quote = optionalString(candidate.quote, "Quote", 500);
    const attribution = optionalString(candidate.attribution, "Quote attribution", 160);
    if (attribution && !quote) {
      throw new Error("An attribution needs a quote to go with it.");
    }

    return [
      {
        locale: locale as TestimonialLocale,
        storyLabel: requiredString(candidate.storyLabel, "Story label", 80),
        body: requiredString(candidate.body, "Story text", 1000),
        quote,
        attribution,
        imageAlt: optionalString(candidate.imageAlt, "Image description", 200),
      },
    ];
  });

  if (!translations.some((translation) => translation.locale === "en")) {
    throw new Error("An English version is required.");
  }
  if (new Set(translations.map((item) => item.locale)).size !== translations.length) {
    throw new Error("Each language can only appear once.");
  }
  return translations;
}

async function requireStaff() {
  const authState = await getAdminAuthState();
  if (!authState.user || !authState.isStaff) redirect("/admin/login");
  return { supabase: createAdminClient(), userId: authState.user.id };
}

function revalidateTestimonialPages() {
  revalidatePath("/");
  revalidatePath("/zh");
  revalidatePath("/cn");
  revalidatePath("/admin/content/testimonials");
}

function imageFile(formData: FormData) {
  const value = formData.get("image");
  if (!(value instanceof File) || value.size === 0) return null;
  if (value.size > MAX_IMAGE_SIZE) {
    throw new Error("The testimonial image must be 5 MB or smaller.");
  }
  if (!(value.type in IMAGE_TYPES)) {
    throw new Error("The testimonial image must be a JPEG, PNG, or WebP file.");
  }
  return value;
}

async function uploadImage(supabase: AdminClient, file: File, slug: string) {
  const extension = IMAGE_TYPES[file.type as keyof typeof IMAGE_TYPES];
  const path = `${slug}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from("testimonial-images")
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });
  if (error) throw new Error(`Unable to upload testimonial image: ${error.message}`);
  return path;
}

/** Repository images live in /public and must never be deleted from storage. */
async function removeUploadedImage(supabase: AdminClient, path: string | null) {
  if (!path || path.startsWith("/") || /^https?:\/\//i.test(path)) return;
  await supabase.storage.from("testimonial-images").remove([path]);
}

async function nextSortOrder(supabase: AdminClient) {
  const { data, error } = await supabase
    .from("testimonials")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`Unable to determine testimonial order: ${error.message}`);
  return Math.min((data?.sort_order ?? 0) + 1, 9999);
}

function slugFromStoryLabel(label: string) {
  const readable = label
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 84)
    .replace(/-+$/g, "");
  const base = readable || "testimonial";
  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

/** Replaces every stored translation with the submitted set. */
async function replaceTranslations(
  supabase: AdminClient,
  testimonialId: number,
  translations: SubmittedTranslation[],
) {
  const { error: upsertError } = await supabase
    .from("testimonial_translations")
    .upsert(
      translations.map((translation) => ({
        testimonial_id: testimonialId,
        locale: translation.locale,
        story_label: translation.storyLabel,
        body: translation.body,
        quote: translation.quote,
        attribution: translation.attribution,
        image_alt: translation.imageAlt,
      })),
      { onConflict: "testimonial_id,locale" },
    );
  if (upsertError) {
    throw new Error(`Unable to save testimonial content: ${upsertError.message}`);
  }

  const keptLocales = translations.map((translation) => translation.locale);
  const removedLocales = testimonialLocales.filter(
    (locale) => !keptLocales.includes(locale),
  );
  if (removedLocales.length === 0) return;

  const { error: deleteError } = await supabase
    .from("testimonial_translations")
    .delete()
    .eq("testimonial_id", testimonialId)
    .in("locale", removedLocales);
  if (deleteError) {
    throw new Error(`Unable to save testimonial content: ${deleteError.message}`);
  }
}

export async function createTestimonial(formData: FormData) {
  const { supabase, userId } = await requireStaff();
  const translations = parseTranslations(formData);
  const english = translations.find((translation) => translation.locale === "en")!;
  const slug = slugFromStoryLabel(english.storyLabel);
  const file = imageFile(formData);
  const uploadedPath = file ? await uploadImage(supabase, file, slug) : null;

  const { data: testimonial, error } = await supabase
    .from("testimonials")
    .insert({
      slug,
      status: "published",
      image_path: uploadedPath ?? DEFAULT_TESTIMONIAL_IMAGE,
      // New stories go to the end of the carousel.
      sort_order: await nextSortOrder(supabase),
      created_by: userId,
    })
    .select("id")
    .single();

  if (error || !testimonial) {
    await removeUploadedImage(supabase, uploadedPath);
    throw new Error(
      `Unable to create testimonial: ${error?.message ?? "No record returned."}`,
    );
  }

  try {
    await replaceTranslations(supabase, testimonial.id, translations);
  } catch (contentError) {
    await supabase.from("testimonials").delete().eq("id", testimonial.id);
    await removeUploadedImage(supabase, uploadedPath);
    throw contentError;
  }

  revalidateTestimonialPages();
  redirect("/admin/content/testimonials");
}

export async function updateTestimonial(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = parseId(formData);
  const translations = parseTranslations(formData);
  const file = imageFile(formData);

  const { data: current, error: readError } = await supabase
    .from("testimonials")
    .select("slug, image_path")
    .eq("id", id)
    .maybeSingle();
  if (readError) throw new Error(`Unable to read testimonial: ${readError.message}`);
  if (!current) throw new Error("Testimonial not found.");

  // The story keeps its place in the carousel; only a new photo touches the row.
  const uploadedPath = file ? await uploadImage(supabase, file, current.slug) : null;
  if (uploadedPath) {
    const { error } = await supabase
      .from("testimonials")
      .update({ image_path: uploadedPath })
      .eq("id", id);
    if (error) {
      await removeUploadedImage(supabase, uploadedPath);
      throw new Error(`Unable to update testimonial: ${error.message}`);
    }
  }

  try {
    await replaceTranslations(supabase, id, translations);
  } catch (contentError) {
    if (uploadedPath) {
      await supabase
        .from("testimonials")
        .update({ image_path: current.image_path })
        .eq("id", id);
    }
    await removeUploadedImage(supabase, uploadedPath);
    throw contentError;
  }

  if (uploadedPath) await removeUploadedImage(supabase, current.image_path);

  revalidateTestimonialPages();
  redirect("/admin/content/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = parseId(formData);

  const { data: testimonial, error: readError } = await supabase
    .from("testimonials")
    .select("image_path")
    .eq("id", id)
    .maybeSingle();
  if (readError) throw new Error(`Unable to read testimonial: ${readError.message}`);
  if (!testimonial) throw new Error("Testimonial not found.");

  // Translations are removed by the cascading foreign key.
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(`Unable to delete testimonial: ${error.message}`);
  await removeUploadedImage(supabase, testimonial.image_path);

  revalidateTestimonialPages();
  redirect("/admin/content/testimonials");
}
