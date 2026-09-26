/**
 * The larger paintings: the home landscape and the three showcase pieces
 * (Phren's stepping stones, m4l-builder's singing bowl, Mina's night branch).
 */
import { blob, brush, Mist, Mountain, rng, type Pt } from "./ink";

/** Home: one mountain off to the right, a far range, and mist through the middle. */
export function HeroLandscape({ className }: { className?: string }) {
  const ink = "#2b2620";
  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {/* far ranges, barely there */}
      <Mountain id="hl-far1" peaks={[{ x: 250, h: 190, w: 260 }, { x: 430, h: 130, w: 200 }]} x0={-20} x1={760} base={700} foot={780} seed={3} tone={0.16} color="#5d574f" far />
      <Mountain id="hl-far2" peaks={[{ x: 1420, h: 230, w: 240 }, { x: 1580, h: 150, w: 200 }]} x0={1150} x1={1640} base={640} foot={720} seed={8} tone={0.14} color="#5d574f" far />
      <Mountain id="hl-mid" peaks={[{ x: 700, h: 140, w: 210 }, { x: 560, h: 80, w: 150 }]} x0={420} x1={960} base={760} foot={840} seed={12} tone={0.28} color="#4a443c" far />
      <Mist bands={[[1300, 560, 420, 40, 0.9]]} />
      {/* the mountain, built back to front: a tall massif, then two lower shoulders */}
      <Mountain
        id="hl-back"
        peaks={[
          { x: 1010, h: 540, w: 190 },
          { x: 1095, h: 470, w: 150 },
          { x: 900, h: 330, w: 140 },
          { x: 1180, h: 350, w: 120 },
        ]}
        x0={700}
        x1={1330}
        base={720}
        foot={650}
        seed={21}
        tone={0.62}
        color={ink}
        texture={26}
      />
      <Mist bands={[[1010, 610, 400, 52, 0.95]]} />
      <Mountain id="hl-right" peaks={[{ x: 1255, h: 290, w: 180 }, { x: 1345, h: 210, w: 130 }]} x0={1060} x1={1500} base={800} foot={745} seed={24} tone={0.74} color={ink} texture={12} />
      <Mountain id="hl-left" peaks={[{ x: 840, h: 190, w: 150 }, { x: 905, h: 140, w: 110 }]} x0={660} x1={1030} base={815} foot={770} seed={27} tone={0.7} color={ink} texture={8} />
      <Mist bands={[[1100, 700, 520, 44, 0.95], [700, 780, 760, 60, 0.9]]} />
      {/* a low near hill at the right edge */}
      <Mountain id="hl-near" peaks={[{ x: 1510, h: 160, w: 250 }]} x0={1220} x1={1640} base={920} foot={900} seed={30} tone={0.5} color={ink} texture={5} />
    </svg>
  );
}

/** Phren: stepping stones across still water, going off into the mist. */
export function PhrenArt({ className, ink }: { className?: string; ink: string }) {
  const rand = rng(77);
  // A gentle curve from the near left to the far right; each stone smaller and fainter.
  const stones = Array.from({ length: 8 }, (_, i) => {
    const t = i / 7;
    const x = 170 + t * 640 + Math.sin(t * 3.2) * 70;
    const y = 400 - t * 205 - t * t * 10;
    const s = 1 - t * 0.84;
    return { x, y, rx: 46 * s + 4, ry: 15 * s + 2, tone: 0.82 * (1 - t) ** 1.25 + 0.05, seed: 100 + i };
  });
  const lines = Array.from({ length: 14 }, () => {
    const y = 205 + rand() ** 1.3 * 230;
    const x = 40 + rand() * 860;
    const l = 30 + rand() * 120 * ((y - 190) / 240 + 0.3);
    return { y, x, l, o: 0.12 + rand() * 0.18 };
  });
  return (
    <svg className={className} viewBox="0 0 1000 460" role="img" aria-label="Ink painting: stepping stones across still water, fading into mist.">
      <Mountain id="ph-far" peaks={[{ x: 750, h: 110, w: 180 }, { x: 850, h: 70, w: 120 }]} x0={540} x1={985} base={200} foot={240} seed={5} tone={0.2} color={ink} far />
      <Mountain id="ph-far2" peaks={[{ x: 230, h: 50, w: 190 }]} x0={30} x1={430} base={205} foot={230} seed={6} tone={0.12} color={ink} far />
      <Mist bands={[[630, 208, 290, 22, 1]]} />
      <g fill={ink} filter="url(#iw-line)">
        {lines.map((l, i) => (
          <path key={i} opacity={l.o} d={brush([[l.x, l.y], [l.x + l.l * 0.5, l.y + 0.6], [l.x + l.l, l.y]], 1.6, { seed: 300 + i, head: 0.3, tail: 0.05 })} />
        ))}
      </g>
      {stones.map((s, i) => (
        <g key={i}>
          {/* reflection first, then the stone sitting on it */}
          <path d={blob(s.x, s.y + s.ry * 1.1, s.rx * 0.9, s.ry * 0.8, s.seed + 50, 0.18)} fill={ink} opacity={s.tone * 0.22} filter="url(#iw-bleed)" />
          <path d={blob(s.x, s.y, s.rx, s.ry, s.seed, 0.14, 0.35)} fill={ink} opacity={s.tone} filter="url(#iw-bleed)" />
          <path d={blob(s.x - s.rx * 0.2, s.y - s.ry * 0.25, s.rx * 0.55, s.ry * 0.35, s.seed + 9, 0.2)} fill="var(--paper)" opacity={0.14} filter="url(#iw-bleed)" />
          <path d={brush([[s.x - s.rx * 1.3, s.y + s.ry * 0.9], [s.x + s.rx * 1.4, s.y + s.ry * 0.95]], 1.4 + s.ry * 0.08, { seed: s.seed + 3, head: 0.3 })} fill={ink} opacity={s.tone * 0.5} filter="url(#iw-line)" />
        </g>
      ))}
      <Mist bands={[[850, 226, 90, 18, 0.9]]} />
    </svg>
  );
}

