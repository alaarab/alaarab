import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useSearchParams } from "react-router";
import {
  educationItems,
  experienceItems,
  featuredProjects,
  quickStats,
  siteMeta,
} from "../../data/siteContent";
import type { Project } from "../../types";
import { Knob } from "./Knob";
import {
  ButtonLink,
  contactButtons,
  Ear,
  Jacks,
  Led,
  MODEL,
  NavStrip,
  RackFooter,
  RackRoot,
  Readout,
} from "./parts";
import {
  channel,
  groupOf,
  ledColor,
  ledMode,
  rackOrder,
  rackPath,
  threadGroups,
  type ThreadGroup,
} from "./rackData";
import styles from "./rack.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

export function RackHome() {
  const [params, setParams] = useSearchParams();
  // Local state drives the knob so rapid key presses never read a stale URL;
  // the URL just mirrors it for sharing.
  const [index, setIndex] = useState(() =>
    Math.max(0, threadGroups.findIndex((group) => group.key === params.get("thread"))),
  );
  const active = threadGroups[index]!;
  const isPowered = (project: Project) =>
    active.key === "all" || groupOf(project).key === active.key;
  const powered = rackOrder.filter(isPowered);

  const choose = (next: number) => {
    setIndex(next);
    const key = threadGroups[next]!.key;
    setParams(key === "all" ? {} : { thread: key }, { replace: true, preventScrollReset: true });
  };

  const bankA = rackOrder.filter((p) => p.featured);
  const bankB = rackOrder.filter((p) => !p.featured);

  return (
    <RackRoot>
      <a href="#rack" className={styles.skip}>
        Skip to the rack
      </a>
      <div className={styles.case}>
        <NavStrip current="home" />

        <header className={styles.master}>
          <Ear side="l" label="4U" />
          <div className={styles.masterPlate}>
            <div className={styles.masterTop}>
              <span className={styles.silk}>Model {MODEL}</span>
              <span className={styles.silk}>Full-stack instrument · Rev. 2026</span>
              <span className={styles.silk}>{siteMeta.location}</span>
            </div>
            <div className={styles.masterGrid}>
              <div className={styles.masterId}>
                <h1 className={styles.name}>{siteMeta.name}</h1>
                <p className={styles.descriptor}>{siteMeta.title}</p>
                <p className={styles.intro}>{siteMeta.intro}</p>
                <p className={styles.summary}>{siteMeta.summary}</p>
              </div>
              <div className={styles.masterPanel}>
                <div className={styles.power}>
                  <Led color="#e0431b" mode="on" size="lg" />
                  <div>
                    <span className={styles.silk}>Power · Available</span>
                    <p className={styles.powerText}>{siteMeta.availability}</p>
                  </div>
                </div>
                <div className={styles.counters} aria-label="Rack totals">
                  <Counter value={rackOrder.length} label="Devices" />
                  <Counter value={featuredProjects.length} label="Featured" />
                  <Counter value={threadGroups.length - 1} label="Threads" />
                </div>
                <dl className={styles.lcdList}>
                  {quickStats.map((stat) => (
                    <div key={stat.label}>
                      <dt>{stat.label}</dt>
                      <dd>{stat.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className={styles.buttonRow}>
                  {contactButtons.map((link, i) => (
                    <ButtonLink key={link.label} href={link.href} variant={i === 0 ? "lit" : "plain"}>
                      {link.label}
                    </ButtonLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Ear side="r" label="4U" />
        </header>

        <main>
          <section id="rack" className={styles.rackSection} aria-labelledby="rack-title">
            <div className={styles.selector}>
              <Ear side="l" label="2U" />
              <div className={styles.selectorPlate}>
                <div className={styles.selectorCopy}>
                  <h2 id="rack-title" className={styles.sectionTitle}>
                    The rack
                  </h2>
                  <p className={styles.sectionNote}>
                    Every project is a device. Turn the thread selector to power one line of work
                    and put the rest in bypass. Arrow keys work too.
                  </p>
                </div>
                <Knob
                  options={threadGroups}
                  value={index}
                  onChange={choose}
                  valueText={`${active.label}, ${powered.length} of ${rackOrder.length} devices powered`}
                />
                <div className={styles.selectorLcd} aria-live="polite">
                  <span className={styles.lcdLabel}>Thread</span>
                  <span className={styles.lcdBig}>{active.label}</span>
                  <span className={styles.lcdLabel}>
                    <span className={styles.seg} data-ghost="88">
                      {pad(powered.length)}
                    </span>{" "}
                    powered ·{" "}
                    <span className={styles.seg} data-ghost="88">
                      {pad(rackOrder.length - powered.length)}
                    </span>{" "}
                    bypass
                  </span>
                  <span className={styles.lcdList2}>
                    {active.key === "all"
                      ? "Signal to every device"
                      : powered.map((p) => p.title).join(" → ")}
                  </span>
                </div>
              </div>
              <Ear side="r" label="2U" />
            </div>

            <div className={styles.rack}>
              <BlankPanel label={`Bank A · Featured · ${pad(bankA.length)} devices`} />
              {bankA.map((project) => (
                <Device key={project.slug} project={project} powered={isPowered(project)} />
              ))}
              <BlankPanel label={`Bank B · More work · ${pad(bankB.length)} devices`} />
              {bankB.map((project) => (
                <Device key={project.slug} project={project} powered={isPowered(project)} />
              ))}
              <Cables active={active} powered={powered} />
            </div>
          </section>

          <section id="log" className={styles.logSection} aria-labelledby="log-title">
            <Ear side="l" label="3U" />
            <div className={styles.logPlate}>
              <div className={styles.logHead}>
                <h2 id="log-title" className={styles.sectionTitle}>
                  Signal log
                </h2>
                <span className={styles.silk}>Archive rack · Experience + education</span>
              </div>
              <ol className={styles.log}>
                {experienceItems.map((item, i) => (
                  <li key={item.company} className={styles.logRow}>
                    <span className={styles.logYears}>{item.years}</span>
                    <span className={styles.logJack} aria-hidden="true" data-on={i === 0 || undefined} />
                    <div className={styles.logMain}>
                      <h3 className={styles.logCompany}>{item.company}</h3>
                      <p className={styles.logRole}>
                        {item.role} <span className={styles.logLoc}>· {item.location}</span>
                      </p>
                      <p className={styles.logSummary}>{item.summary}</p>
                    </div>
                  </li>
                ))}
                {educationItems.map((item) => (
                  <li key={item.school} className={styles.logRow} data-kind="edu">
                    <span className={styles.logYears}>{item.years}</span>
                    <span className={styles.logJack} aria-hidden="true" />
                    <div className={styles.logMain}>
                      <h3 className={styles.logCompany}>{item.school}</h3>
                      <p className={styles.logRole}>{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <Ear side="r" label="3U" />
          </section>

          <section id="contact" className={styles.contact} aria-labelledby="contact-title">
            <Ear side="l" label="2U" />
            <div className={styles.contactPlate}>
              <div>
                <span className={styles.silk}>Output · Main out</span>
                <h2 id="contact-title" className={styles.contactTitle}>
                  Patch in
                </h2>
                <p className={styles.sectionNote}>
                  {siteMeta.availability} Email is the fastest route.
                </p>
              </div>
              <div className={styles.contactControls}>
                <a href={siteMeta.emailHref} className={styles.emailPlate}>
                  <Led color="#e0431b" mode="live" />
                  <span>{siteMeta.email}</span>
                </a>
                <div className={styles.buttonRow}>
                  {contactButtons.map((link) => (
                    <ButtonLink key={link.label} href={link.href}>
                      {link.label}
                    </ButtonLink>
                  ))}
                </div>
              </div>
            </div>
            <Ear side="r" label="2U" />
          </section>
        </main>

        <RackFooter />
      </div>
    </RackRoot>
  );
}

function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div className={styles.counter}>
      <span className={styles.counterValue}>
        <span className={styles.seg} data-ghost="88">
          {pad(value)}
        </span>
      </span>
      <span className={styles.lcdLabel}>{label}</span>
    </div>
  );
}

function BlankPanel({ label }: { label: string }) {
  return (
    <div className={styles.blank}>
      <Ear side="l" />
      <div className={styles.blankPlate}>
        <span className={styles.vents} aria-hidden="true" />
        <p className={styles.blankLabel}>{label}</p>
        <span className={styles.vents} aria-hidden="true" />
      </div>
      <Ear side="r" />
    </div>
  );
}

function Device({ project, powered }: { project: Project; powered: boolean }) {
  const group = groupOf(project);
  const size = project.featured ? "2U" : "1U";
  const titleId = `dev-${project.slug}`;
  return (
    <article
      className={styles.device}
      data-size={size}
      data-state={powered ? "on" : "bypass"}
      aria-labelledby={titleId}
      style={{ "--led": ledColor(project) } as CSSProperties}
    >
      <Ear side="l" label={size} />
      <div className={styles.plate}>
        <div className={styles.plateHead}>
          <span className={styles.ledCell}>
            <Led color={ledColor(project)} mode={ledMode(project)} off={!powered} />
            <span className={styles.ledText}>{powered ? "On" : "Bypass"}</span>
          </span>
          <span className={styles.chan}>CH {channel(project)}</span>
          <h3 id={titleId} className={styles.deviceTitle}>
            <Link to={rackPath(project.slug)} className={styles.titleLink}>
              {project.title}
            </Link>
          </h3>
          <span className={styles.deviceMeta}>
            <span>{project.category}</span>
            <span aria-hidden="true">/</span>
            <span>{project.year}</span>
          </span>
          <Link
            to={rackPath(project.slug)}
            className={styles.openBtn}
            aria-hidden="true"
            tabIndex={-1}
          >
            Open
          </Link>
        </div>
        {powered ? (
          <>
            <div className={styles.plateBody}>
              <div className={styles.plateCopy}>
                <p className={styles.status}>
                  <span className={styles.silk}>Status</span> {project.status}
                  <span className={styles.statusGroup}>
                    <span className={styles.silk}>Thread</span> {group.label}
                  </span>
                </p>
                <p className={styles.deviceSummary}>{project.summary}</p>
              </div>
              {project.metrics && project.featured ? (
                <div className={styles.readouts}>
                  {project.metrics.map((metric) => (
                    <Readout key={metric} metric={metric} />
                  ))}
                </div>
              ) : null}
            </div>
            <Jacks stack={project.stack} />
          </>
        ) : null}
      </div>
      <Ear side="r">
        <span className={styles.port} data-port={project.slug} />
      </Ear>
    </article>
  );
}

interface CablePath {
  d: string;
  color: string;
  ends: [number, number][];
}

/** Patch cables between consecutive powered devices of the same thread. */
function Cables({ active, powered }: { active: ThreadGroup; powered: Project[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<CablePath[]>([]);
  const key = powered.map((p) => p.slug).join(",");

  useLayoutEffect(() => {
    // The rack is the svg's parent. A parent ref is not attached yet when a
    // child's layout effect runs, so measure from our own node instead.
    const container = svgRef.current?.parentElement;
    if (!container) return;
    const measure = () => {
      const box = container.getBoundingClientRect();
      const groups =
        active.key === "all" ? threadGroups.slice(1) : [active];
      const next: CablePath[] = [];
      groups.forEach((group, gi) => {
        const members = powered.filter((p) => groupOf(p).key === group.key);
        for (let i = 0; i < members.length - 1; i++) {
          const a = container.querySelector(`[data-port="${members[i]!.slug}"]`);
          const b = container.querySelector(`[data-port="${members[i + 1]!.slug}"]`);
          if (!a || !b) continue;
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          const x1 = ra.left + ra.width / 2 - box.left;
          const y1 = ra.top + ra.height / 2 - box.top;
          const x2 = rb.left + rb.width / 2 - box.left;
          const y2 = rb.top + rb.height / 2 - box.top;
          const reach = Math.min(130, 44 + Math.abs(y2 - y1) * 0.07 + gi * 9);
          next.push({
            d: `M ${x1} ${y1} C ${x1 + reach} ${y1 + 18}, ${x2 + reach} ${y2 + 18}, ${x2} ${y2}`,
            color: group.color,
            ends: [
              [x1, y1],
              [x2, y2],
            ],
          });
        }
      });
      setPaths(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [active, key]);

  return (
    <svg ref={svgRef} className={styles.cables} aria-hidden="true" data-thread={active.key}>
      {paths.map((path, i) => (
        <g key={i} style={{ "--cable": path.color } as CSSProperties}>
          <path d={path.d} className={styles.cableShadow} />
          <path d={path.d} pathLength={1} className={styles.cable} />
          {path.ends.map(([x, y], j) => (
            <circle key={j} cx={x} cy={y} r={5.5} className={styles.plug} />
          ))}
        </g>
      ))}
    </svg>
  );
}
