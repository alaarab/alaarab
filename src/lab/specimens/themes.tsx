import type { ReactNode } from "react";
import type { Project } from "../../types";
import type { Frame } from "./Plant";
import type { GrowOpts } from "./grower";

export interface PlateSpec {
  frame: Frame;
  extra: Partial<GrowOpts>;
  under?: ReactNode;
}

const HOME: Frame = { w: 600, h: 800, baseX: 300, baseY: 752, height: 640, halfWidth: 190 };
const PAGE: Frame = { w: 900, h: 960, baseX: 450, baseY: 915, height: 780, halfWidth: 190 };

/** A pale moon: a soft haze, a thin wash, and a fine contour. */
function Moon({ x, y, r, night }: { x: number; y: number; r: number; night: boolean }) {
  const tone = night ? "#efe6c8" : "#a07a3a";
  return (
    <g aria-hidden="true">
      <filter id="specimens-haze" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation={r * 0.5} />
      </filter>
      <circle cx={x} cy={y} r={r * 1.3} fill={tone} opacity={night ? 0.1 : 0.05} filter="url(#specimens-haze)" />
      <circle cx={x} cy={y} r={r} fill={tone} fillOpacity={night ? 0.14 : 0.06} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={tone} strokeOpacity={night ? 0.55 : 0.35} strokeWidth={0.9} />
      <path
        d={`M${x - r * 0.35} ${y - r * 0.2}a${r * 0.12} ${r * 0.09} 0 1 0 1 0M${x + r * 0.2} ${y + r * 0.3}a${r * 0.08} ${r * 0.06} 0 1 0 1 0`}
        fill={tone}
        opacity={0.08}
      />
    </g>
  );
}

/** The plate for a project, in the home sketchbook or on its own page. */
export function plateFor(p: Project, mode: "home" | "page", wave = 0): PlateSpec {
  const base = mode === "home" ? HOME : PAGE;
  if (p.slug === "phren") {
    const frame: Frame =
      mode === "home"
        ? { w: 600, h: 820, baseX: 300, baseY: 400, height: 340, halfWidth: 150 }
        : { w: 900, h: 1040, baseX: 450, baseY: 450, height: 380, halfWidth: 180 };
    return { frame, extra: { roots: mode === "home" ? 360 : 540 } };
  }
  if (p.slug === "m4l-builder") {
    return { frame: base, extra: { wave, terminal: "capsule", capsuleAngle: -Math.PI / 2 + ((wave - 1) * 3 * Math.PI) / 4 } };
  }
  if (p.slug === "mina") {
    const short = { ...base, height: base.height * 0.62 };
    const night = mode === "page";
    return {
      frame: short,
      extra: {
        terminal: "nocturne",
        leafColor: night ? "hsl(160 16% 66%)" : "hsl(150 18% 42%)",
        flowerColor: night ? "hsl(330 42% 88%)" : "hsl(232 30% 52%)",
      },
      under: <Moon x={base.w * 0.74} y={base.h * 0.2} r={base.w * 0.07} night={night} />,
    };
  }
  return { frame: base, extra: {} };
}

const WORDS = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight"];
const count = (n: number, one: string, many: string) => `${WORDS[n] ?? n} ${n === 1 ? one : many}`;

export function captionFor(p: Project): string {
  if (p.slug === "phren")
    return "Phren, above and below the soil line. The roots, drawn larger than the plant, are what it keeps.";
  if (p.slug === "m4l-builder")
    return "m4l-builder. Turn the seed capsule to change the leaf margin from sine to triangle to saw.";
  if (p.slug === "mina") return "Mina, open at 3 AM.";
  const m = p.metrics?.length ?? 0;
  return `${p.title}, grown from its own data: ${count(p.stack.length, "leaf", "leaves")} for its stack, ${
    m ? `${count(m, "flower", "flowers")} for its measures` : "and a single bud"
  }.`;
}

export function roman(n: number): string {
  const table: [number, string][] = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let out = "";
  for (const [v, s] of table) while (n >= v) (out += s), (n -= v);
  return out;
}

export const firstSentence = (s: string) => {
  const i = s.indexOf(". ");
  return i === -1 ? s : s.slice(0, i + 1);
};
