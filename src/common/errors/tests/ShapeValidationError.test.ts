import { ShapeValidationError } from "../ShapeValidationError";

describe("ShapeValidationError tests", () => {
    test("should create error with correct name and message", () => {
        const err = new ShapeValidationError("Invalid shape");

        expect(err).toBeInstanceOf(Error);
        expect(err).toBeInstanceOf(ShapeValidationError);

        expect(err.message).toBe("Invalid shape");
        expect(err.name).toBe("ShapeValidationError");
    });

    test("should preserve stack trace", () => {
        const err = new ShapeValidationError("Test stack");

        expect(err.stack).toBeDefined();
        expect(typeof err.stack).toBe("string");
    });
});
