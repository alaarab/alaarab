# Ala Arab

Full-stack developer in Sacramento. I build web products and the unglamorous internal tools that keep them running after launch. I like software that is honest about what it does and stays that way once the demo is over.

You probably landed here because this repo shares my name. Convenient. So here is what I have actually been building.

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

A pattern is showing up here: I make music in Ableton, I got annoyed at the tooling, and half of these projects are what came out the other side.

## Before the open-source detour

Close to a decade across product engineering, backend systems, and the operations layer around shipping software. Most of it at ADM Associates, building and keeping web apps alive in a compliance-heavy environment where stability was the entire job.

## Say hi

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

Project content lives in `src/data/siteContent.ts` and styles sit in `src/styles`. Run `bun run typecheck` and `bun run build` before shipping anything. `bun start` runs the production server.
