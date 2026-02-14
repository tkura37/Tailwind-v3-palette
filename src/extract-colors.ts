import { isHexColor } from "./is-hex-color.js";
import type { ColorEntry, ColorGroup, ColorSection } from "./types.js";

export function extractColors(
  theme: Record<string, unknown>,
): ColorSection[] {
  const sectionMap = new Map<string, ColorGroup[]>();

  function collectSections(obj: Record<string, unknown>) {
    for (const [sectionName, sectionValue] of Object.entries(obj)) {
      if (sectionName === "extend") {
        if (isPlainObject(sectionValue)) {
          collectSections(sectionValue as Record<string, unknown>);
        }
        continue;
      }

      if (!isPlainObject(sectionValue)) continue;

      const groups = collectGroups(
        sectionName,
        sectionValue as Record<string, unknown>,
      );
      if (groups.length === 0) continue;

      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, []);
      }
      sectionMap.get(sectionName)!.push(...groups);
    }
  }

  collectSections(theme);

  const sections: ColorSection[] = [];
  for (const [name, groups] of sectionMap) {
    sections.push({ name, groups });
  }
  return sections;
}

function collectGroups(
  sectionName: string,
  obj: Record<string, unknown>,
): ColorGroup[] {
  const groups: ColorGroup[] = [];

  // セクション直下のフラットなHEXカラーをグループとして収集
  const flatEntries = collectEntries(obj);
  if (flatEntries.length > 0) {
    groups.push({ name: sectionName, entries: flatEntries });
  }

  // ネストされたオブジェクトをグループとして収集
  for (const [groupName, groupValue] of Object.entries(obj)) {
    if (!isPlainObject(groupValue)) continue;

    const entries = collectEntries(groupValue as Record<string, unknown>);
    if (entries.length > 0) {
      groups.push({ name: groupName, entries });
    }
  }

  return groups;
}

function collectEntries(obj: Record<string, unknown>): ColorEntry[] {
  const entries: ColorEntry[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && isHexColor(value)) {
      entries.push({ key, hex: value });
    }
  }

  return entries;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
