import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useSvgId } from "./art";
import styles from "./letter.module.css";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** An ink-drawn knob. Drag up/down, or use the arrow keys. value is 0 to 1. */
export function Knob({
  value,
  onChange,
  label,
  valueText,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  valueText: string;
}) {
  const drag = useRef<{ y: number; v: number } | null>(null);
  const f = useSvgId("knob");
  const angle = -135 + value * 270;

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05, PageUp: 0.2, PageDown: -0.2 }[e.key];
    if (step !== undefined) onChange(clamp(value + step));
    else if (e.key === "Home") onChange(0);
    else if (e.key === "End") onChange(1);
    else return;
    e.preventDefault();
  };
  const onDown = (e: PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, v: value };
  };
  const onMove = (e: PointerEvent) => {
    if (!drag.current) return;
    onChange(clamp(drag.current.v + (drag.current.y - e.clientY) / 160));
  };
  const onUp = () => {
    drag.current = null;
  };

  return (
    <div
      className={styles.knob}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-valuetext={valueText}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <defs>
          <filter id={f} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="2" seed="5" />
            <feDisplacementMap in="SourceGraphic" scale="1.6" />
          </filter>
        </defs>
        <g filter={`url(#${f})`}>
          {Array.from({ length: 11 }, (_, i) => {
            const a = ((-135 + i * 27 - 90) * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={40 + Math.cos(a) * 33}
                y1={40 + Math.sin(a) * 33}
                x2={40 + Math.cos(a) * 37}
                y2={40 + Math.sin(a) * 37}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.7"
              />
            );
          })}
          <circle cx="40" cy="40" r="25" fill="#b07a3e" opacity={0.12 + value * 0.3} />
          <circle cx="40" cy="40" r="25" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="40" cy="40" r="21" fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
          <line
            x1="40"
            y1="40"
            x2="40"
            y2="20"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            transform={`rotate(${angle} 40 40)`}
          />
        </g>
      </svg>
    </div>
  );
}
