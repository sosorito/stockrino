# Stockrino

**A modern platform for USA Stock Market news, updates, analysis, and financial insights.**

Stockrino is a complete, production-ready stock market news & blogging website built with
Next.js 14, TypeScript, Tailwind CSS, and SQLite (via Drizzle ORM). It includes a full public
website (homepage, blog, categories, search) and a secure admin panel for creating, editing,
scheduling, and publishing content — with image uploads, a media library, SEO tools, and more.

---

> **Note on `npm install`:** this project ships a `.npmrc` with `ignore-scripts=true`.
> Both native dependencies (`better-sqlite3` for the database, `sharp` for image
> processing) bundle prebuilt binaries for all major platforms directly in their
> published npm packages, so no compiler toolchain or extra network access is
> needed. This also avoids a known npm bug where a lockfile-driven `npm install`
> can try to needlessly rebuild `better-sqlite3` from source. You do not need to
> do anything differently — just run `npm install` as normal.

## 1. Quick Start (local development)

Requirements: Node.js 18.18+ (Node 20 LTS recommended) and npm.

```bash
npm install
npm run db:seed     # creates the database, default categories, admin user, and demo articles
npm run dev
```

Visit:
- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login

**Demo admin login:**
- Email: `admin@stockrino.com`
- Password: `Stockrino@123`

> Change these credentials immediately after your first login in a real deployment — see
> "Changing the admin password" below.

The database is a single SQLite file created automatically at `data/stockrino.db` the first
time the app runs. No external database server is required to get started.

---

## 2. What's Included

- **Public website**: homepage (hero, latest news, trending, featured, categories, newsletter),
  blog listing with search/filter/sort/pagination, single article pages, category pages,
  site-wide search, contact/privacy/terms pages, light & dark mode.
- **Admin panel**: dashboard with stats, full blog CRUD (create/edit/duplicate/delete),
  a rich text editor (headings, bold/italic/underline, lists, links, quotes, tables, images
  with captions), featured + inline image uploads, category management, a media library,
  newsletter subscriber list + CSV export, and a settings page (branding, social links,
  contact info, default SEO).
- **Publishing workflow**: Save as Draft, Publish Now, or Schedule for a future date/time.
  Scheduled posts automatically flip to "published" the moment their time arrives — no cron
  job required (checked lazily on every public page load).
- **SEO**: per-post meta title/description/keywords, canonical URLs, Open Graph + Twitter
  card tags, a live Google-style search preview in the editor, `sitemap.xml`, `robots.txt`,
  and JSON-LD structured data (Organization, WebSite, NewsArticle, BreadcrumbList).
- **Sample content**: 12 realistic demo articles covering S&P 500, Nasdaq, Dow Jones,
  earnings, the Federal Reserve, Wall Street, crypto, and more, plus one draft example and
  one scheduled example. Every demo post is tagged `isDemo` in the database and shows a
  "Demo" badge in the admin posts table — delete them whenever you're ready to publish your
  own content (Admin → Blog Posts → select → Delete).

---

## 3. Project Structure

```
src/
  app/
    (site)/            Public-facing pages (home, blog, category, search, contact, ...)
    admin/              Admin login + dashboard (route group "(dashboard)" adds the sidebar)
    api/                REST API routes (public: newsletter; admin: posts, categories, media, ...)
    sitemap.ts          Dynamic XML sitemap
    robots.ts           robots.txt
    icon.tsx / apple-icon.tsx / opengraph-image.tsx   Generated brand imagery
  components/
    site/               Public site UI (header, footer, article cards, ...)
    admin/               Admin UI (sidebar, post form, media library, tables, ...)
    editor/               Rich text editor (Tiptap) + custom image-with-caption node
  db/
    schema.ts           Drizzle ORM schema (SQLite)
    migrate.ts           Idempotent table creation, runs automatically on startup
    index.ts             Database connection singleton
  lib/
    data/                Data-access layer (posts, categories, media, settings, newsletter, users)
    auth.ts / session.ts  JWT session signing/verification, cookie session reader
scripts/
  seed.ts                Demo data seeder (also creates the admin user + default categories)
public/uploads/           Uploaded images are stored here (gitignored)
data/                     SQLite database file lives here (gitignored)
```

---

## 4. Environment Variables

