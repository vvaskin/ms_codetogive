# Agent guidance

Keep this file updated whenever project architecture, conventions, commands, or
workflows change.

## Architecture

### Styling

CSS Modules are the official component-styling approach.

- Colocate `ComponentName.module.css` with camel-cased selectors.
- Global CSS is limited to:
  - `styles/tokens.css` — design tokens
  - `styles/base.css` — reset, element defaults, Calm mode (`html.simple-view`), reduced motion
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

- `components/SiteChrome.tsx` + `SiteChrome.module.css` — header (~64px), Calm mode, language, Donate, dark footer
- Calm mode is the Simple View feature: storage key remains `"simple-view"`; class `html.simple-view`
- Homepage: `components/HomeExperience.*` + `content/homepage.ts`
- Donation: `content/donation.ts` + donate template in `PageRenderer`
- Other templates: `PageRenderer.module.css`
- Forms: `DemoForms.module.css`, `AuthForm.module.css`
- Portal presentation: `app/portal/page.module.css`

### Accessibility

- Minimum 44px touch targets, visible focus, meaningful alt text, keyboard nav
- Prefer CSS hover/focus; respect `prefers-reduced-motion`
- Do not convey information by color alone
- Disabled previews must use real `disabled` semantics and cannot submit

### Behavioral boundaries

- Do not modify Better Auth, Drizzle, SQLite, roles, API routes, or portal authorization
- Do not add payment processing, reservations, wishlist pledges, campaigns, analytics, or admin controls
- Repository content and assets are authoritative; mockups are visual/composition authority only
- Do not invent unverified impact claims from design mockups

### Commands

- `npm run lint`
- `npm run build`
- `npm run dev`
