/**
 * Generates the Open Graph cards under public/: og.png (the site card) and
 * og/<slug>.png for each project, tinted with that project's accent color.
 * No image library — we paint into an RGBA buffer and hand-roll a PNG (zlib
 * IDAT via node:zlib), with a 5x7 bitmap font.
 *
 * Run with: bun scripts/generate-og.ts (or `bun run og`).
 */
import { deflateSync } from "node:zlib";
import { Buffer } from "node:buffer";
import { projects, siteMeta } from "../src/data/siteContent";

type RGB = [number, number, number];

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN_X = 100;
const MAX_TEXT_WIDTH = 1000;

const BG: RGB = [14, 12, 10]; // --bg #0e0c0a
const INK: RGB = [241, 235, 222]; // --ink #f1ebde
const INK_SOFT: RGB = [179, 169, 154]; // --ink-soft #b3a99a
const INK_DIM: RGB = [117, 105, 90]; // --ink-dim #75695a
const SITE_ACCENT: RGB = [255, 91, 31]; // --accent #ff5b1f

const px = new Uint8Array(WIDTH * HEIGHT * 4);

function setPixel(x: number, y: number, color: RGB, alpha = 255): void {
  if (x < 0 || y < 0 || x >= WIDTH || y >= HEIGHT) return;
  const i = (y * WIDTH + x) * 4;
  if (alpha >= 255) {
    px[i] = color[0];
    px[i + 1] = color[1];
    px[i + 2] = color[2];
    px[i + 3] = 255;
    return;
  }
  const sa = alpha / 255;
  px[i] = Math.round(color[0] * sa + px[i] * (1 - sa));
  px[i + 1] = Math.round(color[1] * sa + px[i + 1] * (1 - sa));
  px[i + 2] = Math.round(color[2] * sa + px[i + 2] * (1 - sa));
  px[i + 3] = 255;
}

function fillRect(
  x0: number,
  y0: number,
  w: number,
  h: number,
  color: RGB,
  alpha = 255,
): void {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) setPixel(x, y, color, alpha);
  }
}

function hexToRgb(hex: string): RGB {
  const v = hex.replace("#", "");
  return [
    Number.parseInt(v.slice(0, 2), 16),
    Number.parseInt(v.slice(2, 4), 16),
    Number.parseInt(v.slice(4, 6), 16),
  ];
}

// 5x7 bitmap font: uppercase, digits, and the punctuation the cards use.
const GLYPHS: Record<string, string[]> = {
  " ": ["     ", "     ", "     ", "     ", "     ", "     ", "     "],
  "-": ["     ", "     ", "     ", "#####", "     ", "     ", "     "],
  ".": ["     ", "     ", "     ", "     ", "     ", " ##  ", " ##  "],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".####", "#....", "#....", "#.###", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  J: ["..###", "...#.", "...#.", "...#.", "#..#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#.#.#", "#..##", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  "0": [".###.", "#..##", "#.#.#", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "..##.", ".#...", "#....", "#####"],
  "3": ["#####", "...#.", "..#..", "...#.", "....#", "#...#", ".###."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."],
};

function textCells(text: string): number {
  // 5px per glyph + 1px gap, minus the trailing gap.
  return text.length * 6 - 1;
}

function drawChar(
  x: number,
  y: number,
  ch: string,
  scale: number,
  color: RGB,
): void {
  const rows = GLYPHS[ch] ?? GLYPHS[" "];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let c = 0; c < row.length; c++) {
      if (row[c] === "#") {
        fillRect(x + c * scale, y + r * scale, scale, scale, color);
      }
    }
  }
}

function drawText(
  x: number,
  y: number,
  text: string,
  scale: number,
  color: RGB,
): void {
  let cursor = x;
  for (const ch of text.toUpperCase()) {
    drawChar(cursor, y, ch, scale, color);
    cursor += 6 * scale;
  }
}

/** Largest scale (capped) at which `text` fits within MAX_TEXT_WIDTH. */
function fitScale(text: string, max: number): number {
  const scale = Math.floor(MAX_TEXT_WIDTH / textCells(text.toUpperCase()));
  return Math.max(6, Math.min(max, scale));
}

interface CardOptions {
  eyebrow?: string;
  title: string;
  subtitle: string;
  footer: string;
  accent: RGB;
}

function renderCard(opts: CardOptions): Buffer {
  fillRect(0, 0, WIDTH, HEIGHT, BG);

  // Warm radial glow in the top-left, tinted with the card's accent.
  const glowX = 130;
  const glowY = 80;
  const glowR = 620;
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const d = Math.hypot(x - glowX, y - glowY);
      const t = Math.max(0, 1 - d / glowR);
      if (t > 0) setPixel(x, y, opts.accent, Math.round(t * t * 0.4 * 255));
    }
  }

  if (opts.eyebrow) drawText(MARGIN_X, 92, opts.eyebrow, 4, INK_DIM);

  const titleScale = fitScale(opts.title, 15);
  const titleY = 168;
  drawText(MARGIN_X, titleY, opts.title, titleScale, INK);

  const ruleY = titleY + 7 * titleScale + 30;
  fillRect(MARGIN_X + 2, ruleY, 210, 9, opts.accent);

  drawText(MARGIN_X + 2, ruleY + 28, opts.subtitle, 6, INK_SOFT);
  drawText(MARGIN_X + 2, 476, opts.footer, 5, opts.accent);

  return encodePng();
}

// --- PNG encoding -----------------------------------------------------------

function crc32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
}

const CRC_TABLE = crc32Table();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "latin1");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(WIDTH, 0);
  ihdr.writeUInt32BE(HEIGHT, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA

  const raw = Buffer.alloc(HEIGHT * (1 + WIDTH * 4));
  let o = 0;
  for (let y = 0; y < HEIGHT; y++) {
    raw[o++] = 0; // filter "none"
    raw.set(px.subarray(y * WIDTH * 4, (y + 1) * WIDTH * 4), o);
    o += WIDTH * 4;
  }

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- generate ---------------------------------------------------------------

await Bun.write(
  "public/og.png",
  renderCard({
    title: "Ala Arab",
    subtitle: "Full-stack developer",
    footer: "alaarab.com",
    accent: SITE_ACCENT,
  }),
);

for (const project of projects) {
  await Bun.write(
    `public/og/${project.slug}.png`,
    renderCard({
      eyebrow: "Ala Arab",
      title: project.title,
      subtitle: project.category,
      footer: "alaarab.com",
      accent: project.accent ? hexToRgb(project.accent) : SITE_ACCENT,
    }),
  );
}

// Verify the font once so a typo can't ship silently.
function preview(text: string): void {
  const rows = ["", "", "", "", "", "", ""];
  for (const ch of text.toUpperCase()) {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    for (let r = 0; r < 7; r++) rows[r] += `${g[r]} `;
  }
  console.log(`\n${text}`);
  for (const r of rows) console.log(r.replace(/#/g, "█").replace(/ /g, "·"));
}

console.log(
  `Wrote public/og.png + ${projects.length} project cards (public/og/<slug>.png) for ${siteMeta.name}`,
);
preview("ABCDEFGHIJKLM");
preview("NOPQRSTUVWXYZ");
preview("0123456789 -.");
