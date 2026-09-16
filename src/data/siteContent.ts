import type {
  ActionLink,
  EducationItem,
  ExperienceItem,
  Project,
  QuickStat,
  SiteMeta,
} from "../types";

export const siteMeta: SiteMeta = {
  name: "Ala Arab",
  title:
    "Full-stack developer who owns the whole stack: data model, UI, and the servers under it.",
  intro:
    "Mostly TypeScript and Python these days, across web apps, developer tooling, and audio software.",
  summary:
    "Most of what I ship now is open source: persistent memory for AI agents, a React spreadsheet grid, a Python toolchain for Max for Live, an MCP bridge for Ableton, a Mumble client, and a newborn log for iPhone. Alongside those, a crypto reconciliation SaaS and a multi-tenant ERP. Before that, thirteen years at a consulting firm. I built Intranet there, an internal ERP that became the company's system of record (and a licensed product on the side), and grew the engineering team and infrastructure around it.",
  location: "Los Angeles, California",
  email: "alaarab@gmail.com",
  emailHref: "mailto:alaarab@gmail.com",
  linkedinHref: "https://www.linkedin.com/in/ala-arab-a995b155/",
  availability: "Open to selected consulting.",
};

export const quickStats: QuickStat[] = [
  { label: "Based in", value: "Los Angeles, CA" },
  { label: "Focus", value: "Web products and internal tools" },
  { label: "Stack", value: "TypeScript, Python, React, Bun" },
];

