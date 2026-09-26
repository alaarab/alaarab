/** One landscape per project: an hour of the day, a seed for its hills, one landmark. */
import * as L from "./landmarks";
import { wave, type Ridge } from "./paint";
import type { SceneSpec } from "./Scene";

export const homeScene: SceneSpec = {
  time: "afternoon",
  seed: 12,
  knolls: [{ x: 770, h: 70, w: 220 }],
  after: { 3: L.homeLandmark },
  label: "A painted hillside: a large tree and a small house with a path winding down.",
};

export const notFoundScene: SceneSpec = {
  time: "overcast",
  seed: 91,
  after: { 4: L.notFoundLandmark },
  clouds: [
    { x: 1000, y: 380, w: 520 },
    { x: 380, y: 470, w: 420 },
  ],
  label: "An empty hillside under a grey sky, a path fading into the grass.",
};

const WAVE_BASE = [540, 610, 680, 752];
const WAVE_AMP = [34, 40, 44, 34];
const WAVE_LEN = [210, 290, 380, 520];
const WAVE_PHASE = [0.1, 0.45, 0.8, 0.3];

/** m4l-builder: every ridgeline is the same waveform at a different pitch. */
export function m4lScene(morph: number): SceneSpec {
  return {
    time: "golden",
    seed: 404,
    ridge: (l): Ridge | undefined =>
      l > 3 ? undefined : (x) => WAVE_BASE[l]! - WAVE_AMP[l]! * wave(x / WAVE_LEN[l]! + WAVE_PHASE[l]!, morph),
    after: { 3: L.m4lLandmark },
    trees: 0,
    clouds: [
      { x: 1140, y: 360, w: 380 },
      { x: 380, y: 470, w: 240 },
    ],
    label: "Hills whose ridgelines are waveforms, at golden hour, with a lone tree riding the nearest ridge.",
  };
}

export const projectScenes: Record<string, SceneSpec> = {
  phren: {
    time: "dusk",
    seed: 73,
    knolls: [{ x: 830, h: 50, w: 260 }],
    windows: 150,
    trees: 3,
    after: { 3: L.phrenLandmark },
    clouds: [
      { x: 1150, y: 420, w: 360 },
      { x: 240, y: 470, w: 260 },
    ],
    label: "A hillside at dusk covered in small lit windows.",
  },
  mina: {
    time: "night",
    skyTweak: { sun: { x: 0.6, y: 0.16, r: 34, glow: 0.4, moon: true } },
    seed: 3,
    knolls: [{ x: 780, h: 56, w: 200 }],
    trees: 2,
    after: { 3: L.minaLandmark },
    clouds: [{ x: 360, y: 500, w: 240 }],
    streaks: [{ x: 1050, y: 470, w: 300 }],
    label: "Night: a soft moon over one small house with a single lit window.",
  },
  basis: {
    time: "morning",
    seed: 28,
    trees: 3,
    after: { 3: L.basisLandmark },
    clouds: [
      { x: 1120, y: 300, w: 320 },
      { x: 330, y: 480, w: 220 },
    ],
    label: "A clear morning over an orchard of evenly spaced trees.",
  },
  "intranet-erp": {
    time: "afternoon",
    seed: 57,
    trees: 6,
    after: { 3: L.intranetLandmark },
    label: "A long valley road running into the far hills in late afternoon.",
  },
  ogrid: {
    time: "midday",
    seed: 140,
    trees: 3,
    after: { 2: L.ogridLandmark },
    clouds: [
      { x: 1060, y: 280, w: 420 },
      { x: 250, y: 500, w: 200 },
      { x: 640, y: 450, w: 160 },
    ],
    label: "Midday over a patchwork of fields on the middle hill.",
  },
  livemcp: {
    time: "afternoon",
    seed: 211,
    trees: 5,
    after: { 4: L.livemcpCrossing },
    label: "A stone bridge over a stream in late afternoon.",
  },
  intrapath: {
    time: "dawn",
    seed: 88,
    knolls: [{ x: 790, h: 40, w: 240 }],
    trees: 3,
    after: { 3: L.intrapathLandmark },
    clouds: [
      { x: 1100, y: 420, w: 300 },
      { x: 420, y: 500, w: 200 },
    ],
    label: "Dawn: a new timber frame going up beside an old stone footing.",
  },
  atlas: {
    time: "midday",
    seed: 160,
    trees: 5,
    after: { 4: L.atlasLandmark },
    label: "A crossroads with a three-armed signpost at midday.",
  },
  mutter: {
    time: "dusk",
    seed: 19,
    knolls: [
      { x: 600, h: 70, w: 150 },
      { x: 970, h: 62, w: 150 },
    ],
    trees: 2,
    after: { 3: L.mutterLandmark },
    clouds: [{ x: 1180, y: 430, w: 280 }],
    label: "Blue hour: two houses on facing hills with a line strung between them.",
  },
  emv: {
    time: "overcast",
    seed: 66,
    trees: 4,
    after: { 3: L.emvLandmark },
    clouds: [
      { x: 1080, y: 360, w: 500 },
      { x: 360, y: 440, w: 460 },
      { x: 760, y: 500, w: 260 },
    ],
    label: "Haystacks in a field under an overcast sky.",
  },
  "equipment-tracker": {
    time: "morning",
    seed: 131,
    knolls: [{ x: 820, h: 30, w: 260 }],
    trees: 4,
    after: { 3: L.equipmentLandmark },
    label: "A barn and a cart on a morning hillside.",
  },
  alphalens: {
    time: "golden",
    seed: 47,
    knolls: [{ x: 820, h: 80, w: 190 }],
    trees: 3,
    after: { 3: L.alphalensLandmark },
    clouds: [{ x: 350, y: 450, w: 300 }],
    label: "A small observatory on a hill at golden hour.",
  },
  "garden-sensor-network": {
    time: "dawn",
    seed: 101,
    trees: 5,
    after: { 4: L.gardenLandmark },
    label: "Dawn over a garden of raised beds, each with a small staked sensor.",
  },
  "retrofit-program-data-tools": {
    time: "morning",
    seed: 77,
    trees: 4,
    after: { 3: L.retrofitLandmark },
    label: "A row of old houses in the morning, a ladder against one.",
  },
};
