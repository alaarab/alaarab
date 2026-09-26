import { useMemo, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Link } from "react-router";
import { labPath } from "../directions";
import { projectBySlug } from "../util";
import {
  H,
  Mark,
  W,
  coast,
  desktopView,
  islets,
  phoneView,
  places,
  river,
} from "./country";
import { Compass, Forest, InkDefs, Range, Wash, blob, roughen, smooth } from "./ink";
import styles from "./map.module.css";

const PHONE = "(max-width: 640px)";

function usePhone() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(PHONE);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(PHONE).matches,
    () => false,
  );
}

export const firstSentence = (s: string) => {
  const m = s.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
};

/** The whole country, drawn once; washes and ink sit in separate groups so they can ink in. */
function Drawing({ phone }: { phone: boolean }) {
  const d = useMemo(() => {
    const coastD = smooth(roughen(coast, 11, 16, 3));
    const isletD = islets.map((p, i) => smooth(roughen(p, 30 + i, 5, 2)));
    const riverD = smooth(roughen(river, 5, 8, 2, false), false);
    return { coastD, isletD, riverD };
  }, []);
  const shores = [d.coastD, ...d.isletD];

  return (
    <>
      <InkDefs id="cm" />
      <defs>
        <mask id="cm-sea" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <rect width={W} height={H} fill="#fff" />
          {shores.map((s, i) => <path key={i} d={s} fill="#000" />)}
        </mask>
        <mask id="cm-land" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          {shores.map((s, i) => <path key={i} d={s} fill="#fff" />)}
        </mask>
        <mask id="cm-echo" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          {shores.map((s, i) => (
            <g key={i}>
              <path d={s} fill="none" stroke="#fff" strokeWidth="15" />
              <path d={s} fill="#000" stroke="#000" strokeWidth="12.4" />
            </g>
          ))}
        </mask>
      </defs>

      <g className={styles.washes}>
        <g mask="url(#cm-sea)">
          <g filter="url(#cm-wash)">
            {shores.map((s, i) => <path key={i} d={s} fill="none" stroke="var(--sea)" strokeWidth="130" opacity="0.22" />)}
            {shores.map((s, i) => <path key={i} d={s} fill="none" stroke="var(--sea)" strokeWidth="46" opacity="0.4" />)}
          </g>
        </g>
        <g mask="url(#cm-land)">
          <g filter="url(#cm-wash)">
            {shores.map((s, i) => <path key={i} d={s} fill="var(--sand)" opacity="0.16" />)}
            <Wash d={blob(700, 330, 200, 120, 3)} color="var(--meadow)" o={0.3} />
            <Wash d={blob(640, 380, 120, 80, 31)} color="var(--meadow)" o={0.22} />
            <Wash d={blob(880, 560, 230, 140, 8)} color="var(--meadow)" o={0.26} />
            <Wash d={blob(820, 600, 120, 90, 44)} color="var(--meadow)" o={0.2} />
            <Wash d={blob(640, 760, 120, 80, 12)} color="var(--meadow)" o={0.24} />
            <Wash d={blob(1150, 600, 110, 130, 15)} color="var(--meadow)" o={0.2} />
            <Wash d={blob(1170, 280, 90, 70, 21)} color="var(--rose)" o={0.26} />
            <Wash d={blob(1030, 190, 130, 60, 5)} color="var(--sand)" o={0.34} />
            {shores.map((s, i) => <path key={i} d={s} fill="none" stroke="var(--sand)" strokeWidth="40" opacity="0.5" />)}
          </g>
        </g>
        <path d={d.riverD} fill="none" stroke="var(--sea)" strokeWidth="7" opacity="0.5" strokeLinecap="round" />
        <rect width={W} height={H} fill="var(--ink)" mask="url(#cm-echo)" opacity="0.55" />
      </g>

      <g className={styles.ink}>
        <path className={styles.coastLine} d={d.coastD} pathLength={1} />
        {d.isletD.map((s, i) => <path key={i} className={styles.coastLine} d={s} pathLength={1} />)}
        <path className={styles.coastLine} d={d.riverD} pathLength={1} strokeWidth="1.1" />
      </g>

      <g className={styles.detail}>
        <Range from={[900, 172]} to={[1130, 168]} n={8} seed={4} s={17} />
        <Range from={[940, 212]} to={[990, 206]} n={2} seed={14} s={13} />
        <Range from={[1110, 700]} to={[1200, 650]} n={4} seed={9} s={13} />
        <Range from={[520, 660]} to={[570, 630]} n={2} seed={2} s={11} />
        <Forest cx={690} cy={268} rx={64} ry={34} n={16} seed={6} />
        <Forest cx={820} cy={756} rx={70} ry={30} n={14} seed={13} />
        <Forest cx={1170} cy={540} rx={34} ry={50} n={10} seed={17} />
        <Forest cx={420} cy={912} rx={34} ry={12} n={5} seed={29} s={6} />
        <path className={styles.road} d="M592 796 C640 740 690 670 730 652 S900 566 968 556 S1010 330 1040 244" />
        <path className={styles.ripple} d="M200 300 q10 -6 20 0 t20 0 M1480 560 q10 -6 20 0 t20 0 M300 880 q10 -6 20 0 t20 0 M1380 900 q10 -6 20 0 t20 0 M150 120 q10 -6 20 0 t20 0" />
        <Compass x={1500} y={800} s={30} />
      </g>

      <g className={styles.marks}>
        {places.map((p) => (
          <g key={p.slug} transform={`translate(${p.x} ${p.y}) scale(${phone ? 1.45 : 1})`}>
            <Mark slug={p.slug} />
          </g>
        ))}
      </g>
    </>
  );
}