/** Points around part of an ellipse, for brushing a ring. */
function arc(cx: number, cy: number, rx: number, ry: number, a0: number, a1: number): Pt[] {
  const n = Math.max(4, Math.round(((a1 - a0) / (Math.PI * 2)) * 28));
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / n;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Pt;
  });
}

/** m4l-builder: a bronze singing bowl and its striker, with rings of sound around it. */
export function BowlArt({ className, ink, bronze, level }: { className?: string; ink: string; bronze: string; level: number }) {
  const count = Math.round(3 + level * 21);
  const cx = 300;
  const cy = 336;
  const inner = 150;
  const outer = 290;
  const rand = rng(90);
  // Each ring is two or three brushed arcs with gaps, wide and soft when few, fine when many.
  const strokes: { d: string; o: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const rx = inner + (outer - inner) * t ** 0.85;
    const w = (10 - level * 8.4) * (1 - t * 0.5);
    const o = (0.3 - level * 0.1) * (1 - t * 0.7) + 0.05;
    const parts = 2 + (i % 2);
    const start = rand() * Math.PI * 2;
    for (let k = 0; k < parts; k++) {
      const a0 = start + (k / parts) * Math.PI * 2;
      const a1 = a0 + (Math.PI * 2 / parts) * (0.7 + rand() * 0.22);
      strokes.push({ d: brush(arc(cx, cy, rx, rx * 0.36, a0, a1), w, { seed: i * 7 + k, head: 0.18, tail: 0.05, waver: 0.4 }), o });
    }
  }
  const body = "M176 330 C182 400 230 432 300 432 C370 432 418 400 424 330 Z";
  return (
    <svg className={className} viewBox="0 0 600 560" role="img" aria-label={`Ink painting: a bronze singing bowl with ${count} rings of sound around it.`}>
      <defs>
        <clipPath id="bw-clip">
          <path d={body} />
        </clipPath>
      </defs>
      <g fill={ink} filter="url(#iw-line)">
        {strokes.map((s, i) => (
          <path key={i} d={s.d} opacity={s.o} />
        ))}
      </g>
      {/* the cushion's shadow */}
      <path d={blob(cx, 432, 150, 14, 8, 0.1)} fill={ink} opacity={0.16} filter="url(#iw-wash)" />
      {/* paper under the bowl so the rings pass behind it, then a bronze wash */}
      <path d={body} style={{ fill: "var(--paper)" }} />
      <path d={body} fill={bronze} opacity={0.24} filter="url(#iw-bleed)" />
      <g clipPath="url(#bw-clip)" filter="url(#iw-bleed)">
        <path d={blob(206, 372, 44, 70, 14, 0.16)} fill={bronze} opacity={0.5} />
        <path d={blob(222, 392, 30, 44, 15, 0.2)} fill={ink} opacity={0.28} />
        <path d={blob(408, 380, 24, 56, 16, 0.18)} fill={ink} opacity={0.3} />
        <path d={blob(300, 428, 120, 12, 17, 0.2)} fill={bronze} opacity={0.35} />
      </g>
      <g fill={ink} filter="url(#iw-line)">
        <path d={brush([[178, 334], [196, 396], [250, 430], [300, 434], [352, 430], [404, 398], [422, 334]], 3.6, { seed: 6, head: 0.08, tail: 0.3 })} opacity={0.75} />
        <path d={brush(arc(cx, 330, 123, 19, Math.PI, Math.PI * 2), 2.6, { seed: 7, head: 0.1, tail: 0.2 })} opacity={0.8} />
        <path d={brush(arc(cx, 330, 123, 19, 0.05, Math.PI - 0.05), 4.4, { seed: 8, head: 0.1, tail: 0.2 })} opacity={0.85} />
      </g>
      <path d={blob(cx, 327, 104, 11, 12, 0.08)} fill={ink} opacity={0.42} filter="url(#iw-bleed)" />
      {/* the striker leaning beside it */}
      <g fill={ink} filter="url(#iw-line)">
        <path d={brush([[452, 432], [482, 336], [502, 268]], 8, { seed: 12, head: 0.08, tail: 0.5 })} opacity={0.8} />
        <path d={blob(504, 262, 10, 12, 4, 0.12)} opacity={0.85} />
      </g>
    </svg>
  );
}

