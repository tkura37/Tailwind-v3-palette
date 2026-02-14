import type { ColorEntry } from "./types.js";

export type LayoutType = "card" | "pair";

export function detectLayout(entries: ColorEntry[]): LayoutType {
  const numericCount = entries.filter(
    (e) => e.key !== "DEFAULT" && /^\d+$/.test(e.key),
  ).length;
  return numericCount >= entries.length / 2 ? "card" : "pair";
}
