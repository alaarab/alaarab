import type { Post, PostBlock, PostInput, PostSummary } from "../types";
import { parsePostSource } from "./postSource";

export const blogPath = (slug: string) => `/blog/${slug}`;

/** Lowercase words joined by single hyphens. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Newest first, then by title. */
export const byDateDesc = (a: { date: string; title: string }, b: { date: string; title: string }) =>
  b.date.localeCompare(a.date) || a.title.localeCompare(b.title);

export function toPost(input: PostInput): Post {
  const { source, ...rest } = input;
  return { ...rest, body: parsePostSource(source) };
}

export function toSummary(post: Post): PostSummary {
  const { body, ...rest } = post;
  return { ...rest, minutes: readingMinutes(body) };
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-09-27" → "September 27, 2026". Fixed format, so server and client agree. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d || m > 12) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

/** A real calendar date in YYYY-MM-DD form. */
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Today in YYYY-MM-DD, UTC. */
export const today = () => new Date().toISOString().slice(0, 10);

/** Text with the inline marks removed: [label](href) → label, `code` → code. */
export const stripMarks = (text: string) =>
  text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1").replace(/`([^`]+)`/g, "$1");

function blockText(block: PostBlock): string {
  switch (block.type) {
    case "list":
      return block.items.join(" ");
    case "code":
      return block.code;
    default:
      return block.text;
  }
}

/** Whole minutes at 220 words a minute, at least one. */
export function readingMinutes(body: PostBlock[]): number {
  const words = body
    .map((block) => stripMarks(blockText(block)))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/** An anchor id from heading text. */
export const headingId = (text: string) =>
  stripMarks(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
