# Ala Arab

Full-stack developer in Los Angeles. I build web products and the internal tools that keep them running after launch, mostly in TypeScript and Python.

This repo shares my name and doubles as my portfolio site. Here's what I've been building.

## What I'm building

### Phren

Persistent memory for AI coding agents. Findings, tasks, and patterns live as markdown in a git repo you own, so the next session starts where the last one ended. No database, no lock-in. Plays nice with Claude, Copilot, Cursor, and Codex.

[github.com/alaarab/phren](https://github.com/alaarab/phren)

### OGrid

Spreadsheet behavior for any table. Headless React hooks for inline edit, range select, the fill handle, and copy/paste. Drop them on shadcn, Material, Fluent, or a plain old table element. MIT licensed.

[github.com/alaarab/ogrid](https://github.com/alaarab/ogrid)

### m4l-builder

Max for Live devices written in Python instead of clicked together in a GUI. Pure standard library, ships to PyPI, and carries the test coverage to prove the .amxd files actually load.

[github.com/alaarab/m4l-builder](https://github.com/alaarab/m4l-builder)

### LiveMCP

An MCP bridge for Ableton Live. Around 170 tools for driving sessions, clips, devices, and the mixer straight from an agent.

[github.com/alaarab/livemcp](https://github.com/alaarab/livemcp)

A few of these come from the same place: I make music in Ableton, got annoyed at the tooling, and built what was missing.

### Atlas

A full ITSM platform you run in the browser. On top of the ticket views, Atlas mirrors every ticket to disk as markdown and exposes them to any AI tool through MCP, so the same queue lives in your editor and your agents too. The markdown mirror is loopback-only with a read-only allowlist, with sigstore-signed releases and an SBOM. Private for now, but drop me a line if you want a look.

## Before the open-source detour

Thirteen years at ADM Associates. I built Intranet, a project-based ERP that grew into the company's primary system and got licensed to clients. It's the one that replaced Deltek Vision. I also built out the engineering team, set up CI/CD on GitHub Actions, and ran SOC 2-compliant Linux servers and on-prem infrastructure.

These days I'm rebuilding that ERP from scratch as Intrapath. React on Bun this time, with the workflow modeled right from the data layer up.

## Contact

- Email: alaarab@gmail.com
- LinkedIn: [ala-arab](https://www.linkedin.com/in/ala-arab-a995b155/)

---

### About this repo

This doubles as my portfolio site: a Bun-native app with React 19 and TypeScript 6. No meta-framework. Bun handles the dev server, bundling, and the production server. Content sits in one typed file, so projects update without anyone touching the layout.

```bash
bun install
bun dev
```

Then open [localhost:3000](http://localhost:3000).

Project content lives in `src/data/siteContent.ts` and styles sit in `src/styles`. `bun run build` bundles the app, builds a server-render bundle, and prerenders one static HTML file per route (`scripts/prerender.ts`). Each one gets its own title, description, canonical URL, Open Graph card, and server-rendered body, so crawlers and social unfurlers get real content and metadata, not an empty shell. React hydrates the prerendered markup on the client. Unknown URLs return a real 404. `bun run og` regenerates the social cards under `public/og/`. Run `bun run typecheck` and `bun run build` before shipping anything; `bun start` builds and serves the static output.
