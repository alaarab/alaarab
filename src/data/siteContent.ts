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
    "Full-stack developer building web products and the unglamorous tools that keep them running.",
  intro:
    "I like software that is honest about what it does and stays that way once the demo is over.",
  summary:
    "Most of what I ship now is open source: persistent memory for AI agents, headless spreadsheet hooks, a Python toolchain for Max for Live, an MCP bridge for Ableton, and a local-first ticket explorer. Before that, thirteen years building an internal ERP that became the system of record for a consulting firm and a licensed product on the side.",
  location: "Los Angeles, California",
  email: "alaarab@gmail.com",
  emailHref: "mailto:alaarab@gmail.com",
  linkedinHref: "https://www.linkedin.com/in/ala-arab-a995b155/",
  availability: "Open to selected consulting.",
};

export const quickStats: QuickStat[] = [
  { label: "Based in", value: "Los Angeles, CA" },
  { label: "Focus", value: "Web products and internal tools" },
  { label: "Approach", value: "Honest, reliable, useful past demo day" },
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
      "Persistent memory for AI coding agents. Findings, tasks, and patterns stay as markdown in a git repo you own.",
    outcome:
      "Agents stop forgetting. Context starts flowing automatically across sessions, projects, and machines.",
    problem:
      "AI coding agents lose everything between sessions, so the same context has to be rebuilt over and over.",
    build:
      "I built it as a TypeScript monorepo: an MCP server, a CLI, and hooks that capture findings and tasks into plain markdown. No database, no vendor lock-in.",
    impact:
      "It works across Claude, Copilot, Cursor, and Codex, and reloads cleanly on a new machine with a single init command.",
    stack: ["TypeScript", "MCP", "Turborepo", "Node.js"],
    metrics: [
      "54 MCP tools",
      "FTS5 + semantic fallback",
      "Claude / Copilot / Cursor / Codex",
    ],
    thread: "Agent tooling",
    quote: "Your agents forget everything. Phren doesn't.",
    links: [
      { label: "Project page", href: "/projects/phren" },
      { label: "GitHub", href: "https://github.com/alaarab/phren" },
      { label: "Docs", href: "https://alaarab.github.io/phren/" },
    ],
    featured: true,
  },
  {
    slug: "halo-explorer",
    accent: "#2ab8a8",
    title: "Halo Explorer",
    category: "Open source",
    status: "Stable",
    year: "2026",
    summary:
      "Halo's web UI, but you live in your editor. A local-first CLI and four-view desktop app that pulls every ticket onto disk as markdown, then exposes them to any AI tool through MCP.",
    outcome:
      "Tickets become a corpus your editor and your agents can both read. The browser tab strip stops eating your context.",
    problem:
      "Halo only ships a SPA. Forty open tickets, filters that reset on reload, no way to grep, and nothing an AI tool can investigate without a half-dozen round trips.",
    build:
      "Bun + Hono server, no-bundler ES module frontend, force-directed D3 graph, MCP server with one fan-out tool that returns a full investigation envelope. Loopback-only with a read-only allowlist on the upstream API.",
    impact:
      "Stable since 1.0.0 with a sigstore-signed release pipeline, CycloneDX SBOM, CodeQL, a smell-check workflow that blocks writes outside the allowlist, and an operational /health endpoint.",
    stack: ["Bun", "Hono", "D3", "MCP", "Biome"],
    metrics: [
      "14 typed MCP tools",
      "Loopback-only, read-only allowlist",
      "Sigstore + SBOM releases",
    ],
    thread: "Agent tooling",
    quote:
      "Halo's web UI, but you live in your editor. Files are real Markdown, your editor gets a folder, your AI gets a corpus.",
    links: [
      { label: "Project page", href: "/projects/halo-explorer" },
      { label: "GitHub", href: "https://github.com/alaarab/halo" },
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
      "Spreadsheet behavior for any table. Headless React hooks for inline edit, range select, the fill handle, and copy/paste.",
    outcome:
      "Teams get real spreadsheet interactions on the table chrome they already use, without adopting a heavy grid framework.",
    problem:
      "Most data grids force you into their styling and component model just to get spreadsheet-style editing.",
    build:
      "I built a headless, React-first library as a Turborepo monorepo, with hooks that drop onto shadcn, Material, Fluent, or a plain table, plus a built-in OGrid component.",
    impact:
      "It ships as MIT-licensed npm packages with documentation and an AG Grid migration guide.",
    stack: ["React", "TypeScript", "Headless UI", "npm"],
    metrics: [
      "Headless hooks",
      "Drops onto shadcn / Material / Fluent",
      "MIT licensed",
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
      "Pure-stdlib Python library that emits valid .amxd files: 90+ DSP blocks, a theme system, jsui visual engines, a recipe layer for common combos, and a reverse-engineering pipeline that reads existing devices back into Python.",
    impact:
      "Ships on PyPI with a test suite that asserts the produced .amxd files actually load in Ableton, and a corpus-mining toolchain that turns external devices into structured fixture data.",
    stack: ["Python", "Max for Live", "Audio DSP", "PyPI"],
    metrics: [
      "90+ DSP blocks",
      "880+ tests",
      "Reverse-engineering pipeline",
    ],
    thread: "Music tooling",
    quote:
      "Write scripts, emit .amxd files straight to your Ableton User Library. No Max GUI required.",
    links: [
      { label: "Project page", href: "/projects/m4l-builder" },
      { label: "GitHub", href: "https://github.com/alaarab/m4l-builder" },
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
    slug: "alphalens",
    accent: "#f59e0b",
    title: "AlphaLens",
    category: "Open source",
    status: "Shipped",
    year: "2025",
    summary:
      "A Discord bot for real-time crypto charts, contract lookups, and trending-token alerts across nine networks.",
    outcome:
      "Trading servers get the chart and contract context they want inline, without leaving Discord.",
    problem:
      "Existing bots either lock features behind subscriptions or stop short of the cross-network coverage active trading rooms actually use.",
    build:
      "Node.js bot with slash commands, encrypted per-server settings storage, rotating API keys for the upstream provider, and a monitoring loop that posts trending-token alerts to a watched channel.",
    impact:
      "Runs on PM2 in production, MIT licensed, and covers Solana, Ethereum, BSC, Avalanche, Fantom, Base, Berachain, Sui, and Monad.",
    stack: ["Node.js", "Discord.js", "AES-256", "PM2"],
    metrics: [
      "9 networks",
      "Encrypted per-server settings",
      "PM2 in production",
    ],
    links: [
      { label: "Project page", href: "/projects/alphalens" },
      { label: "GitHub", href: "https://github.com/alaarab/AlphaLens" },
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
      "Sensor data became something the Learning Center staff could actually read — and use to decide how to take care of their plants.",
    problem:
      "Sensors were streaming readings as JSON, but no one at the center had a way to see them in context.",
    build:
      "Designed and implemented the web UI on top of the incoming JSON stream. Collaborated with computer science, electrical, and mechanical engineers on the surrounding hardware-software stack, and extended a Processing-based UCSD Music Video Game in the same program.",
    impact:
      "An early example of a pattern I still value: take technical readings and make them useful to real people. Built as part of UCSD TIES at the Town and Country Learning Center.",
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
      "Cleaner operational flow without pretending the environment was clean or simple — the same instinct that later became Intranet at ADM.",
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
 * What I'm focused on this season — a /now page in the spirit of
 * nownownow.com. Refresh whenever the focus actually shifts.
 */
export const nowMeta = {
  asOf: "May 2026",
  intro:
    "A snapshot of what I'm actually spending hours on right now. Lighter than a roadmap, more honest than a Twitter bio.",
};

export const nowItems: NowItem[] = [
  {
    heading: "Systems Software Architect at Qualus Corp",
    body: "Day job. Architecting internal software systems across the engineering org.",
  },
  {
    heading: "Rebuilding the ERP from scratch",
    body: "Personal rewrite of the project-based ERP I built and ran at ADM for a decade. Same problem space, fresh stack, no legacy baggage.",
  },
  {
    heading: "Shipping Phren past the prototype",
    body: "Memory layer for coding agents. Getting the retrieval ranker to a place where I'd trust it on my own repos before pitching it to anyone else.",
  },
  {
    heading: "Music tooling for myself first",
    body: "LiveMCP and m4l-builder both started because I wanted them. Continuing in that spirit — only adding features I'd actually use in a session.",
  },
];

export const experienceItems: ExperienceItem[] = [
  {
    company: "Qualus Corp",
    role: "Systems Software Architect",
    years: "2025 to present",
    location: "Los Angeles, CA",
    summary:
      "Architecting internal software systems across the engineering org.",
  },
  {
    company: "ADM Associates, Inc.",
    role: "IT Engineer, then Systems Software Engineer",
    years: "2012 to 2025",
    location: "Sacramento, CA",
    summary:
      "Thirteen years here, starting in IT and moving into systems software. Built Intranet, the project-based ERP that became the company's primary system and replaced Deltek Vision. Helped grow the software engineering team, stood up CI/CD on GitHub Actions, and ran SOC 2-compliant Linux servers and on-prem infrastructure alongside the MongoDB, PostgreSQL, MySQL, and MS SQL databases behind it.",
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
    company: "UC San Diego TIES — Town and Country Learning Center",
    role: "Computer Science Developer",
    years: "2011",
    location: "San Diego, CA",
    summary:
      "Designed and built the web interface for a Garden Sensor Network that turned incoming JSON sensor readings — light, temperature, moisture — into something the Learning Center could actually act on. Also extended a UCSD Music Video Game written in Processing. Worked across CS, electrical, and mechanical engineering teams to bring inventive ideas into the center.",
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
