import type { Pt } from "./ink";

/**
 * The imagined country. Coordinates are in a 1600 x 1000 drawing; older work sits
 * to the south-west, newer to the north-east.
 */

export const W = 1600;
export const H = 1000;

/** Coarse coastline, clockwise from the north-west; roughened when drawn. */
export const coast: Pt[] = [
  [470, 236], [520, 172], [600, 150], [652, 112], [740, 102], [800, 122], [862, 88],
  [940, 98], [1000, 72], [1060, 86], [1112, 72], [1150, 96], [1168, 136], [1196, 150], [1222, 128], [1236, 100],
  [1272, 72], [1304, 112], [1290, 172], [1312, 232], [1302, 292], [1344, 338],
  [1404, 376], [1386, 412], [1322, 424], [1290, 462], [1302, 530], [1270, 590],
  [1290, 652], [1240, 702], [1200, 760], [1150, 792], [1092, 802], [1062, 842],
  [1016, 860], [1004, 830], [984, 812], [952, 806], [920, 814], [906, 836], [898, 862], [866, 900], [818, 918],
  [760, 904], [702, 928], [650, 900], [598, 880], [538, 902], [468, 930], [398, 952],
  [338, 934], [362, 902], [432, 880], [490, 842], [512, 790], [480, 740], [500, 690],
  [470, 642], [440, 604], [500, 572], [590, 534], [500, 500], [430, 472], [400, 422],
  [440, 370], [420, 302],
];

/** Two islets off the west and north-east coasts, for the sake of the sea. */
export const islets: Pt[][] = [
  [[250, 610], [284, 590], [316, 602], [308, 632], [270, 640]],
  [[1432, 214], [1462, 200], [1486, 218], [1470, 240], [1440, 236]],
];

/** The one river: from the northern hills, past the mill and the bridge, into the western bay. */
export const river: Pt[] = [
  [962, 176], [930, 204], [950, 240], [906, 262], [858, 262], [838, 300], [860, 336],
  [812, 360], [760, 350], [728, 380], [742, 420], [690, 448], [640, 440], [614, 478],
  [634, 510], [590, 534],
];

export type Side = "r" | "l" | "a" | "b";

export interface Place {
  slug: string;
  x: number;
  y: number;
  /** Which side of the mark the name sits on. */
  side: Side;
  /** Optional override on the phone crop. */
  phoneSide?: Side;
}

/** One settlement per featured project. */
export const places: Place[] = [
  { slug: "intranet-erp", x: 572, y: 800, side: "r" },
  { slug: "intrapath", x: 722, y: 640, side: "r" },
  { slug: "livemcp", x: 694, y: 446, side: "l", phoneSide: "b" },
  { slug: "m4l-builder", x: 842, y: 312, side: "r" },
  { slug: "ogrid", x: 968, y: 548, side: "r" },
  { slug: "basis", x: 952, y: 778, side: "a" },
  { slug: "phren", x: 1040, y: 222, side: "b" },
  { slug: "atlas", x: 1368, y: 390, side: "l" },
  { slug: "mina", x: 1196, y: 184, side: "b" },
];

export const desktopView = { x: 0, y: 0, w: W, h: H };
/** Phone crop around the settlements. */
export const phoneView = { x: 440, y: 40, w: 960, h: 930 };

/** Settlement marks, drawn at the place's centre. */
export function Mark({ slug }: { slug: string }) {
  switch (slug) {
    case "intranet-erp": // long-established market town: houses round a spire
      return (
        <g>
          <path d="M-18 6 v-9 l6 -6 l6 6 v9 Z M-5 8 v-10 l6 -6 l6 6 v10 Z M8 6 v-8 l5 -5 l5 5 v8 Z" className="roof" />
          <path d="M1 -8 v-16 M-2 -18 h6 M1 -24 l0 -3" />
          <path d="M-24 12 q24 4 48 0" strokeWidth="0.8" />
        </g>
      );
    case "intrapath": // a new town laid out along the old road
      return (
        <g>
          <path d="M-14 4 v-8 l5 -5 l5 5 v8 Z M2 4 v-8 l5 -5 l5 5 v8 Z" className="roof" />
          <path d="M-20 10 h8 M-8 10 h8 M4 10 h8 M16 10 h6" strokeWidth="0.8" strokeDasharray="3 2" />
          <path d="M-22 16 q22 -4 46 2" strokeWidth="0.9" />
        </g>
      );
    case "basis": // a customs house with storehouses in a line along the quay
      return (
        <g>
          <path d="M-8 4 v-11 l8 -7 l8 7 v11 Z" className="roof" />
          <path d="M-22 12 h8 v-6 h-8 Z M-10 12 h8 v-6 h-8 Z M2 12 h8 v-6 h-8 Z M14 12 h8 v-6 h-8 Z" />
          <path d="M-26 16 h52" strokeWidth="1.2" />
        </g>
      );
    case "ogrid": // hedged fields in a tidy grid
      return (
        <g>
          <path d="M-18 -12 h36 v24 h-36 Z M-6 -12 v24 M6 -12 v24 M-18 0 h36" />
          <path d="M-15 -9 h6 M-15 -6 h6 M-3 3 h6 M-3 6 h6 M9 -9 h6" strokeWidth="0.6" />
        </g>
      );
    case "livemcp": // a stone bridge over the river
      return (
        <g>
          <path d="M-20 4 q10 -12 20 0 q10 -12 20 0" />
          <path d="M-22 -4 h44 M-22 4 h44" strokeWidth="0.9" />
        </g>
      );
    case "m4l-builder": // a mill whose wheel is a knob
      return (
        <g>
          <path d="M-16 6 v-12 l8 -7 l8 7 v12 Z" className="roof" />
          <circle cx="10" cy="0" r="9" className="roof" />
          <path d="M10 0 l-4 -7" strokeWidth="1.4" />
        </g>
      );
    case "phren": // a walled library town on a hill
      return (
        <g>
          <path d="M-24 14 Q0 -22 24 14" strokeWidth="0.9" />
          <path d="M-14 4 v-10 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v3 h4 v-3 h4 v10 Z" className="roof" />
          <path d="M-3 -6 v-10 l3 -4 l3 4 v10" className="roof" />
          <path d="M-9 0 h2 M-3 0 h2 M3 0 h2 M9 0 h2" strokeWidth="1.2" />
        </g>
      );
    case "atlas": // a lighthouse on the headland
      return (
        <g>
          <path d="M-5 12 L-3 -12 h6 L5 12 Z" className="roof" />
          <path d="M-5 -12 h10 l-5 -6 Z" className="roof" />
          <path d="M8 -14 l12 -4 M8 -10 l12 2" strokeWidth="0.7" />
          <path d="M-10 12 h20" />
        </g>
      );
    case "mina": // one cottage on a quiet shore
      return (
        <g>
          <path d="M-9 6 v-9 l9 -7 l9 7 v9 Z" className="roof" />
          <rect x="2" y="-2" width="3.5" height="3.5" className="lit" stroke="none" />
        </g>
      );
    default:
      return <circle r="4" className="roof" />;
  }
}
