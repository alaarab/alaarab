import { Database } from "bun:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { PostInput, PostRecord } from "../src/types";

/**
 * The blog's store: one SQLite file with posts and author sessions. It lives
 * outside git (data/ is ignored), so deploys by `git pull` leave it alone.
 * Back it up with the rest of the server.
 */

interface PostRow {
  slug: string;
  title: string;
  summary: string;
  date: string;
  updated: string | null;
  tags: string;
  projects: string;
  draft: number;
  source: string;
  created_at: string;
  updated_at: string;
}

const fromRow = (r: PostRow): PostRecord => ({
  slug: r.slug,
  title: r.title,
  summary: r.summary,
  date: r.date,
  updated: r.updated ?? undefined,
  tags: JSON.parse(r.tags) as string[],
  projects: JSON.parse(r.projects) as string[],
  draft: r.draft === 1,
  source: r.source,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

export type BlogDb = ReturnType<typeof openBlogDb>;

export function openBlogDb(file: string) {
  if (file !== ":memory:") mkdirSync(dirname(file), { recursive: true });
  const db = new Database(file, { create: true, strict: true });
  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA foreign_keys = ON");
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    date TEXT NOT NULL,
    updated TEXT,
    tags TEXT NOT NULL DEFAULT '[]',
    projects TEXT NOT NULL DEFAULT '[]',
    draft INTEGER NOT NULL DEFAULT 1,
    source TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    github_id TEXT NOT NULL,
    login TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  )`);

  const now = () => new Date().toISOString();
  const params = (p: PostInput) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    date: p.date,
    updated: p.updated ?? null,
    tags: JSON.stringify(p.tags),
    projects: JSON.stringify(p.projects),
    draft: p.draft ? 1 : 0,
    source: p.source,
  });

  const q = {
    all: db.query<PostRow, []>("SELECT * FROM posts ORDER BY date DESC, title"),
    published: db.query<PostRow, []>("SELECT * FROM posts WHERE draft = 0 ORDER BY date DESC, title"),
    one: db.query<PostRow, { slug: string }>("SELECT * FROM posts WHERE slug = $slug"),
    insert: db.query(
      `INSERT INTO posts (slug, title, summary, date, updated, tags, projects, draft, source, created_at, updated_at)
       VALUES ($slug, $title, $summary, $date, $updated, $tags, $projects, $draft, $source, $now, $now)`,
    ),
    update: db.query(
      `UPDATE posts SET slug = $slug, title = $title, summary = $summary, date = $date, updated = $updated,
       tags = $tags, projects = $projects, draft = $draft, source = $source, updated_at = $now
       WHERE slug = $old`,
    ),
    remove: db.query("DELETE FROM posts WHERE slug = $slug"),
    session: db.query<{ github_id: string; login: string; expires_at: number }, { hash: string }>(
      "SELECT github_id, login, expires_at FROM sessions WHERE token_hash = $hash",
    ),
    addSession: db.query("INSERT INTO sessions (token_hash, github_id, login, expires_at) VALUES ($hash, $id, $login, $exp)"),
    dropSession: db.query("DELETE FROM sessions WHERE token_hash = $hash"),
    pruneSessions: db.query("DELETE FROM sessions WHERE expires_at < $now"),
  };

  return {
    listPosts: (opts: { includeDrafts: boolean }) => (opts.includeDrafts ? q.all : q.published).all().map(fromRow),
    getPost: (slug: string) => {
      const row = q.one.get({ slug });
      return row ? fromRow(row) : null;
    },
    createPost: (p: PostInput) => {
      q.insert.run({ ...params(p), now: now() });
      return fromRow(q.one.get({ slug: p.slug })!);
    },
    updatePost: (oldSlug: string, p: PostInput) => {
      q.update.run({ ...params(p), now: now(), old: oldSlug });
      return fromRow(q.one.get({ slug: p.slug })!);
    },
    deletePost: (slug: string) => q.remove.run({ slug }).changes > 0,

    getSession: (hash: string) => {
      const row = q.session.get({ hash });
      if (!row) return null;
      if (row.expires_at < Date.now()) {
        q.dropSession.run({ hash });
        return null;
      }
      return { githubId: row.github_id, login: row.login };
    },
    addSession: (hash: string, githubId: string, login: string, expiresAt: number) => {
      q.pruneSessions.run({ now: Date.now() });
      q.addSession.run({ hash, id: githubId, login, exp: expiresAt });
    },
    dropSession: (hash: string) => {
      q.dropSession.run({ hash });
    },
    close: () => db.close(),
  };
}
