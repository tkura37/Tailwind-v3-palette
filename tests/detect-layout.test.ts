import { describe, it, expect } from "vitest";
import { detectLayout } from "../src/detect-layout.js";
import type { ColorEntry } from "../src/types.js";

const entry = (key: string): ColorEntry => ({ key, hex: "#000000" });

describe("detectLayout", () => {
  it("キーの半数以上が数値ならcardを返す", () => {
    const entries = [entry("50"), entry("100"), entry("200"), entry("300")];
    expect(detectLayout(entries)).toBe("card");
  });

  it("キーが全て非数値ならpairを返す", () => {
    const entries = [entry("light"), entry("dark"), entry("main")];
    expect(detectLayout(entries)).toBe("pair");
  });

  it("ちょうど半数が数値ならcardを返す", () => {
    const entries = [entry("100"), entry("light")];
    expect(detectLayout(entries)).toBe("card");
  });

  it("数値が半数未満ならpairを返す", () => {
    const entries = [entry("100"), entry("light"), entry("dark")];
    expect(detectLayout(entries)).toBe("pair");
  });

  it("DEFAULTキーは数値としてカウントしない", () => {
    const entries = [entry("DEFAULT"), entry("100"), entry("200")];
    expect(detectLayout(entries)).toBe("card");
  });
});
