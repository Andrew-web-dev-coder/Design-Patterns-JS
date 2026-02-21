import * as fs from "fs";

import { ConeModel } from "../cone/coneModel";
import { ConeFactory } from "../factories/coneFactory";
import { ConeValidator } from "../validators/coneValidator";

import { ReadParametersError } from "../common/errors/ReadParametersError";
import { FileReadError } from "../common/errors/FileReadError";
import { Logger } from "../common/logging/logger";

const LINE_SPLIT_REGEX = /\r?\n/;

export class ConeService {
  public static getVolume(cone: ConeModel): number {
    return (Math.PI * cone.radius * cone.radius * cone.height) / 3;
  }

  public static getBaseArea(cone: ConeModel): number {
    return Math.PI * cone.radius * cone.radius;
  }

  public static getSurfaceArea(cone: ConeModel): number {
    const slant = Math.sqrt(cone.radius * cone.radius + cone.height * cone.height);
    const lateralArea = Math.PI * cone.radius * slant;
    return lateralArea + ConeService.getBaseArea(cone);
  }

  public static getVolumeSliceRatioByPlaneZ(cone: ConeModel, planeZ: number): number | null {
    const baseZ = cone.center.z;
    const topZ = cone.center.z + cone.height;

    if (planeZ <= baseZ || planeZ >= topZ) {
      return null;
    }

    const cutHeight = topZ - planeZ;
    const scale = cutHeight / cone.height;
    const rSmall = cone.radius * scale;

    const upperVolume = (Math.PI * rSmall * rSmall * cutHeight) / 3;
    const total = ConeService.getVolume(cone);
    const lowerVolume = total - upperVolume;

    return lowerVolume / upperVolume;
  }

  public static isBaseOnCoordinatePlane(cone: ConeModel): boolean {
    return cone.center.z === 0;
  }

  public static filterByMinVolume(cones: ConeModel[], minVolume: number): ConeModel[] {
    return cones.filter((c) => ConeService.getVolume(c) >= minVolume);
  }

  public static sortByVolume(cones: ConeModel[]): ConeModel[] {
    return [...cones].sort((a, b) => ConeService.getVolume(a) - ConeService.getVolume(b));
  }

  public static maxVolume(cones: ConeModel[]): ConeModel | null {
    if (cones.length === 0) return null;

    return cones.reduce((max, cur) =>
      ConeService.getVolume(cur) > ConeService.getVolume(max) ? cur : max
    );
  }

  public static minVolume(cones: ConeModel[]): ConeModel | null {
    if (cones.length === 0) return null;

    return cones.reduce((min, cur) =>
      ConeService.getVolume(cur) < ConeService.getVolume(min) ? cur : min
    );
  }

  public static totalVolume(cones: ConeModel[]): number {
    if (!Array.isArray(cones)) {
      throw new ReadParametersError("Expected array of cones");
    }
    return cones.reduce((sum, c) => sum + ConeService.getVolume(c), 0);
  }

  public static loadFromFile(filePath: string): ConeModel[] {
    let content: string;

    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new FileReadError(`Cannot read file: ${filePath}. Reason: ${msg}`);
    }

    const lines = content
      .split(LINE_SPLIT_REGEX)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const result: ConeModel[] = [];

    for (const line of lines) {
      try {
        const nums = ConeValidator.validateTextLine(line);
        const cone = ConeFactory.fromNumbers(nums);
        result.push(cone);
      } catch (err) {
        Logger.warn(`Invalid cone line skipped: "${line}"`, err);
      }
    }

    return result;
  }
}