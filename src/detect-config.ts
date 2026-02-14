import fs from "node:fs";
import path from "node:path";

const CONFIG_FILES = [
  "tailwind.config.ts",
  "tailwind.config.js",
  "tailwind.config.cjs",
  "tailwind.config.mjs",
] as const;

export function detectConfig(cwd: string): string {
  for (const file of CONFIG_FILES) {
    const filePath = path.join(cwd, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  throw new Error(
    "Tailwind CSS の設定ファイルが見つかりません。tailwind.config.{ts,js,cjs,mjs} のいずれかを作成してください。",
  );
}
