import fs from "node:fs";
import path from "node:path";

const DEFAULT_OUTPUT = "color-palette.html";

export function resolveOutput(cwd: string): string {
  const pkgPath = path.join(cwd, "package.json");

  if (!fs.existsSync(pkgPath)) {
    throw new Error(
      "package.json が見つかりません。プロジェクトルートで実行してください。",
    );
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  const output = pkg?.tailwindV3Palette?.output;

  if (typeof output === "string" && output.length > 0) {
    return path.resolve(cwd, output);
  }

  return path.resolve(cwd, DEFAULT_OUTPUT);
}
