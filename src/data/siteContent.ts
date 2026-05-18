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
    "Full-stack developer building useful web products and internal tools.",
  intro: "I build software that is clear, reliable, and practical.",
  summary:
    "My background spans product-minded frontend work, backend systems, and the operational layer around shipping software well.",
  location: "Sacramento, California",
  email: "alaarab@gmail.com",
  emailHref: "mailto:alaarab@gmail.com",
  linkedinHref: "https://www.linkedin.com/in/ala-arab-a995b155/",
  availability:
    "Available for product work, internal tooling, and selected consulting.",
};

export const quickStats: QuickStat[] = [
  { label: "Based in", value: "Sacramento, CA" },
  { label: "Focus", value: "Web products and internal tools" },
  { label: "Approach", value: "Clear, reliable, practical" },
];

export const projects: Project[] = [
  {
    slug: "portfolio-refresh",
    title: "Portfolio Refresh",
    category: "Current",
    status: "In progress",
    year: "2026",
    summary: "A rebuild of this site into a cleaner, project-led portfolio.",
    outcome:
      "A shorter structure, cleaner visual system, and a better place to add real project work.",
    problem: "The old site felt dated and made it awkward to add new work.",
    build:
      "I rebuilt it around concise sections, reusable project data, and simple case-study pages.",
    impact: "The portfolio now feels current and is easier to maintain.",
    stack: ["Bun", "React", "TypeScript", "Content-first structure"],
    links: [
      { label: "Project page", href: "/projects/portfolio-refresh" },
      { label: "Resume page", href: "/resume" },
    ],
    featured: true,
  },
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
      "A Python library for building Max for Live (.amxd) devices in code, no Max GUI required.",
    outcome:
      "Audio devices become scriptable, reproducible, and version-controllable instead of being trapped in a visual editor.",
    problem:
      "Building Max for Live devices means clicking around a GUI, which makes the work hard to version, review, or reproduce.",
    build:
      "I built a pure-stdlib Python library that emits valid .amxd files, with modules for UI, DSP, jsui visual engines, and a theme system.",
    impact:
      "It ships on PyPI with 880+ tests and a set of example plugins covering filters, compressors, delays, and saturation.",
    stack: ["Python", "Max for Live", "Audio DSP", "PyPI"],
    links: [
      { label: "Project page", href: "/projects/m4l-builder" },
      { label: "GitHub", href: "https://github.com/alaarab/m4l-builder" },
      { label: "PyPI", href: "https://pypi.org/project/m4l-builder/" },
    ],
    featured: true,
  },
  {
    slug: "garden-sensor-network",
    title: "Garden Sensor Network",
    category: "Legacy case study",
    status: "Shipped",
    year: "2011",
    summary:
      "A web interface for live sensor data used by a learning center.",
    outcome:
      "Turned raw readings into something non-technical users could act on.",
    problem:
      "The team needed a clearer view of light, temperature, and moisture data.",
    build:
      "I designed and built a page that surfaced incoming JSON sensor data in a usable way.",
    impact:
      "It was an early example of a pattern I still value: making technical information useful to real people.",
    stack: ["JSON", "Web UI", "Sensor data"],
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
      "Workflow applications and migration tooling for retrofit program operations.",
    outcome:
      "Helped move data between systems and supported field and program workflows.",
    problem:
      "Teams needed practical software around disconnected systems and messy operational workflows.",
    build:
      "I built migration tools, supported testing, and contributed to the surrounding web application work.",
    impact:
      "The result was better operational flow without pretending the environment was clean or simple.",
    stack: ["Ruby on Rails", "Excel", "iPad workflows", "Web applications"],
    links: [
      { label: "Project page", href: "/projects/retrofit-program-data-tools" },
    ],
    featured: false,
  },
  {
    slug: "internal-client-web-platforms",
    title: "Internal and Client Web Platforms",
    category: "Long-term work",
    status: "Delivered over multiple years",
    year: "2012 to 2020",
    summary:
      "Application and infrastructure work across internal tools, client systems, and data-heavy environments.",
    outcome:
      "Supported teams by keeping products and the systems around them useful and dependable.",
    problem:
      "Teams needed reliable applications and supporting infrastructure in environments where stability mattered.",
    build:
      "I designed and maintained web applications while supporting the databases and servers behind them.",
    impact:
      "It was sustained product and systems work rather than a single launch.",
    stack: [
      "Web applications",
      "Databases",
      "Infrastructure",
      "Compliance-minded ops",
    ],
    links: [
      {
        label: "Project page",
        href: "/projects/internal-client-web-platforms",
      },
    ],
    featured: false,
  },
];

export const featuredProjects: Project[] = projects.filter(
  (project) => project.featured,
);

export const experienceItems: ExperienceItem[] = [
  {
    company: "ADM Associates, Inc.",
    role: "Software Engineer",
    years: "2012 to 2020",
    location: "Sacramento, CA",
    summary:
      "Built and maintained web applications while supporting infrastructure and data workflows in a compliance-sensitive environment.",
  },
  {
    company: "Greater Sacramento Pediatrics Association",
    role: "IT Consultant",
    years: "2019",
    location: "Sacramento, CA",
    summary:
      "Improved support processes and handled domain and email migration to Office 365.",
  },
  {
    company: "Matrix Energy Services, Inc.",
    role: "IT Engineer",
    years: "2012 to 2013",
    location: "Sacramento, CA",
    summary:
      "Built tools for retrofit programs, moved data between systems, and supported delivery work.",
  },
  {
    company: "UC San Diego TIES",
    role: "Developer",
    years: "2011",
    location: "San Diego, CA",
    summary:
      "Built educational web interfaces around sensor data and collaborative learning-center projects.",
  },
];

export const educationItems: EducationItem[] = [
  {
    school: "University of California, San Diego",
    detail: "B.S. in Computer Science",
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
