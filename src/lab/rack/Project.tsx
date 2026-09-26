import type { CSSProperties } from "react";
import { Link, useParams } from "react-router";
import { projects } from "../../data/siteContent";
import {
  ButtonLink,
  Ear,
  Jacks,
  Led,
  MiniDevice,
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
  outboundLinks,
  rackPath,
  relatedDevices,
} from "./rackData";
import styles from "./rack.module.css";

export function RackProject() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <RackRoot>
        <div className={styles.case}>
          <NavStrip current="project" />
          <main className={styles.missing}>
            <Ear side="l" label="1U" />
            <div className={styles.missingPlate}>
              <span className={styles.ledCell}>
                <Led color="#e0431b" mode="live" />
                <span className={styles.ledText}>No signal</span>
              </span>
              <h1 className={styles.missingTitle}>No device in this slot</h1>
              <p className={styles.sectionNote}>
                Nothing is patched at <code className={styles.code}>{slug}</code>. It may have been
                renamed or pulled from the rack.
              </p>
              <Link to={rackPath()} className={styles.backBtn}>
                ← Back to the rack
              </Link>
            </div>
            <Ear side="r" label="1U" />
          </main>
          <RackFooter />
        </div>
      </RackRoot>
    );
  }

  const group = groupOf(project);
  const links = outboundLinks(project);
  const related = relatedDevices(project);
  const sections = [
    { tag: "01 · Input", title: "Problem", body: project.problem },
    { tag: "02 · Process", title: "Build", body: project.build, wide: true },
    { tag: "03 · Output", title: "Impact", body: project.impact },
    { tag: "04 · Main out", title: "Outcome", body: project.outcome },
  ];

  return (
    <RackRoot>
      <div className={styles.case} style={{ "--led": ledColor(project) } as CSSProperties}>
        <NavStrip current="project" />

        <header className={styles.opened}>
          <Ear side="l" label="6U" />
          <div className={styles.openedPlate}>
            <div className={styles.openedTop}>
              <Link to={rackPath()} className={styles.backBtn}>
                ← Rack
              </Link>
              <span className={styles.silk}>
                {MODEL} · CH {channel(project)}
              </span>
              <span className={styles.silk}>{group.label}</span>
            </div>
            <div className={styles.openedGrid}>
              <div>
                <div className={styles.openedLed}>
                  <Led color={ledColor(project)} mode={ledMode(project)} size="lg" />
                  <span className={styles.ledText}>Powered</span>
                </div>
                <h1 className={styles.openedTitle}>{project.title}</h1>
                <p className={styles.openedSummary}>{project.summary}</p>
              </div>
              <dl className={styles.openedStats}>
                <div>
                  <dt>Status</dt>
                  <dd>{project.status}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd>{project.year}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{project.category}</dd>
                </div>
              </dl>
            </div>
            {project.metrics ? (
              <div className={styles.openedReadouts}>
                {project.metrics.map((metric) => (
                  <Readout key={metric} metric={metric} />
                ))}
              </div>
            ) : null}
          </div>
          <Ear side="r" label="6U" />
        </header>

        <main>
          <section className={styles.flow} aria-label="Signal flow">
            <Ear side="l" />
            <div className={styles.flowPlate}>
              {sections.map((section) => (
                <article key={section.title} className={styles.panel} data-wide={section.wide || undefined}>
                  <span className={styles.panelTag}>{section.tag}</span>
                  <h2 className={styles.panelTitle}>{section.title}</h2>
                  <p className={styles.panelBody}>{section.body}</p>
                </article>
              ))}
            </div>
            <Ear side="r" />
          </section>

          <section className={styles.backPanel} aria-label="Stack and links">
            <Ear side="l" />
            <div className={styles.backPlate}>
              <Jacks stack={project.stack} label="Stack · patch points" />
              {project.quote ? (
                <figure className={styles.sticker}>
                  <blockquote>{project.quote}</blockquote>
                  <figcaption className={styles.silk}>From the project · {project.title}</figcaption>
                </figure>
              ) : null}
              {links.length ? (
                <div className={styles.linkField}>
                  <span className={styles.silk}>Outputs</span>
                  <div className={styles.buttonRow}>
                    {links.map((link, i) => (
                      <ButtonLink key={link.href} href={link.href} variant={i === 0 ? "lit" : "plain"}>
                        {link.label}
                      </ButtonLink>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
            <Ear side="r" />
          </section>

          {related.length ? (
            <section className={styles.chain} aria-labelledby="chain-title">
              <h2 id="chain-title" className={styles.chainTitle}>
                Next in chain
              </h2>
              <div className={styles.chainList}>
                {related.map((p) => (
                  <MiniDevice key={p.slug} project={p} />
                ))}
              </div>
            </section>
          ) : null}
        </main>

        <RackFooter />
      </div>
    </RackRoot>
  );
}