export function CountryMap({ animate }: { animate: boolean }) {
  const phone = usePhone();
  const view = phone ? phoneView : desktopView;
  const [active, setActive] = useState<string | null>(null);

  const pos = (x: number, y: number) => ({
    left: `${((x - view.x) / view.w) * 100}%`,
    top: `${((y - view.y) / view.h) * 100}%`,
  });
  const activePlace = places.find((p) => p.slug === active);
  const activeProject = projectBySlug(active ?? undefined);

  return (
    <div
      className={`${styles.map} ${animate ? styles.inking : ""}`}
      style={{ "--vbw": view.w, aspectRatio: `${view.w} / ${view.h}` } as CSSProperties}
      onMouseLeave={() => setActive(null)}
    >
      <svg
        className={styles.mapSvg}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <Drawing phone={phone} />
      </svg>

      <nav aria-label="Places on the map" className={styles.placeLayer}>
        {places.map((p) => {
          const project = projectBySlug(p.slug);
          if (!project) return null;
          const side = (phone && p.phoneSide) || p.side;
          return (
            <Link
              key={p.slug}
              to={labPath("map", p.slug)}
              className={`${styles.place} ${styles[`side_${side}`]}`}
              style={pos(p.x, p.y)}
              onMouseEnter={() => setActive(p.slug)}
              onFocus={() => setActive(p.slug)}
              onBlur={() => setActive((a) => (a === p.slug ? null : a))}
              aria-describedby={active === p.slug ? "map-note" : undefined}
            >
              <span className={styles.placeHit} aria-hidden="true" />
              <span className={styles.placeName}>{project.title}</span>
            </Link>
          );
        })}
      </nav>

      {activePlace && activeProject && (
        <p
          id="map-note"
          className={`${styles.note} ${activePlace.y > view.y + view.h * 0.6 ? styles.noteAbove : ""} ${
            activePlace.x > view.x + view.w * 0.62 ? styles.noteLeft : ""
          }`}
          style={pos(activePlace.x, activePlace.y)}
        >
          {firstSentence(activeProject.summary)}
        </p>
      )}
    </div>
  );
}
