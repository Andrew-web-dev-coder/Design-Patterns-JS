import { runExample } from "../main";
import { Logger } from "../../common/logging/logger";
import { ConeValidator } from "../../validators/coneValidator";

describe("main.ts FULL coverage", () => {
    beforeEach(() => {
        jest.spyOn(Logger, "info").mockImplementation(() => {});
        jest.spyOn(Logger, "success").mockImplementation(() => {});
        jest.spyOn(Logger, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("runExample should log success for valid cone", () => {
        jest.spyOn(ConeValidator, "validateTextLine")
            .mockReturnValue([0, 0, 0, 5, 10]);

        runExample();

        expect(Logger.info).toHaveBeenCalled();
        expect(Logger.success).toHaveBeenCalled();
    });

    test("runExample should log error on exception", () => {
        jest.spyOn(ConeValidator, "validateTextLine")
            .mockImplementation(() => { throw new Error("Bad input"); });

        runExample();

        expect(Logger.error).toHaveBeenCalled();
    });
});
