import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { run } from "../src/index.js";

describe("CLI統合テスト", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "t3p-cli-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "test" }),
    );
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("設定ファイルからHTMLを生成して出力する", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "tailwind.config.js"),
      `module.exports = {
        theme: {
          colors: {
            primary: {
              50: "#eff6ff",
              500: "#3b82f6",
              900: "#1e3a8a",
            },
          },
        },
      };`,
    );

    await run(tmpDir);

    const outputPath = path.join(tmpDir, "color-palette.html");
    expect(fs.existsSync(outputPath)).toBe(true);

    const html = fs.readFileSync(outputPath, "utf-8");
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("primary");
    expect(html).toContain("#3b82f6");
    expect(html).toContain('class="swatch"');
  });

  it("カスタム出力先にHTMLを出力する", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({
        tailwindV3Palette: { output: "./out/palette.html" },
      }),
    );
    fs.mkdirSync(path.join(tmpDir, "out"));
    fs.writeFileSync(
      path.join(tmpDir, "tailwind.config.js"),
      `module.exports = {
        theme: {
          colors: {
            brand: { main: "#10b981" },
          },
        },
      };`,
    );

    await run(tmpDir);

    const outputPath = path.join(tmpDir, "out/palette.html");
    expect(fs.existsSync(outputPath)).toBe(true);
  });

  it("設定ファイルが見つからない場合はエラーで終了する", async () => {
    await expect(run(tmpDir)).rejects.toThrow();
  });

  it("コメントが見出しに反映される", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "tailwind.config.js"),
      `module.exports = {
        theme: {
          colors: {
            // メインカラー
            main: {
              light: "#f0f0f0",
              dark: "#333333",
            },
          },
        },
      };`,
    );

    await run(tmpDir);

    const html = fs.readFileSync(
      path.join(tmpDir, "color-palette.html"),
      "utf-8",
    );
    expect(html).toContain("main (メインカラー)");
  });

  it("DEFAULTキー処理が適用される", async () => {
    fs.writeFileSync(
      path.join(tmpDir, "tailwind.config.js"),
      `module.exports = {
        theme: {
          colors: {
            blue: {
              DEFAULT: "#3b82f6",
              500: "#3b82f6",
              600: "#2563eb",
            },
          },
        },
      };`,
    );

    await run(tmpDir);

    const html = fs.readFileSync(
      path.join(tmpDir, "color-palette.html"),
      "utf-8",
    );
    expect(html).toContain("500 (DEFAULT)");
    // DEFAULT自体は表示されない（500に吸収される）
    expect(html).not.toMatch(
      /<div class="name">DEFAULT<\/div>/,
    );
  });
});
