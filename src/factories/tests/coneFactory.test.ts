import { ConeFactory } from "../coneFactory";
import { ConeModel } from "../../cone/coneModel";
import { Point3D } from "../../geometry/point3D";

describe("ConeFactory tests", () => {

    test("fromNumbers should create ConeModel", () => {
        const cone = ConeFactory.fromNumbers([1, 2, 3, 4, 5]);

        expect(cone).toBeInstanceOf(ConeModel);
        expect(cone.center).toEqual(new Point3D(1, 2, 3));
        expect(cone.radius).toBe(4);
        expect(cone.height).toBe(5);
    });

    test("fromNumbers should throw on invalid length", () => {
        expect(() => ConeFactory.fromNumbers([1, 2, 3]))
            .toThrow();
    });

    test("fromTextLine should create ConeModel from valid line", () => {
        const cone = ConeFactory.fromTextLine("1 2 3 4 5");
        expect(cone).toBeInstanceOf(ConeModel);
    });

    test("fromTextLine should return null on invalid line", () => {
        const cone = ConeFactory.fromTextLine("wrong data");
        expect(cone).toBeNull();
    });

});

