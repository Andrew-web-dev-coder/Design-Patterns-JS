import { Logger, logger } from "./logger";

describe("Logger with pino", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("info() calls logger.info with formatted message", () => {
        const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => {});

        Logger.info("Hello", 1, 2);

        expect(infoSpy).toHaveBeenCalledTimes(1);
        expect(infoSpy).toHaveBeenCalledWith(
            { args: [1, 2] },
            "ℹ️  INFO: Hello"
        );
    });

    test("success() calls logger.info with formatted success message", () => {
        const infoSpy = jest.spyOn(logger, "info").mockImplementation(() => {});

        Logger.success("Saved");

        expect(infoSpy).toHaveBeenCalledTimes(1);
        expect(infoSpy).toHaveBeenCalledWith(
            { args: [] },
            "✅ SUCCESS: Saved"
        );
    });

    test("warn() calls logger.warn with formatted warning", () => {
        const warnSpy = jest.spyOn(logger, "warn").mockImplementation(() => {});

        Logger.warn("Warn", 123);

        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy).toHaveBeenCalledWith(
            { args: [123] },
            "⚠️  WARNING: Warn"
        );
    });

    test("error() calls logger.error with formatted error", () => {
        const errorSpy = jest.spyOn(logger, "error").mockImplementation(() => {});

        const err = new Error("boom");
        Logger.error("Fail!", err);

        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy).toHaveBeenCalledWith(
            { args: [err] },
            "❌ ERROR: Fail!"
        );
    });
});
