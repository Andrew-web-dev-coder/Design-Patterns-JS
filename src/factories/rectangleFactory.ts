import { RectangleModel } from "../rectangle/rectangleModel";
import { RectangleValidator } from "../validators/rectangleValidator";
import { Point2D } from "../geometry/point2D";

export class RectangleFactory {
  /**
   * values: [x1, y1, x2, y2] — диагональные точки прямоугольника (оси-параллельного)
   */
  public static fromNumbers(values: number[]): RectangleModel {
    RectangleValidator.validateNumeric(values);

    const [x1, y1, x2, y2] = values;

    // Строим 4 вершины оси-параллельного прямоугольника по диагонали
    const points = [
      new Point2D(x1, y1),
      new Point2D(x2, y1),
      new Point2D(x2, y2),
      new Point2D(x1, y2),
    ];

    return new RectangleModel({ points });
  }

  public static fromTextLine(line: string): RectangleModel | null {
    try {
      const nums = RectangleValidator.validateTextLine(line);
      return RectangleFactory.fromNumbers(nums);
    } catch {
      return null;
    }
  }
}