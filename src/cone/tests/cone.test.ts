import { ConeValidator } from "../../validators/coneValidator";
import { ConeFactory } from "../../factories/coneFactory";
import { ConeModel } from "../coneModel";
import { ConeValidationError } from "../../common/errors/ConeValidationError";
import { ConeService } from "../../services/coneService";
import * as path from "path";

describe("Cone module tests", () => {
  test("Validator should parse valid line correctly", () => {
    const nums = ConeValidator.validateTextLine("0 0 0 5 10");
    expect(nums).toEqual([0, 0, 0, 5, 10]);
  });

  test("Validator should throw error on invalid numeric values", () => {
    expect(() => ConeValidator.validateTextLine("0 0 A 5 10")).toThrow(ConeValidationError);
  });

  test("Validator should throw error on wrong number of values", () => {
    expect(() => ConeValidator.validateTextLine("1 2 3 4")).toThrow(ConeValidationError);
  });

  test("Factory should create a ConeModel object", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 0, 5, 10]);

    expect(cone).toBeInstanceOf(ConeModel);
    expect(cone.radius).toBe(5);
    expect(cone.height).toBe(10);
    expect(cone.center.x).toBe(0);
  });

  test("Factory should throw error if nums array is wrong", () => {
    expect(() => ConeFactory.fromNumbers([1, 2, 3] as any)).toThrow();
  });

  test("ConeService.volume() should compute valid volume", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 0, 3, 6]);
    const expected = (Math.PI * 3 * 3 * 6) / 3;
    expect(ConeService.volume(cone)).toBeCloseTo(expected);
  });

  test("ConeService.baseArea() should compute base area", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 0, 4, 10]);
    expect(ConeService.baseArea(cone)).toBeCloseTo(Math.PI * 16);
  });

  test("ConeService.randomPointInside() should generate valid point", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 0, 5, 10]);
    const p = ConeService.randomPointInside(cone);

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

    const largest = Math.max(...cones.map((c) => ConeService.volume(c)));
    expect(ConeService.volume(max!)).toBeCloseTo(largest);
  });

  test("ConeService.minVolume should return cone with smallest volume", () => {
    const cones = ConeService.loadFromFile(filePath);
    const min = ConeService.minVolume(cones);

    expect(min).not.toBeNull();

    const smallest = Math.min(...cones.map((c) => ConeService.volume(c)));
    expect(ConeService.volume(min!)).toBeCloseTo(smallest);
  });
});