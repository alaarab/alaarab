/**
 * Serve the design-direction prototypes under /lab.
 *
 * Builds the SPA to .lab-dist/<port>/ and serves it with an index.html fallback so
 * React Router owns every path. Exists because `bun run dev` currently fails
 * under Bun 1.3.14 ("import_Terminal_module is not defined"), and the
 * production server only serves the prerendered public routes.
 *
 *   bun run lab            # http://localhost:3300/lab
 *   PORT=4000 bun run lab
 */
import { rmSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const port = Number(process.env.PORT ?? 3300);
// One build dir per port, so parallel lab servers don't clobber each other.
const outdir = join(root, ".lab-dist", String(port));

rmSync(outdir, { recursive: true, force: true });
const result = await Bun.build({
  entrypoints: [join(root, "index.html")],
  outdir,
  publicPath: "/",
  minify: true,
  define: { "process.env.NODE_ENV": '"production"' },
});
if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

const shell = join(outdir, "index.html");
const server = Bun.serve({
  port,
  async fetch(req) {
    const pathname = decodeURIComponent(new URL(req.url).pathname);
    const file = Bun.file(join(outdir, pathname));
    if (pathname !== "/" && !pathname.includes("..") && (await file.exists())) {
      return new Response(file);
    }
    return new Response(Bun.file(shell), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
});

console.log(`Design lab: ${server.url}lab`);
for (const key of ["rack", "ledger", "transit"]) {
  console.log(`  ${server.url}lab/${key}`);
}
