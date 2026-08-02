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
  - `app/globals.css` — entrypoint (imports tokens/base)
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
- `HeartIcon` — soft outline heart SVG for CTA accents (Join menu, homepage hero Donate/Volunteer hover)
- `PageIntro` — eyebrow, title, description, actions
- `ContentCard` — media, meta, title, summary
- `StatusPill` — programme / story / preview tags
- `PreviewPanel` — visually complete, semantically disabled future UI with localized notice

### Chrome and templates

- `components/SiteChrome.tsx` + `SiteChrome.module.css` — header (~64px), outline “Make a difference” dropdown (Nunito body font + pink outline/`HeartIcon`; filled Donate / Volunteer options without per-option hearts or glow; quiet Login link at bottom; opens on hover or click; panel matches trigger width and is decorated with surrounding heart icons) or portal actions when signed in, dark footer. Volunteer opens `/signup?role=contributor` (locale variants) with the contributor role preselected. Homepage hero Donate (pink) and Volunteer (blue) show matching heart accents on hover; homepage `.page` keeps `overflow: visible` so those accents are not clipped.
- Accessibility and language controls live in a fixed bottom-right floating tools cluster (menus open upward). Accessibility offers High contrast (`html.high-contrast`), Text size (A−/A+, levels 0–2 as `html.text-large` / `html.text-largest`, stored in `"text-size"`), and Calm mode (Simple View). Storage keys: `"simple-view"` → class `html.simple-view`; `"high-contrast"` → `html.high-contrast`; `"text-size"` = 0|1|2. All applied via effects on `document.documentElement` in `SiteChrome`.
- Homepage: `components/HomeExperience.*` + `content/homepage.ts`. It follows the rebrand composition as a server-rendered sequence of hero polaroids, monthly impact showcase (hero center ≈1,000 classes/activities with title + supporting line; smaller side stats 600+ members/families and HK$0 to families; all numbers blue; no programme category pills), a minimal Crystal programme story (photo + short panel + mother quote; floating `HeartIcon` accents around the card, disabled in Calm mode / reduced motion), audited impact statistics (punchy oversized pink CountUp figures on a blush band), a tightened education / community section (opportunity framing with three equal oversized pink stats plus blue/teal audited fact panels), deterministic media cards, and a dark donate CTA band (Donate now + Volunteer + wish-list link; standalone sky volunteer band content remains in `homepage.ts` but is not rendered). Stat numbers in the impact showcase, impact band, and education section animate via the client `CountUp` helper (`components/CountUp.tsx`) when they enter the viewport; Calm mode (`html.simple-view`) and `prefers-reduced-motion` show final values immediately. Featured Stories and Stories of Ability (ability conversation) content remains in `homepage.ts` but is not currently rendered. Homepage content is fully localized for `en`, `zh`, and `cn`; repository facts and assets replace mockup placeholders, and the homepage has no donation configurator or live-feed dependency. The wishlist CTA deep-links to the Donate Items tab with validated `?mode=items` state.
- Donation: `content/donation.ts` + interactive `DonateExperience` (`template: "donate"`). The three bilingual modes (`money`, `events`, `items`) retain client-side selections when switching. Money can be completed through the existing PayMe QR or hosted MoonClerk URL; a collapsed disclosure provides approved HSBC/FPS/cheque instructions, and receipt requests link to Maggie by email. Amount/frequency/programme selections are not transmitted by the site. Fundable-event metadata is optional repository content, and event-support/item-selection confirmations are local-only demos with no persistence or progress updates. The community-fundraiser CTA remains disabled.
- Contact: `content/contact.ts` + `ContactExperience` (`template: "contact"`); it reuses the locally validating `ContactForm` from `DemoForms`
- About: `content/about.ts` + `AboutExperience` (`template: "about"`)
- Finance / Trust & Transparency: `content/finance.ts` + `FinanceExperience` (`template: "reports"`); annual PDFs under `public/assets/reports/`
- Primary nav: About (dropdown), Events (`/events` — no dropdown), Member Stories (`/stories/`), Contact Us.
- Events: `content/activities.ts` + `ActivitiesExperience` (`template: "calendar"`) for `/events`. Includes a compact Sports / Nutrition / Family Care programmes band (banner images from repository programme assets; copy aligned with approved programmes content). The August 2026 listings are explicitly presentational; calendar selection is client-side. Event sign-ups (`EventSignupButton` + `registerForEvent` in `app/actions/registrations.ts`) write real rows to `event_participations` (registered users) or `event_guest_signups` (logged-out guests): authenticated members store `interest = "member"`; approved contributors pick an interest (Coach / Class Assistant / Event Helper — options in `lib/volunteer-interests.ts`); other authenticated contributors have no interest; logged-out guests store `guest_name` + `guest_email` (no account is created). Registered events appear at `/portal/events` (portal sidebar "Events").
- Member Stories: `content/media.ts` + `MediaExperience` (`template: "media-index"`) for bilingual media and member-story routes. The hero reuses the homepage Crystal testimonial section (`homepageContent.featuredStory`); the "From our feeds" grid mixes presentational feed cards with live Instagram posts served by `InstagramFeed` (data from `/api/instagram-webhook`, persisted to the `instagram_posts` Supabase table; the legacy gitignored `data/instagram-posts.json` is read once as a seed when the table is empty); external social links are the Love 21 Facebook and Instagram URLs.
- Programmes experience code remains (`ProgrammesExperience`, `content/programmes.ts`) but is not routed; Our Programmes and How Families Join pages were removed.
- Other templates: `PageRenderer.module.css`
- Forms: `DemoForms.module.css`, `AuthForm.module.css`
- Portal presentation: members use the top-nav `PortalShell` plus `MemberPortalExperience` for `/portal`, `/portal/my-events`, `/portal/events`, and `/portal/milestones`. Member dashboard counts, signed-up calendar, published event directory, and participation infographics are loaded from `events` and the signed-in user's `event_participations` rows through `lib/server/member-portal.ts`; the calendar groups dates in `Asia/Hong_Kong`. Contributors use the separate `ContributorPortalExperience` with its local My Portal / My Donations / My Volunteer / Events / Donate views plus profile overlay; its top navigation, canvas, Nunito typography, card surfaces, spacing, and responsive grids intentionally mirror the member portal while retaining contributor-specific behavior. It is fed by `getContributorPortalData` (`lib/portal/contributor-data.ts`) and passed `data` from each `/portal/*` page. The contributor UI is fully localized in place (en/zh/cn via a `portal-locale` localStorage key and `LocaleContext` — no route redirect), and the floating accessibility cluster (high contrast, text size, Calm/simple view) visibly restyles it through the `--portal-*` token palette in `ContributorPortalExperience.module.css` (black-on-white under `html.high-contrast`, decorative bubbles hidden under `html.simple-view`).

### Authentication and persistence

- Supabase provides email/password authentication, Postgres persistence, and storage
- SQL files in `supabase/migrations/` are the schema source of truth; add a new migration instead of rewriting an applied one
- API-facing tables must pair owner-scoped RLS policies with explicit least-privilege table/sequence grants for the required Supabase roles; do not rely on project-level default privileges
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
- Event volunteer/guest sign-ups are supported (see Events above); do not add other attendee registration, payment processing, reservations, wishlist pledges, campaigns, or analytics
- Repository content and assets are authoritative; mockups are visual/composition authority only
- Do not invent unverified impact claims from design mockups

### Commands

- `npm run lint`
- `npm run build`
- `npm run dev`
- `npm run db:push`
- `npm run db:types`
- `npm run staff:promote -- person@example.com`
