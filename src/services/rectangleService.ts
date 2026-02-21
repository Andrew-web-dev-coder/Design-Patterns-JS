import * as fs from "fs";

import { RectangleModel } from "../rectangle/rectangleModel";
import { RectangleFactory } from "../factories/rectangleFactory";
import { RectangleValidator } from "../validators/rectangleValidator";
import { FileReadError } from "../common/errors/FileReadError";
import { ReadParametersError } from "../common/errors/ReadParametersError";
import { Logger } from "../common/logging/logger";
import { Point2D } from "../geometry/point2D";

const LINE_SPLIT_REGEX = /\r?\n/;

// ===== маленькие геометрические хелперы (2D) =====
function sub(a: Point2D, b: Point2D): Point2D {
  return new Point2D(a.x - b.x, a.y - b.y);
}

function dot(a: Point2D, b: Point2D): number {
  return a.x * b.x + a.y * b.y;
}

function cross(a: Point2D, b: Point2D): number {
  return a.x * b.y - a.y * b.x;
}

function len2(v: Point2D): number {
  return v.x * v.x + v.y * v.y;
}

function isParallel(u: Point2D, v: Point2D): boolean {
  // параллельны <=> векторное произведение = 0
  return cross(u, v) === 0;
}

function isRightAngle(u: Point2D, v: Point2D): boolean {
  // перпендикулярны <=> скалярное произведение = 0
  return dot(u, v) === 0;
}

function uniquePoints(points: ReadonlyArray<Point2D>): Point2D[] {
  const map = new Map<string, Point2D>();
  for (const p of points) {
    map.set(`${p.x}:${p.y}`, p);
  }
  return [...map.values()];
}

function anyThreeCollinear(points: ReadonlyArray<Point2D>): boolean {
  // Проверяем все тройки: (pi, pj, pk) коллинеарны, если cross(pj-pi, pk-pi) == 0
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      for (let k = j + 1; k < points.length; k += 1) {
        const a = points[i];
        const b = points[j];
        const c = points[k];
        const ab = sub(b, a);
        const ac = sub(c, a);
        if (cross(ab, ac) === 0) return true;
      }
    }
  }
  return false;
}

/**
 * Упорядочить 4 точки по обходу (по углу вокруг центра масс).
 * Это нужно для корректных проверок выпуклости/параллельности сторон.
 */
function orderByAngle(points: ReadonlyArray<Point2D>): Point2D[] {
  const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points.reduce((s, p) => s + p.y, 0) / points.length;

  return [...points].sort((p1, p2) => {
    const a1 = Math.atan2(p1.y - cy, p1.x - cx);
    const a2 = Math.atan2(p2.y - cy, p2.x - cx);
    return a1 - a2;
  });
}

function boundsAxisAligned(points: ReadonlyArray<Point2D>) {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
}

export class RectangleService {
  // ===== I/O =====

  public static loadFromFile(filePath: string): RectangleModel[] {
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

    const result: RectangleModel[] = [];

    for (const line of lines) {
      try {
        const nums = RectangleValidator.validateTextLine(line);
        const rect = RectangleFactory.fromNumbers(nums);
        result.push(rect);
      } catch (err) {
        Logger.warn(`Invalid rectangle line skipped: "${line}"`, err);
      }
    }

    return result;
  }

  // ===== Метрики (ориентация параллельно осям — из примечания ТЗ) =====

  public static getArea(rect: RectangleModel): number {
    const { width, height } = boundsAxisAligned(rect.points);
    return width * height;
  }

  public static getPerimeter(rect: RectangleModel): number {
    const { width, height } = boundsAxisAligned(rect.points);
    return 2 * (width + height);
  }

  public static getDiagonal(rect: RectangleModel): number {
    const { width, height } = boundsAxisAligned(rect.points);
    return Math.sqrt(width * width + height * height);
  }

  /**
   * Пересекает ли хотя бы одну ось координат (X или Y).
   * Если нужно “только одну из осей” — сделаем отдельный метод ниже.
   */
  public static touchesAnyAxis(rect: RectangleModel): boolean {
    const { minX, maxX, minY, maxY } = boundsAxisAligned(rect.points);
    const touchesX = minY <= 0 && maxY >= 0;
    const touchesY = minX <= 0 && maxX >= 0;
    return touchesX || touchesY;
  }

