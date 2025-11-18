import * as fs from "fs";
import { RectangleService } from "../rectangleService";
import { RectangleModel } from "../../rectangle/rectangleModel";
import { RectangleValidator } from "../../validators/rectangleValidator";
import { RectangleFactory } from "../../factories/rectangleFactory";
import { FileReadError } from "../../common/errors/FileReadError";
import { ReadParametersError } from "../../common/errors/ReadParametersError";
import { Logger } from "../../common/logging/logger";

jest.mock("fs");
jest.mock("../../validators/rectangleValidator");
jest.mock("../../factories/rectangleFactory");

describe("RectangleService — FULL COVERAGE", () => {

    

    test("loadFromFile loads valid rectangles", () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(`
            0 0 10 5
            1 1 3 2
        `);

        const rect1 = { area: () => 50, touchesAxis: () => true } as RectangleModel;
        const rect2 = { area: () => 6, touchesAxis: () => false } as RectangleModel;

        (RectangleValidator.validateTextLine as jest.Mock)
            .mockReturnValueOnce([0, 0, 10, 5])
            .mockReturnValueOnce([1, 1, 3, 2]);

        (RectangleFactory.fromNumbers as jest.Mock)
            .mockReturnValueOnce(rect1)
            .mockReturnValueOnce(rect2);

        const result = RectangleService.loadFromFile("file.txt");

        expect(result).toHaveLength(2);
        expect(result[0]).toBe(rect1);
        expect(result[1]).toBe(rect2);
    });

    test("loadFromFile skips invalid lines and logs error", () => {
        const errSpy = jest
            .spyOn(Logger, "error")
            .mockImplementation(() => {});

        (fs.readFileSync as jest.Mock).mockReturnValue(`
            0 0 10 5
            BAD
            1 1 3 2
        `);

        const rect1 = { area: () => 50, touchesAxis: () => true } as RectangleModel;
        const rect2 = { area: () => 6, touchesAxis: () => false } as RectangleModel;

        (RectangleValidator.validateTextLine as jest.Mock)
            .mockReturnValueOnce([0, 0, 10, 5])
            .mockImplementationOnce(() => { throw new Error("bad"); })
            .mockReturnValueOnce([1, 1, 3, 2]);

        (RectangleFactory.fromNumbers as jest.Mock)
            .mockReturnValueOnce(rect1)
            .mockReturnValueOnce(rect2);

        const result = RectangleService.loadFromFile("file.txt");

        expect(result).toHaveLength(2);
        expect(errSpy).toHaveBeenCalledTimes(1);

        errSpy.mockRestore();
    });

    test("loadFromFile throws FileReadError when fs.readFileSync fails", () => {
        (fs.readFileSync as jest.Mock).mockImplementation(() => {
            throw new Error("fail");
        });

        expect(() => RectangleService.loadFromFile("bad.txt"))
            .toThrow(FileReadError);
    });


    

    test("totalArea calculates correct sum", () => {
        const r1 = { area: () => 10 } as RectangleModel;
        const r2 = { area: () => 5 } as RectangleModel;
        expect(RectangleService.totalArea([r1, r2])).toBe(15);
    });

    test("totalArea throws ReadParametersError when argument is not array", () => {
        expect(() => RectangleService.totalArea(null as any))
            .toThrow(ReadParametersError);
    });


    

    test("findTouchingAxis returns only axis-touching rectangles", () => {
        const r1 = { touchesAxis: () => true } as RectangleModel;
        const r2 = { touchesAxis: () => false } as RectangleModel;
        const r3 = { touchesAxis: () => true } as RectangleModel;

        const res = RectangleService.findTouchingAxis([r1, r2, r3]);
        expect(res).toEqual([r1, r3]);
    });


   
    test("findLargest returns null for empty array", () => {
        expect(RectangleService.findLargest([])).toBeNull();
    });

    test("findLargest returns rectangle with max area", () => {
        const r1 = { area: () => 3 } as RectangleModel;
        const r2 = { area: () => 9 } as RectangleModel;
        const r3 = { area: () => 6 } as RectangleModel;

        expect(RectangleService.findLargest([r1, r2, r3])).toBe(r2);
    });


 

    test("sortByArea sorts rectangles by area ASC", () => {
        const r1 = { area: () => 8 } as RectangleModel;
        const r2 = { area: () => 3 } as RectangleModel;
        const r3 = { area: () => 5 } as RectangleModel;

        const sorted = RectangleService.sortByArea([r1, r2, r3]);
        expect(sorted).toEqual([r2, r3, r1]);
    });


    
    test("maxArea returns null for empty array", () => {
        expect(RectangleService.maxArea([])).toBeNull();
    });

    test("maxArea returns rectangle with max area", () => {
        const r1 = { area: () => 2 } as RectangleModel;
        const r2 = { area: () => 9 } as RectangleModel;
        expect(RectangleService.maxArea([r1, r2])).toBe(r2);
    });


    

    test("minArea returns null for empty array", () => {
        expect(RectangleService.minArea([])).toBeNull();
    });

    test("minArea returns rectangle with smallest area", () => {
        const r1 = { area: () => 7 } as RectangleModel;
        const r2 = { area: () => 3 } as RectangleModel;
        expect(RectangleService.minArea([r1, r2])).toBe(r2);
    });


   

    test("findTouchingAxis throws when input is not an array", () => {
        expect(() => RectangleService.findTouchingAxis(null as any))
            .toThrow();
    });

    test("findLargest throws when input is not an array", () => {
        expect(() => RectangleService.findLargest(null as any))
            .toThrow();
    });

    test("maxArea throws when input is not an array", () => {
        expect(() => RectangleService.maxArea(null as any))
            .toThrow();
    });

    test("minArea throws when input is not an array", () => {
        expect(() => RectangleService.minArea(null as any))
            .toThrow();
    });
});
