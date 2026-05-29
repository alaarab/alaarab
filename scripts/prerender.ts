/**
 * Post-build step: turn the single SPA shell in dist/ into one static HTML
 * file per route, each with its own <title>, description, canonical, and
 * Open Graph / Twitter tags. Also emits a real 404.html, the sitemap and
 * robots.txt, and copies the OG card to the site root.
 *
 * Crawlers and social unfurlers — which mostly don't run JS — now get correct
 * per-route metadata. The page body is still hydrated by React on the client.
 *
 * Runs after `bun build` (see package.json), or standalone via `bun run prerender`.
 */
import { join } from "node:path";
import {
  allRoutes,
  applyRouteMeta,
  buildRobots,
  buildSitemap,
  notFoundMeta,
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

let pages = 0;
for (const route of allRoutes()) {
  const html = applyRouteMeta(template, route);
  const outPath =
    route.path === "/"
      ? join(distDir, "index.html")
      : join(distDir, route.path, "index.html");
  await Bun.write(outPath, html);
  pages += 1;
}

// A real 404 document for static hosts and the production server.
await Bun.write(join(distDir, "404.html"), applyRouteMeta(template, notFoundMeta));

// The OG card isn't referenced from index.html, so the bundler doesn't copy it.
await Bun.write(
  join(distDir, "og.png"),
  Bun.file(join(repoRoot, "public", "og.png")),
);

await Bun.write(join(distDir, "sitemap.xml"), buildSitemap());
await Bun.write(join(distDir, "robots.txt"), buildRobots());

console.log(
  `Prerendered ${pages} routes + 404.html, og.png, sitemap.xml, robots.txt → dist/`,
);