export const projects: Project[] = [
  {
    slug: "phren",
    accent: "#7c3aed",
    title: "Phren",
    category: "Open source",
    status: "Active",
    year: "2026",
    summary:
      "Persistent memory for AI coding agents. Findings, tasks, and patterns stay as markdown in a git repo you own, and you can browse the same store from a terminal shell, a 3D web graph, VS Code, or an iPhone.",
    outcome:
      "Findings, tasks, and context persist as markdown across sessions, projects, and machines, and reload automatically.",
    problem:
      "AI coding agents lose everything between sessions, so the same context has to be rebuilt over and over.",
    build:
      "I built it as a TypeScript monorepo: an MCP server that exposes ten tools by default (an admin tool reaches the other fifty by name, so the schema stays small), a CLI, and hooks that capture findings and tasks into plain markdown. No database, no vendor lock-in. Findings have a lifecycle (supersede, retract, contradict) and trust that decays over time, and a fragment graph links concepts across projects. The store has seven front ends on top of the same files: a full-screen terminal shell, a braille-canvas terminal graph that lights up as agents read and write, a 3D web viewer, a VS Code extension, a SwiftUI iOS app with widgets and Siri intents, and Herdr and Omarchy plugins.",
    impact:
      "It works across Claude, Copilot, Cursor, and Codex, installs as a Claude Code plugin, syncs shared stores over git, and reloads cleanly on a new machine with a single init command.",
    stack: ["TypeScript", "MCP", "SwiftUI", "Node.js"],
    metrics: [
      "10 MCP tools by default, 61 in full",
      "7 surfaces: shell, graph, web, VS Code, iOS",
      "Claude / Copilot / Cursor / Codex",
    ],
    thread: "Agent tooling",
    quote: "Agents lose context between sessions. Phren keeps it in a git repo you own.",
    links: [
      { label: "Project page", href: "/projects/phren" },
      { label: "GitHub", href: "https://github.com/alaarab/phren" },
      { label: "Docs", href: "https://alaarab.github.io/phren/" },
    ],
    featured: true,
  },
  {
    slug: "ogrid",
    accent: "#217346",
    title: "OGrid",
    category: "Open source",
    status: "Active",
    year: "2026",
    summary:
      "A React data grid with spreadsheet features built in: sorting, filtering, pagination, cell editing, range selection, copy/paste, and the fill handle. Drop in the component, or compose the hooks onto your own table.",
    outcome:
      "Teams get real spreadsheet interactions on the UI library they already use, without adopting a heavy grid framework.",
    problem:
      "Most data grids force you into their styling and component model just to get spreadsheet-style editing.",
    build:
      "A Turborepo monorepo with a shared core grid model, a React layer, and Radix and Fluent UI adapters, plus xlsx import/export packages and an MCP server that lets AI editors search the docs and drive live grid instances in a running app. The earlier vanilla JS, Material, Angular, and Vue variants are frozen on a legacy branch.",
    impact:
      "It ships as MIT-licensed npm packages with documentation, an AG Grid migration guide, and a Discord community.",
    stack: ["React", "TypeScript", "Radix", "Fluent UI", "MCP"],
    metrics: [
      "Component or hooks",
      "Radix / Fluent adapters",
      "MCP docs + testing bridge",
    ],
    links: [
      { label: "Project page", href: "/projects/ogrid" },
      { label: "GitHub", href: "https://github.com/alaarab/ogrid" },
      { label: "Docs", href: "https://alaarab.github.io/ogrid/" },
    ],
    featured: true,
  },
  {
    slug: "m4l-builder",
    accent: "#b45309",
    title: "m4l-builder",
    category: "Open source",
    status: "Active",
    year: "2026",
    summary:
      "Max for Live devices written in Python instead of clicked together in a GUI. Pure standard library, ships to PyPI.",
    outcome:
      "Audio devices become scriptable, reproducible, and version-controllable instead of being trapped in a visual editor.",
    problem:
      "Building Max for Live devices means clicking around a GUI, which makes the work hard to version, review, or reproduce.",
    build:
      "Pure-stdlib Python library that emits valid .amxd files: 100+ DSP blocks, a theme system, jsui visual engines, a recipe layer for common combos, and a reverse-engineering pipeline that reads existing devices back into Python.",
    impact:
      "Ships on PyPI with a test suite that asserts the produced .amxd files actually load in Ableton, and a corpus-mining toolchain that turns external devices into structured fixture data.",
    stack: ["Python", "Max for Live", "Audio DSP", "PyPI"],
    metrics: [
      "100+ DSP blocks",
      "Tests assert audio behavior",
      "Reverse-engineering pipeline",
    ],
    thread: "Music tooling",
    quote:
      "Write scripts, emit .amxd files straight to your Ableton User Library. No Max GUI required.",
    links: [
      { label: "Project page", href: "/projects/m4l-builder" },
      { label: "PyPI", href: "https://pypi.org/project/m4l-builder/" },
    ],
    featured: true,
  },
  {
    slug: "livemcp",
    accent: "#0ea5e9",
    title: "LiveMCP",
    category: "Open source",
    status: "Active",
    year: "2026",
    summary:
      "An MCP bridge for Ableton Live. Controller-first interface for transport, views, tracks, clips, devices, and the mixer, plus stable read resources for current state.",
    outcome:
      "An agent can investigate a Live set or drive a session without the operator clicking through Ableton's UI.",
    problem:
      "Ableton's Live API is reachable from Python but stitching together the right calls for even simple controller tasks is a project in itself.",
    build:
      "Python FastMCP server talking to a bundled MIDI Remote Script over a local TCP bridge, with a second bridge into Max for Live patcher internals. Read/write split keeps Live from being mutated off the main thread.",
    impact:
      "Runs on macOS, Windows, and WSL, ships with packaged install/restart helpers, and includes an offline local-docs sync for Ableton and Cycling '74 references.",
    stack: ["Python", "MCP", "Ableton Live", "FastMCP"],
    metrics: [
      "220 tools",
      "Tools + live:// / max:// / docs:// resources",
      "macOS / Windows / WSL",
    ],
    thread: "Music tooling",
    quote:
      "Tools are for actions. Resources are for inspection. LiveMCP turns Ableton Live into an MCP-accessible control surface.",
    links: [
      { label: "Project page", href: "/projects/livemcp" },
      { label: "GitHub", href: "https://github.com/alaarab/livemcp" },
    ],
    featured: true,
  },
  {
    slug: "intrapath",
    accent: "#f43f5e",
    title: "Intrapath",
    category: "Current",
    status: "In active development",
    year: "2026",
    summary:
      "Rewrite of the project-based ERP I built and ran at ADM for a decade, this time as a multi-tenant SaaS: projects, timesheets, invoicing, expenses, HR, and reporting on Bun and React.",
    outcome:
      "A project-based ERP with the workflow modeled into the data layer from day one, and self-service orgs with per-seat billing on top.",
    problem:
      "After ten-plus years running the original Intranet on Ruby on Rails, I learned a lot about what fit a project-based business and what was a compromise that calcified. Time to start fresh, with the workflow modeled right from the data layer up.",
    build:
      "Bun + Hono API over Drizzle and Postgres, React 19 with TanStack Query on the front. Every module is composed from a set of arc primitives: base models, fail-closed authorization policies, approval-workflow state machines, CRUD and workflow hooks, and shared UI components. Signup, org creation, member invitations, and Stripe per-seat billing are built in.",
    impact:
      "Active development. No public release yet.",
    stack: ["Bun", "Hono", "Drizzle", "Postgres", "React 19", "Stripe"],
    metrics: [
      "Successor to Intranet",
      "Multi-tenant, per-seat billing",
      "Fail-closed authorization",
    ],
    links: [{ label: "Project page", href: "/projects/intrapath" }],
    featured: true,
  },
  {
    slug: "atlas",
    accent: "#2ab8a8",
    title: "Atlas",
    category: "Open source",
    status: "Stable",
    year: "2026",
    summary:
      "Multi-tenant ticketing on Bun, Hono, and Postgres, with a local-first desktop frontend that mirrors every ticket to disk as markdown and an MCP server, so the same queue lives in the browser, your editor, and your agents.",
    outcome:
      "Service management runs in the browser, while the same tickets become a corpus your editor and your agents can both read.",
    problem:
      "Most ITSM tools lock everything behind a browser SPA: no local files, no way to grep a queue, and nothing an AI tool can investigate without a half-dozen round trips.",
    build:
      "A monorepo in four pieces. A multi-tenant API on Bun + Hono + Postgres with auth, orgs, tickets, actions, tags, attachments, full-text search, and inbound email, scoped by org from the session rather than the URL. A web SPA with dashboard, list, tile, and D3 graph views. A local-first desktop daemon that mirrors tickets to ~/.atlas as markdown. And an MCP server that lets any AI coding tool investigate a ticket in one call.",
    impact:
      "Pluggable storage (filesystem or S3) and email (console, file, Postmark), hashed bearer tokens, and a CI pipeline with a sigstore-signed release flow, CycloneDX SBOM, and CodeQL.",
    stack: ["Bun", "Hono", "Postgres", "D3", "MCP"],
    metrics: [
      "26 MCP tools",
      "Multi-tenant by org, never by URL",
      "Markdown mirror on disk",
    ],
    thread: "Agent tooling",
    quote:
      "A full ITSM in the browser, with the same tickets as real Markdown on disk, so your editor gets a folder and your AI gets a corpus.",
    links: [{ label: "Project page", href: "/projects/atlas" }],
    featured: true,
  },
  {
    slug: "basis",
    accent: "#0f766e",
    title: "Basis",
    category: "Current",
    status: "In active development",
    year: "2026",
    summary:
      "Crypto reconciliation SaaS. Wallet history across fourteen chains, read-only exchange sync, statement imports, and traceable FIFO worksheets you can audit line by line.",
    outcome:
      "Every number on a draft tax worksheet traces back to a lot, a source row, and a reviewed decision. Nothing is silently zeroed.",
    problem:
      "Crypto tax tools guess. Missing cost basis becomes zero, transfers between your own wallets become sales, and there is no way to see why a figure is what it is.",
    build:
      "Hono on Node with a persistent SQLite database. Wallet readers for Bitcoin, XRP Ledger, Solana, and the EVM chains (Ethereum, Base, Arbitrum, Optimism, Polygon, BNB, Avalanche, HyperEVM, and more), read-only connectors for Kraken, Binance, Coinbase Exchange, and Gemini with server-encrypted keys, importers for the major exchange statement formats, and an exact-decimal, account-specific FIFO engine with missing-basis propagation and grouped undo. Solana memecoin routes, native staking, Aave and Uniswap v3 positions, and Hyperliquid perps each get their own reviewed accounting.",
    impact:
      "Private beta. Coverage is tracked as a 126-item parity backlog with acceptance criteria, worked example worksheets, and a documented limit for every connector.",
    stack: ["TypeScript", "Hono", "SQLite", "Node.js"],
    metrics: [
      "14 chain readers",
      "4 exchange connections + CSV/JSON imports",
      "Traceable FIFO lots",
    ],
    thread: "Crypto",
    quote:
      "Blank USD values stay unresolved; they are never silently assigned a zero cost.",
    links: [{ label: "Project page", href: "/projects/basis" }],
    featured: true,
  },
  {
    slug: "mina",
    accent: "#ec4899",
    title: "Mina",
    category: "Open source",
    status: "Shipped",
    year: "2026",
    summary:
      "A newborn log for two phones. Feeds, diapers, and sleep logged by tap, widget, or Siri, shared through iCloud so both parents see the same log.",
    outcome:
      "Two tired parents get one shared log, a feed alarm, and a handoff for the nights, with nothing leaving their phones.",
    problem:
      "Baby-tracking apps want accounts, subscriptions, and a server holding your newborn's data. I wanted one that was free, private, and fast enough to use one-handed at 3 AM.",
    build:
      "SwiftUI on iPhone and iPad with CloudKit sharing, Home Screen and lock-screen widgets through an App Group, Siri intents, partner alerts that batch and rate-limit themselves, a calendar and searchable history, an age-based guide, and an on-device Ask that answers questions about the log without a network call.",
    impact:
      "Built for my own daughter. Free, open source, no accounts, no servers.",
    stack: ["Swift", "SwiftUI", "CloudKit", "WidgetKit"],
    metrics: [
      "iPhone + iPad",
      "iCloud sharing between phones",
      "On-device Ask, no servers",
    ],
    thread: "iOS",
    quote: "Free, open source, no accounts, no servers.",
    links: [
      { label: "Project page", href: "/projects/mina" },
      { label: "GitHub", href: "https://github.com/alaarab/mina" },
      { label: "Website", href: "https://alaarab.github.io/mina/" },
    ],
    featured: true,
  },
  {
    slug: "mutter",
    accent: "#6366f1",
    title: "Mutter",
    category: "Open source",
    status: "Active",
    year: "2026",
    summary:
      "A Mumble client for desktop, Mac, iOS, Android, and the web. Join a server, see who is around, and talk.",
    outcome:
      "One voice-chat client with a consistent design across every platform, connecting to the Mumble servers people already run.",
    problem:
      "Mumble is a great protocol with a dated, fragmented client story, especially on phones.",
    build:
      "A shared web client that runs in the browser (through a local Node bridge) and in Electron, plus native SwiftUI and Jetpack Compose apps with their own Mumble protocol implementations. Push-to-talk, voice activation, per-user volume, text and image messages, and a screen and camera sharing extension. Themes and fonts are generated from one shared design source.",
    impact:
      "Connects to regular Mumble servers on every platform; screen sharing is a Mutter extension so viewers need Mutter too.",
    stack: ["TypeScript", "Electron", "SwiftUI", "Jetpack Compose"],
    metrics: [
      "5 platforms",
      "Screen + camera sharing",
      "One shared design source",
    ],
    links: [
      { label: "Project page", href: "/projects/mutter" },
      { label: "GitHub", href: "https://github.com/alaarab/mutter" },
      { label: "Docs", href: "https://alaarab.github.io/mutter/" },
    ],
    featured: false,
  },
  {
    slug: "intranet-erp",
    title: "Intranet ERP",
    category: "Flagship product",
    status: "Primary company ERP for a decade",
    year: "2013 to 2023",
    summary:
      "The project-based ERP I built and grew into ADM Associates' system of record, then licensed to outside clients.",
    outcome:
      "One platform for project management, budgeting, accounting, and workflows that replaced Deltek Vision across the company.",
    problem:
      "The company ran on Deltek Vision and a legacy VB.NET application that never fit how a project-based consulting firm actually works.",
    build:
      "I started Intranet shortly after joining and owned it for the next ten years as it grew from a small app into a full ERP. The engineering team, the CI/CD pipeline, and the infrastructure all grew up around it.",
    impact:
      "It became the primary ERP of the company and a product in its own right, run internally and sold to clients.",
    stack: ["Ruby on Rails", "PostgreSQL", "MS SQL", "Docker", "GitHub Actions"],
    metrics: [
      "~82 tables, ~50 controllers",
      "Replaced Deltek Vision company-wide",
      "Licensed to outside clients",
    ],
    links: [{ label: "Project page", href: "/projects/intranet-erp" }],
    featured: true,
  },
  {
    slug: "emv",
    accent: "#84cc16",
    title: "EMV",
    category: "Legacy case study",
    status: "Shipped at ADM",
    year: "2014 to 2025",
    summary:
      "An internal MongoDB-backed app built at ADM Associates for a workflow that fit a document store better than a relational one. Sister system to Intranet.",
    outcome:
      "Covered internal workflows that fit a document store better than Intranet's relational model.",
    problem:
      "Not every workflow at ADM mapped cleanly onto the relational data model behind Intranet. Some fit a document store better.",
    build:
      "Node.js on MongoDB.",
    impact:
      "Ran internally at ADM as one of the apps that made up the day-to-day software stack.",
    stack: ["MongoDB", "Node.js"],
    links: [{ label: "Project page", href: "/projects/emv" }],
    featured: false,
  },
  {
    slug: "equipment-tracker",
    accent: "#06b6d4",
    title: "Equipment Tracker",
    category: "Legacy case study",
    status: "Shipped at ADM",
    year: "2018 to 2025",
    summary:
      "An internal app for tracking equipment, on PostgreSQL and Node. Built at ADM Associates as part of the operations toolkit alongside Intranet.",
    outcome:
      "Equipment records lived in one place instead of across spreadsheets and people's heads.",
    problem:
      "Field and lab equipment got tracked in whatever the previous owner happened to be using, which was usually a spreadsheet.",
    build:
      "Node service on PostgreSQL with an internal UI for the operations side.",
    impact:
      "Used across the operations side of the company as part of the broader app suite.",
    stack: ["PostgreSQL", "Node.js"],
    links: [{ label: "Project page", href: "/projects/equipment-tracker" }],
    featured: false,
  },
  {
    slug: "alphalens",
    accent: "#f59e0b",
    title: "AlphaLens",
    category: "Product",
    status: "Active",
    year: "2025 to present",
    summary:
      "Crypto and stock alpha in your Discord: real-time charts, contract lookups, and trending-token alerts, with a marketing site and a server-owner dashboard.",
    outcome:
      "Trading servers get chart and contract context inline, and server owners get a dashboard and a Pro tier without leaving the ecosystem.",
    problem:
      "Existing bots either lock features behind subscriptions or stop short of the cross-network coverage active trading rooms actually use.",
    build:
      "Bun + TypeScript monorepo: a discord.js bot with slash commands, a token monitor, and a payment monitor, plus a Hono site with React SSR for the dashboard and a Pro-gated trenches view. Both share one SQLite file. Every asset class has a keyless default provider (CoinGecko, GeckoTerminal, Yahoo Finance) and an optional keyed one.",
    impact:
      "Stocks work with no setup; keys only unlock premium sources. Runs in production alongside the dashboard.",
    stack: ["Bun", "TypeScript", "discord.js", "Hono", "SQLite"],
    metrics: [
      "Crypto + stocks",
      "Keyless defaults per asset class",
      "Dashboard + Pro tier",
    ],
    links: [
      { label: "Project page", href: "/projects/alphalens" },
    ],
    featured: false,
  },
  {
    slug: "garden-sensor-network",
    title: "Garden Sensor Network",
    category: "Legacy case study",
    status: "Shipped",
    year: "2011",
    summary:
      "A web interface for a learning-center garden wired up with light, temperature, and moisture sensors. Built at UCSD with a cross-discipline engineering team.",
    outcome:
      "Sensor data became something the Learning Center staff could actually read, and use to decide how to take care of their plants.",
    problem:
      "Sensors were streaming readings as JSON, but no one at the center had a way to see them in context.",
    build:
      "Designed and implemented the web UI on top of the incoming JSON stream. Collaborated with computer science, electrical, and mechanical engineers on the surrounding hardware-software stack, and extended a Processing-based UCSD Music Video Game in the same program.",
    impact:
      "Turned a raw JSON sensor stream into a readable interface non-technical staff could act on. Built as part of UCSD TIES at the Town and Country Learning Center.",
    stack: ["JSON", "Web UI", "Processing", "Sensor data"],
    links: [{ label: "Project page", href: "/projects/garden-sensor-network" }],
    featured: false,
  },
  {
    slug: "retrofit-program-data-tools",
    title: "Retrofit Program Data Tools",
    category: "Client work",
    status: "Shipped",
    year: "2012 to 2013",
    summary:
      "Web applications, iPad data-entry tools, and migration tooling for a retrofit program based in Maryland. Built at Matrix Energy Services.",
    outcome:
      "Field crews could capture and move data between disconnected systems without exporting through Excel by hand.",
    problem:
      "The retrofit program ran on a mix of legacy systems and spreadsheets, with no clean path from the field back into the database.",
    build:
      "Led web application development alongside the project managers. Built iPad apps for field capture, Ruby on Rails services on the backend, and Excel-based migrators for the data already in flight. Wrote and ran the test procedures, and redeveloped the company website in the same window.",
    impact:
      "Gave field crews a clean path from capture to database across otherwise disconnected systems.",
    stack: ["Ruby on Rails", "iPad apps", "Excel", "Web applications"],
    links: [
      { label: "Project page", href: "/projects/retrofit-program-data-tools" },
    ],
    featured: false,
  },
];