  /** Пересекает РОВНО одну ось (X XOR Y). */
  public static touchesExactlyOneAxis(rect: RectangleModel): boolean {
    const { minX, maxX, minY, maxY } = boundsAxisAligned(rect.points);
    const touchesX = minY <= 0 && maxY >= 0;
    const touchesY = minX <= 0 && maxX >= 0;
    return (touchesX && !touchesY) || (!touchesX && touchesY);
  }

  // ===== Проверки по варианту (точки/выпуклость/квадрат/ромб/трапеция) =====

  /** Составляют ли точки прямоугольник в осевом положении (параллельно осям). */
  public static isAxisAlignedRectangle(rect: RectangleModel): boolean {
    const pts = uniquePoints(rect.points);
    if (pts.length !== 4) return false;
    if (anyThreeCollinear(pts)) return false;

    const xs = [...new Set(pts.map((p) => p.x))];
    const ys = [...new Set(pts.map((p) => p.y))];

    // Для осевого прямоугольника должны быть ровно 2 разных x и 2 разных y,
    // и должны существовать все 4 комбинации (x1/y1, x1/y2, x2/y1, x2/y2).
    if (xs.length !== 2 || ys.length !== 2) return false;

    const need = new Set<string>([
      `${xs[0]}:${ys[0]}`,
      `${xs[0]}:${ys[1]}`,
      `${xs[1]}:${ys[0]}`,
      `${xs[1]}:${ys[1]}`,
    ]);

    for (const p of pts) need.delete(`${p.x}:${p.y}`);
    return need.size === 0;
  }

  /** Является ли четырехугольник выпуклым (для произвольного порядка точек). */
  public static isConvex(rect: RectangleModel): boolean {
    const pts = uniquePoints(rect.points);
    if (pts.length !== 4) return false;
    if (anyThreeCollinear(pts)) return false;

    const ordered = orderByAngle(pts);

    // Для выпуклого многоугольника знаки cross у всех поворотов одинаковы
    let prevSign = 0;

    for (let i = 0; i < 4; i += 1) {
      const a = ordered[i];
      const b = ordered[(i + 1) % 4];
      const c = ordered[(i + 2) % 4];

      const ab = sub(b, a);
      const bc = sub(c, b);
      const z = cross(ab, bc);

      const sign = Math.sign(z);
      if (sign === 0) return false; // три подряд коллинеарны => не выпуклый корректно
      if (prevSign === 0) prevSign = sign;
      else if (sign !== prevSign) return false;
    }

    return true;
  }

  /**
   * Прямоугольник в общем смысле (не только осевой):
   * 4 точки должны образовывать выпуклый четырёхугольник,
   * с прямыми углами и параллельными противоположными сторонами.
   */
  public static isRectangle(rect: RectangleModel): boolean {
    const pts = uniquePoints(rect.points);
    if (pts.length !== 4) return false;
    if (!RectangleService.isConvex(rect)) return false;

    const ordered = orderByAngle(pts);

    const v0 = sub(ordered[1], ordered[0]);
    const v1 = sub(ordered[2], ordered[1]);
    const v2 = sub(ordered[3], ordered[2]);
    const v3 = sub(ordered[0], ordered[3]);

    // прямые углы
    const rightAngles =
      isRightAngle(v0, v1) && isRightAngle(v1, v2) && isRightAngle(v2, v3) && isRightAngle(v3, v0);

    if (!rightAngles) return false;

    // противоположные стороны параллельны
    const parallel = isParallel(v0, v2) && isParallel(v1, v3);

    return parallel;
  }

  public static isSquare(rect: RectangleModel): boolean {
    if (!RectangleService.isRectangle(rect)) return false;

    const ordered = orderByAngle(uniquePoints(rect.points));
    const a = ordered[0];
    const b = ordered[1];
    const c = ordered[2];
    const d = ordered[3];

    const ab2 = len2(sub(b, a));
    const bc2 = len2(sub(c, b));
    const cd2 = len2(sub(d, c));
    const da2 = len2(sub(a, d));

    return ab2 === bc2 && bc2 === cd2 && cd2 === da2;
  }

