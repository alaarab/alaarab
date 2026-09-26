import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import type { Project } from "../../types";
import { startYear } from "../util";
import { noteFor } from "./notes";
import { grow, hash, washOf, type Anchor, type GrowOpts, type PlantModel } from "./grower";
import styles from "./specimens.module.css";

const LEAF = "hsl(84 26% 40%)";

export interface Frame {
  w: number;
  h: number;
  baseX: number;
  baseY: number;
  height: number;
  halfWidth: number;
}

/** Everything the grower needs, taken from the project itself. */
export function specimenOpts(p: Project, frame: Frame, extra: Partial<GrowOpts> = {}): GrowOpts {
  const note = noteFor(p.slug);
  const accent = note.hue ?? p.accent ?? "#b56a6a";
  return {
    seed: p.slug,
    age: Math.max(0, 2026 - startYear(p)),
    leaves: p.stack.length,
    flowers: p.metrics?.length ?? 0,
    baseX: frame.baseX,
    baseY: frame.baseY,
    height: frame.height,
    halfWidth: frame.halfWidth,
    leafColor: LEAF,
    flowerColor: washOf(accent),
    form: note.form,
    ...extra,
  };
}

/** Plays the ink reveal once, the first time the plate is in view. */
function useReveal() {
  const ref = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<"idle" | "play">("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setState("play");
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setState("play");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, state };
}

