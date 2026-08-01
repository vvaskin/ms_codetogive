# LOVE 21 Foundation site clone

A Next.js App Router clone of the LOVE 21 Foundation website (English + zh-HK)
with Better Auth, Drizzle ORM, and a local SQLite database.

## Prerequisites

- Node.js `>=20`
- npm

## Quick Start

1. Install the project dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and replace `BETTER_AUTH_SECRET` with a random value of at
least 32 characters. You can generate one with:

```bash
openssl rand -base64 32
```

Keep `BETTER_AUTH_URL=http://localhost:3000` unless the app runs on a different
URL. `DB_FILE_NAME` must be a filename, not a path.

3. Create or update your local database:

```bash
npm run db:migrate
```

4. Start the app:

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

The app uses a local SQLite database through Drizzle ORM. There is no separate
database server to install or start.

The important files are:

- `lib/db/schema.ts` — the TypeScript source of truth for database tables.
- `drizzle/` — generated SQL migrations. These files should be committed.
- `drizzle.config.ts` — tells Drizzle where the schema, migrations, and database
  are located.
- `data/love21.sqlite` — your local database file. It is created by
  `npm run db:migrate` and is ignored by Git.
- `.env.local` — local secrets and the SQLite filename. It is also ignored by
  Git.

The database contains Better Auth's required tables:

- `user`
- `session`
- `account`
- `verification`

It also contains:

- `event` — bilingual activity-schedule records managed by staff

The `user` table also contains the Love 21 `role` field. Its allowed values are
`member`, `donor`, `volunteer`, and `staff`. Public signup offers only the first
three roles. Staff access must be granted locally after the account exists:

```bash
npm run staff:promote -- person@example.com
```

After promotion, sign out and back in through `/admin/login`. Staff accounts are
routed to `/admin`; other accounts continue to use `/portal`. The staff portal
contains the People database at `/admin` and Events database at `/admin/events`.

### After pulling database changes

If another teammate changed `lib/db/schema.ts` or added files under `drizzle/`,
run:

```bash
npm install
npm run db:migrate
```

`db:migrate` applies only migrations that have not already been applied. It is
safe to run it again when your database is already up to date.

### Changing the schema

Use this workflow when adding or changing a table or column:

1. Edit `lib/db/schema.ts`.
2. Generate a migration:

   ```bash
   npm run db:generate -- --name describe_your_change
   ```

   For example:

   ```bash
   npm run db:generate -- --name add_member_profile
   ```

3. Read the new SQL file under `drizzle/` and make sure it matches the intended
   change.
4. Apply it to your local database:

   ```bash
   npm run db:migrate
   ```

5. Run the checks:

   ```bash
   npm run lint
   npm run build
   ```

Commit both the schema change and its generated migration. Do not commit the
SQLite database file, `.env.local`, or authentication secrets.

Do not generate a migration for normal UI or application-logic changes. A
migration is needed only when the database schema changes.

### Viewing the database

Drizzle Studio provides a local browser interface for inspecting tables and
rows:

```bash
npm run db:studio
```

Stop it with `Ctrl+C` when finished. Avoid editing authentication rows manually
unless you understand the effect on Better Auth.

## Database troubleshooting

Try the relevant fix below before resetting anything.

### `no such table` or login returns a database error

Your local database is probably missing a migration:

```bash
npm run db:migrate
```

Restart `npm run dev` after the migration finishes.

### `BETTER_AUTH_SECRET is required`

Create `.env.local` from the template and add a secret:

```bash
cp .env.example .env.local
openssl rand -base64 32
```

Paste the generated value after `BETTER_AUTH_SECRET=` in `.env.local`, then
restart the app.

### `DB_FILE_NAME must be a filename`

Use only a filename in `.env.local`:

```dotenv
DB_FILE_NAME=love21.sqlite
```

Do not use `./data/love21.sqlite` or another path. The app always stores the
file inside `data/`.

### `database is locked`

SQLite allows only limited concurrent writes. Stop duplicate `npm run dev`
processes and close Drizzle Studio, then try again. The
`love21.sqlite-shm` and `love21.sqlite-wal` files are normal SQLite working
files and are ignored by Git.

### `better-sqlite3` or native module error

First confirm that Node.js 20 or newer is active:

```bash
node --version
```

Then rebuild the SQLite package:

```bash
npm rebuild better-sqlite3
```

If it still fails, reinstall the dependencies with the same supported Node.js
version.

### Last resort: reset a disposable local database

Only do this for a local development database whose data can be lost. Never use
these steps on a shared or production database.

Stop the app first, back up the database, remove the local SQLite files, and
reapply the migrations:

```bash
cp data/love21.sqlite /tmp/love21.sqlite.backup
rm -f data/love21.sqlite
rm -f data/love21.sqlite-shm
rm -f data/love21.sqlite-wal
npm run db:migrate
```

If the database contains important data, do not reset it. Keep the files and
ask the team to review the migration history together.

## Authentication

- Email and password signup/login is handled by Better Auth at `/api/auth/*`.
- Drizzle schema and relations live in `lib/db/schema.ts`.
- SQLite defaults to `data/love21.sqlite`; its filename inside `data/` can be
  changed with `DB_FILE_NAME`.
- Each user has one checked `role`: `member`, `donor`, `volunteer`, or `staff`.
- Public signup exposes only member, donor, and volunteer roles.
- Regular authenticated users use `/portal`; staff use `/admin`.

## Events

- Staff create and manage events at `/admin/events`.
- New records default to draft unless staff selects another status.
- The events database is an admin-only prototype and is not connected to the
  public Activity Schedule yet.
- Date and time input uses Hong Kong time.

## Project shape

- `app/` — App Router pages and layout
- `components/` — UI (chrome, home experience, page renderer, demo forms)
- `content/site-data.ts` — bilingual page content
- `styles/` — design tokens and foundational global CSS
- `lib/` — Better Auth and Drizzle database configuration
- `drizzle/` — generated, versioned SQL migrations
- `public/assets/` — images and reports
- `AGENTS.md` — permanent guidance for agents and contributors; update it when
  architecture, conventions, commands, or workflows change

## Styling

CSS Modules are the official component-styling approach. See `AGENTS.md` for the
full Love 21 visual system (palette, typography, shared UI, Calm mode).

| Location | Role |
| --- | --- |
| `styles/tokens.css` | Design tokens and `--love-*` compatibility aliases |
| `styles/base.css` | Document resets, body defaults, focus, Calm mode, reduced motion |
| `app/globals.css` | Global entrypoint (tokens → base) plus quiet development ribbon |
| `components/ui/*` | Shared presentational primitives |
| `*.module.css` | Colocated component styles (camelCase selectors) |

- Prefer semantic tokens such as `--color-pink`, `--color-brand-primary`, and `--color-focus`.
- Do not add new globally named component classes; put new styles in a CSS
  Module next to the component.
- Tailwind is not used.