Copy `.env.example` to `.env` (already done for local development) and set:

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Long random string used to sign admin session tokens. **Must** be changed for production. Generate one with `openssl rand -base64 32`. |
| `SITE_URL` | The public URL of your deployed site, e.g. `https://stockrino.com`. Used for canonical URLs, sitemap, and Open Graph tags. You can also set this later from Admin → Settings. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` | Only used the *first* time `npm run db:seed` runs, to create your initial admin account. |
| `DATABASE_PATH` | Optional. Overrides where the SQLite file is stored (defaults to `data/stockrino.db`). |

---

## 5. Changing the Admin Password

There is currently no in-app "change password" screen (by design, to keep the admin surface
small and secure). To change the password:

1. Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` to your desired new values.
2. Delete the existing admin row from the database, or simplest: delete `data/stockrino.db`
   and re-run `npm run db:seed` (⚠️ this also re-seeds demo content if you haven't removed it
   — export/back up any real content first).

For a production deployment, the cleanest approach is to run `npm run db:seed` once against a
**fresh** database with your real admin credentials in `.env`, before you start publishing.

---

## 6. Deploying

Stockrino runs anywhere Node.js runs. Two common paths:

### Option A — Any Node server / VPS (simplest, matches the SQLite setup as-is)

```bash
npm install
npm run build
npm run db:seed   # first time only
npm start         # runs on port 3000 by default; use a process manager like pm2
```

Put this behind a reverse proxy (nginx/Caddy) for TLS. Make sure the `data/` and
`public/uploads/` directories are on **persistent** disk and are writable by the Node process.

### Option B — Vercel / other serverless platforms

Serverless platforms don't provide persistent local disk, which affects two things this app
does by default:

1. **SQLite file storage** — works fine on a traditional server, but on serverless the
   filesystem is ephemeral/read-only in production. Swap `DATABASE_PATH` for a hosted
   database instead. Because the data-access layer in `src/lib/data/*` is the only place
   that talks to Drizzle, migrating to hosted Postgres means: (a) `npm install drizzle-orm pg`,
   (b) change `src/db/index.ts` to use `drizzle-orm/node-postgres` with a `DATABASE_URL`
   connection string, and (c) convert `src/db/schema.ts` from `sqlite-core` to `pg-core`
   (column types map almost 1:1). `src/db/migrate.ts`'s raw `CREATE TABLE IF NOT EXISTS`
   statements will need the equivalent Postgres syntax, or you can switch to
   `drizzle-kit generate` + `drizzle-kit migrate` for proper migrations at that point.
2. **Local image uploads** (`public/uploads/`, written by `src/app/api/admin/upload/route.ts`)
   — won't persist on serverless. Point the upload route at an S3-compatible bucket (AWS S3,
   Cloudflare R2, Supabase Storage) instead: replace the `fs.writeFile` call with an upload to
   your bucket's SDK, and store the returned public URL in the `media` table exactly as the
   code already does with local `/uploads/...` URLs — no other code needs to change, since
   every consumer just renders `media.url`.

If you don't want to make these changes, choose Option A — a small VPS (e.g. a $5–6/mo
droplet/Lightsail instance) with persistent disk works great for a single-editor blog like
this and requires zero code changes.

---

## 7. Notes on Design Choices

- **Database**: SQLite via Drizzle ORM (not Prisma) — chosen specifically so the app runs
  immediately with zero external services or accounts. The data-access layer is fully
  abstracted in `src/lib/data/*`, so swapping the underlying database later (see §6) doesn't
  require touching any page or API route.
- **Auth**: a minimal custom JWT-in-httpOnly-cookie system (via `jose` + `bcryptjs`), not a
  third-party auth provider — there's exactly one admin role, so a full auth framework would
  be overkill. Sessions last 7 days and are verified in `src/middleware.ts` on every
  `/admin/*` and `/api/admin/*` request.
- **Scheduling**: rather than requiring a cron job or serverless function trigger, scheduled
  posts are "lazily" promoted to published the moment anyone loads a public page after the
  scheduled time (`src/lib/scheduler.ts`). This is simple, reliable, and needs no
  infrastructure — the only trade-off is a post won't flip to published in the *admin* posts
  table until the next admin page load either, which is cosmetic only.
- **Rich text editor**: Tiptap, with a custom `figureImage` node so inline images can carry an
  editable caption (`src/components/editor/extensions/figure-image.tsx`).

---

## 8. Replacing the Demo Content

All 14 demo/example posts are flagged `isDemo: true` in the database and labeled with a
"Demo" badge in Admin → Blog Posts. To start fresh:

1. Go to Admin → Blog Posts.
2. Select each demo post and click Delete (or keep the ones you like as templates).
3. Click **Create Blog** to publish your first real article.

The 11 default categories (Stock Market News, Wall Street, S&P 500, Nasdaq, Dow Jones,
Company News, Earnings, Federal Reserve, Market Analysis, Technology Stocks, Cryptocurrency)
are meant to stay — edit or delete them from Admin → Categories if your needs differ.
