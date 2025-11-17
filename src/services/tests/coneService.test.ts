import * as fs from "fs";

import { ConeService } from "../coneService";
import { ConeModel } from "../../cone/coneModel";
import { ConeValidator } from "../../validators/coneValidator";
import { ConeFactory } from "../../cone/coneFactory";
import { ReadParametersError } from "../../common/errors/ReadParametersError";
import { FileReadError } from "../../common/errors/FileReadError";
import { Logger } from "../../common/logging/logger";

jest.mock("fs");
jest.mock("../../validators/coneValidator");
jest.mock("../../cone/coneFactory");

describe("ConeService tests", () => {

    // ---------------------------------
    // getVolume / getBaseArea
    // ---------------------------------

    test("getVolume returns correct value", () => {
        const cone = { volume: () => 42 } as ConeModel;
        expect(ConeService.getVolume(cone)).toBe(42);
    });

    test("getBaseArea returns correct value", () => {
        const cone = { baseArea: () => 10 } as ConeModel;
        expect(ConeService.getBaseArea(cone)).toBe(10);
    });

    // ---------------------------------
    // in-memory operations
    // ---------------------------------

    test("filterByMinVolume filters correctly", () => {
        const c1 = { volume: () => 5 } as ConeModel;
        const c2 = { volume: () => 15 } as ConeModel;
        const c3 = { volume: () => 25 } as ConeModel;

        const res = ConeService.filterByMinVolume([c1, c2, c3], 10);
        expect(res).toEqual([c2, c3]);
    });

    test("sortByVolume sorts ascending", () => {
        const c1 = { volume: () => 20 } as ConeModel;
        const c2 = { volume: () => 5 } as ConeModel;
        const c3 = { volume: () => 10 } as ConeModel;

        const sorted = ConeService.sortByVolume([c1, c2, c3]);
        expect(sorted).toEqual([c2, c3, c1]);
    });

    test("maxVolume returns correct cone", () => {
        const c1 = { volume: () => 3 } as ConeModel;
        const c2 = { volume: () => 9 } as ConeModel;
        const c3 = { volume: () => 6 } as ConeModel;

        expect(ConeService.maxVolume([c1, c2, c3])).toBe(c2);
    });

    test("maxVolume returns null for empty array", () => {
        expect(ConeService.maxVolume([])).toBeNull();
    });

    test("minVolume returns correct cone", () => {
        const c1 = { volume: () => 3 } as ConeModel;
        const c2 = { volume: () => 9 } as ConeModel;
        const c3 = { volume: () => 1 } as ConeModel;

        expect(ConeService.minVolume([c1, c2, c3])).toBe(c3);
    });

    test("minVolume returns null for empty array", () => {
        expect(ConeService.minVolume([])).toBeNull();
    });

    test("totalVolume sums volumes", () => {
        const c1 = { volume: () => 3 } as ConeModel;
        const c2 = { volume: () => 7 } as ConeModel;
        expect(ConeService.totalVolume([c1, c2])).toBe(10);
    });

    test("totalVolume throws if argument is not array", () => {
        expect(() => ConeService.totalVolume(null as any))
            .toThrow(ReadParametersError);
    });

    // ---------------------------------
    // loadFromFile
    // ---------------------------------

    test("loadFromFile reads file and parses valid lines", () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(`
            0 0 0 5 10
            1 1 1 2 4
        `);

        const c1 = { volume: () => 1 } as ConeModel;
        const c2 = { volume: () => 2 } as ConeModel;

        (ConeValidator.validateTextLine as jest.Mock)
            .mockReturnValueOnce([0, 0, 0, 5, 10])
            .mockReturnValueOnce([1, 1, 1, 2, 4]);

        (ConeFactory.fromNumbers as jest.Mock)
            .mockReturnValueOnce(c1)
            .mockReturnValueOnce(c2);

        const result = ConeService.loadFromFile("cones.txt");

        expect(result).toEqual([c1, c2]);
    });

    test("loadFromFile throws FileReadError if reading fails", () => {
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error("fail");
        });

        expect(() => ConeService.loadFromFile("bad.txt"))
            .toThrow(FileReadError);
    });

    test("loadFromFile skips invalid lines and logs error", () => {
        const errorSpy = jest
            .spyOn(Logger, "error")
            .mockImplementation(() => {});

        (fs.readFileSync as jest.Mock).mockReturnValue(`
            0 0 0 5 10
            invalid
            1 1 1 2 4
        `);

        const c1 = { volume: () => 1 } as ConeModel;
        const c2 = { volume: () => 2 } as ConeModel;

        (ConeValidator.validateTextLine as jest.Mock)
            .mockReturnValueOnce([0, 0, 0, 5, 10])
            .mockImplementationOnce(() => { throw new Error("bad"); })
            .mockReturnValueOnce([1, 1, 1, 2, 4]);

        (ConeFactory.fromNumbers as jest.Mock)
            .mockReturnValueOnce(c1)
            .mockReturnValueOnce(c2);

        const result = ConeService.loadFromFile("cones.txt");

        expect(result).toEqual([c1, c2]);
        expect(errorSpy).toHaveBeenCalledTimes(1);

        errorSpy.mockRestore();
    });
});
