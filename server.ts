import index from "./index.html";
import { projects } from "./src/data/siteContent";

const isProd = process.env.NODE_ENV === "production";
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://alaarab.com";

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    `${SITE_ORIGIN}/`,
    `${SITE_ORIGIN}/projects`,
    `${SITE_ORIGIN}/resume`,
    ...projects.map((project) => `${SITE_ORIGIN}/projects/${project.slug}`),
  ];
  const body = urls
    .map(
      (loc) => `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: ${SITE_ORIGIN}/sitemap.xml
`;

const server = Bun.serve({
  port: Number(process.env.PORT ?? 3000),
  development: isProd ? false : { hmr: true, console: true },
  routes: {
    "/sitemap.xml": () =>
      new Response(buildSitemap(), {
        headers: { "content-type": "application/xml; charset=utf-8" },
      }),
    "/robots.txt": () =>
      new Response(ROBOTS_TXT, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      }),
    // Every other path resolves to the SPA shell. React Router takes it from
    // there, so deep links like /projects/phren survive a hard refresh.
    "/*": index,
  },
});

console.log(`alaarab portfolio running at ${server.url}`);
