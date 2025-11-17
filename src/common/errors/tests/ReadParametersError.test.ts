import { ReadParametersError } from "../ReadParametersError";

describe("ReadParametersError tests", () => {
    test("should create error with correct name and message", () => {
        const err = new ReadParametersError("Invalid params");
        expect(err.message).toBe("Invalid params");
        expect(err.name).toBe("ReadParametersError");
        expect(err).toBeInstanceOf(Error);
    });

    test("should use captureStackTrace when available", () => {
        const original = Error.captureStackTrace;
        let used = false;

        // мок captureStackTrace
        Error.captureStackTrace = () => {
            used = true;
        };

        new ReadParametersError("Test");
        expect(used).toBe(true);

        // вернуть оригинал
        Error.captureStackTrace = original;
    });

    test("should still work when captureStackTrace is missing", () => {
        const original = Error.captureStackTrace;

        // удалить функцию
        // @ts-ignore
        delete Error.captureStackTrace;

        const err = new ReadParametersError("No capture");
        expect(err.stack).toBeDefined();

        // восстановить функцию
        Error.captureStackTrace = original;
    });
});
