import { describe, it, expect } from "vitest";
import { processDefault } from "../src/process-default.js";
import type { ColorEntry } from "../src/types.js";

describe("processDefault", () => {
  it("DEFAULTの値と一致するキーに(DEFAULT)ラベルを付与し、DEFAULTキー自体は削除する", () => {
    const entries: ColorEntry[] = [
      { key: "DEFAULT", hex: "#3b82f6" },
      { key: "500", hex: "#3b82f6" },
      { key: "600", hex: "#2563eb" },
    ];
    const result = processDefault(entries);
    expect(result).toEqual([
      { key: "500 (DEFAULT)", hex: "#3b82f6" },
      { key: "600", hex: "#2563eb" },
    ]);
  });

  it("DEFAULTの値と一致するキーがない場合はDEFAULTを通常キーとして残す", () => {
    const entries: ColorEntry[] = [
      { key: "DEFAULT", hex: "#3b82f6" },
      { key: "light", hex: "#93c5fd" },
      { key: "dark", hex: "#1d4ed8" },
    ];
    const result = processDefault(entries);
    expect(result).toEqual([
      { key: "DEFAULT", hex: "#3b82f6" },
      { key: "light", hex: "#93c5fd" },
      { key: "dark", hex: "#1d4ed8" },
    ]);
  });

  it("DEFAULTキーがない場合はそのまま返す", () => {
    const entries: ColorEntry[] = [
      { key: "100", hex: "#dbeafe" },
      { key: "200", hex: "#bfdbfe" },
    ];
    const result = processDefault(entries);
    expect(result).toEqual(entries);
  });

  it("DEFAULTキーのみの場合はそのまま返す", () => {
    const entries: ColorEntry[] = [{ key: "DEFAULT", hex: "#3b82f6" }];
    const result = processDefault(entries);
    expect(result).toEqual([{ key: "DEFAULT", hex: "#3b82f6" }]);
  });

  it("元の配列を変更しない", () => {
    const entries: ColorEntry[] = [
      { key: "DEFAULT", hex: "#3b82f6" },
      { key: "500", hex: "#3b82f6" },
    ];
    const original = structuredClone(entries);
    processDefault(entries);
    expect(entries).toEqual(original);
  });
});
