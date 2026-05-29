/**
 * Generates the 1200x630 Open Graph card at public/og.png. No image library:
 * we paint into an RGBA buffer and hand-roll a PNG (zlib IDAT via node:zlib),
 * with a small bitmap font so the wordmark reads as the site's mono accent.
 *
 * Run with: bun scripts/generate-og.ts (or `bun run og`).
 */
import { deflateSync } from "node:zlib";
import { Buffer } from "node:buffer";

type RGB = [number, number, number];

const WIDTH = 1200;
const HEIGHT = 630;

const BG: RGB = [14, 12, 10]; // --bg #0e0c0a
const INK: RGB = [241, 235, 222]; // --ink #f1ebde
const INK_SOFT: RGB = [179, 169, 154]; // --ink-soft #b3a99a
const ACCENT: RGB = [255, 91, 31]; // --accent #ff5b1f

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

// 5x7 uppercase bitmap font, just the glyphs the card needs.
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
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
};

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

/** Draws text and returns the rendered width in pixels. */
function drawText(
  x: number,
  y: number,
  text: string,
  scale: number,
  color: RGB,
): number {
  let cursor = x;
  for (const ch of text.toUpperCase()) {
    drawChar(cursor, y, ch, scale, color);
    cursor += 6 * scale; // 5px glyph + 1px gap
  }
  return cursor - x - scale;
}

function crc32Table(): Uint32Array {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
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
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const raw = Buffer.alloc(HEIGHT * (1 + WIDTH * 4));
  let o = 0;
  for (let y = 0; y < HEIGHT; y++) {
    raw[o++] = 0; // filter type "none" for this scanline
    raw.set(px.subarray(y * WIDTH * 4, (y + 1) * WIDTH * 4), o);
    o += WIDTH * 4;
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// --- paint the card ---------------------------------------------------------

fillRect(0, 0, WIDTH, HEIGHT, BG);

// Warm radial glow in the top-left, echoing the site's background.
const glowX = 130;
const glowY = 80;
const glowR = 620;
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    const d = Math.hypot(x - glowX, y - glowY);
    const t = Math.max(0, 1 - d / glowR);
    if (t > 0) setPixel(x, y, ACCENT, Math.round(t * t * 0.4 * 255));
  }
}

const wordmark = "ALA ARAB";
const tagline = "FULL-STACK DEVELOPER";
const url = "ALAARAB.COM";

drawText(96, 172, wordmark, 15, INK);
fillRect(98, 312, 210, 9, ACCENT);
drawText(100, 360, tagline, 6, INK_SOFT);
drawText(100, 476, url, 5, ACCENT);

// --- write + verify ---------------------------------------------------------

const png = encodePng();
await Bun.write("public/og.png", png);

function preview(text: string): void {
  const rows = ["", "", "", "", "", "", ""];
  for (const ch of text.toUpperCase()) {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    for (let r = 0; r < 7; r++) rows[r] += `${g[r]} `;
  }
  console.log(`\n${text}`);
  for (const r of rows) console.log(r.replace(/#/g, "█").replace(/ /g, "·"));
}

console.log(`Wrote public/og.png — ${WIDTH}x${HEIGHT}, ${png.length} bytes`);
console.log(
  `PNG signature ok: ${png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))}`,
);
for (const line of [wordmark, tagline, url]) preview(line);
