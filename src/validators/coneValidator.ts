import { ConeValidationError } from "../common/errors/ConeValidationError";

const SPLIT_BY_WHITESPACE_REGEX = /\s+/;
const EXPECTED_VALUES_COUNT = 5;

export class ConeValidator {
  public static validateTextLine(line: string): number[] {
    const trimmed = line.trim();
    if (!trimmed) {
      throw new ConeValidationError("Cone line is empty");
    }

    const parts = trimmed.split(SPLIT_BY_WHITESPACE_REGEX);

    
    if (parts.length !== EXPECTED_VALUES_COUNT) {
      throw new ConeValidationError(
        "Cone must have exactly 5 numeric values: cx cy cz radius height"
      );
    }

    const nums = parts.map((p) => Number(p));
    ConeValidator.validateNumeric(nums);

    return nums;
  }

  public static validateNumeric(values: number[]): void {
    if (values.length !== EXPECTED_VALUES_COUNT) {
      throw new ConeValidationError(
        "Cone must have exactly 5 numeric values: cx cy cz radius height"
      );
    }

    if (values.some((n) => Number.isNaN(n) || !Number.isFinite(n))) {
      throw new ConeValidationError("Cone contains invalid numeric values");
    }

    const [, , , radius, height] = values;

    if (radius <= 0 || height <= 0) {
      throw new ConeValidationError("Cone radius and height must be positive");
    }
  }
}