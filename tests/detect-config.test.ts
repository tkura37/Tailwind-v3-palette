import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { detectConfig } from "../src/detect-config.js";

describe("detectConfig", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "t3p-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("tailwind.config.tsを最優先で検出する", () => {
    fs.writeFileSync(path.join(tmpDir, "tailwind.config.ts"), "");
    fs.writeFileSync(path.join(tmpDir, "tailwind.config.js"), "");
    const result = detectConfig(tmpDir);
    expect(result).toBe(path.join(tmpDir, "tailwind.config.ts"));
  });

  it("tailwind.config.tsがなければ.jsを検出する", () => {
    fs.writeFileSync(path.join(tmpDir, "tailwind.config.js"), "");
    fs.writeFileSync(path.join(tmpDir, "tailwind.config.cjs"), "");
    const result = detectConfig(tmpDir);
    expect(result).toBe(path.join(tmpDir, "tailwind.config.js"));
  });

  it("tailwind.config.cjsを検出する", () => {
    fs.writeFileSync(path.join(tmpDir, "tailwind.config.cjs"), "");
    const result = detectConfig(tmpDir);
    expect(result).toBe(path.join(tmpDir, "tailwind.config.cjs"));
  });

  it("tailwind.config.mjsを検出する", () => {
    fs.writeFileSync(path.join(tmpDir, "tailwind.config.mjs"), "");
    const result = detectConfig(tmpDir);
    expect(result).toBe(path.join(tmpDir, "tailwind.config.mjs"));
  });

  it("設定ファイルが見つからない場合はエラーを投げる", () => {
    expect(() => detectConfig(tmpDir)).toThrow();
  });
});
