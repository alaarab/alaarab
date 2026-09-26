import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import styles from "./hillside.module.css";

const SWEEP = 270;
export const WAVE_NAMES = ["sine", "triangle", "saw", "square"];

export function waveText(v: number) {
  const near = Math.round(v);
  if (Math.abs(v - near) < 0.13) return WAVE_NAMES[near]!;
  return `between ${WAVE_NAMES[Math.floor(v)]} and ${WAVE_NAMES[Math.ceil(v)]}`;
}

/** A painted knob that morphs the m4l-builder ridges from sine (0) to square (3). */
export function Knob({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const angle = -SWEEP / 2 + (value / 3) * SWEEP;
  const set = (v: number) => onChange(Math.round(Math.max(0, Math.min(3, v)) * 100) / 100);

  const fromPointer = (e: PointerEvent<HTMLDivElement>) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = e.clientY - (box.top + box.height / 2);
    const a = Math.max(-SWEEP / 2, Math.min(SWEEP / 2, (Math.atan2(dx, -dy) * 180) / Math.PI));
    set(((a + SWEEP / 2) / SWEEP) * 3);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = { ArrowRight: 0.25, ArrowUp: 0.25, PageUp: 1, ArrowLeft: -0.25, ArrowDown: -0.25, PageDown: -1 };
    if (e.key in steps) set(value + steps[e.key]!);
    else if (e.key === "Home") set(0);
    else if (e.key === "End") set(3);
    else return;
    e.preventDefault();
  };

  return (
    <div className={styles.knobUnit}>
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label="Ridge waveform"
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={value}
        aria-valuetext={waveText(value)}
        className={styles.knob}
        onKeyDown={onKeyDown}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          fromPointer(e);
        }}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e);
        }}
      >
        <svg viewBox="-60 -60 120 120" aria-hidden="true">
          <defs>
            <radialGradient id="hs-knob" cx="0.38" cy="0.32" r="0.8">
              <stop offset="0" stopColor="#e9cf9c" />
              <stop offset="0.55" stopColor="#b88a52" />
              <stop offset="1" stopColor="#7d5a36" />
            </radialGradient>
          </defs>
          {WAVE_NAMES.map((_, i) => {
            const a = ((-SWEEP / 2 + (i / 3) * SWEEP - 90) * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 46}
                y1={Math.sin(a) * 46}
                x2={Math.cos(a) * 55}
                y2={Math.sin(a) * 55}
                className={styles.knobTick}
              />
            );
          })}
          <circle r="38" fill="#5b4631" opacity="0.25" cy="3" />
          <circle r="36" fill="url(#hs-knob)" />
          <circle r="36" className={styles.knobRim} />
          <g transform={`rotate(${angle})`}>
            <line y1={-12} y2={-31} className={styles.knobPointer} />
          </g>
        </svg>
      </div>
      <ol className={styles.knobNames} aria-hidden="true">
        {WAVE_NAMES.map((n, i) => (
          <li key={n} className={Math.abs(value - i) < 0.5 ? styles.knobNameOn : undefined}>
            {n}
          </li>
        ))}
      </ol>
    </div>
  );
}
