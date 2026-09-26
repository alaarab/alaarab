import { useRef, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { ThreadGroup } from "./rackData";
import styles from "./rack.module.css";

const SWEEP = 270;

interface KnobProps {
  options: ThreadGroup[];
  value: number;
  onChange: (index: number) => void;
  valueText: string;
}

export function Knob({ options, value, onChange, valueText }: KnobProps) {
  const dialRef = useRef<HTMLDivElement>(null);
  const last = options.length - 1;
  const angleOf = (index: number) => -SWEEP / 2 + (index * SWEEP) / last;

  const set = (index: number) => {
    const next = Math.max(0, Math.min(last, index));
    if (next !== value) onChange(next);
  };

  const fromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const box = dialRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    // 0deg points straight up, clockwise positive, range -180..180.
    let angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
    angle = Math.max(-SWEEP / 2, Math.min(SWEEP / 2, angle));
    set(Math.round(((angle + SWEEP / 2) / SWEEP) * last));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowRight: 1,
      ArrowUp: 1,
      PageUp: 2,
      ArrowLeft: -1,
      ArrowDown: -1,
      PageDown: -2,
    };
    if (event.key in steps) set(value + steps[event.key]!);
    else if (event.key === "Home") set(0);
    else if (event.key === "End") set(last);
    else return;
    event.preventDefault();
  };

  return (
    <div className={styles.knobUnit}>
      <div className={styles.knobDial} ref={dialRef}>
        <svg className={styles.knobScale} viewBox="-100 -100 200 200" aria-hidden="true">
          {options.map((option, index) => {
            const rad = ((angleOf(index) - 90) * Math.PI) / 180;
            const on = index === value;
            return (
              <line
                key={option.key}
                x1={Math.cos(rad) * 78}
                y1={Math.sin(rad) * 78}
                x2={Math.cos(rad) * (on ? 96 : 90)}
                y2={Math.sin(rad) * (on ? 96 : 90)}
                className={on ? styles.tickOn : styles.tick}
              />
            );
          })}
        </svg>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Thread selector"
          aria-valuemin={0}
          aria-valuemax={last}
          aria-valuenow={value}
          aria-valuetext={valueText}
          className={styles.knob}
          style={{ "--rot": `${angleOf(value)}deg` } as CSSProperties}
          onKeyDown={onKeyDown}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            fromPointer(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
          }}
        >
          <span className={styles.knobCap}>
            <span className={styles.knobPointer} />
          </span>
        </div>
      </div>
      <ul className={styles.detents} aria-label="Thread detents">
        {options.map((option, index) => (
          <li
            key={option.key}
            style={{ "--a": `${angleOf(index)}deg`, "--c": option.color } as CSSProperties}
          >
            <button
              type="button"
              className={styles.detent}
              aria-pressed={index === value}
              onClick={() => set(index)}
            >
              <span className={styles.detentDot} aria-hidden="true" />
              {option.short}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
