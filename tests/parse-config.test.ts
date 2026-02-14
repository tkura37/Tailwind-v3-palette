import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { parseConfig } from "../src/parse-config.js";

describe("parseConfig", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "t3p-parse-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it(".jsファイルを解析できる", async () => {
    const filePath = path.join(tmpDir, "tailwind.config.js");
    fs.writeFileSync(
      filePath,
      `module.exports = {
        theme: {
          colors: { primary: { 500: "#3b82f6" } }
        }
      };`,
    );
    const result = await parseConfig(filePath);
    expect(result.theme.colors.primary["500"]).toBe("#3b82f6");
  });

  it(".cjsファイルを解析できる", async () => {
    const filePath = path.join(tmpDir, "tailwind.config.cjs");
    fs.writeFileSync(
      filePath,
      `module.exports = {
        theme: {
          colors: { brand: { main: "#0ea5e9" } }
        }
      };`,
    );
    const result = await parseConfig(filePath);
    expect(result.theme.colors.brand.main).toBe("#0ea5e9");
  });

  it(".mjsファイルを解析できる", async () => {
    const filePath = path.join(tmpDir, "tailwind.config.mjs");
    fs.writeFileSync(
      filePath,
      `export default {
        theme: {
          colors: { accent: { light: "#fbbf24" } }
        }
      };`,
    );
    const result = await parseConfig(filePath);
    expect(result.theme.colors.accent.light).toBe("#fbbf24");
  });

  it(".tsファイルを解析できる", async () => {
    const filePath = path.join(tmpDir, "tailwind.config.ts");
    fs.writeFileSync(
      filePath,
      `const config = {
        theme: {
          colors: { info: { 100: "#dbeafe" } }
        }
      };
      export default config;`,
    );
    const result = await parseConfig(filePath);
    expect(result.theme.colors.info["100"]).toBe("#dbeafe");
  });

  it("構文エラーのあるファイルはエラーを投げる", async () => {
    const filePath = path.join(tmpDir, "tailwind.config.js");
    fs.writeFileSync(filePath, "module.exports = {{{");
    await expect(parseConfig(filePath)).rejects.toThrow();
  });
});
