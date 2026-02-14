import { detectLayout } from "./detect-layout.js";
import { processDefault } from "./process-default.js";
import type { ColorEntry, ColorSection } from "./types.js";

export function generateHtml(sections: ColorSection[]): string {
  const body = sections
    .map((section) => {
      const groups = section.groups.map((group) => renderGroup(group)).join("\n");
      return `\n    <h2>${section.name}</h2>${groups}`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tailwind Theme Colors</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, sans-serif; padding: 2rem; background: #f9fafb; color: #1f2937; }
  h1 { font-size: 1.5rem; margin-bottom: 2rem; }
  h2 { font-size: 1.25rem; margin: 2rem 0 0.5rem; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
  h3 { font-size: 1rem; margin: 1.5rem 0 0.5rem; color: #374151; }
  .group { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; }
  .swatch {
    width: 5rem; text-align: center; border-radius: 0.5rem;
    overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.1);
  }
  .swatch .color { height: 3.5rem; }
  .swatch .label { font-size: 0.75rem; padding: 0.25rem 0; background: #fff; line-height: 1.3; }
  .swatch .label .name { font-weight: 600; }
  .swatch .label .hex { color: #6b7280; }
  .pair { display: inline-flex; gap: 0.5rem; margin-right: 1.5rem; margin-bottom: 0.5rem; align-items: center; }
  .pair .color { width: 2.5rem; height: 2.5rem; border-radius: 0.375rem; box-shadow: 0 1px 3px rgba(0,0,0,.1); }
  .pair .info { font-size: 0.85rem; line-height: 1.4; }
  .pair .info .name { font-weight: 600; }
  .pair .info .hex { color: #6b7280; }
</style>
</head>
<body>
    <h1>Tailwind Theme Color Palette</h1>
${body}
</body>
</html>
`;
}

function renderGroup(group: {
  name: string;
  entries: ColorEntry[];
  comment?: string;
}): string {
  const entries = processDefault(group.entries);
  const layout = detectLayout(group.entries);
  const heading = group.comment
    ? `${group.name} (${group.comment})`
    : group.name;

  if (layout === "card") {
    return renderCardGroup(heading, entries);
  }
  return renderPairGroup(heading, entries);
}

function renderCardGroup(heading: string, entries: ColorEntry[]): string {
  const swatches = entries
    .map(
      (e) =>
        `      <div class="swatch"><div class="color" style="background:${e.hex}"></div><div class="label"><div class="name">${e.key}</div><div class="hex">${e.hex}</div></div></div>`,
    )
    .join("\n");

  return `
    <h3>${heading}</h3>
    <div class="group">
${swatches}
    </div>`;
}

function renderPairGroup(heading: string, entries: ColorEntry[]): string {
  const pairs = entries
    .map((e) => {
      const borderStyle = isLightColor(e.hex)
        ? " border:1px solid #cbd5e1"
        : "";
      return `      <div class="pair"><div class="color" style="background:${e.hex};${borderStyle}"></div><div class="info"><div class="name">${e.key}</div><div class="hex">${e.hex}</div></div></div>`;
    })
    .join("\n");

  return `
    <h3>${heading}</h3>
    <div>
${pairs}
    </div>`;
}

function isLightColor(hex: string): boolean {
  const normalized = hex.replace("#", "");
  let r: number, g: number, b: number;

  if (normalized.length === 3) {
    r = parseInt(normalized[0] + normalized[0], 16);
    g = parseInt(normalized[1] + normalized[1], 16);
    b = parseInt(normalized[2] + normalized[2], 16);
  } else {
    r = parseInt(normalized.slice(0, 2), 16);
    g = parseInt(normalized.slice(2, 4), 16);
    b = parseInt(normalized.slice(4, 6), 16);
  }

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.85;
}
