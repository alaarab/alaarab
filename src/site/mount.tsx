/**
 * A real screenshot, untouched, on a cream mat sewn to the linen: a running-stitch
 * border, a cross-stitch tacking each corner, a soft shadow, and a caption below.
 */
import { type CSSProperties, type ReactNode, useState } from "react";
import { LabelStitch, thread, useSewIn } from "./stitch";
import type { Shot, Step, Video } from "./visuals";
import styles from "./embroidery.module.css";

function Tack({ at, c }: { at: "tl" | "tr" | "bl" | "br"; c: string }) {
  return (
    <svg viewBox="0 0 10 10" className={styles.tack} data-at={at} aria-hidden="true" focusable="false">
      <g strokeLinecap="round" strokeWidth="1.5">
        <g stroke="rgba(59,43,31,.3)" transform="translate(0.5 0.6)">
          <line x1="2" y1="2" x2="8" y2="8" />
          <line x1="8" y1="2" x2="2" y2="8" />
        </g>
        <g stroke={c}>
          <line x1="2" y1="2" x2="8" y2="8" />
          <line x1="8" y1="2" x2="2" y2="8" />
        </g>
      </g>
    </svg>
  );
}

/** The cream mat with its stitched border and corner tacks. */
function Mat({ c, children, className }: { c: string; children: ReactNode; className?: string }) {
  return (
    <div className={[styles.mat, className].filter(Boolean).join(" ")}>
      <LabelStitch c={c} />
      {(["tl", "tr", "bl", "br"] as const).map((k) => (
        <Tack key={k} at={k} c={c} />
      ))}
      {children}
    </div>
  );
}

export function Mounted({ shot, eager = false, c = thread.walnut }: { shot: Shot; eager?: boolean; c?: string }) {
  return (
    <figure className={styles.mount} data-phone={shot.phone ? "" : undefined} style={{ "--ratio": `${shot.w} / ${shot.h}` } as CSSProperties}>
      <Mat c={c}>
        <img
          src={shot.src}
          alt={shot.alt}
          width={shot.w}
          height={shot.h}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={styles.shot}
        />
      </Mat>
      <figcaption className={styles.caption}>{shot.caption}</figcaption>
    </figure>
  );
}

/** One or more shots: phone screens sit side by side, desktop shots stack. */
export function Shots({ shots, eager = false, c }: { shots: Shot[]; eager?: boolean; c?: string }) {
  if (!shots.length) return null;
  if (shots[0].phone) {
    return (
      <div className={styles.phoneRow} data-count={shots.length}>
        {shots.map((s, k) => (
          <Mounted key={s.src} shot={s} eager={eager && k === 0} c={c} />
        ))}
      </div>
    );
  }
  return (
    <div className={styles.shotStack}>
      {shots.map((s, k) => (
        <Mounted key={s.src} shot={s} eager={eager && k === 0} c={c} />
      ))}
    </div>
  );
}

/** A small mounted thumbnail for the home page lists. */
export function Thumb({ shot, c = thread.walnut }: { shot: Shot; c?: string }) {
  return (
    <div className={styles.thumb} data-phone={shot.phone ? "" : undefined} style={{ "--ratio": `${shot.w} / ${shot.h}` } as CSSProperties}>
      <Mat c={c} className={styles.thumbMat}>
        <img src={shot.src} alt="" width={shot.w} height={shot.h} loading="lazy" decoding="async" className={styles.shot} />
      </Mat>
    </div>
  );
}

/** A real video, muted, on the same mat. It never plays by itself. */
export function MountedVideo({ video, c = thread.walnut }: { video: Video; c?: string }) {
  return (
    <figure className={styles.mount} data-phone={video.phone ? "" : undefined} style={{ "--ratio": `${video.w} / ${video.h}` } as CSSProperties}>
      <Mat c={c}>
        <video className={styles.shot} src={video.src} poster={video.poster} width={video.w} height={video.h} muted playsInline loop controls preload="none" aria-label={video.label} />
      </Mat>
      <figcaption className={styles.caption}>{video.caption}</figcaption>
    </figure>
  );
}

/* Keyframes live in a hoisted <style>, because Bun's CSS modules rename keyframes
   without renaming the animation names that use them. One set per step count. */
const keyframes = (n: number) => {
  const on = 100 / n;
  return `@keyframes embroidery-step${n}{0%{opacity:0}${(on * 0.08).toFixed(2)}%{opacity:1}${(on * 0.92).toFixed(2)}%{opacity:1}${on.toFixed(2)}%{opacity:0}100%{opacity:0}}
@keyframes embroidery-cap${n}{0%{opacity:.45}${(on * 0.08).toFixed(2)}%{opacity:1}${(on * 0.92).toFixed(2)}%{opacity:1}${on.toFixed(2)}%{opacity:.45}100%{opacity:.45}}`;
};

/**
 * Walks through a product in two to four real screenshots, one caption per step,
 * with a soft stitched ring on the part being described. It starts when it scrolls
 * into view and can be paused. With reduced motion it is a plain numbered list.
 */
export function Explainer({ steps, c = thread.walnut, label }: { steps: Step[]; c?: string; label: string }) {
  const [ref, inView] = useSewIn<HTMLElement>();
  const [paused, setPaused] = useState(false);
  const n = steps.length;
  const first = steps[0];
  return (
    <figure
      ref={ref}
      className={styles.explainer}
      data-phone={first.phone ? "" : undefined}
      data-started={inView ? "" : undefined}
      data-paused={paused ? "" : undefined}
      aria-label={label}
      style={{ "--n": n, "--ratio": `${first.w} / ${first.h}`, "--thread": c, "--anim": `embroidery-step${n}`, "--anim-cap": `embroidery-cap${n}` } as CSSProperties}
    >
      <style href={`embroidery-explainer-${n}`} precedence="default">
        {keyframes(n)}
      </style>
      <Mat c={c}>
        <div className={styles.stage}>
          {steps.map((s, k) => (
            <div key={k} className={styles.layer} style={{ "--k": k } as CSSProperties}>
              <div className={styles.layerPic} style={{ "--ratio": `${s.w} / ${s.h}` } as CSSProperties}>
                <img src={s.src} alt={s.alt} width={s.w} height={s.h} loading="lazy" decoding="async" className={styles.shot} />
                {s.ring && (
                  <span
                    className={styles.ring}
                    aria-hidden="true"
                    style={{ left: `${s.ring.x}%`, top: `${s.ring.y}%`, width: `${s.ring.w}%`, height: `${s.ring.h}%` }}
                  />
                )}
              </div>
              <p className={styles.layerCaption}>
                <span className={styles.stepNo}>{k + 1}.</span> {s.caption}
              </p>
            </div>
          ))}
        </div>
      </Mat>
      <ol className={styles.steps} aria-hidden="true">
        {steps.map((s, k) => (
          <li key={k} style={{ "--k": k } as CSSProperties}>
            <span className={styles.stepNo}>{k + 1}.</span> {s.caption}
          </li>
        ))}
      </ol>
      <button type="button" className={styles.pause} onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
        {paused ? "Play the walkthrough" : "Pause the walkthrough"}
      </button>
    </figure>
  );
}
