import { useEffect, useLayoutEffect, useState } from "react";

/**
 * The room's light by hour. The scene reads these as CSS custom properties,
 * so the sky and the beam follow the visitor's clock without re-rendering
 * any drawing. Afternoon is the fixed first render.
 */
interface Light {
  skyTop: string;
  skyLow: string;
  sun: string;
  sunY: number;
  hillFar: string;
  hillMid: string;
  hillNear: string;
  beam: string;
  beamO: number;
  ambient: string;
  ambientO: number;
  lamp: number;
}

const keys: [number, Light][] = [
  [3, { skyTop: "#1b2340", skyLow: "#34406a", sun: "#e9e4d2", sunY: 520, hillFar: "#3a4468", hillMid: "#2f375a", hillNear: "#252b49", beam: "#a9b8e0", beamO: 0.06, ambient: "#24306a", ambientO: 0.58, lamp: 1 }],
  [6.5, { skyTop: "#8b9fc6", skyLow: "#f2c2ad", sun: "#fff0dc", sunY: 470, hillFar: "#aeabc4", hillMid: "#9593b0", hillNear: "#7a7b98", beam: "#ffd4b6", beamO: 0.3, ambient: "#8581aa", ambientO: 0.1, lamp: 0.35 }],
  [12, { skyTop: "#8db1d4", skyLow: "#e8ecea", sun: "#fffaf0", sunY: 60, hillFar: "#b8c1cf", hillMid: "#a1acbf", hillNear: "#8994aa", beam: "#fff2d6", beamO: 0.42, ambient: "#ffffff", ambientO: 0, lamp: 0 }],
  [16.5, { skyTop: "#a3b4cb", skyLow: "#f8cc93", sun: "#fff1cc", sunY: 318, hillFar: "#b9b2c2", hillMid: "#9c98b0", hillNear: "#7f819b", beam: "#ffd592", beamO: 0.55, ambient: "#ffffff", ambientO: 0, lamp: 0 }],
  [19.2, { skyTop: "#6e6c9c", skyLow: "#f0a487", sun: "#ffcf9c", sunY: 400, hillFar: "#9a89a6", hillMid: "#7b7192", hillNear: "#5e5a78", beam: "#f6a472", beamO: 0.42, ambient: "#6a5a8a", ambientO: 0.14, lamp: 0.6 }],
  [21.5, { skyTop: "#1b2340", skyLow: "#34406a", sun: "#e9e4d2", sunY: 520, hillFar: "#3a4468", hillMid: "#2f375a", hillNear: "#252b49", beam: "#a9b8e0", beamO: 0.06, ambient: "#24306a", ambientO: 0.58, lamp: 1 }],
];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) =>
  "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("");

export function lightAt(hour: number): Light {
  const wrapped = [...keys, [keys[0][0] + 24, keys[0][1]] as [number, Light]];
  const h = hour < keys[0][0] ? hour + 24 : hour;
  for (let i = 0; i < wrapped.length - 1; i++) {
    const [h0, a] = wrapped[i];
    const [h1, b] = wrapped[i + 1];
    if (h >= h0 && h <= h1) {
      const t = (h - h0) / (h1 - h0);
      const out = {} as Record<string, string | number>;
      for (const k of Object.keys(a) as (keyof Light)[]) {
        const x = a[k];
        const y = b[k];
        out[k] = typeof x === "number" ? x + ((y as number) - x) * t : mix(x, y as string, t);
      }
      return out as unknown as Light;
    }
  }
  return keys[3][1];
}

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;
const AFTERNOON = 16.5;

/** Afternoon on the first render, then the visitor's own hour (or ?hour= for review). */
export function useLocalHour() {
  const [hour, setHour] = useState<number>(AFTERNOON);
  const [known, setKnown] = useState(false);
  useIsoLayoutEffect(() => {
    const q = new URLSearchParams(window.location.search).get("hour");
    const now = new Date();
    const h = q !== null && !Number.isNaN(Number(q)) ? Number(q) % 24 : now.getHours() + now.getMinutes() / 60;
    setHour(h);
    setKnown(true);
  }, []);
  return { hour, known };
}

export function clockLabel(hour: number) {
  const h = Math.floor(hour);
  const m = Math.floor((hour - h) * 60);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}
