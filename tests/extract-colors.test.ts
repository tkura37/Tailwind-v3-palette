import { describe, it, expect } from "vitest";
import { extractColors } from "../src/extract-colors.js";

describe("extractColors", () => {
  it("単純なカラーグループを抽出できる", () => {
    const theme = {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
        },
      },
    };
    const result = extractColors(theme);
    expect(result).toEqual([
      {
        name: "colors",
        groups: [
          {
            name: "primary",
            entries: [
              { key: "50", hex: "#eff6ff" },
              { key: "100", hex: "#dbeafe" },
            ],
          },
        ],
      },
    ]);
  });

  it("複数セクションのカラーグループを抽出できる", () => {
    const theme = {
      colors: {
        primary: { 500: "#3b82f6" },
      },
      backgroundColor: {
        surface: { main: "#ffffff" },
      },
    };
    const result = extractColors(theme);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("colors");
    expect(result[1].name).toBe("backgroundColor");
  });

  it("extend内のカラーグループを抽出できる", () => {
    const theme = {
      extend: {
        colors: {
          secondary: { light: "#38bdf8", dark: "#0284c7" },
        },
      },
    };
    const result = extractColors(theme);
    expect(result).toEqual([
      {
        name: "colors",
        groups: [
          {
            name: "secondary",
            entries: [
              { key: "light", hex: "#38bdf8" },
              { key: "dark", hex: "#0284c7" },
            ],
          },
        ],
      },
    ]);
  });

  it("カラーコードを含まないプロパティをスキップする", () => {
    const theme = {
      fontFamily: {
        sans: ["Noto Sans JP", "sans-serif"],
      },
      spacing: {
        sm: "0.5rem",
        md: "1rem",
      },
      colors: {
        brand: { main: "#0ea5e9" },
      },
    };
    const result = extractColors(theme);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("colors");
  });

  it("関数値・配列値・CSS値を除外する", () => {
    const theme = {
      colors: {
        dynamic: {
          valid: "#ff0000",
          fn: () => "#000",
          cssVal: "1rem",
          num: "700",
        },
      },
    };
    const result = extractColors(theme);
    expect(result[0].groups[0].entries).toEqual([
      { key: "valid", hex: "#ff0000" },
    ]);
  });

  it("カラーコードが1つも含まれないグループを除外する", () => {
    const theme = {
      colors: {
        noColors: {
          a: "1rem",
          b: "700",
        },
        hasColors: {
          main: "#ffffff",
        },
      },
    };
    const result = extractColors(theme);
    expect(result[0].groups).toHaveLength(1);
    expect(result[0].groups[0].name).toBe("hasColors");
  });

  it("themeオブジェクトが空の場合は空配列を返す", () => {
    expect(extractColors({})).toEqual([]);
  });

  it("セクション直下にフラットにHEXカラーがある場合もグループとして抽出する", () => {
    const theme = {
      textColor: {
        DEFAULT: "#334155",
        heading: "#0f172a",
        body: "#334155",
        muted: "#94a3b8",
      },
    };
    const result = extractColors(theme);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("textColor");
    expect(result[0].groups).toHaveLength(1);
    expect(result[0].groups[0].name).toBe("textColor");
    expect(result[0].groups[0].entries).toEqual([
      { key: "DEFAULT", hex: "#334155" },
      { key: "heading", hex: "#0f172a" },
      { key: "body", hex: "#334155" },
      { key: "muted", hex: "#94a3b8" },
    ]);
  });

  it("フラットなHEXカラーとネストされたグループが混在する場合も抽出する", () => {
    const theme = {
      colors: {
        DEFAULT: "#000000",
        primary: {
          500: "#3b82f6",
        },
      },
    };
    const result = extractColors(theme);
    expect(result[0].groups).toHaveLength(2);
    expect(result[0].groups[0].name).toBe("colors");
    expect(result[0].groups[0].entries).toEqual([
      { key: "DEFAULT", hex: "#000000" },
    ]);
    expect(result[0].groups[1].name).toBe("primary");
  });

  it("設定ファイルの記述順序を維持する", () => {
    const theme = {
      colors: {
        zeta: { main: "#111111" },
        alpha: { main: "#222222" },
        middle: { main: "#333333" },
      },
    };
    const result = extractColors(theme);
    const names = result[0].groups.map((g) => g.name);
    expect(names).toEqual(["zeta", "alpha", "middle"]);
  });
});
