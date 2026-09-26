import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { projectBySlug } from "./util";
import { directions, labPath, round1, showcaseSlugs } from "./directions";
import styles from "./lab.module.css";

type Frame = "desktop" | "phone";
type Page = "home" | (typeof showcaseSlugs)[number];

const pages: Page[] = ["home", ...showcaseSlugs];
const pageLabel = (p: Page) => (p === "home" ? "Home" : projectBySlug(p)?.title ?? p);

/** Side-by-side viewer for the prototype directions. */
export function LabIndex() {
  useDocumentTitle("Design lab | Ala Arab");
  const [frame, setFrame] = useState<Frame>("desktop");
  const [page, setPage] = useState<Page>("home");
  const gridRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  // Scale each iframe from its real device width down to the column width.
  useEffect(() => {
    const el = gridRef.current?.querySelector<HTMLElement>("[data-viewport]");
    if (!el) return;
    const deviceWidth = frame === "desktop" ? 1440 : 390;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / deviceWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [frame]);

  return (
    <div className={styles.lab}>
      <header className={styles.bar}>
        <div>
          <p className={styles.kicker}>design/creative-directions · round 2</p>
          <h1>Ten directions for alaarab.com</h1>
        </div>
        <div className={styles.controls}>
          <fieldset>
            <legend>Page</legend>
            {pages.map((p) => (
              <label key={p}>
                <input type="radio" name="page" checked={page === p} onChange={() => setPage(p)} />
                {pageLabel(p)}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Width</legend>
            {(["desktop", "phone"] as const).map((f) => (
              <label key={f}>
                <input type="radio" name="frame" checked={frame === f} onChange={() => setFrame(f)} />
                {f === "desktop" ? "Desktop" : "Phone"}
              </label>
            ))}
          </fieldset>
          <Link to="/">Current site</Link>
        </div>
      </header>
      <div ref={gridRef} className={styles.grid} data-frame={frame} style={{ "--s": scale } as CSSProperties}>
        {directions.map((d, i) => {
          const src = labPath(d.key, page === "home" ? undefined : page);
          return (
            <section key={d.key} className={styles.col}>
              <div className={styles.colHead}>
                <h2>
                  {String(i + 1).padStart(2, "0")} · {d.name}
                </h2>
                <p>{d.concept}</p>
                <a href={src} target="_blank" rel="noreferrer">Open full screen ↗</a>
              </div>
              <div className={styles.viewport} data-viewport>
                <iframe title={d.name} src={src} className={styles.frame} loading="lazy" />
              </div>
            </section>
          );
        })}
      </div>
      <footer className={styles.round1}>
        Round 1 (rejected as busy):{" "}
        {round1.map((d) => (
          <a key={d.key} href={labPath(d.key)}>
            {d.name}
          </a>
        ))}
      </footer>
    </div>
  );
}
