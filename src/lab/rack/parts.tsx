import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router";
import { contactLinks, siteMeta } from "../../data/siteContent";
import type { Project } from "../../types";
import {
  channel,
  groupOf,
  ledColor,
  ledMode,
  rackPath,
  splitMetric,
  type LedMode,
} from "./rackData";
import styles from "./rack.module.css";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap";

export const MODEL = "AA-26";

export function RackRoot({ children }: { children: ReactNode }) {
  return (
    <div className={styles.root}>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={FONTS} precedence="default" />
      {children}
    </div>
  );
}

export function Led({
  color,
  mode = "on",
  off = false,
  size = "sm",
}: {
  color: string;
  mode?: LedMode;
  off?: boolean;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={styles.led}
      data-mode={off ? "off" : mode}
      data-size={size}
      style={{ "--led": color } as CSSProperties}
      aria-hidden="true"
    />
  );
}

/** Rack ear with two screw heads. Purely decorative. */
export function Ear({ side, label, children }: { side: "l" | "r"; label?: string; children?: ReactNode }) {
  return (
    <div className={styles.ear} data-side={side} aria-hidden="true">
      <span className={styles.screw} />
      {label ? <span className={styles.earLabel}>{label}</span> : null}
      {children}
      <span className={styles.screw} />
    </div>
  );
}

export function NavStrip({ current }: { current: "home" | "project" }) {
  const home = rackPath();
  const items =
    current === "home"
      ? [
          { label: "Rack", to: "#rack" },
          { label: "Log", to: "#log" },
          { label: "Contact", to: "#contact" },
        ]
      : [
          { label: "Rack", to: home },
          { label: "Log", to: `${home}#log` },
          { label: "Contact", to: `${home}#contact` },
        ];
  return (
    <nav className={styles.navStrip} aria-label="Primary">
      <Link to={home} className={styles.navBrand}>
        <span className={styles.navModel}>{MODEL}</span>
        <span className={styles.navName}>{siteMeta.name}</span>
      </Link>
      <ul className={styles.navList}>
        {items.map((item) => (
          <li key={item.label}>
            {item.to.startsWith("#") ? (
              <a href={item.to} className={styles.navKey}>
                {item.label}
              </a>
            ) : (
              <Link to={item.to} className={styles.navKey}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
        <li>
          <a href="/resume" className={styles.navKey}>
            Resume
          </a>
        </li>
        <li>
          <a href="/now" className={styles.navKey}>
            Now
          </a>
        </li>
      </ul>
    </nav>
  );
}

export function Readout({ metric }: { metric: string }) {
  const { value, caption } = splitMetric(metric);
  return (
    <div className={styles.readout}>
      {value ? <span className={styles.readoutValue}>{value}</span> : null}
      <span className={value ? styles.readoutCaption : styles.readoutText}>{caption}</span>
    </div>
  );
}

export function Jacks({ stack, label = "Patch" }: { stack: string[]; label?: string }) {
  return (
    <div className={styles.jackField}>
      <span className={styles.silk}>{label}</span>
      <ul className={styles.jacks}>
        {stack.map((item) => (
          <li key={item} className={styles.jack}>
            <span className={styles.jackHole} aria-hidden="true" />
            <span className={styles.jackLabel}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Compact 1U device used for "next in chain". */
export function MiniDevice({ project }: { project: Project }) {
  const group = groupOf(project);
  return (
    <Link to={rackPath(project.slug)} className={styles.mini}>
      <Ear side="l" />
      <span className={styles.miniPlate}>
        <span className={styles.miniHead}>
          <Led color={ledColor(project)} mode={ledMode(project)} />
          <span className={styles.silk}>CH {channel(project)}</span>
          <span className={styles.silk}>{group.label}</span>
        </span>
        <span className={styles.miniTitle}>{project.title}</span>
        <span className={styles.miniSummary}>{project.summary}</span>
      </span>
      <Ear side="r" />
    </Link>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "plain",
}: {
  href: string;
  children: ReactNode;
  variant?: "plain" | "lit";
}) {
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={styles.hwButton}
      data-variant={variant}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      <span className={styles.hwCap}>
        {children}
        {external ? (
          <span className={styles.hwExt} aria-hidden="true">
            ↗
          </span>
        ) : null}
      </span>
      {external ? <span className={styles.srOnly}> (opens in a new tab)</span> : null}
    </a>
  );
}

export function RackFooter() {
  return (
    <footer className={styles.footer}>
      <span className={styles.silk}>
        {MODEL} · {siteMeta.name} · {siteMeta.location}
      </span>
      <span className={styles.silk}>Design direction A · Device Rack prototype</span>
    </footer>
  );
}

export const contactButtons = [
  ...contactLinks,
  { label: "Now", href: "/now" },
];
