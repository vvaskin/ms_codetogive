# Agent guidance

Keep this file updated whenever project architecture, conventions, commands, or
workflows change.

## Architecture

### Styling

CSS Modules are the official component-styling approach.

- Colocate `ComponentName.module.css` with camel-cased selectors.
- Global CSS is limited to:
  - `styles/tokens.css` — design tokens
  - `styles/base.css` — reset, element defaults, accessibility (text size / high contrast / Calm mode `html.simple-view`), reduced motion
  - `app/globals.css` — entrypoint (imports tokens/base) plus the quiet development ribbon
- Do not add new globally named component classes.
- New visual patterns must use shared tokens from `styles/tokens.css`.
- Tailwind is not used.

### Design tokens (Love 21 rebrand)

**Typography**

- `Nunito` (`--font-display` / `--font-body`) — normal headings, body, navigation, forms, and controls
- `Shantell Sans` (`--font-hand`) — handwritten English accents (e.g. donation eyebrows)
- `Caveat` (`--font-script`) — super-handwritten English annotations (e.g. donation footnote lines)
- Load font CSS variables on `<html>` via `next/font` (`variable`), and apply `nunito.className` on `<body>` so stacks resolve from `:root`
- Traditional Chinese: `PingFang HK`, `Noto Sans TC`, system sans — never apply Shantell Sans or Caveat to Chinese copy

**Palette**

- Pink `#f40770` — principal actions (`--color-pink`)
- Accents: coral `#ff4f45`, blue `#1878f2`, teal `#20b88f`, cyan `#25afe3`, yellow `#ffc62e`, purple `#7257f4`
- Surfaces: ink `#292320`, muted `#6f6a67`, canvas `#fffdfa`, blush `#fff0f3`, sky `#eaf7ff`, mint `#e7f7f1`, border `#eadfd6`, footer `#292320`

Also defined: container widths, spacing, radius, shadow, control heights, motion.

Legacy `--love-*` and `--header-height` aliases remain for compatibility.

### Shared UI (`components/ui`)

Presentational only (no API, persistence, or business rules):

- `BrandLockup` — pink “21” mark + Love 21 wordmark
- `SectionShell` — `tone`: canvas | white | blush | sky | blue | dark | mint; `width`: wide | standard | narrow
- `ButtonLink` — `variant`: pink | blue | teal | dark | outline | quiet
- `PageIntro` — eyebrow, title, description, actions
- `ContentCard` — media, meta, title, summary
- `StatusPill` — programme / story / preview tags
- `PreviewPanel` — visually complete, semantically disabled future UI with localized notice

### Chrome and templates

- `components/SiteChrome.tsx` + `SiteChrome.module.css` — header (~64px), accessibility menu, language, Donate, dark footer
- Accessibility menu replaces the old Calm-mode toggle. It offers High contrast (`html.high-contrast`), Text size (A−/A+, levels 0–2 as `html.text-large` / `html.text-largest`, stored in `"text-size"`), and Calm mode (Simple View). Storage keys: `"simple-view"` → class `html.simple-view`; `"high-contrast"` → `html.high-contrast`; `"text-size"` = 0|1|2. All applied via effects on `document.documentElement` in `SiteChrome`.
- Homepage: `components/HomeExperience.*` + `content/homepage.ts`
- Donation: `content/donation.ts` + interactive `DonateExperience` (`template: "donate"`). The three bilingual modes (`money`, `events`, `items`) retain client-side selections when switching. Money can be completed through the existing PayMe QR or hosted MoonClerk URL; a collapsed disclosure provides approved HSBC/FPS/cheque instructions, and receipt requests link to Maggie by email. Amount/frequency/programme selections are not transmitted by the site. Fundable-event metadata is optional repository content, and event-support/item-selection confirmations are local-only demos with no persistence or progress updates. The community-fundraiser CTA remains disabled.
- Contact: `content/contact.ts` + `ContactExperience` (`template: "contact"`); it reuses the locally validating `ContactForm` from `DemoForms`
- About: `content/about.ts` + `AboutExperience` (`template: "about"`)
- Finance / Trust & Transparency: `content/finance.ts` + `FinanceExperience` (`template: "reports"`); annual PDFs under `public/assets/reports/`
- Primary nav: About (dropdown), Events (`/events` — no dropdown), Member Stories (`/stories/`), Contact Us. Get Involved remains routable but is not linked in chrome.
- Events: `content/activities.ts` + `ActivitiesExperience` (`template: "calendar"`) for `/events` and volunteer-calendar routes. The August 2026 listings are explicitly presentational; calendar selection is client-side and booking previews remain disabled.
- News & Media: `content/media.ts` + `MediaExperience` (`template: "media-index"`) for bilingual media and member-story routes. The "From our feeds" grid mixes presentational feed cards with live Instagram posts served by `InstagramFeed` (data from `/api/instagram-webhook`, persisted to gitignored `data/instagram-posts.json`); external social links are the Love 21 Facebook and Instagram URLs.
- Get Involved: `content/get-involved.ts` + `GetInvolvedExperience` (`template: "get-involved"`) kept for `/get-involved/` (and locale variants) but omitted from primary nav/footer. Opportunity signup and corporate “Book a session” are disabled previews; live paths remain volunteer form (`/our-volunteer/`), events, donate, and contact.
- Programmes experience code remains (`ProgrammesExperience`, `content/programmes.ts`) but is not routed; Our Programmes and How Families Join pages were removed.
- Other templates: `PageRenderer.module.css`
- Forms: `DemoForms.module.css`, `AuthForm.module.css`
- Portal presentation: `app/portal/page.module.css`

### Authentication and persistence

- Supabase provides email/password authentication, Postgres persistence, and storage
- SQL files in `supabase/migrations/` are the schema source of truth; add a new migration instead of rewriting an applied one
- `lib/supabase/types.generated.ts` mirrors the linked schema and is regenerated atomically with `npm run db:types`; `lib/supabase/types.ts` provides stable application aliases
- Public account roles: `member`, `donor`, `volunteer`; `staff` is server-promoted only
- `public.users.role` is the staff source of truth; public signup metadata is allowlisted and authenticated users cannot update their own role
- `/admin` is staff-only; `/admin` manages people and `/admin/events` manages schedule records
- Do not link `/admin` from public navigation or redirect the general portal to it; staff enter the route directly
- Staff pages and every mutation verify the caller with the cookie-backed client before using the server-only service-role client
- The `events` table is currently managed only through the staff portal and is not connected to public schedules
- Event times are entered in `Asia/Hong_Kong`; persisted timestamps are instants

### Accessibility

- Minimum 44px touch targets, visible focus, meaningful alt text, keyboard nav
- Prefer CSS hover/focus; respect `prefers-reduced-motion`
- Do not convey information by color alone
- Disabled previews must use real `disabled` semantics and cannot submit

### Behavioral boundaries

- Authentication, schema, role, migration, and authorization changes require an explicit user request
- Keep public staff signup disabled and enforce staff authorization independently in every admin mutation
- Do not add payment processing, reservations, attendee registration, wishlist pledges, campaigns, or analytics
- Repository content and assets are authoritative; mockups are visual/composition authority only
- Do not invent unverified impact claims from design mockups

### Commands

- `npm run lint`
- `npm run build`
- `npm run dev`
- `npm run db:push`
- `npm run db:types`
- `npm run staff:promote -- person@example.com`
