/**
 * Post-build step: turn the SPA shell in dist/ into one static HTML file per
 * route. Each page gets its own <title>, description, canonical, and Open
 * Graph / Twitter tags (via applyRouteMeta) AND its server-rendered body, so
 * crawlers, social unfurlers, and no-JS clients see real content; React
 * hydrates it on the client.
 *
 * The body comes from the server bundle in ssr-build/, built with the same
 * bundler as the client so CSS-module class names match and hydration is clean.
 *
 * Runs after `bun build` (see package.json), or standalone via `bun run prerender`.
 */
import { join } from "node:path";
import { projects } from "../src/data/siteContent";
import {
  allRoutes,
  applyRouteMeta,
  buildRobots,
  buildSitemap,
  notFoundMeta,
  type RouteMeta,
} from "../src/lib/routeMeta";

const repoRoot = join(import.meta.dir, "..");
const distDir = join(repoRoot, "dist");

const templateFile = Bun.file(join(distDir, "index.html"));
if (!(await templateFile.exists())) {
  throw new Error(
    "dist/index.html not found. Run `bun build ./index.html --outdir=dist` first.",
  );
}
const template = await templateFile.text();

const serverEntry = join(repoRoot, "ssr-build", "entry-server.js");
if (!(await Bun.file(serverEntry).exists())) {
  throw new Error(
    "ssr-build/entry-server.js not found. Build the server bundle before prerendering (see package.json).",
  );
}
const { render } = (await import(serverEntry)) as {
  render: (location: string) => string;
};

const ROOT_MARKER = '<div id="root"></div>';

/** Per-route head metadata plus the server-rendered body, in the shell. */
function renderRoute(route: RouteMeta): string {
  const html = applyRouteMeta(template, route);
  if (!html.includes(ROOT_MARKER)) {
    throw new Error(
      "prerender: could not find the #root marker to inject server markup.",
    );
  }
  return html.replace(ROOT_MARKER, `<div id="root">${render(route.path)}</div>`);
}

let pages = 0;
for (const route of allRoutes()) {
  const outPath =
    route.path === "/"
      ? join(distDir, "index.html")
      : join(distDir, route.path, "index.html");
  await Bun.write(outPath, renderRoute(route));
  pages += 1;
}

// A real 404 document for static hosts and the production server.
await Bun.write(join(distDir, "404.html"), renderRoute(notFoundMeta));

// OG cards aren't referenced from index.html, so the bundler doesn't copy
// them: the site card plus one per project (tinted with its accent).
await Bun.write(
  join(distDir, "og.png"),
  Bun.file(join(repoRoot, "public", "og.png")),
);
for (const project of projects) {
  await Bun.write(
    join(distDir, "og", `${project.slug}.png`),
    Bun.file(join(repoRoot, "public", "og", `${project.slug}.png`)),
  );
}

await Bun.write(join(distDir, "sitemap.xml"), buildSitemap());
await Bun.write(join(distDir, "robots.txt"), buildRobots());

console.log(
  `Prerendered ${pages} routes + 404.html, og.png, sitemap.xml, robots.txt → dist/`,
);
