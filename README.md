# Stockrino

**A modern platform for USA Stock Market news, updates, analysis, and financial insights.**

Stockrino is a complete, production-ready stock market news & blogging website built with
Next.js 14, TypeScript, Tailwind CSS, PostgreSQL (via Drizzle ORM), and Vercel Blob for
image storage. It includes a full public website (homepage, blog, categories, search) and a
secure admin panel for creating, editing, scheduling, and publishing content — with image
uploads, a media library, SEO tools, and more.

It is built to deploy to **Vercel's free tier** with a free serverless Postgres database
(Neon) and a free Blob store — no server to manage. See §6.

---

## 1. Quick Start (local development)

Requirements: Node.js 18.18+ (Node 20 LTS recommended), npm, and a PostgreSQL database
(a free [Neon](https://neon.tech) project works perfectly).

```bash
npm install
cp .env.example .env    # then fill in DATABASE_URL (and BLOB_READ_WRITE_TOKEN for uploads)
npm run db:seed         # creates the schema, default categories, admin user, and demo articles
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

`npm run db:seed` creates all tables (idempotent) and seeds demo content. To only create the
tables without seeding, run `npm run db:migrate`.

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
    schema.ts           Drizzle ORM schema (PostgreSQL / pg-core)
    migrate.ts           Idempotent CREATE TABLE statements (run via db:migrate / db:seed)
    index.ts             Drizzle + postgres-js connection singleton
  lib/
    data/                Data-access layer (posts, categories, media, settings, newsletter, users)
    auth.ts / session.ts  JWT session signing/verification, cookie session reader
scripts/
  migrate.ts             Creates the schema in your Postgres database
  seed.ts                Runs migrate, then seeds admin user + default categories + demo posts
```

Uploaded images are stored in **Vercel Blob** (public store); each `media.url` is the full
blob URL. No local `uploads/` or `data/` directory is used any more.

---

## 4. Environment Variables

Copy `.env.example` to `.env` (already done for local development) and set:

| Variable | Description |
|---|---|
| `DATABASE_URL` | **Required.** PostgreSQL connection string. On Vercel, adding a Postgres store (Neon) injects this automatically (also as `POSTGRES_URL`, which the app falls back to). |
| `BLOB_READ_WRITE_TOKEN` | **Required for image uploads.** On Vercel, adding a Blob store injects this automatically. Without it the admin media upload returns an error; the rest of the site still works. |
| `AUTH_SECRET` | Long random string used to sign admin session tokens. **Must** be changed for production. Generate one with `openssl rand -base64 32`. |
| `SITE_URL` | The public URL of your deployed site, e.g. `https://stockrino.com`. Used for canonical URLs, sitemap, and Open Graph tags. You can also set this later from Admin → Settings. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD` | Only used the *first* time `npm run db:seed` runs, to create your initial admin account. |

---

## 5. Changing the Admin Password

There is currently no in-app "change password" screen (by design, to keep the admin surface
small and secure). To change the password:

1. Set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in `.env` to your desired new values.
2. Delete the existing `admin_users` row from the database, then re-run `npm run db:seed`
   (it recreates only the admin user if the demo content is already present).

For a production deployment, the cleanest approach is to run `npm run db:seed` once against a
**fresh** database with your real admin credentials in `.env`, before you start publishing.

---

## 6. Deploying to Vercel (free tier)

1. **Push this repo to GitHub** (already done).
2. On [vercel.com](https://vercel.com), **New Project → Import** this GitHub repo. Framework
   is auto-detected as Next.js. Don't deploy yet — add storage first (next step), or let the
   first build fail and redeploy after.
3. In the project, open the **Storage** tab:
   - **Create Database → Postgres** (Neon). Vercel links it and sets `DATABASE_URL` /
     `POSTGRES_URL` automatically.
   - **Create → Blob**. Vercel sets `BLOB_READ_WRITE_TOKEN` automatically.
4. In **Settings → Environment Variables**, add:
   - `AUTH_SECRET` — a long random string (`openssl rand -base64 32`).
   - `SITE_URL` — your deployment URL, e.g. `https://your-project.vercel.app` (update later
     if you add a custom domain).
5. **Seed the database once.** Locally, put the Neon connection string in `.env` as
   `DATABASE_URL` (copy it from the Vercel Postgres store's `.env.local` tab), then run:
   ```bash
   npm install
   npm run db:seed
   ```
   This creates the tables and the admin user. (Alternatively run `npm run db:migrate` for
   an empty schema and create content from scratch.)
6. **Deploy** (Vercel → Deployments → Redeploy, or push a commit).
7. Visit `/admin/login`, sign in with the demo credentials, and change the admin password
   (see §5). Delete the demo posts from Admin → Blog Posts when ready.

**Rendering:** public pages use `export const dynamic = "force-dynamic"` so they always show
the latest content and the build never needs a live database. For a higher-traffic site you
can switch selected pages to ISR (`export const revalidate = 60`) to cut function
invocations.

### Alternative — any Node server / VPS

`npm install && npm run build && npm start` behind nginx/Caddy for TLS. You still need a
reachable `DATABASE_URL` (Postgres) and `BLOB_READ_WRITE_TOKEN`. The `sqlite-vps-version`
git tag holds the older self-contained SQLite build if you'd rather run everything on one box.

---

## 7. Notes on Design Choices

- **Database**: PostgreSQL via Drizzle ORM + `postgres-js` (not Prisma). The data-access
  layer is fully abstracted in `src/lib/data/*`, so pages and API routes never touch the
  driver directly. Timestamps are stored as ISO-8601 UTC strings so the lazy scheduler can
  compare them without date parsing.
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
