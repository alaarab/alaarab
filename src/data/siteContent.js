export const siteMeta = {
  name: "Ala Arab",
  title:
    "Full-stack developer building useful web products and internal tools.",
  intro:
    "I build software that is clear, reliable, and practical.",
  summary:
    "My background spans product-minded frontend work, backend systems, and the operational layer around shipping software well.",
  location: "Sacramento, California",
  email: "alaarab@gmail.com",
  emailHref: "mailto:alaarab@gmail.com",
  linkedinHref: "https://www.linkedin.com/in/ala-arab-a995b155/",
  availability:
    "Available for product work, internal tooling, and selected consulting.",
};

export const quickStats = [
  { label: "Based in", value: "Sacramento, CA" },
  { label: "Focus", value: "Web products and internal tools" },
  { label: "Approach", value: "Clear, reliable, practical" },
];

export const projects = [
  {
    slug: "portfolio-refresh",
    title: "Portfolio Refresh",
    category: "Current",
    status: "In progress",
    year: "2026",
    summary:
      "A rebuild of this site into a cleaner, project-led portfolio.",
    outcome:
      "A shorter structure, cleaner visual system, and a better place to add real project work.",
    problem:
      "The old site felt dated and made it awkward to add new work.",
    build:
      "I rebuilt it around concise sections, reusable project data, and simple case-study pages.",
    impact:
      "The portfolio now feels current and is easier to maintain.",
    stack: ["Next.js", "CSS Modules", "Content-first structure"],
    links: [
      { label: "Project page", href: "/projects/portfolio-refresh" },
      { label: "Resume page", href: "/resume" },
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
    featured: true,
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
    links: [{ label: "Project page", href: "/projects/retrofit-program-data-tools" }],
    featured: true,
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
    stack: ["Web applications", "Databases", "Infrastructure", "Compliance-minded ops"],
    links: [{ label: "Project page", href: "/projects/internal-client-web-platforms" }],
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const experienceItems = [
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

export const educationItems = [
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

export const contactLinks = [
  { label: "Email", href: "mailto:alaarab@gmail.com" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ala-arab-a995b155/",
  },
  { label: "Resume", href: "/resume" },
];
