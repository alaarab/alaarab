import { nowMeta, projects, siteMeta } from "../data/siteContent";

/**
 * Per-route <head> metadata, plus the sitemap/robots builders. This is the
 * single source of truth shared by the static prerender step (scripts/
 * prerender.ts) and the production server (server.ts), so a route's title,
 * description, and canonical URL are identical however the page is served.
 */

export const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://alaarab.com";
export const OG_IMAGE_PATH = "/og.png";

export interface RouteMeta {
  /** Document <title>. */
  title: string;
  /** <meta name="description"> and the social description. */
  description: string;
  /** Path this page lives at, e.g. "/" or "/projects/phren". */
  path: string;
  /** Open Graph image path, relative to the origin. */
  ogImage: string;
  /** Alt text for the Open Graph image. */
  ogImageAlt: string;
}

const HOME_DESCRIPTION =
  "Portfolio of Ala Arab. Full-stack developer in Los Angeles building open-source tooling for AI agents, audio production, and ticket workflows, after a decade running an internal ERP at ADM Associates.";

const SITE_OG_ALT = "Ala Arab — full-stack developer in Los Angeles";

/** Static routes that always exist, in sitemap order. */
const STATIC_ROUTES: RouteMeta[] = [
  {
    path: "/",
    title: "Ala Arab — Full-stack developer, Los Angeles",
    description: HOME_DESCRIPTION,
    ogImage: OG_IMAGE_PATH,
    ogImageAlt: SITE_OG_ALT,
  },
  {
    path: "/projects",
    title: "Projects — Ala Arab",
    description:
      "Selected work from Ala Arab: open-source tooling for AI coding agents and music production, plus a decade of internal ERP and operations software.",
    ogImage: OG_IMAGE_PATH,
    ogImageAlt: SITE_OG_ALT,
  },
  {
    path: "/resume",
    title: "Resume — Ala Arab",
    description:
      "Resume of Ala Arab, full-stack developer in Los Angeles. Systems software at Qualus, thirteen years at ADM Associates, and a shelf of open-source projects.",
    ogImage: OG_IMAGE_PATH,
    ogImageAlt: SITE_OG_ALT,
  },
  {
    path: "/now",
    title: "Now — Ala Arab",
    description: `${nowMeta.intro} As of ${nowMeta.asOf}.`,
    ogImage: OG_IMAGE_PATH,
    ogImageAlt: SITE_OG_ALT,
  },
];

const NOT_FOUND_META: RouteMeta = {
  path: "/404",
  title: "Not found — Ala Arab",
  description: "That page does not exist, or it moved.",
  ogImage: OG_IMAGE_PATH,
  ogImageAlt: SITE_OG_ALT,
};

function projectMeta(slug: string): RouteMeta | null {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return null;
  return {
    path: `/projects/${project.slug}`,
    title: `${project.title} — Ala Arab`,
    description: project.summary,
    ogImage: `/og/${project.slug}.png`,
    ogImageAlt: `${project.title} — ${project.category}`,
  };
}

/** Every page the prerender step should emit, in sitemap order. */
export function allRoutes(): RouteMeta[] {
  const projectRoutes = projects
    .map((project) => projectMeta(project.slug))
    .filter((meta): meta is RouteMeta => meta !== null);
  return [...STATIC_ROUTES, ...projectRoutes];
}

/** Resolve the metadata for any path, falling back to the 404 page. */
export function metaForPath(pathname: string): RouteMeta {
  const path = pathname !== "/" ? pathname.replace(/\/+$/, "") : "/";
  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    return projectMeta(projectMatch[1]) ?? NOT_FOUND_META;
  }
  return STATIC_ROUTES.find((route) => route.path === path) ?? NOT_FOUND_META;
}

export const notFoundMeta = NOT_FOUND_META;

export const knownProjectSlugs = new Set(
  projects.map((project) => project.slug),
);

function escapeText(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, "&quot;");
}

/** Replace exactly one occurrence, throwing if the pattern never matched so a
 * future change to index.html's head shape fails the build instead of silently
 * shipping stale metadata. */
function replaceOrThrow(
  html: string,
  pattern: RegExp,
  replacement: string,
  label: string,
): string {
  if (!pattern.test(html)) {
    throw new Error(
      `applyRouteMeta: could not find ${label} to rewrite. Did index.html's <head> change shape?`,
    );
  }
  return html.replace(pattern, replacement);
}

/**
 * Rewrite the per-route bits of a built index.html <head>: title, description,
 * canonical, and the Open Graph / Twitter title, description, url, and image.
 * Expects the source tags to be single-line (see index.html).
 */
export function applyRouteMeta(
  html: string,
  meta: RouteMeta,
  origin: string = SITE_ORIGIN,
): string {
  const canonical = meta.path === "/" ? `${origin}/` : `${origin}${meta.path}`;
  const ogImage = `${origin}${meta.ogImage}`;
  const title = escapeText(meta.title);
  const titleAttr = escapeAttr(meta.title);
  const descAttr = escapeAttr(meta.description);

  let out = html;
  out = replaceOrThrow(out, /<title>[^<]*<\/title>/, `<title>${title}</title>`, "<title>");
  out = replaceOrThrow(
    out,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${descAttr}" />`,
    "description",
  );
  out = replaceOrThrow(
    out,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    "canonical",
  );
  out = replaceOrThrow(
    out,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    "og:url",
  );
  out = replaceOrThrow(
    out,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${titleAttr}" />`,
    "og:title",
  );
  out = replaceOrThrow(
    out,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${descAttr}" />`,
    "og:description",
  );
  out = replaceOrThrow(
    out,
    /<meta property="og:image" content="[^"]*" \/>/,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
    "og:image",
  );
  out = replaceOrThrow(
    out,
    /<meta property="og:image:alt" content="[^"]*" \/>/,
    `<meta property="og:image:alt" content="${escapeAttr(meta.ogImageAlt)}" />`,
    "og:image:alt",
  );
  out = replaceOrThrow(
    out,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${titleAttr}" />`,
    "twitter:title",
  );
  out = replaceOrThrow(
    out,
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${descAttr}" />`,
    "twitter:description",
  );
  out = replaceOrThrow(
    out,
    /<meta name="twitter:image" content="[^"]*" \/>/,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`,
    "twitter:image",
  );
  return out;
}

export function buildSitemap(origin: string = SITE_ORIGIN): string {
  const today = new Date().toISOString().slice(0, 10);
  const body = allRoutes()
    .map((route) => {
      const loc = route.path === "/" ? `${origin}/` : `${origin}${route.path}`;
      return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function buildRobots(origin: string = SITE_ORIGIN): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
}