export function PlantSvg({
  model,
  frame,
  label,
  children,
  under,
  className,
  crop = true,
}: {
  crop?: boolean;
  model: PlantModel;
  frame: Frame;
  label: string;
  children?: ReactNode;
  under?: ReactNode;
  className?: string;
}) {
  const raw = useId();
  const id = raw.replace(/[^a-zA-Z0-9_-]/g, "");
  const { ref, state } = useReveal();
  const seed = hash(id) % 97;
  // Trim the empty paper above a short plant, keeping a little air.
  const y0 = crop ? Math.max(0, Math.min(frame.h * 0.3, model.top - 60)) : 0;
  return (
    <svg
      ref={ref}
      viewBox={`0 ${y0.toFixed(0)} ${frame.w} ${(frame.h - y0).toFixed(0)}`}
      className={`${styles.plantSvg} ${className ?? ""}`}
      data-state={state}
      role="img"
      aria-label={label}
    >
      <defs>
        <filter id={`${id}w`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed={seed + 3} result="m" />
          <feColorMatrix in="m" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.3 0 0 0 0.15" result="ma" />
          <feComposite in="d" in2="ma" operator="in" result="mottled" />
          <feGaussianBlur in="mottled" stdDeviation="0.35" />
        </filter>
        <filter id={`${id}i`} x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed={seed + 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      {under}
      <g className={styles.wash} filter={`url(#${id}w)`}>
        {model.washes.map((w, i) =>
          w.fill ? (
            <path
              key={i}
              d={w.d}
              fill={w.fill}
              fillOpacity={w.o}
              stroke={w.fill}
              strokeOpacity={w.o * 0.9}
              strokeWidth={1.4}
              style={{ ["--d" as string]: `${w.delay}s` }}
            />
          ) : (
            <path
              key={i}
              d={w.d}
              fill="none"
              stroke={w.stroke}
              strokeOpacity={w.o}
              strokeWidth={w.sw}
              strokeLinecap="round"
              style={{ ["--d" as string]: `${w.delay}s` }}
            />
          ),
        )}
      </g>
      <g className={styles.ink} filter={`url(#${id}i)`}>
        {model.inks.map((k, i) => (
          <path
            key={i}
            d={k.d}
            pathLength={1}
            strokeWidth={k.w}
            strokeOpacity={k.o}
            style={{ ["--d" as string]: `${k.delay}s`, ["--t" as string]: `${k.dur}s` }}
          />
        ))}
      </g>
      {children}
    </svg>
  );
}

/** A plain plate: the specimen alone, no annotations. */
export function Specimen({ project, frame, extra, label }: { project: Project; frame: Frame; extra?: Partial<GrowOpts>; label?: string }) {
  const model = useMemo(() => grow(specimenOpts(project, frame, extra)), [project, frame, extra]);
  return <PlantSvg model={model} frame={frame} label={label ?? plantLabel(project)} />;
}

export function plantLabel(p: Project): string {
  const m = p.metrics?.length ?? 0;
  return `A drawn plant for ${p.title}: ${p.stack.length} leaves for its stack${m ? `, ${m} flowers for its metrics` : ""}.`;
}

const SPRIG: Frame = { w: 40, h: 56, baseX: 20, baseY: 53, height: 42, halfWidth: 17 };

/** A tiny thumbnail sprig for the catalogue: no filters, no motion. */
export function Sprig({ project }: { project: Project }) {
  const model = useMemo(() => grow(specimenOpts(project, SPRIG, { sprig: true, leaves: Math.min(4, project.stack.length) })), [project]);
  return (
    <svg viewBox={`0 0 ${SPRIG.w} ${SPRIG.h}`} className={styles.sprig} aria-hidden="true">
      {model.washes.map((w, i) => (
        <path key={i} d={w.d} fill={w.fill ?? "none"} fillOpacity={w.o} stroke={w.stroke ?? "none"} strokeOpacity={w.o} strokeWidth={w.sw} />
      ))}
      <g className={styles.sprigInk}>
        {model.inks.map((k, i) => (
          <path key={i} d={k.d} strokeWidth={k.w} strokeOpacity={k.o} />
        ))}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------- annotations

export interface Note {
  anchor: Anchor;
  text: string;
}

function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(" ")) {
    if (cur && (cur + " " + word).length > max) {
      lines.push(cur);
      cur = word;
    } else cur = cur ? `${cur} ${word}` : word;
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Leader lines from each part of the plant to its label in the margin, as on a
 * Curtis plate. Labels stack down each margin without overlapping.
 */
export function Annotations({ notes, frame, gutter = 236 }: { notes: Note[]; frame: Frame; gutter?: number }) {
  const lh = 25;
  const placed: { n: number; note: Note; lines: string[]; y: number; x: number; side: -1 | 1 }[] = [];
  for (const side of [-1, 1] as const) {
    let floor = -Infinity;
    const column = notes
      .map((note, i) => ({ note, n: i + 1 }))
      .filter(({ note }) => note.anchor.side === side)
      .sort((a, b) => a.note.anchor.y - b.note.anchor.y)
      .map(({ note, n }) => {
        const lines = wrap(note.text, 19);
        const y = Math.max(note.anchor.y, floor);
        floor = y + lines.length * lh + 20;
        return { n, note, lines, y, x: side === -1 ? gutter : frame.w - gutter, side };
      });
    // Labels that run off the foot of the plate get pushed back up the margin.
    let ceiling = frame.h - 8;
    for (let i = column.length - 1; i >= 0; i--) {
      const c = column[i];
      c.y = Math.min(c.y, ceiling - (c.lines.length - 1) * lh);
      ceiling = c.y - 20 - lh;
    }
    placed.push(...column);
  }
  return (
    <g className={styles.annotations} aria-hidden="true">
      {placed.map(({ n, note, lines, y, x, side }) => {
        const lx = x - side * 16;
        return (
          <g key={n}>
            <path className={styles.leader} d={`M${note.anchor.x.toFixed(1)} ${note.anchor.y.toFixed(1)}L${lx} ${y - 5}`} />
            <circle className={styles.leaderDot} cx={note.anchor.x} cy={note.anchor.y} r={1.8} />
            <text className={styles.annotNum} x={x} y={y} textAnchor={side === -1 ? "end" : "start"}>
              {n}
            </text>
            <text className={styles.annotText} x={x + side * 26} y={y} textAnchor={side === -1 ? "end" : "start"}>
              {lines.map((l, i) => (
                <tspan key={i} x={x + side * 26} dy={i ? lh : 0}>
                  {l}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}
