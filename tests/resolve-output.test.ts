import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { resolveOutput } from "../src/resolve-output.js";

describe("resolveOutput", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "t3p-output-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("package.jsonのtailwindV3Palette.outputの値をパスとして解決する", () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({
        tailwindV3Palette: { output: "./docs/palette.html" },
      }),
    );
    const result = resolveOutput(tmpDir);
    expect(result).toBe(path.join(tmpDir, "docs/palette.html"));
  });

  it("tailwindV3Palette.outputが未設定なら./color-palette.htmlを使用する", () => {
    fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify({}));
    const result = resolveOutput(tmpDir);
    expect(result).toBe(path.join(tmpDir, "color-palette.html"));
  });

  it("tailwindV3Paletteキー自体がなくてもデフォルトを返す", () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "test" }),
    );
    const result = resolveOutput(tmpDir);
    expect(result).toBe(path.join(tmpDir, "color-palette.html"));
  });

  it("package.jsonが存在しない場合はエラーを投げる", () => {
    expect(() => resolveOutput(tmpDir)).toThrow();
  });
});
