import { createRequire } from "node:module";
import { createJiti } from "jiti";
import { pathToFileURL } from "node:url";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function parseConfig(filePath: string): Promise<any> {
  const ext = filePath.slice(filePath.lastIndexOf("."));

  try {
    switch (ext) {
      case ".ts": {
        const jiti = createJiti(filePath);
        const mod = await jiti.import(filePath);
        return extractDefault(mod);
      }
      case ".mjs": {
        const mod = await import(pathToFileURL(filePath).href);
        return extractDefault(mod);
      }
      case ".js":
      case ".cjs": {
        const require = createRequire(filePath);
        return require(filePath);
      }
      default:
        throw new Error(`未対応の拡張子です: ${ext}`);
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`設定ファイルの構文エラー: ${(error as Error).message}`);
    }
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDefault(mod: any): any {
  return mod?.default ?? mod;
}
