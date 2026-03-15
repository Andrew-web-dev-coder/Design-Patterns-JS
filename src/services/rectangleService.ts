import * as fs from "fs";
import { RectangleModel } from "../rectangle/rectangleModel";
import { RectangleFactory } from "../factories/rectangleFactory";
import { RectangleValidator } from "../validators/rectangleValidator";
import { FileReadError } from "../common/errors/FileReadError";
import { ReadParametersError } from "../common/errors/ReadParametersError";
import { Logger } from "../common/logging/logger";

export class RectangleService {
  private static bounds(rect: RectangleModel) {
    const xs = rect.points.map((p) => p.x);
    const ys = rect.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const width = maxX - minX;
    const height = maxY - minY;
    return { minX, maxX, minY, maxY, width, height };
  }

  public static area(rect: RectangleModel): number {
    const { width, height } = this.bounds(rect);
    return width * height;
  }

  public static perimeter(rect: RectangleModel): number {
    const { width, height } = this.bounds(rect);
    return 2 * (width + height);
  }

  public static diagonal(rect: RectangleModel): number {
    const { width, height } = this.bounds(rect);
    return Math.sqrt(width ** 2 + height ** 2);
  }

  public static touchesAxis(rect: RectangleModel): boolean {
    const { minX, maxX, minY, maxY } = this.bounds(rect);
    const touchesX = minY <= 0 && maxY >= 0;
    const touchesY = minX <= 0 && maxX >= 0;
    return touchesX || touchesY;
  }

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
        Logger.error(`Invalid rectangle line "${line}": ${(err as Error).message}`);
      }
    }

    return result;
  }

  public static totalArea(rects: RectangleModel[]): number {
    if (!Array.isArray(rects)) throw new ReadParametersError("Expected array of rectangles");
    return rects.reduce((sum, r) => sum + this.area(r), 0);
  }

  public static findTouchingAxis(rects: RectangleModel[]): RectangleModel[] {
    if (!Array.isArray(rects)) throw new ReadParametersError("Expected array of rectangles");
    return rects.filter((r) => this.touchesAxis(r));
  }

  public static findLargest(rects: RectangleModel[]): RectangleModel | null {
    if (!Array.isArray(rects)) throw new ReadParametersError("Expected array of rectangles");
    if (rects.length === 0) return null;
    return rects.reduce((max, r) => (this.area(r) > this.area(max) ? r : max));
  }

  public static sortByArea(rects: RectangleModel[]): RectangleModel[] {
    return [...rects].sort((a, b) => this.area(a) - this.area(b));
  }

  public static maxArea(rects: RectangleModel[]): RectangleModel | null {
    return this.findLargest(rects);
  }

  public static minArea(rects: RectangleModel[]): RectangleModel | null {
    if (!Array.isArray(rects)) throw new ReadParametersError("Expected array of rectangles");
    if (rects.length === 0) return null;
    return rects.reduce((min, r) => (this.area(r) < this.area(min) ? r : min));
  }

  // =========================================================
  // Методы по ТЗ "Прямоугольник" (Variant A: оси-параллельный)
  // =========================================================

  /**
   * Проверка "является ли прямоугольником".
   * Для Variant A достаточно проверить:
   * - 4 точки
   * - ровно 2 разных X и 2 разных Y
   * - присутствуют все 4 комбинации (minX/minY, maxX/minY, maxX/maxY, minX/maxY)
   */
  public static isRectangle(rect: RectangleModel): boolean {
    if (!rect || !Array.isArray(rect.points) || rect.points.length !== 4) return false;

    const xs = Array.from(new Set(rect.points.map((p) => p.x)));
    const ys = Array.from(new Set(rect.points.map((p) => p.y)));
    if (xs.length !== 2 || ys.length !== 2) return false;

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // ширина/высота должны быть > 0
    if (maxX === minX || maxY === minY) return false;

    const key = (x: number, y: number) => `${x}:${y}`;
    const set = new Set(rect.points.map((p) => key(p.x, p.y)));

    return (
      set.has(key(minX, minY)) &&
      set.has(key(maxX, minY)) &&
      set.has(key(maxX, maxY)) &&
      set.has(key(minX, maxY))
    );
  }

  /**
   * Выпуклость.
   * Любой корректный прямоугольник выпуклый.
   * (Но на всякий случай опираемся на isRectangle)
   */
  public static isConvex(rect: RectangleModel): boolean {
    return this.isRectangle(rect);
  }

  /**
   * Квадрат: ширина == высота.
   */
  public static isSquare(rect: RectangleModel): boolean {
    if (!this.isRectangle(rect)) return false;
    const { width, height } = this.bounds(rect);
    return Math.abs(width - height) < 1e-9;
  }

  /**
   * Ромб: все стороны равны.
   * Для прямоугольника это эквивалентно квадрату.
   */
  public static isRhombus(rect: RectangleModel): boolean {
    return this.isSquare(rect);
  }

  /**
   * Трапеция.
   * В "строгом" школьном определении трапеция — ровно ОДНА пара параллельных сторон.
   * У прямоугольника две пары параллельных сторон, поэтому false.
   */
  public static isTrapezoid(rect: RectangleModel): boolean {
    if (!this.isRectangle(rect)) return false;
    return false;
  }
}