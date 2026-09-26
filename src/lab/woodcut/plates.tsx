import {
  along,
  contourCuts,
  cutsAlong,
  gouge,
  hatch,
  hash,
  lens,
  ridge,
  rings,
  rng,
  underRidge,
  vHatch,
  type Pt,
} from "./carve";
import type { Layer } from "./Print";

export const INK = {
  paper: "#f2ead8",
  key: "#2f3a4a",
  terra: "#c46a4a",
  ochre: "#dcae5f",
  pale: "#e6c888",
  sage: "#93a684",
  mist: "#a9bccf",
  night: "#a3afcd",
  nightKey: "#3b4763",
};

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;

/** Rows of cuts between two ridges, stopping short of the lower one. */
function bandCuts(
  top: (x: number) => number,
  bottom: (x: number) => number,
  x0: number,
  x1: number,
  spacing: number,
  r: () => number,
  w: (k: number) => number,
): string {
  let d = "";
  for (let k = 1; k < 40; k++) {
    const pts = along((x) => top(x) + k * spacing, x0, x1, 6);
    let run: Pt[] = [];
    let any = false;
    for (const p of pts) {
      if (p[1] < bottom(p[0]) - spacing * 0.6) {
        run.push(p);
        any = true;
      } else {
        if (run.length > 1) d += cutsAlong(run, r, { seg: [3, 12], gap: [1, 4], w: w(k) });
        run = [];
      }
    }
    if (run.length > 1) d += cutsAlong(run, r, { seg: [3, 12], gap: [1, 4], w: w(k) });
    if (!any) break;
  }
  return d;
}

/** A palm: bent trunk and drooping fronds. */
function palm(x: number, y: number, h: number, r: () => number): string {
  const top: Pt = [x + h * 0.08, y - h];
  let d = lens(along((t) => y - t * h, 0, 1, 0.1).map(([t, yy]) => [x + Math.sin(t * 1.4) * h * 0.08, yy] as Pt), h * 0.07);
  for (let i = 0; i < 8; i++) {
    const a = -Math.PI / 2 + (i - 3.5) * 0.42 + (r() - 0.5) * 0.15;
    const len = h * (0.32 + r() * 0.1);
    const pts: Pt[] = [];
    for (let t = 0; t <= 1.001; t += 0.125) {
      pts.push([top[0] + Math.cos(a) * len * t, top[1] + Math.sin(a) * len * t + t * t * len * 0.55]);
    }
    d += lens(pts, h * 0.05);
  }
  return d;
}

/* ------------------------------------------------------------------ */
/* Frontispiece: the studio window, Los Angeles hills at golden hour. */
/* ------------------------------------------------------------------ */

export const STUDIO = { w: 1000, h: 640 };

