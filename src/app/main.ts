import path from "node:path";
import { readFile } from "node:fs/promises";

import { ConeFactory } from "../factories/coneFactory";
import { RectangleFactory } from "../factories/rectangleFactory";
import { Logger } from "../common/logging/logger";
import { FileReadError } from "../common/errors/FileReadError";
import { ShapeRepository } from "../repository/shapeRepository";

import { ShapeIdSpecification } from "../specifications/shapeIdSpecification";
import { FirstQuadrantSpecification } from "../specifications/firstQuadrantSpecification";
import { MetricRangeSpecification } from "../specifications/metricRangeSpecification";

import { ShapeIdComparator } from "../comparators/shapeIdComparator";
import { ShapeNameComparator } from "../comparators/shapeNameComparator";
import { ShapeFirstPointXComparator } from "../comparators/shapeFirstPointXComparator";
import { ShapeFirstPointYComparator } from "../comparators/shapeFirstPointYComparator";

import { Warehouse } from "../warehouse/warehouse";
import { Point2D } from "../geometry/point2D";

const DATA_FILE_RELATIVE_PATH = path.join("data", "sample_cones.txt");
const LINE_SPLIT_REGEX = /\r?\n/;

async function readLinesFromFile(relativePath: string): Promise<string[]> {
  const absPath = path.resolve(process.cwd(), relativePath);

  try {
    const content = await readFile(absPath, { encoding: "utf-8" });

    return content
      .split(LINE_SPLIT_REGEX)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new FileReadError(`Cannot read file: ${absPath}. Reason: ${message}`);
  }
}

export async function main(): Promise<void> {
  const repository = ShapeRepository.getInstance();
  const warehouse = Warehouse.getInstance();

  repository.clear();

  // ===== Добавление фигур =====
  const rectangle = RectangleFactory.fromNumbers([0, 0, 4, 3]);
  const cone = ConeFactory.fromNumbers([1, 2, 3, 5, 10]);

  repository.add(rectangle);
  repository.add(cone);

  Logger.info(`Shapes in repository: ${repository.count()}`);

  Logger.info(`Rectangle params in warehouse: ${JSON.stringify(warehouse.get(rectangle.id))}`);
  Logger.info(`Cone params in warehouse: ${JSON.stringify(warehouse.get(cone.id))}`);

  // ===== Observer + Warehouse =====
  Logger.info(`Rectangle params before change: ${JSON.stringify(warehouse.get(rectangle.id))}`);
  rectangle.setPoint(1, new Point2D(8, 0));
  Logger.info(`Rectangle params after change: ${JSON.stringify(warehouse.get(rectangle.id))}`);

  Logger.info(`Cone params before change: ${JSON.stringify(warehouse.get(cone.id))}`);
  cone.setRadius(10);
  Logger.info(`Cone params after change: ${JSON.stringify(warehouse.get(cone.id))}`);

  // ===== Specification =====
  const byId = repository.findBySpecification(
    new ShapeIdSpecification(rectangle.id)
  );
  Logger.info(`Found by id: ${byId.length}`);

  const firstQuadrantShapes = repository.findBySpecification(
    new FirstQuadrantSpecification()
  );
  Logger.info(`Found in first quadrant: ${firstQuadrantShapes.length}`);

  const mediumRectangles = repository.findBySpecification(
    new MetricRangeSpecification("area", 1, 100)
  );
  Logger.info(`Found by area range: ${mediumRectangles.length}`);

  // ===== Comparator =====
  const sortedById = repository.sort(new ShapeIdComparator());
  Logger.info(`Sorted by id: ${sortedById.map((shape) => shape.id).join(", ")}`);

  const sortedByName = repository.sort(new ShapeNameComparator());
  Logger.info(`Sorted by name: ${sortedByName.map((shape) => shape.name).join(", ")}`);

  const sortedByX = repository.sort(new ShapeFirstPointXComparator());
  Logger.info(`Sorted by first point X: ${sortedByX.map((shape) => shape.id).join(", ")}`);

  const sortedByY = repository.sort(new ShapeFirstPointYComparator());
  Logger.info(`Sorted by first point Y: ${sortedByY.map((shape) => shape.id).join(", ")}`);

  // ===== Чтение конусов из файла =====
  Logger.info(`Reading cones from: ${DATA_FILE_RELATIVE_PATH}`);

  try {
    const lines = await readLinesFromFile(DATA_FILE_RELATIVE_PATH);

    let created = 0;
    let skipped = 0;

    for (const line of lines) {
      const coneFromFile = ConeFactory.fromTextLine(line);

      if (!coneFromFile) {
        skipped += 1;
        Logger.warn(`SKIP: invalid line "${line}"`);
        continue;
      }

      repository.add(coneFromFile);
      created += 1;

      Logger.success(
        `OK: cone radius=${coneFromFile.radius}, height=${coneFromFile.height}`
      );
    }

    Logger.info(`Done. Created=${created}, Skipped=${skipped}`);
    Logger.info(`Repository total count: ${repository.count()}`);
  } catch (err) {
    Logger.error("Fatal error: cannot run app", err);
  }
}

void main();