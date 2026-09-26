/**
 * One small emblem per project, drawn in a 120 x 120 box with a few stitch
 * types. Keep each to a single idea: it has to read at 120px on a phone.
 */
import type { ReactNode } from "react";
import { Knots, Run, Satin, Stem, Strokes, thread as t } from "./stitch";

type Draw = () => ReactNode;

const range = (n: number) => Array.from({ length: n }, (_, k) => k);

const phren: Draw = () => (
  <>
    <Stem c={t.woad} i={0} w={2.08} d="M30 40 Q45 26 60 28 Q76 30 90 42" />
    <Stem c={t.woad} i={1} w={2.08} d="M30 40 Q30 60 42 72 Q60 82 78 74 Q92 60 90 42" />
    <Stem c={t.woad} i={2} w={2.08} d="M42 72 Q46 90 60 98 Q74 90 78 74" />
    <Stem c={t.woad} i={2} w={2.08} d="M60 28 Q50 50 42 72 M60 28 Q72 52 78 74" />
    <Run c={t.madder} i={3} w={2.21} d="M60 98 C80 98 72 80 78 74 C86 64 102 54 90 42 C82 30 70 18 60 28 C48 38 34 28 30 40" />
    <Knots c={t.plum} i={5} r={3.91} pts={[[30, 40], [60, 28], [90, 42], [42, 72], [78, 74], [60, 98]]} />
  </>
);

const ogrid: Draw = () => {
  const g = range(5).map((k) => 24 + k * 18);
  return (
    <>
      {g.map((v, k) => (
        <Run key={`h${k}`} c={t.walnut} i={0} w={1.56} dash={[2.4, 2.6]} d={`M24 ${v}H96`} />
      ))}
      {g.map((v, k) => (
        <Run key={`v${k}`} c={t.walnut} i={1} w={1.56} dash={[2.4, 2.6]} d={`M${v} 24V96`} />
      ))}
      <Satin c={t.green} i={2} angle={45} d="M44 44H76V76H44Z" box={[44, 44, 32, 32]} />
      {[[33, 33], [87, 33], [33, 87], [69, 87]].map(([x, y], k) => (
        <Strokes key={k} c={t.weld} i={3} w={2.08} lines={[[x - 4, y - 4, x + 4, y + 4], [x + 4, y - 4, x - 4, y + 4]]} />
      ))}
      <Knots c={t.madder} i={4} r={3.45} pts={[[77, 77]]} />
    </>
  );
};

/** Harmonic waveform used by the m4l-builder emblem and panel. */
export function wave(x: number, harmonics: number, cycles = 2) {
  let y = 0;
  for (let k = 1; k <= harmonics; k++) y += Math.sin(k * x * Math.PI * 2 * cycles) / k;
  return y / 1.2;
}

const m4lBuilder: Draw = () => {
  const lines = range(15).map((k): [number, number, number, number] => {
    const x = 64 + k * 3;
    const y = 60 - wave(k / 14, 3, 1) * 20;
    return [x, 60, x, y];
  });
  const ticks = range(5).map((k): [number, number] => {
    const a = ((-135 + k * 67.5) * Math.PI) / 180;
    return [36 + Math.sin(a) * 26, 60 - Math.cos(a) * 26];
  });
  return (
    <>
      <Satin c={t.weld} i={0} angle={-30} outline={t.walnut} d="M18 60a18 18 0 1 0 36 0a18 18 0 1 0-36 0Z" box={[18, 42, 36, 36]} />
      <Stem c={t.madder} i={1} w={3.12} d="M36 60L27 50" />
      <Strokes c={t.madder} i={2} w={2.47} lines={lines} />
      <Run c={t.walnut} i={3} w={1.69} dash={[2.6, 2.6]} d="M60 84H108" />
      <Knots c={t.walnut} i={4} r={2.07} pts={ticks} />
    </>
  );
};

const livemcp: Draw = () => (
  <>
    <Stem c={t.woad} i={0} w={2.86} d="M16 80 Q60 22 104 80" />
    <Stem c={t.walnut} i={1} w={2.86} d="M12 80H108" />
    <Strokes
      c={t.woad}
      i={2}
      w={1.56}
      lines={[30, 40, 50, 60, 70, 80, 90].map((x): [number, number, number, number] => {
        const u = (x - 16) / 88;
        return [x, 80, x, 80 - 4 * 29 * u * (1 - u) * 2 + 2];
      })}
    />
    <Run c={t.woad} i={3} w={1.82} opacity={0.75} d="M20 96 Q30 91 40 96 T60 96 T80 96 T100 96" />
    <Knots c={t.madder} i={4} r={3.68} pts={[[12, 80], [108, 80]]} />
  </>
);