export function studioLayers(): Layer[] {
  const r = rng(11);
  const [W0, W1, T, B] = [110, 890, 40, 470];
  const sun: Pt = [640, 300];
  const far = ridge(312, [[14, 0.011, 1], [8, 0.027, 2], [4, 0.06, 0.5]]);
  const mid = ridge(372, [[22, 0.007, 4], [10, 0.019, 1], [4, 0.05, 3]]);
  const near = ridge(448, [[9, 0.006, 2.2], [5, 0.021, 0.3], [2, 0.07, 1]]);
  const toSun = (x: number, y: number) => Math.hypot(x - sun[0], y - sun[1]);

  // Ochre: the whole sheet, with the sun and a sky of horizontal cuts.
  const ochreCuts =
    circle(sun[0], sun[1], 44) +
    rings(sun[0], sun[1], 56, 150, 11, r, (rad) => 4.5 - rad / 45) +
    hatch(W0, W1, T + 4, 300, 9, r, (x, y) => {
      const d = toSun(x, y);
      return d < 160 ? 0 : 0.8 + 4 * Math.max(0, 1 - d / 420);
    }) +
    hatch(0, 1000, 478, 500, 7, r, 1.4, [6, 20]);

  // Terracotta: the room wall, the hills, the bench front.
  const wall = "M0 0H1000V470H0Z M96 26V476H904V26Z";
  const toWindow = (x: number, y: number) => {
    const dx = Math.max(W0 - x, 0, x - W1);
    const dy = Math.max(T - y, 0);
    return Math.hypot(dx, dy);
  };
  const terraCuts =
    vHatch(4, 1000, 0, 470, 8, r, (x, y) => (toWindow(x, y) < 14 ? 0 : 0.5 + 3.6 * Math.max(0, 1 - toWindow(x, y) / 110))) +
    bandCuts(far, mid, W0, W1, 6, r, (k) => Math.max(1.6, 4.2 - k * 0.12)) +
    bandCuts(mid, near, W0, W1, 7, r, (k) => (k < 3 ? 3.4 : Math.max(0.6, 2.2 - k * 0.2))) +
    hatch(0, 1000, 518, 636, 11, r, (x, y) => 0.8 + (y - 518) / 70, [10, 40]);

  // Key: window frame, the near hill, palms, the bench and what's on it.
  const frame =
    "M96 26H904V476H96Z M110 40V168H494V40Z M506 40V168H890V40Z M110 180V470H494V180Z M506 180V470H890V180Z";
  const frameCuts =
    gouge(103, 44, 103, 462, 2) +
    gouge(897, 44, 897, 462, 2) +
    gouge(118, 33, 882, 33, 2) +
    gouge(500, 52, 500, 460, 1.6) +
    gouge(122, 174, 878, 174, 1.6);
  const nearCuts = contourCuts(near, W0, W1, 4, 5.5, r, (k) => Math.max(1.4, 3.6 - k * 0.5));
  const palms = palm(236, near(236) + 4, 170, r) + palm(772, near(772) + 4, 132, r) + palm(812, near(812) + 4, 100, r);
  const plant = [-0.55, -0.3, -0.08, 0.15, 0.4].map((a, i) =>
    lens(along(() => 0, 0, 1, 0.2).map(([t]) => [190 + Math.sin(a) * t * (84 + i * 7) + t * t * a * 20, 424 - Math.cos(a) * t * (84 + i * 7)] as Pt), 11),
  ).join("");
  // Everything on the sill is a key-block silhouette with a few highlights cut in.
  const sill =
    "M162 420H218L208 488H172Z" + // clay pot
    rect(156, 414, 68, 12) +
    rect(318, 460, 140, 28) + // two books
    "M330 436L444 432L446 460L332 462Z" +
    "M338 428L452 419L453 424L339 433Z" + // a pencil
    rect(770, 430, 50, 58); // mug
  const sillCuts =
    gouge(176, 438, 204, 438, 1.6) +
    gouge(178, 452, 202, 452, 1.4) +
    gouge(324, 468, 452, 468, 1.4) +
    gouge(324, 476, 452, 476, 1.4) +
    gouge(338, 444, 440, 441, 1.4) +
    gouge(338, 452, 440, 449, 1.4) +
    vHatch(778, 812, 436, 482, 7, r, 1.8);
  const benchLines = [520, 548, 584, 616].map((y) => lens(along((x) => y + Math.sin(x / 90 + y) * 3, 0, 1000, 20), 3)).join("");

  return [
    { ink: INK.ochre, art: <path d="M100 30H900V505H100Z M0 470H1000V505H0Z" />, cuts: ochreCuts },
    {
      ink: INK.terra,
      art: (
        <>
          <path d={wall} fillRule="evenodd" />
          <path d={underRidge(far, W0, W1, B)} />
          <path d="M0 505H1000V640H0Z" />
        </>
      ),
      cuts: terraCuts,
    },
    {
      ink: INK.key,
      art: (
        <>
          <path d={frame} fillRule="evenodd" />
          <path d={underRidge(near, W0, W1, B)} />
          <path d={palms} />
          <path d={rect(0, 503, 1000, 7)} />
          <path d={benchLines} />
          <path d={plant} />
          <path d={sill} />
          <path d="M820 440c24 0 24 34 0 34" fill="none" stroke="currentColor" strokeWidth={8} />
        </>
      ),
      cuts: frameCuts + nearCuts + sillCuts,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Showcase: Phren. A tall bookcase and a reading lamp.               */
/* ------------------------------------------------------------------ */

export const PHREN = { w: 600, h: 820 };

export function phrenLayers(): Layer[] {
  const r = rng(hash("phren"));
  const lamp: Pt = [488, 318];
  const shelves = [88, 206, 324, 442, 560, 678];
  let books = "";
  let bookCuts = "";
  let pages = "";
  let pageCuts = "";
  for (let s = 0; s < shelves.length - 1; s++) {
    const floor = shelves[s + 1] - 2;
    let x = 84 + r() * 6;
    while (x < 350) {
      const bw = 11 + r() * 13;
      if (x + bw > 356) break;
      const roll = r();
      if (roll < 0.1) {
        // a gap, sometimes with a small stack of pages lying flat
        if (r() < 0.6 && x + 50 < 356) {
          pages += rect(x + 2, floor - 16, 44, 16);
          for (let yy = floor - 12; yy < floor - 2; yy += 4) pageCuts += gouge(x + 4, yy, x + 44, yy, 1.1);
          x += 52;
        } else x += 18;
        continue;
      }
      const bh = 62 + r() * 38;
      if (roll > 0.93 && x + bh * 0.4 < 356) {
        // a leaning book
        const lean = 0.28;
        books += `M${x} ${floor}L${x + bw} ${floor}L${x + bw + bh * lean} ${floor - bh}L${x + bh * lean} ${floor - bh}Z`;
        x += bw + bh * lean + 2;
        continue;
      }
      books += rect(x, floor - bh, bw, bh);
      bookCuts += gouge(x + 2, floor - bh + 10, x + bw - 2, floor - bh + 10, 1.4);
      bookCuts += gouge(x + 2, floor - 12, x + bw - 2, floor - 12, 1.4);
      if (r() < 0.35) bookCuts += gouge(x + bw / 2, floor - bh + 18, x + bw / 2, floor - 20, bw * 0.18);
      if (r() < 0.18) pages += rect(x + 2, floor - bh - 9, bw - 4, 12);
      x += bw + 1 + r() * 2;
    }
  }
  const caseArt = "M58 64H382V752H58Z M76 88V742H364V88Z";
  const shelfArt = shelves.slice(1, -1).map((y) => rect(76, y - 2, 288, 12)).join("") + rect(46, 50, 348, 18);
  const caseCuts = vHatch(62, 72, 90, 740, 5, r, 1.2) + vHatch(368, 378, 90, 740, 5, r, 1.2) + gouge(52, 58, 388, 58, 1.8);

  const ochreCuts =
    rings(lamp[0], lamp[1] + 30, 40, 290, 10, r, (rad) => (rad < 70 ? 5 : 0.6 + ((rad - 70) / 220) * 5.2)) +
    hatch(0, 600, 770, 812, 8, r, 1.8, [8, 22]);

  const stool = rect(420, 640, 136, 14) + rect(432, 654, 10, 96) + rect(534, 654, 10, 96) + rect(438, 700, 100, 6);
  const stoolPages = "M430 612L540 606L546 640L428 640Z";
  let stoolCuts = "";
  for (let yy = 616; yy < 638; yy += 5) stoolCuts += gouge(434, yy, 538, yy - 3, 1.1);
  const loose = "M300 770L352 760L358 790L304 800Z"; // a page fallen to the floor

  return [
    {
      ink: INK.pale,
      art: (
        <>
          <circle cx={lamp[0]} cy={lamp[1] + 30} r={292} />
          <rect y={752} width={600} height={68} />
        </>
      ),
      cuts: ochreCuts,
    },
    {
      ink: INK.terra,
      art: (
        <>
          <path d={pages} />
          <path d={stoolPages} />
          <path d={loose} />
        </>
      ),
      cuts: pageCuts + stoolCuts + gouge(308, 776, 350, 768, 1) + gouge(310, 786, 352, 778, 1),
    },
    {
      ink: INK.key,
      art: (
        <>
          <path d={caseArt} fillRule="evenodd" />
          <path d={shelfArt} />
          <path d={books} />
          {/* reading lamp */}
          <path d="M438 250H538L566 318H410Z" />
          <path d={lens([[488, 318], [487, 500], [489, 700], [488, 748]], 9)} />
          <ellipse cx={488} cy={750} rx={44} ry={8} />
          <path d={stool} />
          <rect y={752} width={600} height={68} />
        </>
      ),
      cuts:
        caseCuts +
        bookCuts +
        vHatch(420, 556, 256, 314, 11, r, 2) +
        hatch(0, 600, 760, 816, 9, r, (x) => 1.5 + Math.max(0, 3 - Math.abs(x - 488) / 70), [10, 34]),
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Showcase: m4l-builder. A loudspeaker above a synthesizer panel.     */
/* ------------------------------------------------------------------ */

export const M4L = { w: 1000, h: 640, knob: { x: 858, y: 548, r: 56 } };

export function m4lLayers(v: number): Layer[] {
  const r = rng(hash("m4l-builder"));
  const c: Pt = [228, 262];
  const { knob } = M4L;

  // Waves: spacing tightens and the ripple sharpens as the knob turns up.
  const spacing = 64 - 36 * v;
  const amp = 1 + 14 * v * v;
  const freq = 2 + 30 * v;
  let waves = "";
  for (let rad = 170; rad < 900; rad += spacing) {
    let run: Pt[] = [];
    for (let a = -0.95; a <= 0.95; a += 0.01) {
      // past halfway the ripple squares off, like a wave being driven harder
      const s = Math.sin(a * freq + rad * 0.05);
      const rr = rad + amp * (v > 0.5 ? Math.sign(s) * Math.pow(Math.abs(s), 1 - (v - 0.5) * 1.6) : s);
      const p: Pt = [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr];
      if (p[0] > 404 && p[0] < 980 && p[1] > 22 && p[1] < 440) run.push(p);
      else {
        if (run.length > 2) waves += lens(run, 7 - (rad / 900) * 3);
        run = [];
      }
    }
    if (run.length > 2) waves += lens(run, 7 - (rad / 900) * 3);
  }

  const angle = (-135 + 270 * v) * (Math.PI / 180);
  const ix = knob.x + Math.sin(angle) * (knob.r - 10);
  const iy = knob.y - Math.cos(angle) * (knob.r - 10);
  let knurl = "";
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2;
    knurl += gouge(knob.x + Math.cos(a) * (knob.r - 7), knob.y + Math.sin(a) * (knob.r - 7), knob.x + Math.cos(a) * (knob.r - 1), knob.y + Math.sin(a) * (knob.r - 1), 1.6);
  }
  let ticks = "";
  for (let i = 0; i <= 10; i++) {
    const a = (-135 + 27 * i) * (Math.PI / 180);
    ticks += gouge(knob.x + Math.sin(a) * (knob.r + 8), knob.y - Math.cos(a) * (knob.r + 8), knob.x + Math.sin(a) * (knob.r + 18), knob.y - Math.cos(a) * (knob.r + 18), 2.4);
  }
  const small = (x: number, y: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return gouge(x, y, x + Math.sin(a) * 24, y - Math.cos(a) * 24, 3.4);
  };

  const cabinet = `M64 34H392V446H64Z ${circle(c[0], c[1], 136)} ${circle(228, 96, 38)}`;
  const cone =
    rings(c[0], c[1], 44, 128, 12, r, 1.8) + circle(c[0], c[1], 20);

  return [
    {
      ink: INK.ochre,
      art: (
        <>
          <circle cx={c[0]} cy={c[1]} r={136} />
          <circle cx={228} cy={96} r={38} />
          <rect x={24} y={466} width={952} height={150} />
        </>
      ),
      cuts: rings(c[0], c[1], 30, 126, 16, r, 2.4) + hatch(30, 970, 474, 610, 10, r, 0.9, [6, 20]),
    },
    { ink: INK.terra, art: <path d={waves} /> },
    {
      ink: INK.key,
      art: (
        <>
          <path d={cabinet} fillRule="evenodd" />
          <path d={cone} />
          <circle cx={c[0]} cy={c[1]} r={34} />
          <circle cx={228} cy={96} r={14} />
          <path d={`M24 466H976V616H24Z M34 476V606H966V476Z`} fillRule="evenodd" />
          <circle cx={150} cy={541} r={36} />
          <circle cx={270} cy={541} r={36} />
          <circle cx={390} cy={541} r={36} />
          {[520, 580, 640].map((x) => <circle key={x} cx={x} cy={541} r={17} />)}
          <path d={lens(along((x) => 548 + 34 * Math.sin(((x - 520) / 120) * Math.PI), 520, 640, 8), 6)} />
          <circle cx={knob.x} cy={knob.y} r={knob.r} />
          {[46, 954].map((x) => [488, 594].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={5} />))}
        </>
      ),
      cuts:
        vHatch(70, 386, 40, 440, 9, r, (x, y) => (Math.hypot(x - c[0], y - c[1]) < 146 || Math.hypot(x - 228, y - 96) < 48 ? 0 : 2.2)) +
        rings(c[0], c[1], 8, 26, 9, r, 1.8) +
        small(150, 541, -60) +
        small(270, 541, 30) +
        small(390, 541, 100) +
        [520, 580, 640].map((x) => circle(x, 541, 7)).join("") +
        knurl +
        gouge(knob.x, knob.y, ix, iy, 6),
      shift: [0, 0],
    },
    // ticks around the big knob are cut out of nothing: printed in key as marks
    { ink: INK.key, art: <path d={ticks} /> },
  ];
}

/* ------------------------------------------------------------------ */
/* Showcase: Mina. A crib under a window, the moon, one warm lamp.    */
/* ------------------------------------------------------------------ */

export const MINA = { w: 700, h: 780 };

export function minaLayers(): Layer[] {
  const r = rng(hash("mina"));
  const moon: Pt = [545, 138];
  const [WX0, WX1, WY0, WY1] = [300, 620, 70, 350];
  let stars = "";
  for (let i = 0; i < 14; i++) {
    const x = WX0 + 20 + r() * (WX1 - WX0 - 40);
    const y = WY0 + 16 + r() * 150;
    if (Math.hypot(x - moon[0], y - moon[1]) < 90) continue;
    const s = 2 + r() * 2.4;
    stars += gouge(x - s, y, x + s, y, s * 0.7) + gouge(x, y - s, x, y + s, s * 0.7);
  }
  const lamp: Pt = [146, 452];
  // Night sky: thin key strokes, closer together toward the top of the pane.
  let skyLines = "";
  for (let y = WY0 + 8; y < WY1 - 4; y += 7 + (y - WY0) / 22) {
    const pts = along(() => y, WX0 + 2, WX1 - 2, 6).filter(([x]) => Math.hypot(x - moon[0], y - moon[1]) > 58);
    let run: Pt[] = [];
    for (const p of pts) {
      if (run.length && p[0] - run[run.length - 1][0] > 7) {
        skyLines += cutsAlong(run, r, { seg: [4, 16], gap: [1, 4], w: 2.6 - (y - WY0) / 160 });
        run = [];
      }
      run.push(p);
    }
    skyLines += cutsAlong(run, r, { seg: [4, 16], gap: [1, 4], w: 2.6 - (y - WY0) / 160 });
  }
  let bars = "";
  for (let x = 262; x <= 632; x += 24) bars += rect(x, 402, 8, 190);
  let glow = "";
  for (let rad = 70; rad < 200; rad += 16) {
    const pts: Pt[] = [];
    for (let a = -Math.PI; a <= Math.PI; a += 0.05) pts.push([lamp[0] + Math.cos(a) * rad, lamp[1] + Math.sin(a) * rad * 0.9]);
    glow += cutsAlong(pts.filter(([x, y]) => y < 640 && x > 8), r, { seg: [3, 7], gap: [1, 4], w: 3.2 - rad / 80 });
  }

  return [
    {
      ink: INK.night,
      art: <rect width={700} height={780} />,
      cuts:
        circle(moon[0], moon[1], 34) +
        rings(moon[0], moon[1], 44, 100, 11, r, (rad) => 3.4 - rad / 36) +
        stars +
        vHatch(8, 290, 10, 680, 13, r, 0.8) +
        vHatch(630, 696, 10, 680, 13, r, 0.8) +
        // lamp light on the wall
        rings(lamp[0], lamp[1], 30, 150, 10, r, (rad) => 5.5 - rad / 30) +
        // the blanket in the crib
        "M300 560C340 528 440 530 500 548C540 560 590 556 600 572L600 588H300Z",
    },
    {
      ink: INK.terra,
      art: (
        <>
          <path d="M108 388H184L200 450H92Z" />
          <path d={glow} />
        </>
      ),
      cuts: gouge(120, 398, 116, 440, 2) + gouge(142, 396, 142, 442, 2) + gouge(166, 398, 170, 440, 2),
    },
    {
      ink: INK.nightKey,
      art: (
        <>
          {/* window frame and its night sky */}
          <path d={`M${WX0 - 14} ${WY0 - 14}H${WX1 + 14}V${WY1 + 14}H${WX0 - 14}Z M${WX0} ${WY0}V${WY1}H${WX1}V${WY0}Z`} fillRule="evenodd" />
          <path d={rect(456, WY0, 8, WY1 - WY0) + rect(WX0, 206, WX1 - WX0, 8)} />
          <path d={skyLines} />
          {/* crib */}
          <path d={rect(244, 388, 412, 16) + rect(244, 588, 412, 14) + rect(244, 388, 16, 290) + rect(640, 388, 16, 290)} />
          <path d={bars} />
          {/* side table and lamp base */}
          <path d={rect(70, 500, 150, 12) + rect(84, 512, 10, 168) + rect(196, 512, 10, 168)} />
          <path d="M136 450H156L160 500H132Z" />
          {/* floor */}
          <rect y={678} width={700} height={102} />
        </>
      ),
      cuts:
        hatch(0, 700, 686, 776, 7, r, (x) => 2.8 + Math.max(0, 2.6 - Math.abs(x - 450) / 110), [10, 30]) +
        gouge(250, 396, 650, 396, 1.6),
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Small plates for every other project.                              */
/* ------------------------------------------------------------------ */

export const SMALL = { w: 320, h: 240 };

type Small = () => Layer[];

const small: Record<string, Small> = {
  basis: () => {
    const r = rng(hash("basis"));
    const pan = (cx: number) => `M${cx - 36} 150Q${cx} 178 ${cx + 36} 150Z`;
    const strings = (cx: number) => lens([[cx, 72], [cx - 34, 150]], 2.2) + lens([[cx, 72], [cx + 34, 150]], 2.2);
    return [
      { ink: INK.sage, art: <circle cx={160} cy={122} r={98} />, cuts: rings(160, 122, 20, 96, 9, r, (rad) => 0.8 + rad / 40) },
      {
        ink: INK.terra,
        art: (
          <>
            <path d={pan(78) + pan(242)} />
            <path d={rect(58, 128, 16, 20) + rect(76, 134, 16, 14) + rect(66, 116, 16, 12)} />
            <path d="M222 132L262 128L264 148L224 150Z" />
          </>
        ),
        cuts: gouge(228, 138, 258, 136, 0.9) + gouge(228, 143, 258, 141, 0.9),
      },
      {
        ink: INK.key,
        art: (
          <>
            <path d={rect(154, 64, 12, 140) + "M122 214H198L186 200H134Z"} />
            <path d={rect(70, 66, 180, 9)} />
            <circle cx={160} cy={64} r={9} />
            <path d={strings(78) + strings(242)} />
          </>
        ),
        cuts: gouge(158, 84, 158, 196, 1.2) + gouge(80, 70, 240, 70, 1),
      },
    ];
  },
  "intranet-erp": () => {
    const r = rng(hash("intranet-erp"));
    const crown = [[160, 84, 62], [104, 104, 44], [214, 102, 48], [132, 64, 38], [192, 60, 40], [80, 128, 30], [242, 128, 32]]
      .map(([x, y, rr]) => circle(x, y, rr))
      .join("");
    const hill = ridge(196, [[6, 0.02, 1], [3, 0.05, 2]]);
    let leaf = "";
    for (let i = 0; i < 70; i++) {
      const x = 60 + r() * 200;
      const y = 30 + r() * 120;
      const a = r() * 0.6 - 0.3;
      leaf += gouge(x, y, x + Math.cos(a) * 9, y + 5 + Math.sin(a) * 3, 2.4, 1.5);
    }
    return [
      { ink: INK.ochre, art: <path d={underRidge(hill, 0, 320, 240)} />, cuts: contourCuts(hill, 0, 320, 6, 7, r, (k) => 2.6 - k * 0.3) },
      { ink: INK.sage, art: <path d={crown} />, cuts: leaf },
      {
        ink: INK.key,
        art: (
          <>
            <path d="M146 204C150 170 152 150 140 124L150 120C158 138 162 150 162 158C166 142 176 128 190 118L196 126C178 140 172 164 176 204Z" />
            <path d={lens([[70, 206], [160, 202], [250, 206]], 6)} />
          </>
        ),
        cuts: gouge(156, 196, 154, 160, 1.4) + gouge(166, 196, 168, 162, 1.2),
      },
    ];
  },
  atlas: () => {
    const r = rng(hash("atlas"));
    const sea = ridge(176, [[2, 0.05, 1]]);
    return [
      { ink: INK.mist, art: <rect width={320} height={240} />, cuts: hatch(0, 320, 8, 170, 8, r, (x, y) => 0.8 + y / 90) },
      {
        ink: INK.ochre,
        art: <path d="M214 62L320 30V58ZM214 70L320 96V120Z" />,
        cuts: hatch(214, 320, 30, 120, 6, r, 1.2),
      },
      {
        ink: INK.terra,
        art: <path d={rect(186, 96, 30, 16) + rect(182, 134, 38, 16)} />,
      },
      {
        ink: INK.key,
        art: (
          <>
            <path d="M188 76H214L222 184H180Z" fill="none" stroke="currentColor" strokeWidth={3.5} />
            <path d="M184 54H218V76H184Z M178 50L201 34L224 50Z" />
            <path d={underRidge(sea, 0, 320, 240)} />
            <path d="M150 190C160 172 186 168 204 172C226 168 246 176 256 190Z" />
          </>
        ),
        cuts: contourCuts(sea, 0, 320, 8, 7, r, (k) => 2.6 - k * 0.18) + rect(191, 58, 20, 12),
      },
    ];
  },
  "garden-sensor-network": () => {
    const r = rng(hash("garden-sensor-network"));
    let leaves = "";
    for (let x = 70; x < 260; x += 22) {
      for (let i = -1; i <= 1; i++) {
        const top: Pt = [x + i * 9, 110 + r() * 12];
        leaves += lens([[x, 150], [(x + top[0]) / 2 + i * 4, 130], top], 8);
      }
    }
    return [
      { ink: INK.ochre, art: <circle cx={258} cy={52} r={26} />, cuts: rings(258, 52, 6, 22, 6, r, 1.6) },
      { ink: INK.sage, art: <path d={leaves} />, cuts: "" },
      {
        ink: INK.terra,
        art: <path d="M46 150H274V200H46Z" />,
        cuts: hatch(50, 270, 158, 196, 10, r, 1.8, [6, 18]),
      },
      {
        ink: INK.key,
        art: (
          <>
            <path d={rect(46, 146, 228, 8) + rect(46, 196, 228, 8)} />
            <path d={rect(58, 112, 4, 40) + rect(52, 104, 16, 12)} />
            <path d="M74 98a14 14 0 0 1 0 22 M82 90a24 24 0 0 1 0 38" fill="none" stroke="currentColor" strokeWidth={3} />
            <path d={rect(0, 204, 320, 36)} />
          </>
        ),
        cuts: hatch(0, 320, 212, 236, 7, r, 1.8, [6, 20]),
      },
    ];
  },
  ogrid: () => {
    const r = rng(hash("ogrid"));
    let lattice = "";
    for (let x = 40; x <= 280; x += 40) lattice += rect(x - 2, 30, 5, 180);
    for (let y = 30; y <= 210; y += 36) lattice += rect(38, y - 2, 245, 5);
    const vine = along((y) => 150 + Math.sin(y / 22) * 50, 206, 34, 6).map(([y, x]) => [x, y] as Pt);
    let leaves = "";
    vine.forEach(([x, y], i) => {
      if (i % 2) leaves += gouge(x, y, x + (i % 4 === 1 ? 20 : -20), y - 8, 7);
    });
    return [
      { ink: INK.ochre, art: <rect x={30} y={22} width={260} height={196} />, cuts: vHatch(34, 286, 26, 214, 10, r, 1.4) },
      { ink: INK.sage, art: <path d={lens(vine, 6) + leaves} /> },
      {
        ink: INK.terra,
        art: (
          <>
            <circle cx={118} cy={96} r={8} />
            <circle cx={196} cy={148} r={9} />
            <circle cx={128} cy={180} r={7} />
          </>
        ),
      },
      { ink: INK.key, art: <path d={lattice} />, cuts: "" },
    ];
  },
  livemcp: () => {
    const r = rng(hash("livemcp"));
    const water = ridge(170, [[1.5, 0.08, 0]]);
    return [
      { ink: INK.ochre, art: <rect width={320} height={170} />, cuts: hatch(0, 320, 8, 160, 8, r, (x, y) => 0.6 + y / 70) },
      {
        ink: INK.terra,
        art: <path d="M20 110H300V124H262C250 88 214 70 160 70C106 70 70 88 58 124H20Z M20 98H300V110H20Z" fillRule="evenodd" />,
        cuts: [40, 70, 100, 130, 160, 190, 220, 250, 280].map((x) => gouge(x, 99, x, 110, 1)).join("") + gouge(24, 104, 296, 104, 1),
      },
      {
        ink: INK.key,
        art: (
          <>
            <path d="M20 124H58C70 88 106 72 160 72C214 72 250 88 262 124H300V132H20Z" fill="none" stroke="currentColor" strokeWidth={3} />
            <path d={underRidge(water, 0, 320, 240)} />
          </>
        ),
        cuts:
          contourCuts(water, 0, 320, 9, 7, r, (k) => 2.4 - k * 0.12) +
          cutsAlong(along((x) => 176 + Math.sqrt(Math.max(0, 1 - ((x - 160) / 102) ** 2)) * 44, 58, 262, 5), r, { seg: [3, 7], gap: [1, 3], w: 3.2 }),
      },
    ];
  },
  intrapath: () => {
    const r = rng(hash("intrapath"));
    const hill = ridge(96, [[10, 0.015, 1], [4, 0.04, 0]]);
    const path = "M150 240C130 210 200 190 190 160C182 136 150 132 168 112L176 112C166 132 198 140 204 162C214 196 160 208 196 240Z";
    return [
      { ink: INK.ochre, art: <path d={underRidge(hill, 0, 320, 240)} />, cuts: contourCuts(hill, 0, 320, 18, 8, r, (k) => 1 + k * 0.1) + path },
      {
        ink: INK.terra,
        art: <path d="M170 86L190 70L210 86Z M232 90L244 80L256 90Z" />,
      },
      {
        ink: INK.key,
        art: (
          <>
            <path d={rect(174, 86, 32, 24) + rect(236, 90, 18, 14)} />
            <path d={lens([[40, 98], [40, 60]], 7) + circle(40, 54, 14)} />
            <path d={lens(along(hill, 0, 320, 8), 3)} />
          </>
        ),
        cuts: rect(186, 96, 8, 14) + rect(242, 94, 6, 6),
      },
    ];
  },
  mutter: () => {
    const r = rng(hash("mutter"));
    const can = (x: number, tilt: number) => `M${x} ${100 + tilt}h44v60h-44Z`;
    return [
      { ink: INK.mist, art: <circle cx={160} cy={120} r={96} />, cuts: rings(160, 120, 12, 94, 10, r, (rad) => 0.8 + rad / 36) },
      { ink: INK.terra, art: <path d={can(40, 0) + can(236, 0)} />, cuts: vHatch(44, 80, 106, 156, 8, r, 1.6) + vHatch(240, 276, 106, 156, 8, r, 1.6) },
      {
        ink: INK.key,
        art: (
          <>
            <path d={rect(38, 96, 48, 7) + rect(38, 157, 48, 7) + rect(234, 96, 48, 7) + rect(234, 157, 48, 7)} />
            <path d="M86 130C140 170 180 170 234 130" fill="none" stroke="currentColor" strokeWidth={2.5} />
          </>
        ),
      },
    ];
  },
  emv: () => {
    const r = rng(hash("emv"));
    let drawers = "";
    let handles = "";
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 3; col++) {
        const x = 86 + col * 52;
        const y = 60 + row * 44;
        if (!(row === 1 && col === 2)) drawers += rect(x, y, 46, 38);
        handles += rect(x + 17, y + (row === 1 && col === 2 ? 36 : 18), 12, 5);
      }
    return [
      { ink: INK.ochre, art: <path d={handles} /> },
      {
        ink: INK.terra,
        art: <path d="M80 52H244V200H80Z M190 104H236V142H190Z" fillRule="evenodd" />,
        cuts: vHatch(84, 240, 54, 198, 7, r, 1.2),
      },
      {
        ink: INK.key,
        art: (
          <>
            <path d={drawers} fill="none" stroke="currentColor" strokeWidth={3} />
            <path d="M184 132H250V180H184Z" />
            <path d={[192, 204, 216, 228].map((x) => rect(x, 114 + (x % 3) * 2, 10, 18)).join("")} fill="none" stroke="currentColor" strokeWidth={2} />
            <path d={rect(80, 200, 10, 20) + rect(234, 200, 10, 20) + rect(0, 218, 320, 22)} />
          </>
        ),
        cuts: gouge(192, 156, 242, 156, 1.6) + hatch(0, 320, 224, 238, 6, r, 1.4),
      },
    ];
  },
  "equipment-tracker": () => {
    const r = rng(hash("equipment-tracker"));
    let holes = "";
    for (let x = 44; x < 280; x += 16) for (let y = 34; y < 206; y += 16) holes += circle(x, y, 2.2);
    return [
      { ink: INK.ochre, art: <rect x={30} y={22} width={260} height={196} />, cuts: holes },
      {
        ink: INK.terra,
        art: <path d={rect(84, 146, 16, 52) + rect(204, 154, 14, 46) + "M140 60h40v14h-40Z"} />,
        cuts: gouge(92, 150, 92, 194, 1.4),
      },
      {
        ink: INK.key,
        art: (
          <>
            <path d="M70 58H114V78H98V146H86V78H70Z" />
            <path d="M152 74h16l-4 110h-8Z M160 176a12 12 0 1 0 0.1 0Z" />
            <path d="M198 60a14 14 0 1 1 26 0l-6 8v86h-14v-86Z" />
            <path d={rect(236, 52, 30, 140)} />
          </>
        ),
        cuts: gouge(210, 58, 212, 48, 3) + [60, 76, 92, 108, 124, 140, 156, 172].map((y) => gouge(262, y, 268, y + 4, 1.6)).join(""),
      },
    ];
  },
  alphalens: () => {
    const r = rng(hash("alphalens"));
    const line = ridge(150, [[14, 0.04, 0], [8, 0.11, 1], [4, 0.3, 2]]);
    const big = (x: number) => 120 + (line(126 + (x - 126) / 2) - 150) * 2.2;
    return [
      { ink: INK.mist, art: <circle cx={126} cy={110} r={64} />, cuts: hatch(62, 190, 50, 170, 7, r, 0.9) },
      { ink: INK.terra, art: <path d={lens(along(line, 16, 304, 5), 4)} /> },
      {
        ink: INK.key,
        art: (
          <>
            <circle cx={126} cy={110} r={70} fill="none" stroke="currentColor" strokeWidth={10} />
            <path d={lens([[176, 162], [244, 226]], 22)} />
            <path d={lens(along(big, 70, 182, 4), 4.5)} />
          </>
        ),
        cuts: gouge(64, 90, 90, 56, 2.2),
      },
    ];
  },
  "retrofit-program-data-tools": () => {
    const r = rng(hash("retrofit-program-data-tools"));
    return [
      { ink: INK.ochre, art: <rect width={320} height={206} />, cuts: hatch(0, 320, 8, 200, 8, r, (x, y) => 0.6 + y / 80) },
      {
        ink: INK.terra,
        art: <path d="M90 110H230V206H90Z" />,
        cuts: hatch(94, 226, 114, 204, 8, r, 1.4, [4, 14]) + rect(110, 132, 30, 30) + rect(180, 132, 30, 30),
      },
      {
        ink: INK.key,
        art: (
          <>
            <path d="M76 114L160 54L244 114Z" />
            <path d={rect(142, 164, 26, 42) + rect(0, 204, 320, 36)} />
            <path d={rect(104, 128, 42, 6) + rect(104, 160, 42, 6)} />
            <path d="M246 206L270 70L278 71L254 206Z M268 206L290 76L298 78L276 206Z" />
            <path d={[90, 110, 130, 150, 170, 190].map((y) => `M${252 + (206 - y) * 0.03} ${y}l${24} 3v4l-24 -3Z`).join("")} />
          </>
        ),
        cuts: hatch(0, 320, 212, 236, 7, r, 1.6, [6, 20]) + hatch(90, 230, 64, 110, 7, r, 1.3),
      },
    ];
  },
};

/** Light ink and a short catalogue caption for every plate. */
export const PLATE_NOTES: Record<string, { caption: string; ink: string }> = {
  phren: { caption: "A bookcase and a reading lamp, with pages kept.", ink: INK.pale },
  "m4l-builder": { caption: "A loudspeaker above a synthesizer panel.", ink: INK.ochre },
  mina: { caption: "A crib under the window, the moon, one lamp.", ink: INK.night },
  basis: { caption: "A balance scale, level.", ink: INK.sage },
  "intranet-erp": { caption: "An old oak on a low hill.", ink: INK.sage },
  atlas: { caption: "A lighthouse over the water.", ink: INK.mist },
  "garden-sensor-network": { caption: "A garden bed with a sensor stake.", ink: INK.sage },
  ogrid: { caption: "A trellis, and a vine finding its way across it.", ink: INK.sage },
  livemcp: { caption: "A stone bridge over a stream.", ink: INK.ochre },
  intrapath: { caption: "A path through the fields to a house.", ink: INK.ochre },
  mutter: { caption: "Two tin cans on a string.", ink: INK.mist },
  emv: { caption: "A card cabinet, one drawer open.", ink: INK.ochre },
  "equipment-tracker": { caption: "Tools on a pegboard.", ink: INK.ochre },
  alphalens: { caption: "A glass held over a line.", ink: INK.mist },
  "retrofit-program-data-tools": { caption: "A house with a ladder against it.", ink: INK.ochre },
};

export type PlateSpec = { w: number; h: number; layers: Layer[] };

/** The carved plate for a slug, at its natural size. */
export function plateFor(slug: string, knob = 0.3): PlateSpec | undefined {
  if (slug === "phren") return { ...PHREN, layers: phrenLayers() };
  if (slug === "m4l-builder") return { ...M4L, layers: m4lLayers(knob) };
  if (slug === "mina") return { ...MINA, layers: minaLayers() };
  const s = small[slug];
  return s ? { ...SMALL, layers: s() } : undefined;
}

/** An uncut block, for slugs that have no plate. */
export function blankLayers(): Layer[] {
  const r = rng(3);
  return [
    { ink: INK.ochre, art: <rect x={60} y={40} width={200} height={150} />, cuts: vHatch(64, 256, 44, 186, 9, r, 1.2) },
    { ink: INK.key, art: <path d={lens([[210, 200], [290, 150]], 8) + rect(284, 140, 14, 10)} /> },
  ];
}
