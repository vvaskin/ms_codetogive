import type { Metadata } from "next";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from "@/app/admin/testimonials/actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPanel,
} from "@/components/admin/AdminUI";
import { TestimonialForm } from "@/components/admin/TestimonialForm";
import {
  readAdminTestimonials,
  type AdminTestimonialRecord,
} from "@/lib/testimonials";
import styles from "./Testimonials.module.css";

export const metadata: Metadata = { title: "Testimonials" };

function recordTitle(record: AdminTestimonialRecord) {
  const english = record.translations.find((item) => item.locale === "en");
  return english?.story_label ?? record.slug;
}

function recordSummary(record: AdminTestimonialRecord) {
  const languages = record.translations.length;
  return [
    `${languages} language${languages === 1 ? "" : "s"}`,
    `Updated ${formatUpdatedAt(record.updated_at)}`,
  ].join(" · ");
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-HK", {
    timeZone: "Asia/Hong_Kong",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminTestimonialsPage() {
  const testimonials = await readAdminTestimonials();

  return (
    <>
      <AdminPageHeader
        eyebrow="Content"
        title="Testimonials"
        description="Create, edit and remove the member stories that rotate in the homepage carousel."
        actions={
          <a className={styles.primaryAction} href="#add-testimonial">
            Add testimonial
          </a>
        }
      />

      <section
        className={`${styles.composer} ${testimonials.length === 0 ? styles.composerVisible : ""}`}
        id="add-testimonial"
      >
        <div className={styles.composerBody}>
          <h2 className={styles.composerTitle}>New testimonial</h2>
          <TestimonialForm action={createTestimonial} submitLabel="Save testimonial" />
        </div>
      </section>

      <AdminPanel
        eyebrow="Homepage carousel"
        title="Testimonial records"
        description={`${testimonials.length} ${testimonials.length === 1 ? "story" : "stories"}, shown in display order`}
      >
        {testimonials.length === 0 ? (
          <AdminEmptyState
            title="No testimonials stored yet"
            description="Apply the testimonial migration with npm run db:push, then use the form above to add the first story. The homepage keeps showing Crystal’s story until then."
            icon="♡"
          />
        ) : (
          <div className={styles.list}>
            {testimonials.map((record) => (
              <article className={styles.card} key={record.id}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3>{recordTitle(record)}</h3>
                    <p>{recordSummary(record)}</p>
                  </div>
                  <form action={deleteTestimonial}>
                    <input type="hidden" name="id" value={record.id} />
                    <ConfirmSubmitButton
                      className={styles.deleteAction}
                      message={`Delete “${recordTitle(record)}”? This cannot be undone.`}
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
                <details className={styles.editor}>
                  <summary>Edit testimonial</summary>
                  <div className={styles.editorBody}>
                    <TestimonialForm
                      action={updateTestimonial}
                      record={record}
                      submitLabel="Save changes"
                    />
                  </div>
                </details>
              </article>
            ))}
          </div>
        )}
      </AdminPanel>
    </>
  );
}
