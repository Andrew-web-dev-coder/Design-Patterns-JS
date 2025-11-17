import * as fs from "fs";
import { RectangleModel } from "../rectangle/rectangleModel";
import { RectangleFactory } from "../factories/rectangleFactory";
import { RectangleValidator } from "../validators/rectangleValidator";
import { FileReadError } from "../common/errors/FileReadError";
import { ReadParametersError } from "../common/errors/ReadParametersError";
import { Logger } from "../common/logging/logger";

export class RectangleService {
    public static loadFromFile(path: string): RectangleModel[] {
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

        const result: RectangleModel[] = [];

        for (const line of lines) {
            try {
                const nums = RectangleValidator.validateTextLine(line);
                const rect = RectangleFactory.fromNumbers(nums);
                result.push(rect);
            } catch (err) {
                Logger.error(
                    `Invalid rectangle line "${line}": ${(err as Error).message}`
                );
            }
        }

        return result;
    }

    public static totalArea(rects: RectangleModel[]): number {
        if (!Array.isArray(rects)) {
            throw new ReadParametersError("Expected array of rectangles");
        }
        return rects.reduce((sum, r) => sum + r.area(), 0);
    }

    public static findTouchingAxis(rects: RectangleModel[]): RectangleModel[] {
        return rects.filter((r) => r.touchesAxis());
    }

    public static findLargest(rects: RectangleModel[]): RectangleModel | null {
        if (!Array.isArray(rects)) {
            throw new ReadParametersError("Expected array of rectangles");
        }
        if (rects.length === 0) return null;
        return rects.reduce((max, r) => (r.area() > max.area() ? r : max));
    }

    public static sortByArea(rects: RectangleModel[]): RectangleModel[] {
        return [...rects].sort((a, b) => a.area() - b.area());
    }

    public static maxArea(rects: RectangleModel[]): RectangleModel | null {
        if (!Array.isArray(rects)) {
            throw new ReadParametersError("Expected array of rectangles");
        }
        return this.findLargest(rects);
    }

    public static minArea(rects: RectangleModel[]): RectangleModel | null {
        if (!Array.isArray(rects)) {
            throw new ReadParametersError("Expected array of rectangles");
        }
        if (rects.length === 0) return null;
        return rects.reduce((min, r) => (r.area() < min.area() ? r : min));
    }
}
