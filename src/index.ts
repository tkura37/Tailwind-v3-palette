import fs from "node:fs";
import path from "node:path";
import { detectConfig } from "./detect-config.js";
import { parseConfig } from "./parse-config.js";
import { extractColors } from "./extract-colors.js";
import { extractComments } from "./extract-comments.js";
import { resolveOutput } from "./resolve-output.js";
import { generateHtml } from "./generate-html.js";

export async function run(cwd: string): Promise<void> {
  const configPath = detectConfig(cwd);
  const config = await parseConfig(configPath);

  const theme = config?.theme ?? {};
  const sections = extractColors(theme);

  const source = fs.readFileSync(configPath, "utf-8");
  const comments = extractComments(source);

  for (const section of sections) {
    for (const group of section.groups) {
      const comment = comments.get(group.name);
      if (comment) {
        group.comment = comment;
      }
    }
  }

  const html = generateHtml(sections);
  const outputPath = resolveOutput(cwd);

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, html, "utf-8");
}
