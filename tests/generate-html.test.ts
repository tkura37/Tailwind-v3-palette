import { describe, it, expect } from "vitest";
import { generateHtml } from "../src/generate-html.js";
import type { ColorSection } from "../src/types.js";

describe("generateHtml", () => {
  it("有効なHTML文書を生成する", () => {
    const sections: ColorSection[] = [];
    const html = generateHtml(sections);
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html lang=\"ja\">");
    expect(html).toContain("</html>");
  });

  it("セクション名をh2見出しとして表示する", () => {
    const sections: ColorSection[] = [
      {
        name: "colors",
        groups: [
          {
            name: "primary",
            entries: [{ key: "500", hex: "#3b82f6" }],
          },
        ],
      },
    ];
    const html = generateHtml(sections);
    expect(html).toContain("<h2>colors</h2>");
    expect(html).toContain("<h3>primary</h3>");
  });

  it("複数セクションがそれぞれh2見出しを持つ", () => {
    const sections: ColorSection[] = [
      {
        name: "colors",
        groups: [{ name: "a", entries: [{ key: "x", hex: "#111" }] }],
      },
      {
        name: "backgroundColor",
        groups: [{ name: "b", entries: [{ key: "y", hex: "#222" }] }],
      },
    ];
    const html = generateHtml(sections);
    expect(html).toContain("<h2>colors</h2>");
    expect(html).toContain("<h2>backgroundColor</h2>");
  });

  it("カード横並び表示: 数値キーのグループをswatchで表示する", () => {
    const sections: ColorSection[] = [
      {
        name: "colors",
        groups: [
          {
            name: "blue",
            entries: [
              { key: "100", hex: "#dbeafe" },
              { key: "500", hex: "#3b82f6" },
            ],
          },
        ],
      },
    ];
    const html = generateHtml(sections);
    expect(html).toContain('class="group"');
    expect(html).toContain('class="swatch"');
    expect(html).toContain("background:#dbeafe");
    expect(html).toContain("100");
    expect(html).toContain("#dbeafe");
  });

  it("ペア表示: 非数値キーのグループをpairで表示する", () => {
    const sections: ColorSection[] = [
      {
        name: "colors",
        groups: [
          {
            name: "surface",
            entries: [
              { key: "main", hex: "#ffffff" },
              { key: "muted", hex: "#f1f5f9" },
            ],
          },
        ],
      },
    ];
    const html = generateHtml(sections);
    expect(html).toContain('class="pair"');
    expect(html).toContain("main");
    expect(html).toContain("#ffffff");
  });

  it("コメント付きグループの見出しに補足テキストを含める", () => {
    const sections: ColorSection[] = [
      {
        name: "colors",
        groups: [
          {
            name: "theme",
            comment: "テーマカラー",
            entries: [{ key: "500", hex: "#0ea5e9" }],
          },
        ],
      },
    ];
    const html = generateHtml(sections);
    expect(html).toContain("theme (テーマカラー)");
  });

  it("DEFAULTキー処理が適用されたエントリーを正しく表示する", () => {
    const sections: ColorSection[] = [
      {
        name: "colors",
        groups: [
          {
            name: "primary",
            entries: [
              { key: "500 (DEFAULT)", hex: "#3b82f6" },
              { key: "600", hex: "#2563eb" },
            ],
          },
        ],
      },
    ];
    const html = generateHtml(sections);
    expect(html).toContain("500 (DEFAULT)");
  });

  it("明るい色(ペア表示)にはボーダーを付ける", () => {
    const sections: ColorSection[] = [
      {
        name: "colors",
        groups: [
          {
            name: "surface",
            entries: [{ key: "light", hex: "#ffffff" }],
          },
        ],
      },
    ];
    const html = generateHtml(sections);
    expect(html).toContain("border:1px solid");
  });
});
