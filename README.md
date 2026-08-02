# LOVE 21 Foundation site clone

A Next.js App Router clone of the LOVE 21 Foundation website (English + zh-HK)
with Supabase for authentication, database, and file storage.

## Prerequisites

- Node.js `>=20`
- npm
- Access to the project's Supabase project (ask a teammate for an invite, or
  for the project ref if you're linking your own local CLI)

## Quick Start

1. Install the project dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the three Supabase values from the dashboard at
**Project Settings → API Keys**:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable key, starts with sb_publishable_>
SUPABASE_SERVICE_ROLE_KEY=<secret key, starts with sb_secret_>
```

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe to
  ship to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security. Keep it
  server-only — never prefix it with `NEXT_PUBLIC_`, never commit it, never
  log it.

3. Link the Supabase CLI to the project and apply the schema:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npm run db:push
```

`<project-ref>` is the subdomain in your project URL — e.g. for
`https://afssbvjqpqlveqwyzvvs.supabase.co` it's `afssbvjqpqlveqwyzvvs`. You
can also find it at **Project Settings → General → Reference ID**.

`npx supabase login` opens a browser to authenticate the CLI; `link` will
prompt for the project's database password. `db:push` applies every SQL file
under `supabase/migrations/` (tables, enums, triggers, Row Level Security,
storage buckets).

4. In the dashboard, confirm **Authentication → URL Configuration** has:
   - Site URL: `http://localhost:3000`
   - Redirect URLs includes: `http://localhost:3000/auth/callback`

   Email confirmation is required by default — new accounts must click the
   link emailed to them before they can log in.

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To check a production build:

```bash
npm run build
npm start
```

## Database setup

If you're setting up your own Supabase project from scratch instead of
linking to the shared one:

```bash
npm install
npx supabase login
npx supabase link --project-ref afssbvjqpqlveqwyzvvs
npm run db:push
```

### After pulling schema changes

If another teammate added a file under `supabase/migrations/`, apply it:

```bash
npm run db:push
```

This only applies migrations that haven't already been run against the
linked project.

### Changing the schema

Use this workflow when adding or changing a table, enum, policy, or storage
bucket:

1. Add a new, chronologically-named SQL file under `supabase/migrations/`
   (e.g. `20260815000000_add_something.sql`). Don't edit already-applied
   migration files — write a new one, the same way Drizzle/Rails-style
   migration tools work.
2. Apply it:

   ```bash
   npm run db:push
   ```

3. If the change affects table shapes, regenerate the TypeScript types:

   ```bash
   npm run db:types
   ```

   This atomically replaces `lib/supabase/types.generated.ts` from the live
   linked schema. Stable application aliases remain in
   `lib/supabase/types.ts`.

4. Run the checks:

   ```bash
   npm run lint
   npm run build
   ```

Commit the new migration file and any regenerated types. Do not commit
`.env.local` or any Supabase secret key.

Do not add a migration for normal UI or application-logic changes. A
migration is needed only when the database schema, policies, or storage
configuration change.

### Viewing the database

Use the Supabase dashboard's **Table Editor** and **SQL Editor** to inspect
tables and rows for the linked project, or run the CLI's local Studio against
a local stack:

```bash
npx supabase start
```

This spins up a local Postgres + Studio + Auth + Storage stack (see
`supabase/config.toml`) so you can develop against a throwaway database
instead of the shared one. Stop it with:

```bash
npx supabase stop
```

Avoid editing rows in `auth.*` tables manually — let Supabase Auth manage
them.

## Database troubleshooting

### `supabase: command not found`

The Supabase CLI isn't installed globally, and npm intentionally does not
support installing it as a global package. Either keep using `npx` (already
wired into `npm run db:push` / `npm run db:types`, downloads on first use), or
install a persistent binary via Homebrew:

```bash
brew install supabase/tap/supabase
```

### `Supabase is not configured` error on every page

`NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing from
`.env.local`. Copy them from **Project Settings → API Keys** and restart
`npm run dev`.

### Signup succeeds but login says the email isn't confirmed

Email confirmation is required. Check the inbox for the address you signed up
with (including spam) and click the confirmation link, which lands on
`/auth/callback` and logs you in automatically.

### The confirmation link doesn't work / redirects to the wrong place

Check **Authentication → URL Configuration** in the dashboard: Site URL must
be `http://localhost:3000` (or your deployed URL), and Redirect URLs must
include `<site-url>/auth/callback`.

### `relation "public.users" does not exist` or similar

The schema hasn't been pushed to this project yet:

