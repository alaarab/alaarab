/**
 * Real screenshots of the real products, keyed by slug. Projects not listed
 * here have no visual and render text only; never draw a stand-in.
 */
import atlasShell from "./assets/atlas-shell.jpg";
import atlasWeb from "./assets/atlas-web-copilot.jpg";
import m4lDesign from "./assets/m4l-linear-phase-eq-design.svg";
import m4lEq from "./assets/m4l-linear-phase-eq.jpg";
import minaCalendar from "./assets/mina-calendar.jpg";
import minaTodayImg from "./assets/mina-today.jpg";
import minaTrends from "./assets/mina-trends.jpg";
import minaTrailer from "./assets/mina-trailer.mp4";
import minaTrailerPoster from "./assets/mina-trailer-poster.jpg";
import mutterDesktop from "./assets/mutter-desktop-session.jpg";
import phrenGraph from "./assets/phren-webui-graph.jpg";
import phrenShellGraph from "./assets/phren-shell-graph.jpg";
import phrenTasks from "./assets/phren-shell-tasks.jpg";
import phrenSplash from "./assets/phren-splash.mp4";
import phrenSplashPoster from "./assets/phren-splash-poster.jpg";

export interface Shot {
  src: string;
  alt: string;
  caption: string;
  w: number;
  h: number;
  phone?: boolean;
}

/** A step in an explainer: a real screenshot, a caption, and optionally a ring
 *  around the part being described (percentages of the image). */
export interface Step extends Shot {
  ring?: { x: number; y: number; w: number; h: number };
}

export interface Video {
  src: string;
  poster: string;
  w: number;
  h: number;
  caption: string;
  label: string;
  phone?: boolean;
}

/** What sits beside each explanation on the project page. */
export type Media = { shot: Shot } | { steps: Step[] } | { video: Video };

export interface Visuals {
  /** Shown small on the home page and large at the top of the project page. */
  hero: Shot[];
  /** Real media paired with the problem, build and impact explanations. */
  pairs?: Partial<Record<"problem" | "build" | "impact", Media>>;
}

const phrenGraphShot: Shot = {
  src: phrenGraph,
  w: 1400,
  h: 875,
  alt: "Phren's 3D web viewer: projects drawn as glowing clusters of findings, with a project panel on the left and its findings list on the right.",
  caption: "The 3D web viewer. Each cluster is a project; each point is a finding.",
};

const minaToday: Shot = {
  src: minaTodayImg,
  w: 560,
  h: 1216,
  phone: true,
  alt: "Mina's Today screen: the last feed, the next feed estimate, current sleep, today's totals, and large buttons for bottle, nurse, diaper and sleep.",
  caption: "Today: the last feed, the next one, and big buttons for one hand.",
};

const atlasShellShot: Shot = {
  src: atlasShell,
  w: 1120,
  h: 760,
  alt: "Atlas's local terminal shell: a queue of six tickets on the left and the selected ticket's fields and details on the right.",
  caption: "The local shell, reading the queue from markdown on disk.",
};

export const visuals: Record<string, Visuals> = {
  phren: {
    hero: [phrenGraphShot],
    pairs: {
      build: {
        steps: [
          {
            src: phrenShellGraph,
            w: 1130,
            h: 680,
            alt: "Phren's terminal shell showing a braille-drawn graph of projects around a selected fragment, RetryPolicy, with its links listed at the side.",
            caption: "In the terminal, pick a fragment and see every project that links to it.",
            ring: { x: 28, y: 36, w: 34, h: 22 },
          },
          {
            src: phrenTasks,
            w: 1130,
            h: 680,
            alt: "Phren's terminal shell on the Tasks tab, listing active, queued and done tasks for a project.",
            caption: "Tasks for each project, kept as plain markdown: active, queue, done.",
            ring: { x: 1, y: 11, w: 50, h: 16 },
          },
          {
            ...phrenGraphShot,
            caption: "The same store in the browser, as a graph you can move through.",
            ring: { x: 35, y: 36, w: 24, h: 34 },
          },
        ],
      },
      impact: {
        video: {
          src: phrenSplash,
          poster: phrenSplashPoster,
          w: 916,
          h: 440,
          label: "The Phren shell starting up: the name assembles itself and the prompt reads Press any key to enter.",
          caption: "The shell starting up.",
        },
      },
    },
  },
  "m4l-builder": {
    hero: [
      {
        src: m4lEq,
        w: 756,
        h: 189,
        alt: "The Linear Phase EQ device running in Ableton Live: a flat EQ curve with a red peak node at 1 kHz and a pink high-cut node near 12 kHz, over a post-analyzer grid.",
        caption: "The Linear Phase EQ device from m4l-builder, running in Ableton Live.",
      },
    ],
    pairs: {
      build: {
        shot: {
          src: m4lDesign,
          w: 920,
          h: 520,
          alt: "Interface design for the Linear-Phase EQ: processing, analyzer and range selectors across the top, a curve with one selected node, and band controls below.",
          caption: "The EQ's interface design, from the project docs.",
        },
      },
    },
  },
  mina: {
    hero: [minaToday],
    pairs: {
      build: {
        steps: [
          { ...minaToday, caption: "Log a feed, a diaper or sleep with one tap.", ring: { x: 3, y: 42, w: 94, h: 22 } },
          {
            src: minaCalendar,
            w: 560,
            h: 1216,
            phone: true,
            alt: "Mina's Calendar screen: a month view with a dot per logged event, and today's entries listed below.",
            caption: "Every day on a calendar, with the entries under it.",
            ring: { x: 3, y: 17, w: 94, h: 26 },
          },
          {
            src: minaTrends,
            w: 560,
            h: 1216,
            phone: true,
            alt: "Mina's Trends screen: seven-day averages for feeds, diapers and sleep, with bar charts of bottle ounces and sleep hours per day.",
            caption: "Trends over the last week: feeds, sleep and diapers.",
            ring: { x: 3, y: 24, w: 94, h: 19 },
          },
        ],
      },
      impact: {
        video: {
          src: minaTrailer,
          poster: minaTrailerPoster,
          w: 406,
          h: 720,
          phone: true,
          label: "A short silent tour of Mina: the Today screen, logging a bottle, the calendar, trends, the guide and settings.",
          caption: "A short tour of the app.",
        },
      },
    },
  },
  atlas: {
    hero: [atlasShellShot],
    pairs: {
      build: {
        steps: [
          { ...atlasShellShot, caption: "In the terminal: the queue on the left, from markdown files on disk.", ring: { x: 2, y: 20, w: 44, h: 14 } },
          { ...atlasShellShot, caption: "The selected ticket's fields and details, beside it.", ring: { x: 47, y: 20, w: 51, h: 38 } },
          {
            src: atlasWeb,
            w: 1440,
            h: 900,
            alt: "Atlas in the browser with demo data: a ticket list on the left and the ticket copilot on the right, showing its plan and the evidence it used.",
            caption: "In the browser, the ticket copilot investigates a ticket and shows its evidence (demo data).",
            ring: { x: 53, y: 9, w: 46, h: 60 },
          },
        ],
      },
    },
  },
  mutter: {
    hero: [
      {
        src: mutterDesktop,
        w: 1280,
        h: 800,
        alt: "Mutter on the desktop: a server's channels and who is in them on the left, the channel's chat in the middle, and members on the right.",
        caption: "A desktop session: channels, who is around, and the chat.",
      },
    ],
  },
};
