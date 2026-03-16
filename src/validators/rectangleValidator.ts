import { RectangleValidationError } from "../common/errors/RectangleValidationError";

const SPLIT_BY_WHITESPACE_REGEX = /\s+/;
const EXPECTED_VALUES_COUNT = 4;

export class RectangleValidator {
  /**
   * values: [x1, y1, x2, y2] — диагональные точки прямоугольника
   */
  public static validateNumeric(values: number[]): void {
    if (values.length !== EXPECTED_VALUES_COUNT) {
      throw new RectangleValidationError(
        "Rectangle must have exactly 4 numeric values: x1 y1 x2 y2"
      );
    }

    if (values.some((v) => Number.isNaN(v) || !Number.isFinite(v))) {
      throw new RectangleValidationError("All rectangle values must be finite numbers");
    }

    const [x1, y1, x2, y2] = values;

    // Диагональные точки не должны совпадать
    if (x1 === x2 && y1 === y2) {
      throw new RectangleValidationError(
        "Rectangle diagonal points must not coincide"
      );
    }

    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    if (width <= 0 || height <= 0) {
      throw new RectangleValidationError(
        "Rectangle width and height must be positive"
      );
    }
  }

  public static validateTextLine(line: string): number[] {
    const trimmed = line.trim();
    if (!trimmed) {
      throw new RectangleValidationError("Rectangle line is empty");
    }

    const parts = trimmed.split(SPLIT_BY_WHITESPACE_REGEX);
    if (parts.length !== EXPECTED_VALUES_COUNT) {
      throw new RectangleValidationError(
        "Rectangle line must contain exactly 4 values: x1 y1 x2 y2"
      );
    }

    const nums = parts.map(Number);
    RectangleValidator.validateNumeric(nums);

    return nums;
  }
}