import { projects } from "../src/data/siteContent";
import { SLUG_PATTERN, isIsoDate, toPost, toSummary } from "../src/lib/posts";
import {
  SITE_ORIGIN,
  applyRouteMeta,
  blogIndexMeta,
  buildFeed,
  buildSitemap,
  notFoundMeta,
  postMeta,
  writeMeta,
  type RouteMeta,
} from "../src/lib/routeMeta";
import { BLOG_DATA_ID, type BlogPayload, blogPayloadJson } from "../src/site/blogData";
import type { BlogPageData, PostInput, PostRecord } from "../src/types";
import type { Auth } from "./auth";
import type { BlogDb } from "./db";

/**
 * The blog's server side: page data and server-rendered pages for /blog, the
 * feed and sitemap, and the author API behind the session.
 */

/** The server-render entry and the unrendered HTML shell, in production. */
export interface Renderer {
  shell: string;
  render: (location: string, blog?: BlogPayload) => string;
}

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
const fail = (error: string, status = 400, field?: keyof PostInput) => json({ error, field }, status);

const knownProjects = new Set(projects.map((p) => p.slug));

const MAX_SOURCE = 200_000;

/** Check and normalise a post from the editor. */
export function validatePost(raw: unknown): { ok: true; post: PostInput } | { ok: false; error: string; field?: keyof PostInput } {
  if (!raw || typeof raw !== "object") return { ok: false, error: "Send the post as JSON." };
  const r = raw as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string).trim() : "");
  const list = (k: string) =>
    Array.isArray(r[k]) ? [...new Set((r[k] as unknown[]).filter((v): v is string => typeof v === "string").map((v) => v.trim()).filter(Boolean))] : [];

  const title = str("title");
  if (!title) return { ok: false, error: "Give the post a title.", field: "title" };
  if (title.length > 200) return { ok: false, error: "Keep the title under 200 characters.", field: "title" };

  const slug = str("slug");
  if (!SLUG_PATTERN.test(slug) || slug.length > 80)
    return { ok: false, error: "Use lowercase letters, numbers and single hyphens, up to 80 characters.", field: "slug" };

  const summary = str("summary");
  if (!summary) return { ok: false, error: "Add a one or two sentence summary.", field: "summary" };
  if (summary.length > 400) return { ok: false, error: "Keep the summary under 400 characters.", field: "summary" };

  const date = str("date");
  if (!isIsoDate(date)) return { ok: false, error: "Pick a date.", field: "date" };
  const updated = str("updated") || undefined;
  if (updated && !isIsoDate(updated)) return { ok: false, error: "That isn't a date.", field: "updated" };
  if (updated && updated < date) return { ok: false, error: "The update can't be before the post date.", field: "updated" };

  const tags = list("tags");
  if (tags.length > 12 || tags.some((t) => t.length > 40)) return { ok: false, error: "Up to 12 tags, 40 characters each.", field: "tags" };

  const linked = list("projects");
  const unknown = linked.find((p) => !knownProjects.has(p));
  if (unknown) return { ok: false, error: `There is no project called ${unknown}.`, field: "projects" };

  const source = typeof r.source === "string" ? r.source.replace(/\r\n?/g, "\n") : "";
  if (source.length > MAX_SOURCE) return { ok: false, error: "The post is too long to save.", field: "source" };

  const draft = r.draft !== false;
  if (!draft && !source.trim()) return { ok: false, error: "Write something before publishing.", field: "source" };

  return { ok: true, post: { slug, title, summary, date, updated, tags, projects: linked, draft, source } };
}

