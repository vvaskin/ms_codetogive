import { contactContent, type ContactCopy } from "../content/contact";
import { facebookUrl, instagramUrl } from "../content/media";
import type { Locale } from "../content/site-data";
import { ContactForm } from "./DemoForms";
import styles from "./ContactExperience.module.css";

const spaceAddress = "2/F, Trium Lab, 21 Luk Hop Street, San Po Kong, Kowloon";
const officeAddress = "1102, 11/F, Trium Lab, 21 Luk Hop Street, San Po Kong, Kowloon";

function DirectContact({ copy }: { copy: ContactCopy }) {
  return (
    <aside className={styles.directCard} aria-labelledby="direct-contact-title">
      <h2 id="direct-contact-title">{copy.direct.title}</h2>

      <div className={styles.contactGroup}>
        <p className={styles.detailLabel}>{copy.direct.emailLabel}</p>
        <a href="mailto:jeff@love21foundation.com">jeff@love21foundation.com</a>
        <a href="mailto:maggie@love21foundation.com">maggie@love21foundation.com</a>
      </div>

      <div className={styles.contactGroup}>
        <p className={styles.detailLabel}>{copy.direct.addressLabel}</p>
        <div>
          <strong>{copy.direct.spaceLabel}</strong>
          <p>{spaceAddress}</p>
        </div>
        <div>
          <strong>{copy.direct.officeLabel}</strong>
          <p>{officeAddress}</p>
        </div>
      </div>

      <div className={styles.socialGroup}>
        <p className={styles.detailLabel}>{copy.direct.socialLabel}</p>
        <div className={styles.socialLinks}>
          <a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
          <a href={facebookUrl} target="_blank" rel="noreferrer">Facebook</a>
        </div>
      </div>
    </aside>
  );
}

export function ContactExperience({ locale }: { locale: Locale }) {
  const copy = contactContent[locale];
  const isChinese = locale === "zh";

  return (
    <article className={styles.page}>
      <header className={styles.intro}>
        <p className={`${styles.eyebrow} ${isChinese ? styles.localizedAccent : ""}`}>
          {copy.intro.eyebrow}
        </p>
        <h1>{copy.intro.title}</h1>
        <p className={styles.description}>{copy.intro.description}</p>
        <span className={styles.accent} aria-hidden="true" />
      </header>

      <div className={styles.layout}>
        <section className={styles.formCard} aria-labelledby="contact-form-title">
          <ContactForm copy={copy.form} />
        </section>
        <DirectContact copy={copy} />
      </div>
    </article>
  );
}
