import path from "node:path";
import { readFile } from "node:fs/promises";

import { ConeFactory } from "../factories/coneFactory";
import { Logger } from "../common/logging/logger";
import { FileReadError } from "../common/errors/FileReadError";

const DATA_FILE_RELATIVE_PATH = path.join("data", "sample_cones.txt");
const LINE_SPLIT_REGEX = /\r?\n/;

async function readLinesFromFile(relativePath: string): Promise<string[]> {
  const absPath = path.resolve(process.cwd(), relativePath);

  try {
    const content = await readFile(absPath, { encoding: "utf-8" });
    return content
      .split(LINE_SPLIT_REGEX)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new FileReadError(`Cannot read file: ${absPath}. Reason: ${message}`);
  }
}

export async function main(): Promise<void> {
  Logger.info(`Reading cones from: ${DATA_FILE_RELATIVE_PATH}`);

  try {
    const lines = await readLinesFromFile(DATA_FILE_RELATIVE_PATH);

    let created = 0;
    let skipped = 0;

    for (const line of lines) {
      const cone = ConeFactory.fromTextLine(line);

      if (!cone) {
        skipped += 1;
        Logger.warn(`SKIP: invalid line "${line}"`);
        continue;
      }

      created += 1;
      Logger.success(`OK: cone radius=${cone.radius}, height=${cone.height}`);
    }

    Logger.info(`Done. Created=${created}, Skipped=${skipped}`);
  } catch (err) {
    Logger.error("Fatal error: cannot run app", err);
  }
}

void main();