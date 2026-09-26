/**
 * Per-project touches: a few plain words for the home list, the brush mark
 * that precedes each name, a slight ink tint, and a small painting for the
 * project page. The three showcase projects have larger art in art.tsx.
 */
import type { ReactNode } from "react";
import { blob, brush, Mist, Mountain, rng, type Pt } from "./ink";

export interface Motif {
  /** A few words for the home list. */
  words: string;
  /** Brush mark before the name: points in a 44x28 box, and a width. */
  mark: [Pt[], number];
  /** Ink tint for this project's painting and headings. */
  ink: string;
  /** Short description of the painting, for screen readers. */
  alt: string;
  art?: (ink: string) => ReactNode;
}

const W = "#2b2620";

/** Small helper: a group of brush strokes in one ink, with the stroke filter. */
const Strokes = ({ ink, o = 0.8, children }: { ink: string; o?: number; children: ReactNode }) => (
  <g fill={ink} opacity={o} filter="url(#iw-line)">
    {children}
  </g>
);

const ground = (ink: string, y: number, x0 = 60, x1 = 340, seed = 1) => (
  <path d={blob((x0 + x1) / 2, y, (x1 - x0) / 2, 9, seed, 0.12)} fill={ink} opacity={0.14} filter="url(#iw-wash)" />
);

