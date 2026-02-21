import path from "node:path";
import { readFile } from "node:fs/promises";

import { ConeValidator } from "../validators/coneValidator";
import { ConeFactory } from "../factories/coneFactory";
import { Logger } from "../common/logging/logger";
import { FileReadError } from "../common/errors/FileReadError";

const DATA_FILE_RELATIVE_PATH = path.join("data", "cone.txt");

async function readLinesFromFile(relativePath: string): Promise<string[]> {
  const absPath = path.resolve(process.cwd(), relativePath);

  try {
    const content = await readFile(absPath, { encoding: "utf-8" });
    return content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
  } catch (err) {
    // Важно: выбрасываем кастомное исключение, а не стандартное
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
      try {
        const nums = ConeValidator.validateTextLine(line);
        const cone = ConeFactory.fromNumbers(nums);

        created += 1;
        Logger.success(
          `OK: cone radius=${cone.radius}, height=${cone.height}`
        );
      } catch (err) {
        skipped += 1;
        Logger.warn(`SKIP: invalid line "${line}"`, err);
      }
    }

    Logger.info(`Done. Created=${created}, Skipped=${skipped}`);
  } catch (err) {
    // Это ошибки уровня “файл не прочитан” и т.п. — тут уже завершаем
    Logger.error("Fatal error: cannot run app", err);
  }
}

// Если ты хочешь, чтобы файл был настоящей entrypoint:
void main();