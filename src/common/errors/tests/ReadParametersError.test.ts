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

        
        Error.captureStackTrace = () => {
            used = true;
        };

        new ReadParametersError("Test");
        expect(used).toBe(true);

        
        Error.captureStackTrace = original;
    });

    test("should still work when captureStackTrace is missing", () => {
        const original = Error.captureStackTrace;

       
        // @ts-ignore
        delete Error.captureStackTrace;

        const err = new ReadParametersError("No capture");
        expect(err.stack).toBeDefined();

        
        Error.captureStackTrace = original;
    });
});
