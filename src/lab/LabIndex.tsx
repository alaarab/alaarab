import { type CSSProperties, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { directions, labPath } from "./directions";
import styles from "./lab.module.css";

type Frame = "desktop" | "phone";

/** Side-by-side viewer for the three prototype directions. */
export function LabIndex() {
  useDocumentTitle("Design lab | Ala Arab");
  const [frame, setFrame] = useState<Frame>("desktop");
  const [page, setPage] = useState<"home" | "project">("home");
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
          <p className={styles.kicker}>design/creative-directions</p>
          <h1>Three directions for alaarab.com</h1>
        </div>
        <div className={styles.controls}>
          <fieldset>
            <legend>Page</legend>
            {(["home", "project"] as const).map((p) => (
              <label key={p}>
                <input type="radio" name="page" checked={page === p} onChange={() => setPage(p)} />
                {p === "home" ? "Home" : "Project"}
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
        {directions.map((d) => {
          const src = labPath(d.key, page === "project" ? d.sampleProject : undefined);
          return (
            <section key={d.key} className={styles.col}>
              <div className={styles.colHead}>
                <h2>{d.name}</h2>
                <p>{d.concept}</p>
                <a href={src} target="_blank" rel="noreferrer">Open full screen ↗</a>
              </div>
              <div className={styles.viewport} data-viewport>
                <iframe title={d.name} src={src} className={styles.frame} />
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
