import { existsSync } from "node:fs";
import { join } from "node:path";
import index from "./index.html";
import {
  SITE_ORIGIN,
  buildRobots,
  buildSitemap,
  knownProjectSlugs,
} from "./src/lib/routeMeta";

const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT ?? 3000);
const DIST = join(import.meta.dir, "dist");

const XML_HEADERS = { "content-type": "application/xml; charset=utf-8" };
const TEXT_HEADERS = { "content-type": "text/plain; charset=utf-8" };

const sitemap = () => new Response(buildSitemap(SITE_ORIGIN), { headers: XML_HEADERS });
const robots = () => new Response(buildRobots(SITE_ORIGIN), { headers: TEXT_HEADERS });

if (isProd) {
  // Production serves the prerendered static build: one HTML file per route
  // with its own metadata, hashed assets cached forever, and real 404s.
  if (!existsSync(join(DIST, "index.html"))) {
    console.error(
      "dist/ is missing or incomplete. Run `bun run build` before `bun server.ts` in production.",
    );
    process.exit(1);
  }

  const html = (file: string, status = 200) =>
    new Response(Bun.file(file), {
      status,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache" },
    });
  const notFound = () => html(join(DIST, "404.html"), 404);

  const server = Bun.serve({
    port,
    development: false,
    routes: {
      "/sitemap.xml": sitemap,
      "/robots.txt": robots,
      "/og.png": () =>
        new Response(Bun.file(join(DIST, "og.png")), {
          headers: { "cache-control": "public, max-age=86400" },
        }),
      "/": () => html(join(DIST, "index.html")),
      "/projects": () => html(join(DIST, "projects", "index.html")),
      "/resume": () => html(join(DIST, "resume", "index.html")),
      "/now": () => html(join(DIST, "now", "index.html")),
      "/projects/:slug": (req) => {
        const { slug } = req.params;
        if (!knownProjectSlugs.has(slug)) return notFound();
        return html(join(DIST, "projects", slug, "index.html"));
      },
      // Hashed, content-addressed assets at the dist root. Anything else 404s.
      "/*": async (req) => {
        const pathname = new URL(req.url).pathname;
        const resolved = join(DIST, pathname);
        if (pathname === "/" || !resolved.startsWith(DIST)) return notFound();
        const file = Bun.file(resolved);
        if (!(await file.exists())) return notFound();
        // OG cards keep a stable name, so cache them for a day rather than
        // forever; hashed bundles are content-addressed and immutable.
        const cacheControl = pathname.startsWith("/og/")
          ? "public, max-age=86400"
          : "public, max-age=31536000, immutable";
        return new Response(file, { headers: { "cache-control": cacheControl } });
      },
    },
  });

  console.log(`alaarab portfolio (prod) serving dist/ at ${server.url}`);
} else {
  // Dev serves the SPA shell with HMR; React Router owns every path.
  const server = Bun.serve({
    port,
    development: { hmr: true, console: true },
    routes: {
      "/sitemap.xml": sitemap,
      "/robots.txt": robots,
      "/og.png": () => new Response(Bun.file(join(import.meta.dir, "public", "og.png"))),
      "/*": index,
    },
  });

  console.log(`alaarab portfolio (dev) running at ${server.url}`);
}
