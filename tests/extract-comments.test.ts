import { describe, it, expect } from "vitest";
import { extractComments } from "../src/extract-comments.js";

describe("extractComments", () => {
  it("カラーグループ直前の行コメントを抽出できる", () => {
    const source = `module.exports = {
  theme: {
    colors: {
      // テーマカラー
      primary: {
        500: "#3b82f6",
      },
    },
  },
};`;
    const result = extractComments(source);
    expect(result.get("primary")).toBe("テーマカラー");
  });

  it("カラーグループ直前のブロックコメントを抽出できる", () => {
    const source = `module.exports = {
  theme: {
    colors: {
      /* アクセントカラー */
      accent: {
        500: "#f59e0b",
      },
    },
  },
};`;
    const result = extractComments(source);
    expect(result.get("accent")).toBe("アクセントカラー");
  });

  it("連続する複数行のコメントを結合する", () => {
    const source = `module.exports = {
  theme: {
    colors: {
      // 第1行
      // 第2行
      multi: {
        500: "#10b981",
      },
    },
  },
};`;
    const result = extractComments(source);
    expect(result.get("multi")).toBe("第1行 第2行");
  });

  it("コメントとカラーグループの間に空行があっても抽出する", () => {
    const source = `module.exports = {
  theme: {
    colors: {
      // 空行の後

      spaced: {
        500: "#8b5cf6",
      },
    },
  },
};`;
    const result = extractComments(source);
    expect(result.get("spaced")).toBe("空行の後");
  });

  it("コメントがないカラーグループはMapに含まれない", () => {
    const source = `module.exports = {
  theme: {
    colors: {
      noComment: {
        500: "#ef4444",
      },
    },
  },
};`;
    const result = extractComments(source);
    expect(result.has("noComment")).toBe(false);
  });

  it("複数のカラーグループのコメントをそれぞれ抽出できる", () => {
    const source = `module.exports = {
  theme: {
    colors: {
      // プライマリ
      primary: {
        500: "#3b82f6",
      },
      // セカンダリ
      secondary: {
        500: "#10b981",
      },
    },
  },
};`;
    const result = extractComments(source);
    expect(result.get("primary")).toBe("プライマリ");
    expect(result.get("secondary")).toBe("セカンダリ");
  });
});
