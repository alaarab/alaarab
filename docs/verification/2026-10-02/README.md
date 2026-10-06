# Portfolio route audit, 2026-10-02

The live portfolio ships the accepted Embroidery home and project-detail pages, but its home links to Resume and Now, both still rendered with the old dark template. Now and the generic 404 link to the old Projects index. The server's missing-project document and the client's missing-project page also differed. The local starting checkout was clean at `0fc2497`; GitHub main was verified at `e623bc8bbb2f9ea126b552184ff40724c07a22f5`. This fix starts at the latter in an isolated worktree, preserving the original checkout.

The fix ports `/resume`, `/now`, `/projects`, and all 404s to the existing linen, type, stitches, and screenshots. It preserves the accepted home section order, Active/Made classification, content, and per-project themes. Shared navigation points All work to the complete `/projects` index, and wraps with 44px navigation targets on phones. Internal links use React Router; client navigation updates the same metadata as prerendered direct visits. Trailing-slash and `index.html` aliases redirect to canonical routes while retaining query strings. Unrecognized HTML artifacts cannot expose old-template pages. Resume printing still hides navigation and controls.

The build now explicitly uses `NODE_ENV=production` for both bundles. The final referenced client JS is about 290 KB and contains no `jsxDEV` or React development-module markers, compared with the live bundle's 504,619 bytes. The old Fraunces/JetBrains font requests and dark browser/manifest colors are removed. New repository instructions describe Bun and the current route/design architecture; no content, blog OAuth, production nginx, pm2, or Hook settings changed.

Validation:

- `bun run typecheck` — passed.
- `bun run build` — passed; 19 prerendered routes plus 404.
- `bun run test -- --workers=1` — 15 passed. Covers all 19 routes, internal destinations and expected project external URLs, direct HTML and hydrated metadata, navigation/back round trips, 320px/390px document and actual link bounds, 44px navigation targets, canonical redirects, generic/project 404 consistency, and resume print styles. No JavaScript or hydration errors in the route sweep.
- `bun run test -- --workers=1 --grep 'all routes fit|homepage'` — 4 passed; focused verification after retaining the original home spacing around the new main landmark.
- `git diff --check` — passed.
- A separate serial browser audit read five current live pages and seven local routes, captured desktop and 390px screenshots, and recorded URLs, status, background, links, and scroll widths in [route-audit.json](route-audit.json). Both missing local routes return 404. Every captured local page is Embroidery and fits 390px.

The first two-worker run hit Chromium SIGTRAP/resource errors on the shared machine and produced incomplete CSS measurements; a serial rerun resolved those. It also caught the project-index alias being intercepted by the parameter route and an unsafe browser access to `process`; both were fixed before the passing run. Earlier failures are retained in `/tmp/portfolio-evidence-20261002/first-run` and `second-run`. The first `bun run test` attempt hit a global mise Playwright install timeout, so the script now calls the repository's installed CLI explicitly. Local browser servers needed sandbox escalation for port binding. Only one verification job ran at a time, with no more than two workers and final runs serial; no subprocess agents or iOS builds ran.

Review the screenshots:

| Route | Live desktop | Fixed desktop | Live phone | Fixed phone |
| --- | --- | --- | --- | --- |
| Resume | [Before](live-resume-desktop.jpg) | [After](local-resume-desktop.jpg) | [Before](live-resume-mobile.jpg) | [After](local-resume-mobile.jpg) |
| Projects | [Before](live-projects-desktop.jpg) | [After](local-projects-desktop.jpg) | [Before](live-projects-mobile.jpg) | [After](local-projects-mobile.jpg) |
| Now | — | — | [Before](live-now-mobile.jpg) | [After](local-now-mobile.jpg) |

Remaining integration work: review/merge/deploy under a separate integration brief, then verify live routes and compression. Live gzip is still absent and needs an nginx/server follow-up; it cannot be changed by this source-only PR. Task `bid:17c2873d` remains Active for review and the original infrastructure remainder. The Phren summary/instruction memory still describes Next.js; the new repository AGENTS.md and README give verified current instructions. Blog PR #6, its OAuth/DB prerequisites, and owner-confirmation tasks remain separate. `dispatch_report` saves successfully from the worker terminal; both local and dispatching Mini Hooks reported no configured integrator target, so automatic forwarding could not be confirmed. No Hook restart or reconfiguration was attempted.