/** Mina: a thin moon over a small bird asleep on a branch. Night, the faintest wash. */
export function MinaArt({ className, ink }: { className?: string; ink: string }) {
  return (
    <svg className={className} viewBox="0 20 500 560" role="img" aria-label="Ink painting: a thin crescent moon over a small bird asleep on a branch, at night.">
      <defs>
        <mask id="mn-cres" maskUnits="userSpaceOnUse" x="0" y="0" width="500" height="720">
          <circle cx="300" cy="200" r="36" fill="#fff" />
          <circle cx="313" cy="191" r="32" fill="#000" />
        </mask>
      </defs>
      {/* night wash, clearing around the moon, gone before the edges */}
      <g fill={ink} filter="url(#iw-cloud)">
        <ellipse cx="250" cy="262" rx="190" ry="24" opacity="0.12" />
        <ellipse cx="350" cy="168" rx="120" ry="16" opacity="0.08" />
        <ellipse cx="190" cy="140" rx="110" ry="12" opacity="0.07" />
      </g>
      <g mask="url(#mn-cres)" filter="url(#iw-line)">
        <circle cx="300" cy="200" r="36" fill="#f7f3eb" />
        <circle cx="300" cy="200" r="36" fill="none" stroke={ink} strokeOpacity="0.4" strokeWidth="1.4" />
      </g>
      {/* the branch comes in from the right */}
      <g fill={ink} opacity={0.75} filter="url(#iw-line)">
        <path d={brush([[520, 488], [430, 470], [330, 468], [230, 452], [120, 438]], 11, { seed: 31, head: 0.04, tail: 0.1 })} opacity={0.72} />
        <path d={brush([[400, 472], [372, 440], [352, 418]], 4, { seed: 32, head: 0.1 })} opacity={0.6} />
        <path d={brush([[190, 448], [160, 468], [140, 474]], 3.4, { seed: 33 })} opacity={0.55} />
        {[
          [352, 416],
          [140, 474],
          [118, 438],
        ].map(([x, y], i) => (
          <path key={i} d={blob(x, y, 4, 3.2, 40 + i, 0.2)} opacity={0.5} />
        ))}
      </g>
      {/* the bird, head tucked in, asleep */}
      <g filter="url(#iw-bleed)">
        <path d={blob(282, 432, 34, 25, 9, 0.06)} fill={ink} opacity={0.32} />
        <path d={blob(266, 424, 22, 15, 10, 0.08)} fill={ink} opacity={0.4} />
        <path d={blob(304, 420, 17, 15, 11, 0.06)} fill={ink} opacity={0.36} />
      </g>
      <g fill={ink} filter="url(#iw-line)">
        <path d={brush([[252, 438], [232, 452], [214, 458]], 7, { seed: 50, tail: 0.3 })} opacity={0.55} />
        <path d={brush([[262, 422], [284, 414], [300, 418]], 2.2, { seed: 51 })} opacity={0.5} />
        <path d={brush([[306, 418], [311, 421], [316, 419]], 1.4, { seed: 52, head: 0.3 })} opacity={0.7} />
        <path d={brush([[318, 426], [327, 430]], 2.4, { seed: 53 })} opacity={0.6} />
        <path d={brush([[276, 454], [278, 466]], 1.4, { seed: 54 })} opacity={0.6} />
        <path d={brush([[290, 454], [291, 466]], 1.4, { seed: 55 })} opacity={0.6} />
      </g>
          </svg>
  );
}
