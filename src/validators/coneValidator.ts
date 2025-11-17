import { ConeValidationError } from "../common/errors/ConeValidationError";

/**
 * Валидатор текстовой строки для конуса.
 * Формат строки: "cx cy cz radius height"
 */
export class ConeValidator {
    /**
     * Проверяет строку и возвращает массив чисел.
     */
    public static validateTextLine(line: string): number[] {
        if (!line.trim()) {
            throw new ConeValidationError("Cone line is empty");
        }

        const parts = line.trim().split(/\s+/);

        if (parts.length !== 5) {
            throw new ConeValidationError(
                "Cone must have exactly 5 numeric values: cx cy cz radius height"
            );
        }

        const nums = parts.map(Number);

        if (nums.some(n => Number.isNaN(n) || !Number.isFinite(n))) {
            throw new ConeValidationError("Cone contains invalid numeric values");
        }

        const [cx, cy, cz, radius, height] = nums;

        if (radius <= 0 || height <= 0) {
            throw new ConeValidationError("Cone radius and height must be positive");
        }

        return nums;
    }

    /**
     * Проверка массива чисел (используется Factory)
     */
    public static validateNumeric(values: number[]): void {
        if (values.length !== 5) {
            throw new ConeValidationError(
                "Cone must have exactly 5 numeric values: cx cy cz radius height"
            );
        }

        const [cx, cy, cz, radius, height] = values;

        if (
            [cx, cy, cz, radius, height].some(
                n => Number.isNaN(n) || !Number.isFinite(n)
            )
        ) {
            throw new ConeValidationError("Cone contains invalid numeric values");
        }

        if (radius <= 0 || height <= 0) {
            throw new ConeValidationError("Cone radius and height must be positive");
        }
    }
}