export function createBlog(db: BlogDb, auth: Auth, renderer: Renderer | null, origin: string = SITE_ORIGIN) {
  // Rendered public pages, cleared whenever a post changes.
  const cache = new Map<string, { status: number; html: string }>();
  let summaries: ReturnType<typeof toSummary>[] | null = null;

  const published = () => (summaries ??= db.listPosts({ includeDrafts: false }).map((r) => toSummary(toPost(r))));
  const changed = () => {
    cache.clear();
    summaries = null;
  };

  /** Page data for a public blog path, or null for a 404. Drafts are never public. */
  function pageData(path: string): BlogPageData | null {
    if (path === "/blog") return { kind: "index", posts: published() };
    const m = path.match(/^\/blog\/([a-z0-9-]+)$/);
    if (!m) return null;
    const record = db.getPost(m[1]);
    if (!record || record.draft) return null;
    const list = published();
    const k = list.findIndex((p) => p.slug === record.slug);
    const ref = (i: number) => (list[i] ? { slug: list[i].slug, title: list[i].title } : undefined);
    return { kind: "post", post: toPost(record), newer: ref(k - 1), older: ref(k + 1) };
  }

  const ROOT = '<div id="root"></div>';

  function renderPage(path: string, meta: RouteMeta, payload?: BlogPayload): string {
    if (!renderer) throw new Error("renderPage needs the production renderer.");
    let html = applyRouteMeta(renderer.shell, meta, origin);
    const body = renderer.render(path, payload);
    const data = payload
      ? `<script id="${BLOG_DATA_ID}" type="application/json">${blogPayloadJson(payload)}</script>`
      : "";
    html = html.replace(ROOT, () => `<div id="root">${body}</div>${data}`);
    return html;
  }

  const htmlResponse = (html: string, status: number) =>
    new Response(html, { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" } });

  return {
    /** GET /blog and /blog/:slug, server-rendered with their data. */
    page(req: Request): Response {
      const path = new URL(req.url).pathname.replace(/\/+$/, "") || "/";
      const hit = cache.get(path);
      if (hit) return htmlResponse(hit.html, hit.status);
      const data = pageData(path);
      const meta = !data ? notFoundMeta : data.kind === "index" ? blogIndexMeta : postMeta(data.post);
      const entry = { status: data ? 200 : 404, html: renderPage(path, meta, { path, data }) };
      // Don't let random 404 paths grow the cache.
      if (data) cache.set(path, entry);
      return htmlResponse(entry.html, entry.status);
    },

    /** GET /write and /write/*: the editor's app shell, never indexed. */
    writeShell(req: Request): Response {
      const path = new URL(req.url).pathname;
      const html = renderPage(path, { ...writeMeta, path });
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
      });
    },

    /** GET /api/blog/page?path=: the same data, for client-side navigation. */
    pageApi(req: Request): Response {
      const path = new URL(req.url).searchParams.get("path") ?? "";
      const data = pageData(path);
      return data ? json(data) : fail("Not found.", 404);
    },

    feed: () =>
      new Response(buildFeed(published(), origin), {
        headers: { "content-type": "application/atom+xml; charset=utf-8" },
      }),

    sitemap: () =>
      new Response(buildSitemap(origin, published()), {
        headers: { "content-type": "application/xml; charset=utf-8" },
      }),

    /** GET /api/me */
    me(req: Request): Response {
      const who = auth.author(req);
      return json({ user: who ? { login: who.login } : null });
    },

    /** Everything under /api/admin. */
    async admin(req: Request): Promise<Response> {
      if (!auth.author(req)) return fail("Sign in first.", 401);
      const url = new URL(req.url);
      const slug = url.pathname.match(/^\/api\/admin\/posts\/([^/]+)$/)?.[1];
      const isWrite = req.method !== "GET" && req.method !== "HEAD";
      if (isWrite && !auth.sameOrigin(req)) return fail("Writes must come from this site.", 403);

      if (url.pathname === "/api/admin/posts" && req.method === "GET") {
        return json(db.listPosts({ includeDrafts: true }));
      }

      if (url.pathname === "/api/admin/posts" && req.method === "POST") {
        const checked = validatePost(await req.json().catch(() => null));
        if (!checked.ok) return fail(checked.error, 400, checked.field);
        if (db.getPost(checked.post.slug)) return fail("A post already uses that slug.", 409, "slug");
        const saved = db.createPost(checked.post);
        changed();
        return json(saved, 201);
      }

      if (slug) {
        const existing: PostRecord | null = db.getPost(slug);
        if (!existing) return fail("No such post.", 404);

        if (req.method === "GET") return json(existing);

        if (req.method === "PUT") {
          const checked = validatePost(await req.json().catch(() => null));
          if (!checked.ok) return fail(checked.error, 400, checked.field);
          const post = checked.post;
          if (post.slug !== existing.slug) {
            if (!existing.draft) return fail("A published post keeps its slug, so links to it keep working.", 409, "slug");
            if (db.getPost(post.slug)) return fail("A post already uses that slug.", 409, "slug");
          }
          const saved = db.updatePost(existing.slug, post);
          changed();
          return json(saved);
        }

        if (req.method === "DELETE") {
          db.deletePost(existing.slug);
          changed();
          return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
        }
      }

      return fail("Not found.", 404);
    },
  };
}
