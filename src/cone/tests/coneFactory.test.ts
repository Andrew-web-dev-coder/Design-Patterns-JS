import { ConeFactory } from "../coneFactory";
import { ConeModel } from "../coneModel";

describe("ConeFactory FULL COVERAGE", () => {

    test("fromNumbers should create ConeModel", () => {
        const cone = ConeFactory.fromNumbers([0, 0, 0, 5, 10]);
        expect(cone).toBeInstanceOf(ConeModel);
    });

    test("fromNumbers should throw if validateNumeric fails", () => {
        expect(() => ConeFactory.fromNumbers([1, 2, 3])).toThrow();
    });

    test("fromTextLine should return ConeModel on valid line", () => {
        const cone = ConeFactory.fromTextLine("0 0 0 5 10");
        expect(cone).toBeInstanceOf(ConeModel);
    });

    test("fromTextLine should return null on invalid line", () => {
        const cone = ConeFactory.fromTextLine("bad data");
        expect(cone).toBeNull();   // ← покрывает catch
    });
});
