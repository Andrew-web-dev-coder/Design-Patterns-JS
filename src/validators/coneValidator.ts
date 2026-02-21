import { ConeValidationError } from "../common/errors/ConeValidationError";

const SPLIT_BY_WHITESPACE_REGEX = /\s+/;
const EXPECTED_VALUES_COUNT = 5;

const DEFAULT_CZ = 0;
const DEFAULT_RADIUS = 1;
const DEFAULT_HEIGHT = 1;

export class ConeValidator {
  public static validateTextLine(line: string): number[] {
    const trimmed = line.trim();
    if (!trimmed) {
      throw new ConeValidationError("Cone line is empty");
    }

    const parts = trimmed.split(SPLIT_BY_WHITESPACE_REGEX);

    if (parts.length > EXPECTED_VALUES_COUNT) {
      throw new ConeValidationError(
        "Cone must have 5 numeric values: cx cy cz radius height"
      );
    }

    // дополняем дефолтами если не хватает
    const padded = [...parts];
    while (padded.length < EXPECTED_VALUES_COUNT) {
      if (padded.length === 2) padded.push(String(DEFAULT_CZ));
      else if (padded.length === 3) padded.push(String(DEFAULT_RADIUS));
      else if (padded.length === 4) padded.push(String(DEFAULT_HEIGHT));
      else padded.push("0");
    }

    const nums = padded.map((p) => Number(p));
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