const intrapath: Draw = () => (
  <>
    <Stem c={t.walnut} i={0} w={2.34} d="M18 80H40V102H18Z" />
    <Run c={t.madder} i={1} w={2.34} d="M40 91 C60 92 44 64 62 62 C82 60 70 40 80 38" />
    <Satin c={t.madder} i={2} angle={30} outline={t.walnut} d="M80 20H104V44H80Z" box={[80, 20, 24, 24]} />
    <Knots c={t.weld} i={3} r={2.3} pts={[[52, 82], [56, 66], [74, 52]]} />
  </>
);

const atlas: Draw = () => (
  <>
    <Stem c={t.walnut} i={0} w={2.34} d="M36 16H74L86 28V56H36Z M74 16V28H86" />
    <Run c={t.woad} i={1} w={1.95} dash={[2.6, 2.4]} d="M44 30H70 M44 38H78 M44 46H72" />
    <Run c={t.madder} i={2} w={1.82} d="M22 64H98" />
    <Stem c={t.woad} i={3} w={2.08} opacity={0.6} d="M36 112H74L86 100V72H36Z M74 112V100H86" />
    <Run c={t.woad} i={4} w={1.69} opacity={0.6} dash={[2.6, 2.4]} d="M44 98H70 M44 90H78 M44 82H72" />
  </>
);

const basis: Draw = () => {
  const rows = [30, 54, 78];
  const cols = range(6).map((k) => 26 + k * 13.6);
  return (
    <>
      {rows.map((y, r) => (
        <Strokes key={r} c={t.green} i={r} w={2.86} lines={cols.map((x): [number, number, number, number] => [x, y - 6, x, y + 6])} />
      ))}
      <Run
        c={t.madder}
        i={3}
        w={1.82}
        dash={[2.4, 2.4]}
        d="M94 92 H24 Q16 92 16 84 Q16 66 24 66 H94 Q102 66 102 58 Q102 42 94 42 H24 Q16 42 16 34 Q16 18 26 18"
      />
      <Knots c={t.madder} i={4} r={2.76} pts={[[94, 92], [26, 18]]} />
    </>
  );
};

const mina: Draw = () => (
  <>
    <Satin c={t.cream} i={0} angle={70} gap={1.2} outline={t.night} outlineW={1.2} d="M46 16 A22 22 0 1 0 72 46 A17 17 0 1 1 46 16Z" box={[22, 16, 50, 46]} />
    <g transform="rotate(-14 66 84)">
      <Satin c={t.cream} i={1} angle={30} gap={1.2} outline={t.night} outlineW={1.2} d="M38 84a28 14 0 1 0 56 0a28 14 0 1 0-56 0Z" box={[38, 70, 56, 28]} />
      <Stem c={t.night} i={2} w={1.43} d="M56 72 Q62 84 58 97 M72 71 Q78 84 74 97" />
    </g>
    <Satin c={t.cream} i={2} angle={-20} gap={1.2} outline={t.night} outlineW={1.2} d="M31 86a9 9 0 1 0 18 0a9 9 0 1 0-18 0Z" box={[31, 77, 18, 18]} />
    <Knots c={t.weld} i={3} r={1.84} pts={[[88, 22], [100, 40], [80, 34]]} />
  </>
);

const mutter: Draw = () => (
  <>
    <Satin c={t.woad} i={0} angle={60} d="M22 48a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z" box={[22, 40, 16, 16]} />
    <Stem c={t.woad} i={0} w={2.6} d="M14 84 Q30 60 46 84" />
    <Satin c={t.plum} i={1} angle={-60} d="M82 48a8 8 0 1 0 16 0a8 8 0 1 0-16 0Z" box={[82, 40, 16, 16]} />
    <Stem c={t.plum} i={1} w={2.6} d="M74 84 Q90 60 106 84" />
    <Run c={t.madder} i={2} w={1.95} dash={[2.2, 2.4]} d="M48 44 Q53 50 48 56 M54 38 Q62 50 54 62" />
    <Run c={t.madder} i={3} w={1.95} dash={[2.2, 2.4]} d="M72 44 Q67 50 72 56 M66 38 Q58 50 66 62" />
  </>
);

/** A stepped border, repeated. Used small here and long on its own page. */
export function borderRepeats(n: number, x0: number, unit: number, y0: number, y1: number) {
  let d = `M${x0} ${y1}`;
  for (let k = 0; k < n; k++) {
    const x = x0 + k * unit;
    d += ` L${x + unit / 2} ${y0} L${x + unit} ${y1}`;
  }
  return d;
}

