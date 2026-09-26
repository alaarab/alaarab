import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { brush } from "./ink";
import styles from "./inkwash.module.css";

/**
 * An ink-drawn knob for the m4l-builder page. It is a real slider: arrow keys,
 * Page Up/Down, Home/End, and vertical drag (as on a hardware or Live knob).
 */
export function Knob({
  value,
  onChange,
  label,
  valueText,
  ink,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  valueText: string;
  ink: string;
}) {
  const drag = useRef<{ y: number; v: number } | null>(null);
  const clamp = (v: number) => Math.min(100, Math.max(0, v));
  const angle = -135 + (value / 100) * 270;

  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowUp: 4, ArrowRight: 4, ArrowDown: -4, ArrowLeft: -4, PageUp: 20, PageDown: -20 };
    if (e.key in step) onChange(clamp(value + step[e.key]));
    else if (e.key === "Home") onChange(0);
    else if (e.key === "End") onChange(100);
    else return;
    e.preventDefault();
  };
  const onDown = (e: PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, v: value };
  };
  const onMove = (e: PointerEvent) => {
    if (drag.current) onChange(clamp(drag.current.v + (drag.current.y - e.clientY) * 0.6));
  };
  const onUp = () => {
    drag.current = null;
  };

  return (
    <div className={styles.knobWrap}>
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value)}
        aria-valuetext={valueText}
        className={styles.knob}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <svg viewBox="0 0 80 80" aria-hidden="true" focusable="false">
          {/* travel: a faint arc under the knob, the filled part in denser ink */}
          <path d="M18.8 61.2 A30 30 0 1 1 61.2 61.2" fill="none" stroke={ink} strokeOpacity="0.18" strokeWidth="2" filter="url(#iw-line)" />
          <circle cx="40" cy="40" r="21" fill="#f5f1e8" stroke={ink} strokeOpacity="0.75" strokeWidth="2.2" filter="url(#iw-line)" />
          <g transform={`rotate(${angle} 40 40)`}>
            <path d={brush([[40, 36], [40, 22]], 3.4, { seed: 3, head: 0.1, tail: 0.4 })} fill={ink} />
          </g>
        </svg>
      </div>
      <div className={styles.knobText}>
        <span className={styles.knobLabel}>{label}</span>
        <span className={styles.quiet}>{valueText}</span>
      </div>
    </div>
  );
}
