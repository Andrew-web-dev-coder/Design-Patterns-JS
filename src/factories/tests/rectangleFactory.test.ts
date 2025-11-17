import { RectangleFactory } from "../rectangleFactory";
import { RectangleModel } from "../../rectangle/rectangleModel";

describe("RectangleFactory tests", () => {

    test("fromNumbers should create RectangleModel", () => {
        const rect = RectangleFactory.fromNumbers([1, 2, 3, 4]);

        expect(rect).toBeInstanceOf(RectangleModel);
        expect(rect.x).toBe(1);
        expect(rect.y).toBe(2);
        expect(rect.width).toBe(3);
        expect(rect.height).toBe(4);
    });

    test("fromNumbers should throw on invalid length", () => {
        expect(() => RectangleFactory.fromNumbers([1, 2, 3]))
            .toThrow();
    });

    test("fromTextLine should create RectangleModel from valid text", () => {
        const rect = RectangleFactory.fromTextLine("1 2 3 4");
        expect(rect).toBeInstanceOf(RectangleModel);
    });

    test("fromTextLine should return null for invalid text", () => {
        const rect = RectangleFactory.fromTextLine("bad data");
        expect(rect).toBeNull();
    });

});
