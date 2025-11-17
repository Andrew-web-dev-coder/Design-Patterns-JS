import * as fs from "fs";

import { ConeModel } from "../cone/coneModel";
import { ConeFactory } from "../cone/coneFactory";
import { ConeValidator } from "../validators/coneValidator";

import { ReadParametersError } from "../common/errors/ReadParametersError";
import { FileReadError } from "../common/errors/FileReadError";
import { Logger } from "../common/logging/logger";

export class ConeService {

    public static getVolume(cone: ConeModel): number {
        return cone.volume();
    }

    public static getBaseArea(cone: ConeModel): number {
        return cone.baseArea();
    }

    public static filterByMinVolume(cones: ConeModel[], minVolume: number): ConeModel[] {
        return cones.filter((c) => c.volume() >= minVolume);
    }

    public static sortByVolume(cones: ConeModel[]): ConeModel[] {
        return [...cones].sort((a, b) => a.volume() - b.volume());
    }

    public static maxVolume(cones: ConeModel[]): ConeModel | null {
        if (cones.length === 0) return null;

        return cones.reduce((max, cur) =>
            cur.volume() > max.volume() ? cur : max
        );
    }

    public static minVolume(cones: ConeModel[]): ConeModel | null {
        if (cones.length === 0) return null;

        return cones.reduce((min, cur) =>
            cur.volume() < min.volume() ? cur : min
        );
    }

    public static totalVolume(cones: ConeModel[]): number {
        if (!Array.isArray(cones)) {
            throw new ReadParametersError("Expected array of cones");
        }
        return cones.reduce((sum, c) => sum + c.volume(), 0);
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
                Logger.error(
                    `Invalid cone line "${line}": ${(err as Error).message}`
                );
            }
        }

        return result;
    }
}
