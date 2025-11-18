import { RectangleValidationError } from "../common/errors/RectangleValidationError";

export class RectangleValidator {

    
    public static validateNumeric(values: number[]): void {
        if (values.length !== 4) {
            throw new RectangleValidationError(
                "Rectangle must have 4 numeric params: x y width height"
            );
        }

        if (values.some(isNaN)) {
            throw new RectangleValidationError("All values must be numbers");
        }
    }

    
    public static validateTextLine(line: string): number[] {
        const parts = line.trim().split(/\s+/);

        if (parts.length !== 4) {
            throw new RectangleValidationError(
                "Rectangle must have exactly 4 values: x y width height"
            );
        }

        const nums = parts.map(Number);

        if (nums.some(isNaN)) {
            throw new RectangleValidationError("Rectangle parameters must be valid numbers");
        }

        return nums;
    }
}
