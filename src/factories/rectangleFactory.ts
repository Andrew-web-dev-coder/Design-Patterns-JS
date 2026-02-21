import { RectangleModel } from "../rectangle/rectangleModel";
import { RectangleValidator } from "../validators/rectangleValidator";
import { Point2D } from "../geometry/point2D";
import { Logger } from "../common/logging/logger";

const DEFAULT_RECTANGLE_NAME = "rectangle";

function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const stamp = Date.now().toString(36);
  return `${prefix}-${stamp}-${rand}`;
}

export class RectangleFactory {
  /**
   * values: [x1, y1, x2, y2] — диагональные точки.
   */
  public static fromNumbers(values: number[], name: string = DEFAULT_RECTANGLE_NAME): RectangleModel {
    RectangleValidator.validateNumeric(values);

    const [x1, y1, x2, y2] = values;

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    const points = [
      new Point2D(minX, minY),
      new Point2D(minX, maxY),
      new Point2D(maxX, maxY),
      new Point2D(maxX, minY),
    ];

    return new RectangleModel({
      id: generateId("rectangle"),
      name,
      points,
    });
  }

  public static fromTextLine(line: string, name: string = DEFAULT_RECTANGLE_NAME): RectangleModel | null {
    try {
      const nums = RectangleValidator.validateTextLine(line);
      return RectangleFactory.fromNumbers(nums, name);
    } catch (err) {
      Logger.warn(`Invalid rectangle line skipped: "${line}"`, err);
      return null;
    }
  }
}