import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { run } from "../src/index.js";

describe("参考データによる動作確認", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "t3p-verify-"));
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "verify" }),
    );
    fs.copyFileSync(
      path.resolve("tests/fixtures/tailwind.config.mjs"),
      path.join(tmpDir, "tailwind.config.mjs"),
    );
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("参考設定ファイルからHTMLを生成できる", async () => {
    await run(tmpDir);

    const outputPath = path.join(tmpDir, "color-palette.html");
    expect(fs.existsSync(outputPath)).toBe(true);

    const html = fs.readFileSync(outputPath, "utf-8");

    // 基本構造
    expect(html).toContain("<!DOCTYPE html>");

    // セクション見出し
    expect(html).toContain("<h2>colors</h2>");
    expect(html).toContain("<h2>textColor</h2>");

    // colorsセクションのグループ
    expect(html).toContain("primary (プライマリ(インディゴ))");
    expect(html).toContain("border (ボーダーの色)");

    // textColorセクション
    expect(html).toContain("textColor (文字色)");

    // DEFAULT処理: primary.500がDEFAULTとして表示される
    expect(html).toContain("500 (DEFAULT)");

    // カード表示(数値キー)とペア表示(非数値キー)の両方がある
    expect(html).toContain('class="swatch"');
    expect(html).toContain('class="pair"');

    // カラーコードが含まれる
    expect(html).toContain("#6366f1");
    expect(html).toContain("#e2e8f0");
    expect(html).toContain("#334155");

    // spacing(カラーコードを含まない)のデータが除外されている
    expect(html).not.toContain(">xs<");
    expect(html).not.toContain(">spacing<");

    // fontFamily(カラーコードを含まない)が除外されている
    expect(html).not.toContain("Noto Sans JP");
    expect(html).not.toContain("fontFamily");
  });
});