const intranetErp: Draw = () => (
  <>
    <Stem c={t.walnut} i={0} w={2.34} d="M8 42H112 M8 78H112" />
    <Stem c={t.madder} i={1} w={2.86} d={borderRepeats(5, 10, 20, 50, 70)} />
    <Knots c={t.weld} i={2} r={2.53} pts={range(5).map((k): [number, number] => [20 + k * 20, 72])} />
    <Run c={t.walnut} i={3} w={1.56} dash={[2, 2.6]} d="M8 34H112 M8 86H112" />
  </>
);

const emv: Draw = () => (
  <>
    <Stem c={t.walnut} i={0} w={2.08} opacity={0.7} d="M30 30 L76 22 L84 72 L38 80Z" />
    <Stem c={t.walnut} i={1} w={2.08} opacity={0.85} d="M36 36 L82 36 L82 86 L36 86Z" />
    <Satin c={t.green} i={2} angle={20} outline={t.walnut} d="M42 44 L88 50 L82 100 L36 94Z" box={[36, 44, 52, 56]} />
  </>
);

const equipmentTracker: Draw = () => (
  <>
    <Stem c={t.woad} i={0} w={2.6} d="M42 44H96V88H42L26 66Z" />
    <Stem c={t.walnut} i={1} w={2.08} d="M36 66a4 4 0 1 0 0.1 0" />
    <Run c={t.walnut} i={2} w={2.08} d="M36 62 C22 48 22 26 44 18 C58 14 64 22 60 30" />
    <Run c={t.woad} i={3} w={1.95} dash={[2.6, 2.4]} d="M52 58H86 M52 66H80 M52 74H84" />
  </>
);

const alphalens: Draw = () => (
  <>
    <Run c={t.weld} i={0} w={2.34} d="M16 88 L34 74 L48 80 L62 58 L76 64 L94 40" />
    <Knots c={t.weld} i={1} r={2.3} pts={[[34, 74], [62, 58], [94, 40]]} />
    <Stem c={t.walnut} i={2} w={2.6} d="M46 58a20 20 0 1 0 40 0a20 20 0 1 0-40 0" />
    <Stem c={t.walnut} i={3} w={4.42} d="M80 73 L100 94" />
  </>
);

const gardenSensorNetwork: Draw = () => (
  <>
    <Stem c={t.green} i={0} w={2.6} d="M60 102 C60 84 57 66 60 40" />
    <Satin c={t.green} i={1} angle={-40} outline={t.green} d="M59 80 C44 80 34 68 32 58 C46 58 56 66 59 80Z" box={[32, 58, 27, 22]} />
    <Satin c={t.green} i={2} angle={40} outline={t.green} d="M61 64 C74 62 84 52 88 42 C74 42 64 50 61 64Z" box={[61, 42, 27, 22]} />
    <Knots c={t.weld} i={3} r={3.45} pts={[[60, 37]]} />
    <Run c={t.walnut} i={3} w={2.08} d="M30 104H90" />
    <Stem c={t.madder} i={4} w={1.69} d="M82 104V90" />
    <Knots c={t.madder} i={4} r={2.76} pts={[[82, 88]]} />
  </>
);

const retrofit: Draw = () => (
  <>
    <Stem c={t.walnut} i={0} w={2.6} d="M34 60V98H86V60" />
    <Satin c={t.madder} i={1} angle={-60} outline={t.walnut} d="M26 62 L60 32 L94 62Z" box={[26, 32, 68, 30]} />
    <Stem c={t.woad} i={2} w={2.08} d="M50 72H70V88H50Z M60 72V88" />
    <Run c={t.walnut} i={3} w={1.69} dash={[2.4, 2.4]} d="M22 104H98" />
    <Knots c={t.weld} i={4} r={2.3} pts={[[100, 24], [106, 30], [96, 32]]} />
  </>
);

const emblems: Record<string, Draw> = {
  phren,
  ogrid,
  "m4l-builder": m4lBuilder,
  livemcp,
  intrapath,
  atlas,
  basis,
  mina,
  mutter,
  "intranet-erp": intranetErp,
  emv,
  "equipment-tracker": equipmentTracker,
  alphalens,
  "garden-sensor-network": gardenSensorNetwork,
  "retrofit-program-data-tools": retrofit,
};

/** The emblem drawing for a slug, in 120 x 120 units. */
export function EmblemArt({ slug }: { slug: string }) {
  const draw = emblems[slug];
  return draw ? <>{draw()}</> : null;
}
