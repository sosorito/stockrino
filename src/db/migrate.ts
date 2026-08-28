import type Database from "better-sqlite3";

/**
 * Idempotent schema setup. Runs automatically on server start so the app
 * works immediately after `npm install` with zero extra setup steps.
 * Safe to call multiple times.
 */
export function ensureSchema(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      url TEXT NOT NULL,
      title TEXT DEFAULT '',
      alt_text TEXT DEFAULT '',
      caption TEXT DEFAULT '',
      width INTEGER,
      height INTEGER,
      size INTEGER,
      mime_type TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      featured_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL,
      author_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      is_trending INTEGER NOT NULL DEFAULT 0,
      is_featured INTEGER NOT NULL DEFAULT 0,
      is_demo INTEGER NOT NULL DEFAULT 0,
      view_count INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      scheduled_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      seo_keywords TEXT DEFAULT '',
      canonical_url TEXT DEFAULT '',
      og_title TEXT DEFAULT '',
      og_description TEXT DEFAULT '',
      og_image_id INTEGER REFERENCES media(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS post_tags (
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (post_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      subscribed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_name TEXT NOT NULL DEFAULT 'Stockrino',
      tagline TEXT NOT NULL DEFAULT 'A modern platform for USA Stock Market news, updates, analysis, and financial insights.',
      description TEXT DEFAULT '',
      logo_url TEXT DEFAULT '',
      favicon_url TEXT DEFAULT '',
      social_twitter TEXT DEFAULT '',
      social_facebook TEXT DEFAULT '',
      social_linkedin TEXT DEFAULT '',
      social_youtube TEXT DEFAULT '',
      social_instagram TEXT DEFAULT '',
      contact_email TEXT DEFAULT '',
      contact_phone TEXT DEFAULT '',
      contact_address TEXT DEFAULT '',
      seo_default_title TEXT DEFAULT '',
      seo_default_description TEXT DEFAULT '',
      seo_default_keywords TEXT DEFAULT '',
      site_url TEXT DEFAULT 'http://localhost:3000'
    );

    CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category_id);
    CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
    CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
  `);

  const settingsCount = sqlite
    .prepare("SELECT COUNT(*) as c FROM settings")
    .get() as { c: number };
  if (settingsCount.c === 0) {
    sqlite.prepare("INSERT INTO settings (id) VALUES (1)").run();
  }
}
