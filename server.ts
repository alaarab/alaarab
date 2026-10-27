import { existsSync } from "node:fs";
import { join } from "node:path";
import index from "./index.html";
import { createAuth } from "./server/auth";
import { type Renderer, createBlog } from "./server/blog";
import { gzipped, serveFile } from "./server/compress";
import { openBlogDb } from "./server/db";
import { SITE_ORIGIN, buildRobots, canonicalPagePath, knownProjectSlugs } from "./src/lib/routeMeta";

const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT ?? 3000);
const DIST = join(import.meta.dir, "dist");
const SSR = join(import.meta.dir, "ssr-build");

const TEXT_HEADERS = { "content-type": "text/plain; charset=utf-8" };
const robots = () => new Response(buildRobots(SITE_ORIGIN), { headers: TEXT_HEADERS });

// Blog posts and author sessions. See docs/blog.md for the environment.
const db = openBlogDb(process.env.BLOG_DB ?? join(import.meta.dir, "data", "blog.sqlite"));
const auth = createAuth(db, {
  origin: SITE_ORIGIN,
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  adminGithubId: process.env.BLOG_ADMIN_GITHUB_ID,
  testLogin: process.env.BLOG_TEST_LOGIN === "1",
});

/** Routes the blog and the editor share in dev and production. */
function blogRoutes(blog: ReturnType<typeof createBlog>) {
  return {
    "/sitemap.xml": gzipped(blog.sitemap),
    "/robots.txt": gzipped(robots),
    "/blog/feed.xml": gzipped(blog.feed),
    "/api/blog/page": gzipped((req: Request) => blog.pageApi(req)),
    "/api/me": (req: Request) => blog.me(req),
    "/api/admin/*": (req: Request) => blog.admin(req),
    "/auth/github": (req: Request) => auth.start(req),
    "/auth/github/callback": (req: Request) => auth.callback(req),
    "/auth/logout": (req: Request) => (req.method === "POST" ? auth.logout(req) : new Response(null, { status: 405 })),
    "/auth/test-login": (req: Request) => (req.method === "POST" ? auth.testLogin(req) : new Response(null, { status: 405 })),
  };
}

if (isProd) {
  // Production serves the prerendered static build: one HTML file per route
  // with its own metadata, hashed assets cached forever, and real 404s. The
  // blog and the editor are rendered per request from the database.
  if (!existsSync(join(DIST, "index.html")) || !existsSync(join(SSR, "shell.html"))) {
    console.error(
      "dist/ or ssr-build/ is missing or incomplete. Run `bun run build` before `bun server.ts` in production.",
    );
    process.exit(1);
  }

  const renderer: Renderer = {
    shell: await Bun.file(join(SSR, "shell.html")).text(),
    render: ((await import(join(SSR, "entry-server.js"))) as { render: Renderer["render"] }).render,
  };
  const blog = createBlog(db, auth, renderer);

  const html = (req: Request, file: string, status = 200) =>
    serveFile(req, file, {
      status,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
    });
  const notFound = (req: Request) => html(req, join(DIST, "404.html"), 404);
  const writePage = gzipped((req: Request) =>
    /^\/write(\/[a-z0-9-]+)?\/?$/.test(new URL(req.url).pathname) ? blog.writeShell(req) : notFound(req),
  );

  const server = Bun.serve({
    port,
    development: false,
    routes: {
      ...blogRoutes(blog),
      "/og.png": () =>
        new Response(Bun.file(join(DIST, "og.png")), {
          headers: { "cache-control": "public, max-age=86400" },
        }),
      // The manifest points here; the bundler only emits a hashed copy.
      "/favicon.ico": () =>
        new Response(Bun.file(join(DIST, "favicon.ico")), {
          headers: { "cache-control": "public, max-age=86400" },
        }),
      "/": (req) => html(req, join(DIST, "index.html")),
      "/projects": (req) => html(req, join(DIST, "projects", "index.html")),
      "/resume": (req) => html(req, join(DIST, "resume", "index.html")),
      "/now": (req) => html(req, join(DIST, "now", "index.html")),
      "/intrapath/concepts": (req) => html(req, join(DIST, "intrapath", "concepts.html")),
      "/projects/:slug": (req) => {
        const { slug } = req.params;
        // The parameter route wins over /* for this static-host alias.
        if (slug === "index.html") {
          return new Response(null, {
            status: 308,
            headers: { location: `/projects${new URL(req.url).search}`, "cache-control": "no-cache" },
          });
        }
        if (!knownProjectSlugs.has(slug)) return notFound(req);
        return html(req, join(DIST, "projects", slug, "index.html"));
      },
      "/blog": gzipped((req) => blog.page(req)),
      "/blog/:slug": gzipped((req) => blog.page(req)),
      "/write": writePage,
      "/write/*": writePage,
      // Hashed, content-addressed assets at the dist root. Anything else 404s.
      "/*": async (req) => {
        const url = new URL(req.url);
        const pathname = url.pathname;
        const canonical = canonicalPagePath(pathname);
        if (canonical && canonical !== pathname) {
          return new Response(null, {
            status: 308,
            headers: { location: `${canonical}${url.search}`, "cache-control": "no-cache" },
          });
        }
        // Old build artifacts must never expose removed or duplicate HTML routes.
        if (pathname.endsWith(".html")) return notFound(req);
        const resolved = join(DIST, pathname);
        if (pathname === "/" || !resolved.startsWith(DIST)) return notFound(req);
        if (!(await Bun.file(resolved).exists())) return notFound(req);
        // OG cards keep a stable name, so cache them for a day rather than
        // forever; hashed bundles are content-addressed and immutable.
        const cacheControl = pathname.startsWith("/og/")
          ? "public, max-age=86400"
          : "public, max-age=31536000, immutable";
        return serveFile(req, resolved, { headers: { "cache-control": cacheControl } });
      },
    },
  });

  console.log(`alaarab portfolio (prod) serving dist/ at ${server.url}`);
} else {
  // Dev serves the SPA shell with HMR; React Router owns every path, and blog
  // pages fetch their data from /api/blog/page.
  const blog = createBlog(db, auth, null);
  const server = Bun.serve({
    port,
    development: { hmr: true, console: true },
    routes: {
      ...blogRoutes(blog),
      "/og.png": () => new Response(Bun.file(join(import.meta.dir, "public", "og.png"))),
      "/favicon.ico": () => new Response(Bun.file(join(import.meta.dir, "public", "favicon.ico"))),
      "/intrapath/concepts": () => new Response(Bun.file(join(import.meta.dir, "public", "intrapath", "concepts.html"))),
      "/*": index,
    },
  });

  console.log(`alaarab portfolio (dev) running at ${server.url}`);
}
