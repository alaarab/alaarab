# Portfolio repository

This is Ala Arab's Bun app, with React 19, TypeScript, React Router, and CSS modules. It is not a Next.js app.

Content lives in `src/data/siteContent.ts`. Keep it structured and reuse it across routes; do not invent biography, project claims, or sample posts. The accepted design is Embroidery: linen, Alegreya type, stitched rules, and real product screenshots. Preserve the home section order and the Active/Made grouping in `src/site/status.ts`. Projects without screenshots remain text-only.

All public routes use `src/site/embroidery.module.css`. Home and project details live in `src/site/`; supporting pages live in `src/pages/` and use the shared `Page` and `SiteNav`. Keep client routing (`src/App.tsx`), metadata (`src/lib/routeMeta.ts`), prerendering (`scripts/prerender.ts`), and production serving (`server.ts`) consistent. Unknown pages return an actual 404.

Run `bun install --frozen-lockfile`, `bun run typecheck`, `bun run build`, and `bun run test -- --workers=2`. Browser tests build and start their own production server at port 3210. Limit local workers to two (one when sharing a busy machine) and preserve evidence from failures. Inspect mobile navigation, actual link bounds, direct URLs, client navigation, and resume printing when changing routes or styles.

Use an isolated branch/worktree and a reviewable PR for fixes. Keep unrelated checkouts and evidence intact. Merge, production deployment, server changes, and OAuth configuration require the owner's integration brief. Blog/editor work is tracked separately and must not enable unconfigured OAuth.
