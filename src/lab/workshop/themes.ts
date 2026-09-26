import type { ComponentType } from "react";
import {
  Binder,
  BinderPair,
  FilingDrawer,
  Folders,
  GraphPaper,
  Headset,
  Ledger,
  OldTablet,
  PadController,
  PinnedChart,
  PottedPlant,
  TaggedTool,
} from "./objects";

/**
 * How each project's object is lit when we walk up to it. `wall` runs from the
 * lit side to the shade; `light` is the colour of the window's light; the page
 * under the picture takes `paper` and `link` so the whole page shifts together.
 */
export interface Theme {
  Art: ComponentType;
  object: string;
  wall: [string, string];
  light: string;
  paper: string;
  link: string;
  /** Where the object rests, in the close-up's 1440 x 720 space. */
  place?: { x: number; y: number; s: number };
}

export const themes: Record<string, Theme> = {
  ogrid: { Art: GraphPaper, object: "A sheet of graph paper, a few cells selected.", wall: ["#e5e7d4", "#b3bca7"], light: "#fffbe6", paper: "#f2efe1", link: "#3d6a4a", place: { x: 720, y: 640, s: 3.1 } },
  livemcp: { Art: PadController, object: "A small pad controller, a few pads lit.", wall: ["#d6dde6", "#949fb4"], light: "#d9e8f6", paper: "#eeeee9", link: "#2e5c78", place: { x: 720, y: 650, s: 3 } },
  atlas: { Art: Folders, object: "A small stack of folders.", wall: ["#dfe6de", "#a5b8b1"], light: "#fff0d0", paper: "#f0efe4", link: "#2a6962", place: { x: 720, y: 650, s: 2.9 } },
  basis: { Art: Ledger, object: "A quarter-bound ledger and a pencil.", wall: ["#e4e2d3", "#aab3a5"], light: "#fff4de", paper: "#f2eee1", link: "#2d675e", place: { x: 700, y: 650, s: 2.8 } },
  "intranet-erp": { Art: Binder, object: "A binder, worn at the edges from ten years of use.", wall: ["#ead4b6", "#b0957f"], light: "#ffcf8a", paper: "#f3e6d2", link: "#7c4839", place: { x: 720, y: 660, s: 2.9 } },
  intrapath: { Art: BinderPair, object: "A new binder, standing next to the old one.", wall: ["#f1ddd6", "#c2a1a1"], light: "#fff0e4", paper: "#f6ebe4", link: "#94404f", place: { x: 720, y: 660, s: 2.9 } },
  emv: { Art: FilingDrawer, object: "An old card-catalog drawer.", wall: ["#e5e1c6", "#aeaa86"], light: "#fff1c8", paper: "#f1eddb", link: "#5a6124", place: { x: 720, y: 660, s: 2.9 } },
  "equipment-tracker": { Art: TaggedTool, object: "A wrench with a paper tag tied to it.", wall: ["#dde3e4", "#9fadb2"], light: "#fdf6e6", paper: "#eff0ea", link: "#2a6370", place: { x: 740, y: 630, s: 3 } },
  "garden-sensor-network": { Art: PottedPlant, object: "A potted plant with a small sensor on a stake.", wall: ["#e3e8d3", "#a6b696"], light: "#fff8d8", paper: "#f1f1e0", link: "#486733", place: { x: 720, y: 670, s: 2.7 } },
  "retrofit-program-data-tools": { Art: OldTablet, object: "An old tablet with a form on it.", wall: ["#e3e0da", "#a7a49f"], light: "#fff3e0", paper: "#f1eee8", link: "#4a5570", place: { x: 720, y: 650, s: 3 } },
  mutter: { Art: Headset, object: "A headset, set down between calls.", wall: ["#e1dbe8", "#a59ebd"], light: "#ffd9b8", paper: "#f0ecf2", link: "#4d4887", place: { x: 720, y: 650, s: 2.8 } },
  alphalens: { Art: PinnedChart, object: "A small chart pinned to the wall.", wall: ["#efdcbf", "#bf9d7a"], light: "#ffd592", paper: "#f5e8d3", link: "#84501f", place: { x: 720, y: 450, s: 2.9 } },
};
