import { describe, it, expect } from "vitest";
import { isHexColor } from "../src/is-hex-color.js";

describe("isHexColor", () => {
  it("3桁のHEXカラーコードを判定できる", () => {
    expect(isHexColor("#fff")).toBe(true);
    expect(isHexColor("#000")).toBe(true);
    expect(isHexColor("#abc")).toBe(true);
  });

  it("6桁のHEXカラーコードを判定できる", () => {
    expect(isHexColor("#ffffff")).toBe(true);
    expect(isHexColor("#0ea5e9")).toBe(true);
    expect(isHexColor("#1A2B3C")).toBe(true);
  });

  it("8桁のHEXカラーコード(透明度付き)を判定できる", () => {
    expect(isHexColor("#ffffff00")).toBe(true);
    expect(isHexColor("#0ea5e9ff")).toBe(true);
  });

  it("#で始まらない文字列を拒否する", () => {
    expect(isHexColor("ffffff")).toBe(false);
    expect(isHexColor("red")).toBe(false);
  });

  it("不正な桁数を拒否する", () => {
    expect(isHexColor("#ff")).toBe(false);
    expect(isHexColor("#ffff")).toBe(false);
    expect(isHexColor("#fffff")).toBe(false);
    expect(isHexColor("#fffffff")).toBe(false);
    expect(isHexColor("#fffffffff")).toBe(false);
  });

  it("HEX以外の文字を含む場合は拒否する", () => {
    expect(isHexColor("#gggggg")).toBe(false);
    expect(isHexColor("#xyz")).toBe(false);
  });

  it("カラーコードではない値を拒否する", () => {
    expect(isHexColor("1rem")).toBe(false);
    expect(isHexColor("700")).toBe(false);
    expect(isHexColor("")).toBe(false);
  });
});
