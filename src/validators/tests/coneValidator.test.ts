import { ConeValidator } from "../coneValidator";
import { ConeValidationError } from "../../common/errors/ConeValidationError";

describe("ConeValidator — FULL COVERAGE", () => {

    

    test("validateTextLine parses valid string", () => {
        const res = ConeValidator.validateTextLine("1 2 3 4 5");
        expect(res).toEqual([1, 2, 3, 4, 5]);
    });

    test("validateTextLine throws when line is empty", () => {
        expect(() => ConeValidator.validateTextLine("   ")).toThrow(ConeValidationError);
    });

    test("validateTextLine throws when not exactly 5 values", () => {
        expect(() => ConeValidator.validateTextLine("1 2 3 4"))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateTextLine("1 2 3 4 5 6"))
            .toThrow(ConeValidationError);
    });

    test("validateTextLine throws on NaN or non-numeric values", () => {
        expect(() => ConeValidator.validateTextLine("1 2 A 4 5"))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateTextLine("1 2 3 NaN 5"))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateTextLine("1 2 3 Infinity 5"))
            .toThrow(ConeValidationError);
    });

    test("validateTextLine throws if radius or height <= 0", () => {
        expect(() => ConeValidator.validateTextLine("1 2 3 0 5"))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateTextLine("1 2 3 4 0"))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateTextLine("1 2 3 -1 5"))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateTextLine("1 2 3 4 -10"))
            .toThrow(ConeValidationError);
    });


    

    test("validateNumeric accepts valid numbers", () => {
        expect(() => ConeValidator.validateNumeric([1, 2, 3, 4, 5])).not.toThrow();
    });

    test("validateNumeric throws when not exactly 5 values", () => {
        expect(() => ConeValidator.validateNumeric([1, 2, 3, 4]))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateNumeric([1, 2, 3, 4, 5, 6]))
            .toThrow(ConeValidationError);
    });

    test("validateNumeric throws on NaN or non-finite values", () => {
        expect(() => ConeValidator.validateNumeric([1, 2, NaN, 4, 5]))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateNumeric([1, 2, 3, Infinity, 5]))
            .toThrow(ConeValidationError);
    });

    test("validateNumeric throws if radius or height <= 0", () => {
        expect(() => ConeValidator.validateNumeric([1, 2, 3, 0, 5]))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateNumeric([1, 2, 3, 4, 0]))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateNumeric([1, 2, 3, -3, 5]))
            .toThrow(ConeValidationError);

        expect(() => ConeValidator.validateNumeric([1, 2, 3, 4, -10]))
            .toThrow(ConeValidationError);
    });
});