  /**
   * Ромб: все стороны равны (в школьной геометрии).
   * Прямоугольник будет ромбом только если он квадрат.
   */
  public static isRhombus(rect: RectangleModel): boolean {
    // ромб — тоже выпуклый четырёхугольник
    if (!RectangleService.isConvex(rect)) return false;

    const ordered = orderByAngle(uniquePoints(rect.points));
    const a = ordered[0];
    const b = ordered[1];
    const c = ordered[2];
    const d = ordered[3];

    const ab2 = len2(sub(b, a));
    const bc2 = len2(sub(c, b));
    const cd2 = len2(sub(d, c));
    const da2 = len2(sub(a, d));

    return ab2 > 0 && ab2 === bc2 && bc2 === cd2 && cd2 === da2;
  }

  /**
   * Трапеция — по распространённому определению "есть хотя бы одна пара параллельных сторон".
   * Если у преподавателя "ровно одна пара", см. метод isTrapezoidOnlyOnePair().
   */
  public static isTrapezoid(rect: RectangleModel): boolean {
    if (!RectangleService.isConvex(rect)) return false;

    const ordered = orderByAngle(uniquePoints(rect.points));
    const v0 = sub(ordered[1], ordered[0]);
    const v1 = sub(ordered[2], ordered[1]);
    const v2 = sub(ordered[3], ordered[2]);
    const v3 = sub(ordered[0], ordered[3]);

    const pair1 = isParallel(v0, v2);
    const pair2 = isParallel(v1, v3);

    return pair1 || pair2;
  }

  /** Трапеция с ровно одной парой параллельных сторон. */
  public static isTrapezoidOnlyOnePair(rect: RectangleModel): boolean {
    if (!RectangleService.isConvex(rect)) return false;

    const ordered = orderByAngle(uniquePoints(rect.points));
    const v0 = sub(ordered[1], ordered[0]);
    const v1 = sub(ordered[2], ordered[1]);
    const v2 = sub(ordered[3], ordered[2]);
    const v3 = sub(ordered[0], ordered[3]);

    const pair1 = isParallel(v0, v2);
    const pair2 = isParallel(v1, v3);

    return (pair1 && !pair2) || (!pair1 && pair2);
  }

  // ===== агрегаты =====

  public static totalArea(rects: RectangleModel[]): number {
    if (!Array.isArray(rects)) {
      throw new ReadParametersError("Expected array of rectangles");
    }
    return rects.reduce((sum, r) => sum + RectangleService.getArea(r), 0);
  }

  public static findTouchingAxis(rects: RectangleModel[]): RectangleModel[] {
    return rects.filter((r) => RectangleService.touchesAnyAxis(r));
  }

  public static findLargest(rects: RectangleModel[]): RectangleModel | null {
    if (!Array.isArray(rects)) {
      throw new ReadParametersError("Expected array of rectangles");
    }
    if (rects.length === 0) return null;

    return rects.reduce((max, r) =>
      RectangleService.getArea(r) > RectangleService.getArea(max) ? r : max
    );
  }

  public static sortByArea(rects: RectangleModel[]): RectangleModel[] {
    return [...rects].sort((a, b) => RectangleService.getArea(a) - RectangleService.getArea(b));
  }

  public static maxArea(rects: RectangleModel[]): RectangleModel | null {
    if (!Array.isArray(rects)) {
      throw new ReadParametersError("Expected array of rectangles");
    }
    return RectangleService.findLargest(rects);
  }

  public static minArea(rects: RectangleModel[]): RectangleModel | null {
    if (!Array.isArray(rects)) {
      throw new ReadParametersError("Expected array of rectangles");
    }
    if (rects.length === 0) return null;

    return rects.reduce((min, r) =>
      RectangleService.getArea(r) < RectangleService.getArea(min) ? r : min
    );
  }
}