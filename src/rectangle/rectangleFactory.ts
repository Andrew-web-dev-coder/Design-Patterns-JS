import { RectangleModel } from "../rectangle/rectangleModel";
import { RectangleValidator } from "../validators/rectangleValidator";

export class RectangleFactory {
  public static fromNumbers(values: number[]): RectangleModel {
    RectangleValidator.validateNumeric(values);

    const points = [
      { x: values[0], y: values[1] },
      { x: values[2], y: values[3] },
      { x: values[4], y: values[5] },
      { x: values[6], y: values[7] },
    ];

    return new RectangleModel(points);
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