export const featuredProjects: Project[] = projects.filter(
  (project) => project.featured,
);

export type NowItem = {
  heading: string;
  body: string;
};

/**
 * What I'm focused on this season: a /now page in the spirit of
 * nownownow.com. Refresh whenever the focus actually shifts.
 */
export const nowMeta = {
  asOf: "September 2026",
  intro:
    "What I'm actively working on right now. Updated when the focus actually changes.",
};

export const nowItems: NowItem[] = [
  {
    heading: "Systems Software Architect at Qualus Corp",
    body: "Day job. Database management systems for client portfolios, plus the internal tools that move data across the company: CRM through APIs into Power BI and Tableau. Lots of Node, React, and Angular.",
  },
  {
    heading: "Basis, a crypto reconciliation SaaS",
    body: "Wallet readers, exchange connectors, and a FIFO engine where every figure traces back to a source row. Working through a 126-item parity backlog, deepest on Hyperliquid, Solana, and the major exchanges.",
  },
  {
    heading: "Rebuilding the ERP as a SaaS",
    body: "Intrapath is the rewrite of the project-based ERP I ran at ADM for a decade: Bun, Hono, Postgres, React 19, multi-tenant with per-seat billing, every module composed from the same authorization and workflow primitives.",
  },
  {
    heading: "Phren, everywhere the store is",
    body: "Memory layer for coding agents. The retrieval ranker is in a place I trust on my own repos; now it's the surfaces: the terminal graph, the iOS app, the VS Code extension, and shared stores syncing over git.",
  },
  {
    heading: "Building for the phone",
    body: "Mina (a newborn log for my daughter), Mutter (a Mumble client), and the Phren iOS app all shipped this year in SwiftUI. Turns out I like native iOS.",
  },
  {
    heading: "Music tooling for myself first",
    body: "I produce electronic music in Ableton, and got tired of waiting for the tools to exist. LiveMCP and m4l-builder both started that way. Still going in that spirit. Only the features I'd actually use in a session.",
  },
];