export const motifs: Record<string, Motif> = {
  phren: {
    words: "memory for AI coding agents",
    mark: [[[5, 18], [20, 15], [38, 16]], 5],
    ink: "#34303e",
    alt: "stepping stones across still water",
  },
  "m4l-builder": {
    words: "Max for Live devices, written in Python",
    mark: [[[6, 10], [12, 20], [24, 23], [38, 18]], 4.6],
    ink: "#2f2821",
    alt: "a bronze singing bowl",
  },
  mina: {
    words: "a newborn log for two phones",
    mark: [[[8, 22], [22, 17], [38, 8]], 3.2],
    ink: "#2d3038",
    alt: "a bird asleep on a branch under a thin moon",
  },
  ogrid: {
    words: "a React data grid with spreadsheet editing",
    mark: [[[4, 12], [40, 12]], 4],
    ink: "#28302a",
    alt: "terraced fields stepping down a hill",
    art: (ink) => {
      const rows = [0, 1, 2, 3, 4, 5];
      return (
        <>
          {rows.map((i) => (
            <path key={`w${i}`} d={blob(210 - i * 6, 92 + i * 30, 150 + i * 22, 11, 60 + i, 0.08)} fill={ink} opacity={0.05 + (i % 2) * 0.05} filter="url(#iw-wash)" />
          ))}
          <Strokes ink={ink} o={0.72}>
            {rows.map((i) => {
              const y = 100 + i * 30;
              const x0 = 70 - i * 14;
              const x1 = 330 + i * 8;
              return <path key={i} d={brush([[x0, y + 6], [(x0 + x1) / 2 - 30, y - 4], [x1, y + 4]], 3.2 - i * 0.2, { seed: 70 + i, head: 0.15 })} />;
            })}
          </Strokes>
          <Mist bands={[[200, 270, 220, 30, 0.9]]} />
        </>
      );
    },
  },
  livemcp: {
    words: "an MCP bridge for Ableton Live",
    mark: [[[4, 22], [22, 8], [40, 22]], 3.6],
    ink: "#2a3033",
    alt: "a small footbridge over a stream",
    art: (ink) => (
      <>
        <path d={blob(70, 196, 80, 30, 4, 0.14, 0.4)} fill={ink} opacity={0.3} filter="url(#iw-bleed)" />
        <path d={blob(338, 200, 78, 26, 5, 0.14, 0.4)} fill={ink} opacity={0.26} filter="url(#iw-bleed)" />
        <Strokes ink={ink}>
          <path d={brush([[96, 184], [200, 120], [306, 186]], 6, { seed: 3, head: 0.06, tail: 0.3 })} />
          <path d={brush([[104, 162], [200, 102], [298, 164]], 2.2, { seed: 4 })} opacity={0.8} />
          {[130, 165, 200, 235, 270].map((x, i) => {
            const t = (x - 96) / 210;
            const y = 184 - Math.sin(t * Math.PI) * 64;
            return <path key={i} d={brush([[x, y - 1], [x, y - 20]], 1.8, { seed: 10 + i })} opacity={0.75} />;
          })}
        </Strokes>
        <Strokes ink={ink} o={0.3}>
          {[222, 238, 256].map((y, i) => (
            <path key={i} d={brush([[120 + i * 20, y], [300 - i * 10, y + 1]], 1.6, { seed: 20 + i, head: 0.3 })} />
          ))}
        </Strokes>
      </>
    ),
  },
  intrapath: {
    words: "the ERP, rebuilt as multi-tenant SaaS",
    mark: [[[6, 24], [18, 16], [12, 10], [34, 5]], 3],
    ink: "#332c2b",
    alt: "a path climbing a hill in switchbacks",
    art: (ink) => (
      <>
        <Mountain id="ip-hill" peaks={[{ x: 230, h: 180, w: 200 }]} x0={20} x1={400} base={270} foot={260} seed={14} tone={0.42} color={ink} texture={5} />
        <Mist bands={[[200, 250, 220, 26, 1]]} />
        <Strokes ink={ink} o={0.62}>
          {(
            [
              [[150, 262], [250, 240]],
              [[250, 240], [180, 205]],
              [[180, 205], [248, 170]],
              [[248, 170], [210, 138]],
              [[210, 138], [232, 110]],
            ] as Pt[][]
          ).map((seg, i) => (
            <path key={i} d={brush(seg, 2.2 - i * 0.25, { seed: 40 + i, head: 0.2, tail: 0.3 })} />
          ))}
        </Strokes>
      </>
    ),
  },
  atlas: {
    words: "ticketing, mirrored to markdown on disk",
    mark: [[[10, 6], [10, 22]], 3.6],
    ink: "#28302f",
    alt: "a small hut on the shore and its reflection in the water",
    art: (ink) => {
      const hut = (flip: boolean) => {
        const f = (y: number) => (flip ? 300 - y : y);
        return (
          <g opacity={flip ? 0.22 : 0.85}>
            <Strokes ink={ink} o={1}>
              <path d={brush([[150, f(118)], [200, f(92)], [252, f(118)]], 5, { seed: flip ? 2 : 1, head: 0.1 })} />
              <path d={brush([[166, f(118)], [166, f(148)]], 2.4, { seed: 3 })} />
              <path d={brush([[236, f(118)], [236, f(148)]], 2.4, { seed: 4 })} />
              <path d={brush([[196, f(128)], [196, f(148)]], 1.8, { seed: 5 })} />
            </Strokes>
          </g>
        );
      };
      return (
        <>
          <path d={blob(200, 152, 150, 10, 3, 0.1, 0.5)} fill={ink} opacity={0.3} filter="url(#iw-bleed)" />
          {hut(false)}
          {hut(true)}
          <Strokes ink={ink} o={0.3}>
            {[170, 184, 200].map((y, i) => (
              <path key={i} d={brush([[110 + i * 26, y], [290 - i * 18, y]], 1.4, { seed: 30 + i, head: 0.3 })} />
            ))}
          </Strokes>
          <Mist bands={[[200, 250, 200, 30, 0.9]]} />
        </>
      );
    },
  },
  basis: {
    words: "reconciliation you can trace line by line",
    mark: [[[4, 14], [22, 13], [40, 14]], 2.6],
    ink: "#2b2c28",
    alt: "a balance with evenly weighted stones in each pan",
    art: (ink) => (
      <>
        {ground(ink, 262, 110, 290, 2)}
        <Strokes ink={ink}>
          <path d={brush([[200, 258], [200, 92]], 5, { seed: 1, head: 0.05, tail: 0.5 })} />
          <path d={blob(200, 258, 26, 7, 3, 0.1, 0.6)} />
          <path d={brush([[104, 96], [200, 94], [296, 96]], 3.6, { seed: 2, head: 0.1, tail: 0.6 })} />
          <path d={blob(200, 92, 5, 5, 4)} />
          {[104, 296].map((x, i) => (
            <g key={i}>
              <path d={brush([[x, 98], [x - 22, 170]], 1.1, { seed: 5 + i })} opacity={0.7} />
              <path d={brush([[x, 98], [x + 22, 170]], 1.1, { seed: 7 + i })} opacity={0.7} />
              <path d={brush([[x - 34, 170], [x, 180], [x + 34, 170]], 3.4, { seed: 9 + i, head: 0.1 })} />
            </g>
          ))}
        </Strokes>
        {[104, 296].map((x, i) => (
          <g key={i} fill={ink} filter="url(#iw-bleed)">
            <path d={blob(x - 13, 163, 10, 7, 20 + i, 0.14, 0.2)} opacity={0.5} />
            <path d={blob(x + 12, 164, 10, 6.5, 22 + i, 0.14, 0.2)} opacity={0.45} />
            <path d={blob(x, 152, 9, 6.5, 24 + i, 0.14, 0.2)} opacity={0.6} />
          </g>
        ))}
      </>
    ),
  },
  mutter: {
    words: "a Mumble client for every platform",
    mark: [[[6, 20], [14, 12]], 3.4],
    ink: "#2e2d36",
    alt: "two small birds on separate branches, calling across the gap",
    art: (ink) => {
      const bird = (x: number, y: number, dir: 1 | -1, s: number) => (
        <g>
          <g fill={ink} filter="url(#iw-bleed)">
            <path d={blob(x, y, 20, 13, s, 0.06)} opacity={0.42} />
            <path d={blob(x + dir * 17, y - 12, 9, 8, s + 1, 0.06)} opacity={0.55} />
          </g>
          <Strokes ink={ink} o={0.7}>
            <path d={brush([[x - dir * 16, y + 2], [x - dir * 34, y + 12]], 6, { seed: s + 2, tail: 0.3 })} />
            <path d={brush([[x + dir * 25, y - 13], [x + dir * 33, y - 16]], 2, { seed: s + 3 })} />
            <path d={brush([[x + dir * 25, y - 10], [x + dir * 32, y - 8]], 1.6, { seed: s + 4 })} />
          </Strokes>
        </g>
      );
      return (
        <>
          <Strokes ink={ink} o={0.62}>
            <path d={brush([[-10, 200], [60, 190], [140, 180]], 7, { seed: 1, head: 0.02 })} />
            <path d={brush([[410, 150], [340, 142], [262, 136]], 7, { seed: 2, head: 0.02 })} />
          </Strokes>
          {bird(108, 166, 1, 30)}
          {bird(296, 122, -1, 40)}
        </>
      );
    },
  },
  "intranet-erp": {
    words: "a company's ERP, ten years running",
    mark: [[[8, 24], [14, 14], [12, 5]], 4.6],
    ink: "#2b2620",
    alt: "an old pine that has stood a long time",
    art: (ink) => {
      const tufts: [number, number, number][] = [
        [118, 88, 54],
        [196, 70, 44],
        [258, 108, 60],
        [150, 134, 40],
        [300, 150, 38],
      ];
      return (
        <>
          {ground(ink, 272, 110, 300, 5)}
          <Strokes ink={ink} o={0.85}>
            <path d={brush([[196, 274], [186, 220], [214, 170], [196, 110], [202, 76]], 15, { seed: 2, head: 0.04, tail: 0.3 })} />
            <path d={brush([[204, 150], [256, 128], [304, 148]], 5, { seed: 3, head: 0.05, tail: 0.2 })} />
            <path d={brush([[196, 116], [152, 110], [116, 92]], 4.6, { seed: 4, head: 0.05, tail: 0.2 })} />
          </Strokes>
          <g fill={ink} filter="url(#iw-bleed)">
            {tufts.map(([x, y, w], i) => (
              <g key={i}>
                <path d={blob(x, y, w, 11, 50 + i, 0.18, 0.3)} opacity={0.5} />
                <path d={blob(x + 4, y + 3, w * 0.8, 6, 60 + i, 0.2)} opacity={0.35} />
              </g>
            ))}
          </g>
          <Strokes ink={ink} o={0.6}>
            {tufts.map(([x, y, w], i) => (
              <path key={i} d={brush([[x - w * 0.95, y + 6], [x, y + 10], [x + w * 0.9, y + 5]], 3, { seed: 90 + i, head: 0.1, tail: 0.1 })} />
            ))}
          </Strokes>
        </>
      );
    },
  },
  emv: {
    words: "an internal app on MongoDB",
    mark: [[[8, 20], [30, 22]], 5.4],
    ink: "#2c2b27",
    alt: "a cairn of loose stones",
    art: (ink) => {
      const stones: [number, number, number, number][] = [
        [200, 250, 58, 18],
        [194, 218, 44, 15],
        [206, 190, 34, 13],
        [198, 166, 24, 10],
        [202, 148, 14, 7],
      ];
      return (
        <>
          {ground(ink, 266, 90, 310, 7)}
          <g fill={ink} filter="url(#iw-bleed)">
            {stones.map(([x, y, rx, ry], i) => (
              <path key={i} d={blob(x, y, rx, ry, 80 + i, 0.14, 0.25)} opacity={0.62 - i * 0.07} />
            ))}
          </g>
          <Mist bands={[[200, 290, 200, 22, 0.8]]} />
        </>
      );
    },
  },
  "equipment-tracker": {
    words: "equipment records in one place",
    mark: [[[6, 8], [16, 18], [36, 20]], 3.4],
    ink: "#2a2d2d",
    alt: "nets drying on poles",
    art: (ink) => {
      const poles = [100, 200, 300];
      return (
        <>
          {ground(ink, 262, 70, 330, 9)}
          <Strokes ink={ink}>
            {poles.map((x, i) => (
              <path key={i} d={brush([[x, 262], [x + (i - 1) * 2, 96]], 4, { seed: 10 + i, head: 0.05, tail: 0.5 })} />
            ))}
          </Strokes>
          <Strokes ink={ink} o={0.45}>
            {[0, 1].map((k) => {
              const a = poles[k];
              const b = poles[k + 1];
              return [0, 1, 2, 3].map((j) => (
                <path key={`${k}-${j}`} d={brush([[a, 104 + j * 18], [(a + b) / 2, 148 + j * 12], [b, 104 + j * 18]], 1.1, { seed: 20 + k * 4 + j, head: 0.2, tail: 0.4 })} />
              ));
            })}
            {[120, 140, 160, 180, 220, 240, 260, 280].map((x, i) => (
              <path key={`v${i}`} d={brush([[x, 112 + Math.abs(x % 100 - 50) * -0.6 + 30], [x + 1, 180 + Math.abs(x % 100 - 50) * -0.4]], 0.8, { seed: 40 + i })} />
            ))}
          </Strokes>
          <g fill={ink} opacity={0.1} filter="url(#iw-wash)">
            <path d={blob(150, 150, 44, 30, 3)} />
            <path d={blob(250, 150, 44, 30, 4)} />
          </g>
        </>
      );
    },
  },
  alphalens: {
    words: "charts and alerts in Discord",
    mark: [[[4, 20], [40, 20]], 2.2],
    ink: "#302b25",
    alt: "the sun on a far horizon over the sea",
    art: (ink) => (
      <>
        <defs>
          <clipPath id="al-sky">
            <rect x="0" y="0" width="400" height="176" />
          </clipPath>
        </defs>
        <g clipPath="url(#al-sky)">
          <circle cx="232" cy="176" r="42" fill={ink} opacity="0.16" filter="url(#iw-wash)" />
          <circle cx="232" cy="176" r="36" fill="none" stroke={ink} strokeOpacity="0.4" strokeWidth="1.4" filter="url(#iw-line)" />
        </g>
        <Strokes ink={ink} o={0.7}>
          <path d={brush([[20, 177], [200, 176], [380, 177]], 2.4, { seed: 1, head: 0.2, tail: 0.1 })} />
        </Strokes>
        <Strokes ink={ink} o={0.28}>
          {(() => {
            const rand = rng(8);
            return Array.from({ length: 9 }, (_, i) => {
              const y = 196 + i * 10 + rand() * 6;
              const x = 40 + rand() * 260;
              const l = 20 + rand() * 60 + i * 6;
              return <path key={i} d={brush([[x, y], [x + l, y]], 1.4, { seed: 20 + i, head: 0.3 })} />;
            });
          })()}
        </Strokes>
      </>
    ),
  },
  "garden-sensor-network": {
    words: "a garden's sensors, made readable",
    mark: [[[10, 26], [13, 16], [22, 6]], 3],
    ink: "#2b2f27",
    alt: "young shoots coming up from the soil",
    art: (ink) => {
      const shoots: [number, number, number][] = [
        [120, 70, -1],
        [168, 110, 1],
        [210, 84, -1],
        [250, 124, 1],
        [290, 64, -1],
      ];
      return (
        <>
          {ground(ink, 250, 80, 330, 11)}
          <Strokes ink={ink} o={0.75}>
            {shoots.map(([x, h, d], i) => {
              const top: Pt = [x + d * 8, 246 - h];
              return (
                <g key={i}>
                  <path d={brush([[x, 248], [x + d * 3, 248 - h * 0.5], top], 2.4, { seed: 30 + i, head: 0.05, tail: 0.3 })} />
                  <path d={brush([top, [top[0] + 10, top[1] - 8], [top[0] + 22, top[1] - 6]], 5, { seed: 40 + i, head: 0.3, tail: 0.05 })} opacity={0.8} />
                  <path d={brush([[top[0], top[1] + 8], [top[0] - 10, top[1] + 2], [top[0] - 20, top[1] + 4]], 4.4, { seed: 50 + i, head: 0.3, tail: 0.05 })} opacity={0.7} />
                </g>
              );
            })}
          </Strokes>
        </>
      );
    },
  },
  "retrofit-program-data-tools": {
    words: "field data tools for a retrofit program",
    mark: [[[6, 14], [24, 7], [38, 14]], 3.4],
    ink: "#2d2a26",
    alt: "a small house with a ladder leaning against it",
    art: (ink) => (
      <>
        {ground(ink, 244, 90, 320, 13)}
        <path d={blob(205, 200, 66, 40, 6, 0.06, 0.2)} fill={ink} opacity={0.08} filter="url(#iw-wash)" />
        <Strokes ink={ink}>
          <path d={brush([[126, 164], [200, 110], [282, 164]], 5.4, { seed: 1, head: 0.08 })} />
          <path d={brush([[142, 162], [142, 240]], 2.6, { seed: 2 })} />
          <path d={brush([[268, 162], [268, 240]], 2.6, { seed: 3 })} />
          <path d={brush([[190, 204], [190, 240]], 1.8, { seed: 4 })} />
          <path d={brush([[212, 204], [212, 240]], 1.8, { seed: 5 })} />
        </Strokes>
        <Strokes ink={ink} o={0.65}>
          <path d={brush([[300, 246], [252, 118]], 2, { seed: 6 })} />
          <path d={brush([[318, 244], [270, 116]], 2, { seed: 7 })} />
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const t = 0.1 + k * 0.15;
            return <path key={k} d={brush([[300 - 48 * t, 246 - 128 * t], [318 - 48 * t, 244 - 128 * t]], 1.4, { seed: 10 + k })} />;
          })}
        </Strokes>
      </>
    ),
  },
};

export const motifFor = (slug: string): Motif =>
  motifs[slug] ?? { words: "", mark: [[[6, 16], [36, 16]], 3], ink: W, alt: "" };
