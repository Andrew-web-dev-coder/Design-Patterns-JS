import { RectangleValidationError } from "../common/errors/RectangleValidationError";

export class RectangleValidator {
  public static validateNumeric(values: number[]): void {
    if (values.length !== 8) {
      throw new RectangleValidationError(
        "Rectangle must have 8 numeric params: x1 y1 x2 y2 x3 y3 x4 y4"
      );
    }

    if (values.some((v) => Number.isNaN(v) || !Number.isFinite(v))) {
      throw new RectangleValidationError("All values must be finite numbers");
    }

    // Разложим на точки
    const pts = [
      { x: values[0], y: values[1] },
      { x: values[2], y: values[3] },
      { x: values[4], y: values[5] },
      { x: values[6], y: values[7] },
    ];

    // 4 уникальные точки
    const uniq = new Set(pts.map((p) => `${p.x},${p.y}`));
    if (uniq.size !== 4) {
      throw new RectangleValidationError("Rectangle must have 4 distinct points");
    }

    // Оси-ориентированный прямоугольник: 2 уникальных X и 2 уникальных Y
    const xs = new Set(pts.map((p) => p.x));
    const ys = new Set(pts.map((p) => p.y));

    if (xs.size !== 2 || ys.size !== 2) {
      throw new RectangleValidationError(
        "Points do not form an axis-aligned rectangle (need 2 unique X and 2 unique Y)"
      );
    }

    const xArr = Array.from(xs);
    const yArr = Array.from(ys);
    const width = Math.abs(xArr[0] - xArr[1]);
    const height = Math.abs(yArr[0] - yArr[1]);

    if (width <= 0 || height <= 0) {
      throw new RectangleValidationError("Rectangle width and height must be positive");
    }

    // Доп. проверка: все 4 комбинации (x,y) должны присутствовать
    const expected = new Set<string>();
    for (const x of xArr) for (const y of yArr) expected.add(`${x},${y}`);

    for (const p of pts) {
      if (!expected.has(`${p.x},${p.y}`)) {
        throw new RectangleValidationError("Points do not match rectangle corner set");
      }
    }
  }

  public static validateTextLine(line: string): number[] {
    if (!line.trim()) {
      throw new RectangleValidationError("Rectangle line is empty");
    }

    const parts = line.trim().split(/\s+/);
    if (parts.length !== 8) {
      throw new RectangleValidationError(
        "Rectangle must have exactly 8 values: x1 y1 x2 y2 x3 y3 x4 y4"
      );
    }

    const nums = parts.map(Number);

    // validateNumeric уже сделает остальные проверки
    RectangleValidator.validateNumeric(nums);

    return nums;
  }
}
