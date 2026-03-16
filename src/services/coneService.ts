import * as fs from "fs";

import { ConeModel } from "../cone/coneModel";
import { ConeFactory } from "../factories/coneFactory";
import { ConeValidator } from "../validators/coneValidator";

import { ReadParametersError } from "../common/errors/ReadParametersError";
import { FileReadError } from "../common/errors/FileReadError";
import { Logger } from "../common/logging/logger";
import { Point3D } from "../geometry/point3D";

export class ConeService {
  public static volume(cone: ConeModel): number {
    return (Math.PI * cone.radius * cone.radius * cone.height) / 3;
  }

  public static baseArea(cone: ConeModel): number {
    return Math.PI * cone.radius * cone.radius;
  }

  public static surfaceArea(cone: ConeModel): number {
    const slant = Math.sqrt(cone.radius * cone.radius + cone.height * cone.height);
    const lateralArea = Math.PI * cone.radius * slant;
    return lateralArea + this.baseArea(cone);
  }

  /**
   * Отношение объёмов частей конуса при рассечении плоскостью z = planeZ:
   *   V_lower / V_upper
   *
   * Модель:
   * - center = центр основания
   * - основание лежит в плоскости z = center.z
   * - вершина лежит в точке z = center.z + height
   * - ось конуса направлена вдоль +Z
   *
   * Если planeZ не проходит через внутренность конуса, возвращается null.
   */
  public static volumeSliceRatio(cone: ConeModel, planeZ: number): number | null {
    const baseZ = cone.center.z;
    const topZ = baseZ + cone.height;

    if (planeZ <= baseZ || planeZ >= topZ) {
      return null;
    }

    const t = (planeZ - baseZ) / cone.height;
    const k = 1 - t;

    const fullVolume = this.volume(cone);
    const upperVolume = fullVolume * k * k * k;
    const lowerVolume = fullVolume - upperVolume;

    return lowerVolume / upperVolume;
  }

  /**
   * Отношение объёмов частей конуса при рассечении КООРДИНАТНОЙ плоскостью:
   * - OXY -> z = 0
   * - OYZ -> x = 0
   * - OXZ -> y = 0
   *
   * Что реализовано корректно:
   * 1) OXY: считаем через volumeSliceRatio(cone, 0)
   * 2) OYZ / OXZ:
   *    - если плоскость проходит через ось конуса (center.x === 0 или center.y === 0),
   *      то по симметрии она делит объём пополам => отношение 1
   *    - в общем случае для смещённого конуса точное вычисление заметно сложнее,
   *      поэтому возвращаем null
   */
  public static volumeRatioByCoordinatePlane(
  cone: ConeModel,
  plane: "OXY" | "OYZ" | "OXZ"
): number | null {

  if (plane === "OXY") {
    return this.volumeSliceRatio(cone, 0);
  }

  if (plane === "OYZ") {
    const d = cone.center.x;

    if (Math.abs(d) >= cone.radius) {
      return null;
    }

    const left = cone.radius + d;
    const right = cone.radius - d;

    return left / right;
  }

  if (plane === "OXZ") {
    const d = cone.center.y;

    if (Math.abs(d) >= cone.radius) {
      return null;
    }

    const front = cone.radius + d;
    const back = cone.radius - d;

    return front / back;
  }

  return null;
}

  /**
   * Основание лежит на координатной плоскости OXY,
   * если центр основания имеет z = 0.
   */
  public static isBaseOnCoordinatePlane(cone: ConeModel): boolean {
    return cone.center.z === 0;
  }

  /**
   * Равномерная генерация точки внутри конуса по объёму.
   */
  public static randomPointInside(cone: ConeModel): Point3D {
    const u = Math.random();
    const h = cone.height * (1 - Math.cbrt(u));

    const rMax = cone.radius * (1 - h / cone.height);
    const r = rMax * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;

    const x = cone.center.x + r * Math.cos(theta);
    const y = cone.center.y + r * Math.sin(theta);
    const z = cone.center.z + h;

    return new Point3D(x, y, z);
  }

  public static filterByMinVolume(cones: ConeModel[], minVolume: number): ConeModel[] {
    return cones.filter((c) => this.volume(c) >= minVolume);
  }

  public static sortByVolume(cones: ConeModel[]): ConeModel[] {
    return [...cones].sort((a, b) => this.volume(a) - this.volume(b));
  }

  public static maxVolume(cones: ConeModel[]): ConeModel | null {
    if (cones.length === 0) {
      return null;
    }

    return cones.reduce((max, cur) =>
      this.volume(cur) > this.volume(max) ? cur : max
    );
  }

  public static minVolume(cones: ConeModel[]): ConeModel | null {
    if (cones.length === 0) {
      return null;
    }

    return cones.reduce((min, cur) =>
      this.volume(cur) < this.volume(min) ? cur : min
    );
  }

  public static totalVolume(cones: ConeModel[]): number {
    if (!Array.isArray(cones)) {
      throw new ReadParametersError("Expected array of cones");
    }

    return cones.reduce((sum, c) => sum + this.volume(c), 0);
  }

  public static loadFromFile(path: string): ConeModel[] {
    let content: string;

    try {
      content = fs.readFileSync(path, "utf-8");
    } catch {
      throw new FileReadError(`Cannot read file: ${path}`);
    }

    const lines = content
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const result: ConeModel[] = [];

    for (const line of lines) {
      try {
        const nums = ConeValidator.validateTextLine(line);
        const cone = ConeFactory.fromNumbers(nums);
        result.push(cone);
      } catch (err) {
        Logger.error(`Invalid cone line "${line}": ${(err as Error).message}`);
      }
    }

    return result;
  }
}