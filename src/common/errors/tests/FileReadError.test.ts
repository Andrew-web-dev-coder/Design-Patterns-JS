import { FileReadError } from "../FileReadError";

describe("FileReadError tests", () => {
    test("should create error with correct message", () => {
        const err = new FileReadError("Failed to read file");

        expect(err.message).toBe("Failed to read file");
    });

    test("should set correct error name", () => {
        const err = new FileReadError("Test");
        expect(err.name).toBe("FileReadError");
    });

    test("should be instance of Error and FileReadError", () => {
        const err = new FileReadError("Test");
        expect(err instanceof Error).toBe(true);
        expect(err instanceof FileReadError).toBe(true);
    });

    test("should preserve stack trace", () => {
        const err = new FileReadError("Stack test");

        expect(err.stack).toBeDefined();
        expect(typeof err.stack).toBe("string");
    });
});