export const experienceItems: ExperienceItem[] = [
  {
    company: "Qualus Corp",
    role: "Systems Software Architect",
    years: "2025 to present",
    location: "Los Angeles, CA",
    summary:
      "Architecting database management systems for client portfolios, plus the internal tools and automation that move data across the company: CRM through APIs into Power BI and Tableau reporting. Stack is Node, React, and Angular sitting on top of the databases.",
  },
  {
    company: "ADM Associates, Inc.",
    role: "IT Engineer, then Systems Software Engineer",
    years: "2012 to 2025",
    location: "Sacramento, CA",
    summary:
      "Thirteen years, starting in IT and moving into systems software. Built and ran a stack of internal apps: Intranet (the project-based ERP that replaced Deltek Vision, on PostgreSQL + Rails), EMV (MongoDB), and an Equipment Tracker (PostgreSQL + Node), plus most of the company's web presence. Stood up the data science infrastructure so analysts could deploy R workloads to R Server and ship Shiny apps. Ran the Linux fleet, the multi-database backend (MongoDB, PostgreSQL, MySQL, MS SQL), and the SOC 2 environment underneath all of it. Helped grow the engineering team and stood up CI/CD on GitHub Actions.",
  },
  {
    company: "Greater Sacramento Pediatrics Association",
    role: "IT Consultant",
    years: "2019",
    location: "Sacramento, CA",
    summary:
      "Proposed and implemented system enhancements while documenting existing and new processes for the IT support team. Migrated the domain and email to Office 365 and ran the server fleet in a VMware environment.",
  },
  {
    company: "Matrix Energy Services, Inc.",
    role: "IT Engineer",
    years: "2012 to 2013",
    location: "Sacramento, CA",
    summary:
      "Worked alongside project managers to lead web application development for a retrofit program in Maryland. Built iPad apps, Ruby on Rails services, and Excel-based tooling for migrating data between systems and databases. Wrote and ran the test procedures, and redeveloped the company website.",
  },
  {
    company: "UC San Diego TIES, Town and Country Learning Center",
    role: "Computer Science Developer",
    years: "2011",
    location: "San Diego, CA",
    summary:
      "Designed and built the web interface for a Garden Sensor Network that turned incoming JSON sensor readings (light, temperature, moisture) into something the Learning Center could actually act on. Also extended a UCSD Music Video Game written in Processing. Worked across CS, electrical, and mechanical engineering teams to bring inventive ideas into the center.",
  },
  {
    company: "Dell",
    role: "Campus Marketing, Advertising, and Technical Support",
    years: "2008 to 2009",
    location: "Santa Cruz, CA",
    summary:
      "Dell's on-campus presence at UC Santa Cruz. Provided technical support to students and parents on the Dell product line with a sales goal, and ran on-campus marketing strategies with a partner.",
  },
];

export const educationItems: EducationItem[] = [
  {
    school: "University of California, San Diego",
    detail: "B.S. in Computer Science · graduated December 2011",
    years: "2008 to 2011",
  },
  {
    school: "University of California, Santa Cruz",
    detail: "Computer Science and Engineering",
    years: "2006 to 2008",
  },
];

export const contactLinks: ActionLink[] = [
  { label: "Email", href: "mailto:alaarab@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ala-arab-a995b155/" },
  { label: "Resume", href: "/resume" },
];