```bash
npx supabase link --project-ref <project-ref>
npm run db:push
```

### Row Level Security errors (`new row violates row-level security policy`)

This is usually correct behavior — a user tried to read or write a row they
don't own. `public.users`, `event_participations`, and `event_sponsorships`
are all scoped to `auth.uid()`. If you need to bypass RLS for a one-off
admin/staff script, use the `service_role` key server-side — never in
client-side code.

## Authentication

- Email and password signup/login is handled by **Supabase Auth**. Session
  cookies are managed by `@supabase/ssr` and refreshed on every request by
  `middleware.ts`.
- `app/auth/callback/route.ts` exchanges the emailed confirmation link for a
  session.
- Supabase Auth owns credentials in its own `auth.users` table — the app
  never stores or reads a password. `public.users` (see
  `supabase/migrations/20260801000001_init.sql`) is a *profile* row keyed by
  the same `id`, auto-created by a database trigger on signup.
- Each public user has one `role`: `member`, `donor`, or `volunteer`, chosen at
  signup and stored on `public.users`. `staff` is never offered at signup and
  can only be assigned with trusted server credentials.
- Unauthenticated visits to `/portal/*` redirect to `/login`.
- `lib/supabase/client.ts` is for client components, `lib/supabase/server.ts`
  for server components/route handlers, and `lib/supabase/profile.ts` exposes
  `getSessionProfile()` — the combined auth + profile lookup used by the
  portal pages.

### Staff access

The Staff Portal is intentionally absent from public navigation. Staff open
`/admin` directly and sign in with an approved account.

Create the account through the normal signup flow, apply all migrations, then
promote it from a trusted local terminal:

```bash
npm run staff:promote -- person@example.com
```

This command requires `NEXT_PUBLIC_SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Staff authorization uses the
profile role in `public.users`; the service-role key remains server-only.

## Database design

Defined in `supabase/migrations/`:

- **`users`** — profile for a Supabase Auth user (name, phone, address,
  role, avatar path). No password column.
- **`events`** — event records including bilingual copy, Hong Kong start/end
  times, audience, and published/cancelled status. Staff CRUD currently
  lives under `/admin/events`; the public Activity Schedule remains a separate
  presentational prototype.
- **`event_participations`** — one row per (user, event) for members and
  volunteers. `status` is `registered` (upcoming/"attending"), `attended`,
  `no_show`, or `cancelled`. A volunteer's attendance certificate path is
  only ever set once `status = 'attended'`.
- **`event_sponsorships`** — one row per (donor, event), with the amount
  donated to that specific event (`amount_cents`, integer minor units) and a
  path to that event's sponsorship certificate PDF.

Storage buckets (see `20260801000002_storage.sql`):

- `avatars` — public read, write restricted to the owning user's folder.
- `event-images` — public read, staff-managed writes.
- `certificates` — private; a user may only read files inside their own
  folder, served via signed URLs.

## Project shape

- `app/` — App Router pages and layout
- `app/auth/callback/` — Supabase email-confirmation landing route
- `middleware.ts` — refreshes the Supabase session on every request and
  guards `/portal/*`
- `components/` — UI (chrome, home experience, page renderer, demo forms,
  portal)
- `content/site-data.ts` — bilingual page content
- `styles/` — design tokens and foundational global CSS
- `lib/supabase/` — Supabase client/server helpers, session + profile
  lookup, staff-only administrative client, and generated database types
- `lib/roles.ts` — the `member` / `donor` / `volunteer` role union
- `supabase/migrations/` — versioned SQL migrations (schema, RLS, storage)
- `supabase/config.toml` — local Supabase CLI stack configuration
- `public/assets/` — images and reports
- `AGENTS.md` — permanent guidance for agents and contributors; update it
  when architecture, conventions, commands, or workflows change

## Styling

CSS Modules are the official component-styling approach. See `AGENTS.md` for the
full Love 21 visual system (palette, typography, shared UI, Calm mode).

| Location | Role |
| --- | --- |
| `styles/tokens.css` | Design tokens and `--love-*` compatibility aliases |
| `styles/base.css` | Document resets, body defaults, focus, Calm mode, reduced motion |
| `app/globals.css` | Global entrypoint (tokens → base) |
| `components/ui/*` | Shared presentational primitives |
| `*.module.css` | Colocated component styles (camelCase selectors) |

- Prefer semantic tokens such as `--color-pink`, `--color-brand-primary`, and `--color-focus`.
- Do not add new globally named component classes; put new styles in a CSS
  Module next to the component.
- Tailwind is not used.
