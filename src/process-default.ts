import type { ColorEntry } from "./types.js";

export function processDefault(entries: ColorEntry[]): ColorEntry[] {
  const defaultEntry = entries.find((e) => e.key === "DEFAULT");
  if (!defaultEntry) return entries;

  const others = entries.filter((e) => e.key !== "DEFAULT");
  if (others.length === 0) return entries;

  const matchExists = others.some((e) => e.hex === defaultEntry.hex);
  if (!matchExists) return entries.map((e) => ({ ...e }));

  return others.map((e) =>
    e.hex === defaultEntry.hex ? { key: `${e.key} (DEFAULT)`, hex: e.hex } : { ...e },
  );
}
