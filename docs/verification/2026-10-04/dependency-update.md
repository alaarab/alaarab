# Dependency update — 2026-10-04

Started from pulled `main` at `0ca8d82` in an isolated worktree on `deps/update-2026-10-04`.
Stable versions were checked against the npm registry and GitHub release APIs on 2026-10-04.

| Dependency | Before | After |
| --- | --- | --- |
| react / react-dom | 19.2.7 | 19.3.0 |
| react-router | 7.17.0 | 8.4.0 |
| @playwright/test | 1.60.0 | 1.63.0 |
| @types/bun | 1.3.14 | 1.4.2 |
| @types/react | 19.2.17 | 19.3.0 |
| @types/react-dom | 19.2.3 | 19.3.0 |
| typescript | 6.0.3 | 7.0.2 |
| actions/checkout | v4 | v7.0.1 |
| oven-sh/setup-bun | v2 | v2.2.0 |
| CI Bun runtime | latest (floating) | 1.4.2 |

Added `packageManager: bun@1.4.2` and regenerated `bun.lock`, including compatible transitive updates and TypeScript 7's platform-specific compiler packages.

## Major upgrades

No major bumps skipped. React Router 8 works with the existing declarative router, ESM modules, React 19, and Bun builds. No framework-mode migration is needed. TypeScript 7 accepts the existing configuration and source. Checkout 7 is compatible with this workflow's `pull_request` and `push` events on GitHub-hosted `ubuntu-latest`.

Release references: [React Router changelog](https://github.com/remix-run/react-router/blob/main/CHANGELOG.md), [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1), [setup-bun v2.2.0](https://github.com/oven-sh/setup-bun/releases/tag/v2.2.0), [Bun 1.4.2](https://github.com/oven-sh/bun/releases/tag/bun-v1.4.2).

## Local validation

Bun 1.4.2 and Node 26.7.0, on Linux:

- `bun install --frozen-lockfile`: passed; lockfile unchanged.
- `bun run typecheck`: passed.
- `bun run build`: passed; 19 routes plus 404 prerendered.
- `bun run test -- --workers=2`: 15 passed in 19.5 seconds.
- `git diff --check`: passed.

The unchanged browser suite covers mobile bounds at 320px and 390px, direct URLs, client navigation and metadata, hydration, resume printing, prerendered content, social cards, and HTTP 404 status.

A redundant Chromium download attempt failed with the host's `/tmp` quota error. Tests then used the already installed matching Playwright Chromium v1243 and passed. No tests were weakened or deleted.

No lint command is defined. No Swift, Python, or other dependency manifests are tracked, so no Xcode/simulator run applies. No merge, release, deployment, or production changes were performed.

## Owner-authorized follow-up

Re-fetched PR #8 into a separate worktree and ran `git rebase origin/main` on
2026-10-04. Latest `main` remained `0ca8d82bf3ceef037efcbc762c09ee7bbd437d17`;
the dependency commit was already based on it. Rechecked all eight direct
packages and every lockfile package against npm, plus Bun and both CI action
release APIs: all direct packages, Bun and CI actions remain newest stable.

Two transitive dependencies cannot use their newest releases within upstream
requirements (no override applied):

| Package | Locked / newest allowed | Newest stable | Exact upstream constraint |
| --- | --- | --- | --- |
| `@remix-run/route-pattern` | 0.22.1 | 1.0.0 | `react-router@8.4.0` requires `^0.22.1` (>=0.22.1 <0.23.0) |
| `undici-types` | 8.9.0 | 8.11.2 | `@types/node@26.6.4` requires `~8.9.0` (>=8.9.0 <8.10.0) |

All other locked packages match their newest stable release. The React Router
8 migration notes were checked: this app already uses ESM and imports from
`react-router`, uses declarative routes rather than framework/Vite mode, and
does not use removed future flags or route-module meta APIs. React 19.3.0 meets
its >=19.2.7 peer minimum. TypeScript 7's native Darwin ARM64 compiler installs
and accepts the existing strict project configuration without changes.

Fresh validation on the Mac mini, using an isolated Bun 1.4.2 binary and
Node 26.0.0:

- `bun install --frozen-lockfile`: passed; tracked lockfile unchanged.
- `bun run typecheck`: passed.
- `bun run build`: passed; 19 routes plus 404 prerendered.
- `bun run test -- --workers=1`: 15 passed in 12.9 seconds; zero skipped.
- `git diff --check`: passed.
- Test files, test configuration and assertions are unchanged from `main`.

The tracked repository contains no lint script/configuration, unit test suite,
Swift/native manifest, Xcode project, or simulator test target. Those checks are
not applicable, not claimed as passes. Browser UI tests are the complete
existing test suite. Disk preflight showed about 22 GiB free, above the owner's
20 GB requirement; no Xcode/simulator run was needed or started. Merge only is
authorized; no release, deployment, package publication or version bump.
