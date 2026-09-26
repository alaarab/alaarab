import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./specimens.module.css";

const NAMES = ["Sine", "Triangle", "Saw"];
const MARGINS = ["a sinuate margin", "a dentate margin", "a serrate margin"];
const SWEEP = (3 * Math.PI) / 4;

export const waveName = (v: number) => NAMES[Math.round(v)] ?? "Sine";

/**
 * The seed capsule as a knob: a real slider from 0 (sine) to 2 (saw).
 * Drag around it, or use the arrow keys, Home and End.
 */
export function CapsuleKnob({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const set = (v: number) => onChange(Math.round(Math.min(2, Math.max(0, v)) * 20) / 20);
  const angle = (value - 1) * SWEEP;

  const fromPointer = (e: PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const a = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2)));
    set(1 + Math.max(-SWEEP, Math.min(SWEEP, a)) / SWEEP);
  };

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowRight: 0.1, ArrowUp: 0.1, ArrowLeft: -0.1, ArrowDown: -0.1, PageUp: 0.5, PageDown: -0.5 }[e.key];
    if (step !== undefined) set(value + step);
    else if (e.key === "Home") set(0);
    else if (e.key === "End") set(2);
    else return;
    e.preventDefault();
  };

  const idx = Math.round(value);
  const ridges = Array.from({ length: 12 }, (_, k) => (k / 12) * Math.PI * 2);

  return (
    <div className={styles.knobWrap}>
      <div
        ref={ref}
        className={styles.knob}
        role="slider"
        tabIndex={0}
        aria-label="Leaf waveform"
        aria-valuemin={0}
        aria-valuemax={2}
        aria-valuenow={value}
        aria-valuetext={`${NAMES[idx]}, ${MARGINS[idx]}`}
        onKeyDown={onKey}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e);
        }}
      >
        <svg viewBox="-60 -60 120 120" aria-hidden="true">
          <circle r="44" className={styles.knobWash} />
          <circle r="44" className={styles.knobInk} />
          <circle r="30" className={styles.knobInk} strokeOpacity={0.5} />
          {ridges.map((a) => (
            <line key={a} x1={Math.sin(a) * 31} y1={-Math.cos(a) * 31} x2={Math.sin(a) * 43} y2={-Math.cos(a) * 43} className={styles.knobInk} strokeOpacity={0.45} />
          ))}
          {[-1, 0, 1].map((k) => (
            <circle key={k} cx={Math.sin(k * SWEEP) * 53} cy={-Math.cos(k * SWEEP) * 53} r="1.8" className={styles.knobTick} />
          ))}
          <line x1="0" y1="0" x2={Math.sin(angle) * 40} y2={-Math.cos(angle) * 40} className={styles.knobMark} />
        </svg>
      </div>
      <div className={styles.knobChoices}>
        {NAMES.map((n, i) => (
          <button key={n} type="button" onClick={() => set(i)} aria-pressed={idx === i} className={styles.knobChoice}>
            {n.toLowerCase()}
          </button>
        ))}
      </div>
      <p className={styles.knobReadout} aria-hidden="true">
        {NAMES[idx]}, {MARGINS[idx]}
      </p>
    </div>
  );
}
