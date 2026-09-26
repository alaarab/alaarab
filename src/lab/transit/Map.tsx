import { useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import styles from "./transit.module.css";
import { Bullet, lineVars } from "./parts";
import {
  MAP_H,
  MAP_W,
  eras,
  layout,
  lines,
  linesFor,
  mapOrder,
  projectBySlug,
  roundedPath,
  routeRuns,
  startYear,
  transitPath,
  type LineId,
} from "./lines";

export function TransitMap() {
  const navigate = useNavigate();
  const [pinned, setPinned] = useState<LineId | null>(null);
  const [hoverLine, setHoverLine] = useState<LineId | null>(null);
  const [station, setStation] = useState<string | null>(null);
  const iso = hoverLine ?? pinned;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPinned(null);
        setStation(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (slug: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(transitPath(slug));
  };

  const active = station ? projectBySlug[station] : null;
  const activePos = station ? layout[station] : null;

  return (
    <div className={styles.mapBlock}>
      <div className={styles.key} role="group" aria-label="Lines. Select a line to isolate it on the map.">
        {lines.map((line) => (
          <button
            key={line.id}
            type="button"
            className={styles.keyItem}
            style={lineVars(line)}
            aria-pressed={pinned === line.id}
            onClick={() => setPinned((p) => (p === line.id ? null : line.id))}
            onMouseEnter={() => setHoverLine(line.id)}
            onMouseLeave={() => setHoverLine(null)}
            onFocus={() => setHoverLine(line.id)}
            onBlur={() => setHoverLine(null)}
          >
            <Bullet line={line} />
            <span className={styles.keyName}>{line.name}</span>
            <span className={styles.keyCount} aria-label={`${line.stations.length} stations`}>
              {line.stations.length}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.mapFrame}>
        <svg
          className={styles.map}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          aria-labelledby="map-title map-desc"
          data-iso={iso ?? undefined}
        >
          <title id="map-title">System map of Ala Arab's work, 2011 to 2026</title>
          <desc id="map-desc">
            Five lines of work run left to right through time. Projects are stations; a project on
            two lines is an interchange. The timetable below lists every station as text.
          </desc>

          <g aria-hidden="true">
            {eras.map((era, i) => (
              <g key={era.label}>
                <rect
                  x={era.x0}
                  y={0}
                  width={era.x1 - era.x0}
                  height={MAP_H}
                  className={i % 2 ? styles.eraAlt : styles.era}
                />
                <text x={era.x0 + 12} y={MAP_H - 30} className={styles.eraYear}>
                  {era.label}
                </text>
                <text x={era.x0 + 12} y={MAP_H - 12} className={styles.eraSub}>
                  {era.sub}
                </text>
              </g>
            ))}
          </g>

          <g aria-hidden="true">
            {lines.map((line) => (
              <g
                key={line.id}
                style={lineVars(line)}
                className={`${styles.mapLine} ${iso && iso !== line.id ? styles.faded : ""}`}
                onMouseEnter={() => setHoverLine(line.id)}
                onMouseLeave={() => setHoverLine(null)}
              >
                {routeRuns(line).map((run, i) => (
                  <g key={i}>
                    <path d={roundedPath(run.points)} className={styles.hit} />
                    <path
                      d={roundedPath(run.points)}
                      className={run.gap ? styles.trackGap : styles.track}
                    />
                  </g>
                ))}
                {line.bullets.map(([x, y], i) => (
                  <g key={i} className={styles.mapBullet}>
                    <circle cx={x} cy={y} r={15} />
                    <text x={x} y={y + 6}>
                      {line.id}
                    </text>
                  </g>
                ))}
              </g>
            ))}
          </g>

          <g>
            {mapOrder.map((slug) => {
              const p = projectBySlug[slug];
              const pos = layout[slug];
              const served = linesFor(slug);
              const inter = served.length > 1;
              const on = !iso || served.some((l) => l.id === iso);
              const lead = served.find((l) => l.id === iso) ?? served[0];
              return (
                <a
                  key={slug}
                  href={transitPath(slug)}
                  onClick={go(slug)}
                  className={`${styles.station} ${on ? "" : styles.faded} ${iso && on ? styles.lit : ""}`}
                  style={lineVars(lead)}
                  aria-label={`${p.title}, ${p.year}, ${served.map((l) => `${l.name} line`).join(" and ")}`}
                  aria-describedby={station === slug ? "station-tip" : undefined}
                  onMouseEnter={() => setStation(slug)}
                  onMouseLeave={() => setStation(null)}
                  onFocus={() => setStation(slug)}
                  onBlur={() => setStation(null)}
                >
                  <circle cx={pos.x} cy={pos.y} r={24} className={styles.hitDot} />
                  <g className={styles.marker} style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}>
                    <circle cx={pos.x} cy={pos.y} r={20} className={styles.focusRing} />
                    {inter ? (
                      <circle cx={pos.x} cy={pos.y} r={11} className={styles.interDot} />
                    ) : (
                      <circle cx={pos.x} cy={pos.y} r={6.5} className={styles.dot} />
                    )}
                  </g>
                  <text x={pos.lx} y={pos.ly} textAnchor={pos.anchor} className={styles.label}>
                    <tspan className={styles.labelYear}>{startYear(p)}</tspan>
                    {pos.label.map((part, i) => (
                      <tspan key={i} x={pos.lx} dy={i === 0 ? 19 : 18} className={styles.labelName}>
                        {part}
                      </tspan>
                    ))}
                  </text>
                </a>
              );
            })}
          </g>
        </svg>

        {active && activePos && (
          <div
            id="station-tip"
            role="tooltip"
            className={styles.tip}
            data-side={activePos.x > MAP_W * 0.62 ? "left" : "right"}
            data-v={activePos.y > MAP_H * 0.55 ? "up" : "down"}
            style={{
              left: `${(activePos.x / MAP_W) * 100}%`,
              top: `${(activePos.y / MAP_H) * 100}%`,
            }}
          >
            <div className={styles.tipHead}>
              <span className={styles.tipYear}>{active.year}</span>
              <span className={styles.tipStatus}>{active.status}</span>
            </div>
            <p className={styles.tipTitle}>{active.title}</p>
            <p className={styles.tipBody}>{active.summary}</p>
            <ul className={styles.tipLines} aria-label="Lines serving this station">
              {linesFor(active.slug).map((l) => (
                <li key={l.id}>
                  <Bullet line={l} size="sm" />
                  {l.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.keyLegend} aria-hidden="true">
          <span>
            <svg width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="7" fill="#fff" stroke="currentColor" strokeWidth="3.5" />
            </svg>
            Interchange
          </span>
          <span>
            <svg width="30" height="10" viewBox="0 0 30 10">
              <line x1="0" y1="5" x2="30" y2="5" stroke="currentColor" strokeWidth="5" strokeDasharray="7 5" />
            </svg>
            No stations on this stretch
          </span>
        </div>
    </div>
  );
}
