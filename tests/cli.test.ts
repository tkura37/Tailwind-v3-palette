import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CLI_PATH = path.resolve("dist/cli.js");

function runCli(cwd: string): { stdout: string; stderr: string; exitCode: number } {
  try {
    const stdout = execFileSync("node", [CLI_PATH], {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { stdout, stderr: "", exitCode: 0 };
  } catch (error: unknown) {
    const e = error as { status: number; stderr: string; stdout: string };
    return { stdout: e.stdout || "", stderr: e.stderr || "", exitCode: e.status };
  }
}

describe("CLI", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "t3p-cli-bin-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true });
  });

  it("正常終了時に終了コード0を返しHTMLを出力する", () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "test" }),
    );
    fs.writeFileSync(
      path.join(tmpDir, "tailwind.config.js"),
      `module.exports = {
        theme: { colors: { brand: { main: "#10b981" } } }
      };`,
    );

    const { exitCode } = runCli(tmpDir);
    expect(exitCode).toBe(0);
    expect(fs.existsSync(path.join(tmpDir, "color-palette.html"))).toBe(true);

    const html = fs.readFileSync(path.join(tmpDir, "color-palette.html"), "utf-8");
    expect(html).toContain("brand");
    expect(html).toContain("#10b981");
  });

  it("設定ファイルが見つからない場合に終了コード1を返す", () => {
    fs.writeFileSync(
      path.join(tmpDir, "package.json"),
      JSON.stringify({ name: "test" }),
    );

    const { exitCode, stderr } = runCli(tmpDir);
    expect(exitCode).toBe(1);
    expect(stderr).toContain("設定ファイルが見つかりません");
  });

  it("package.jsonが見つからない場合に終了コード1を返す", () => {
    fs.writeFileSync(
      path.join(tmpDir, "tailwind.config.js"),
      `module.exports = { theme: { colors: { a: { b: "#000" } } } };`,
    );

    const { exitCode, stderr } = runCli(tmpDir);
    expect(exitCode).toBe(1);
    expect(stderr).toContain("package.json");
  });
});
