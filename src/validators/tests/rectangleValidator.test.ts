import { RectangleValidator } from "../rectangleValidator";
import { RectangleValidationError } from "../../common/errors/RectangleValidationError";

describe("RectangleValidator — FULL COVERAGE", () => {

    // ---------------------------------------------------------
    // validateNumeric
    // ---------------------------------------------------------

    test("validateNumeric accepts valid values", () => {
        expect(() => RectangleValidator.validateNumeric([1, 2, 3, 4])).not.toThrow();
    });

    test("validateNumeric throws if array length is not 4", () => {
        expect(() => RectangleValidator.validateNumeric([1, 2, 3]))
            .toThrow(RectangleValidationError);

        expect(() => RectangleValidator.validateNumeric([1, 2, 3, 4, 5]))
            .toThrow(RectangleValidationError);
    });

    test("validateNumeric throws when values contain NaN", () => {
        expect(() => RectangleValidator.validateNumeric([1, NaN, 3, 4]))
            .toThrow(RectangleValidationError);
    });


    // ---------------------------------------------------------
    // validateTextLine
    // ---------------------------------------------------------

    test("validateTextLine parses valid line", () => {
        const nums = RectangleValidator.validateTextLine("1 2 3 4");
        expect(nums).toEqual([1, 2, 3, 4]);
    });

    test("validateTextLine throws on wrong number of values", () => {
        expect(() => RectangleValidator.validateTextLine("1 2 3"))
            .toThrow(RectangleValidationError);

        expect(() => RectangleValidator.validateTextLine("1 2 3 4 5"))
            .toThrow(RectangleValidationError);
    });

    test("validateTextLine throws on invalid numeric values", () => {
        expect(() => RectangleValidator.validateTextLine("1 A 3 4"))
            .toThrow(RectangleValidationError);

        expect(() => RectangleValidator.validateTextLine("1 2 NaN 4"))
            .toThrow(RectangleValidationError);
    });

    test("validateTextLine works with extra spaces (edge case)", () => {
        const nums = RectangleValidator.validateTextLine("   10   20   30    40    ");
        expect(nums).toEqual([10, 20, 30, 40]);
    });

    test("validateTextLine throws on empty string", () => {
        expect(() => RectangleValidator.validateTextLine("   "))
            .toThrow(RectangleValidationError);
    });
});
