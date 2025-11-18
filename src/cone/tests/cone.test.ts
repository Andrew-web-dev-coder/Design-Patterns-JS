import { ConeValidator } from "../../validators/coneValidator";
import { ConeFactory } from "../coneFactory";
import { ConeModel } from "../coneModel";
import { ConeValidationError } from "../../common/errors/ConeValidationError";
import { Point3D } from "../../geometry/point3D";
import { ConeService } from "../../services/coneService";
import * as path from "path";

describe("Cone module tests", () => {

    test("Validator should parse valid line correctly", () => {
        const nums = ConeValidator.validateTextLine("0 0 0 5 10");
        expect(nums).toEqual([0, 0, 0, 5, 10]);
    });

    test("Validator should throw error on invalid numeric values", () => {
        expect(() =>
            ConeValidator.validateTextLine("0 0 A 5 10")
        ).toThrow(ConeValidationError);
    });

    test("Validator should throw error on wrong number of values", () => {
        expect(() =>
            ConeValidator.validateTextLine("1 2 3 4")
        ).toThrow(ConeValidationError);
    });

    test("Factory should create a ConeModel object", () => {
        const nums = [0, 0, 0, 5, 10];
        const cone = ConeFactory.fromNumbers(nums);

        expect(cone).toBeInstanceOf(ConeModel);
        expect(cone.radius).toBe(5);
        expect(cone.height).toBe(10);
        expect(cone.center.x).toBe(0);
    });

    test("Factory should throw error if nums array is wrong", () => {
        expect(() => ConeFactory.fromNumbers([1, 2, 3])).toThrow();
    });

    test("ConeModel constructor should throw on non-positive radius or height", () => {
        const c = new Point3D(0, 0, 0);

        expect(() => new ConeModel(c, 0, 5)).toThrow();
        expect(() => new ConeModel(c, 5, 0)).toThrow();
        expect(() => new ConeModel(c, -1, 5)).toThrow();
        expect(() => new ConeModel(c, 5, -1)).toThrow();
    });

    test("ConeModel volume() should compute valid volume", () => {
        const cone = new ConeModel(new Point3D(0, 0, 0), 3, 6);
        const expected = (Math.PI * 3 * 3 * 6) / 3;
        expect(cone.volume()).toBeCloseTo(expected);
    });

    test("ConeModel baseArea() should compute base area", () => {
        const cone = new ConeModel(new Point3D(0, 0, 0), 4, 10);
        expect(cone.baseArea()).toBeCloseTo(Math.PI * 16);
    });

    test("ConeModel randomPointInside() should generate valid point", () => {
        const cone = new ConeModel(new Point3D(0, 0, 0), 5, 10);
        const p = cone.randomPointInside();

        expect(p.z).toBeGreaterThanOrEqual(0);
        expect(p.z).toBeLessThanOrEqual(10);

        const dx = p.x - cone.center.x;
        const dy = p.y - cone.center.y;

        const distance = Math.sqrt(dx * dx + dy * dy);
        expect(distance).toBeLessThanOrEqual(5);
    });

});



describe("Cone TXT file tests", () => {

    const filePath = path.join(__dirname, "../../../data/sample_cones.txt");

    test("ConeService.loadFromFile should load valid cones", () => {
        const cones = ConeService.loadFromFile(filePath);
        expect(cones.length).toBeGreaterThan(0);
        expect(cones[0]).toBeInstanceOf(ConeModel);
    });

    test("ConeService.loadFromFile should skip invalid lines", () => {
        const fs = require("fs");
        const cones = ConeService.loadFromFile(filePath);

        const linesCount = fs.readFileSync(filePath, "utf-8")
            .trim()
            .split("\n").length;

        expect(cones.length).toBeLessThan(linesCount);
    });

    test("ConeService.totalVolume should compute total volume", () => {
        const cones = ConeService.loadFromFile(filePath);
        const total = ConeService.totalVolume(cones);

        expect(total).toBeGreaterThan(0);
        expect(typeof total).toBe("number");
    });

    test("ConeService.maxVolume should return cone with largest volume", () => {
        const cones = ConeService.loadFromFile(filePath);
        const max = ConeService.maxVolume(cones);

        expect(max).not.toBeNull();

        const largest = Math.max(...cones.map(c => c.volume()));
        expect(max?.volume()).toBeCloseTo(largest);
    });

    test("ConeService.minVolume should return cone with smallest volume", () => {
        const cones = ConeService.loadFromFile(filePath);
        const min = ConeService.minVolume(cones);

        expect(min).not.toBeNull();

        const smallest = Math.min(...cones.map(c => c.volume()));
        expect(min?.volume()).toBeCloseTo(smallest);
    });
    
 

    test("validateTextLine should throw on empty line", () => {
        expect(() => ConeValidator.validateTextLine("")).toThrow(ConeValidationError);
    });

    test("validateTextLine should throw when not exactly 5 values", () => {
        expect(() => ConeValidator.validateTextLine("1 2 3 4")).toThrow(ConeValidationError);
        expect(() => ConeValidator.validateTextLine("1 2 3 4 5 6")).toThrow(ConeValidationError);
    });

    test("validateTextLine should throw on non-numeric values", () => {
        expect(() => ConeValidator.validateTextLine("0 0 X 5 10")).toThrow(ConeValidationError);
    });

    test("validateTextLine should throw when radius or height <= 0", () => {
        expect(() => ConeValidator.validateTextLine("0 0 0 0 10")).toThrow(ConeValidationError);
        expect(() => ConeValidator.validateTextLine("0 0 0 5 0")).toThrow(ConeValidationError);
        expect(() => ConeValidator.validateTextLine("0 0 0 -1 10")).toThrow(ConeValidationError);
    });

    
    test("validateNumeric should throw when array length !== 5", () => {
        expect(() => ConeValidator.validateNumeric([1, 2, 3])).toThrow(ConeValidationError);
    });

    test("validateNumeric should throw on invalid numbers", () => {
        expect(() => ConeValidator.validateNumeric([1, 2, NaN, 4, 5])).toThrow(ConeValidationError);
    });

    test("validateNumeric should throw when radius or height <= 0", () => {
        expect(() => ConeValidator.validateNumeric([0, 0, 0, 0, 10])).toThrow(ConeValidationError);
        expect(() => ConeValidator.validateNumeric([0, 0, 0, 5, 0])).toThrow(ConeValidationError);
        expect(() => ConeValidator.validateNumeric([0, 0, 0, -1, 10])).toThrow(ConeValidationError);
    });

});
