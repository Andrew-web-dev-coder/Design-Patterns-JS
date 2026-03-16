import * as path from "path";

import { ConeValidator } from "../../validators/coneValidator";
import { ConeFactory } from "../../factories/coneFactory";
import { ConeModel } from "../../cone/coneModel";
import { ConeValidationError } from "../../common/errors/ConeValidationError";
import { ConeService } from "../../services/coneService";

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
    expect(() => ConeValidator.validateTextLine("1 2 3 4 5 6")).toThrow(ConeValidationError);
  });

  test("Factory should create a ConeModel object", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 0, 5, 10]);

    expect(cone).toBeInstanceOf(ConeModel);
    expect(cone.radius).toBe(5);
    expect(cone.height).toBe(10);
    expect(cone.center.x).toBe(0);
    expect(cone.center.y).toBe(0);
    expect(cone.center.z).toBe(0);
  });

  test("Factory should throw error if nums array is wrong", () => {
    expect(() => ConeFactory.fromNumbers([1, 2, 3] as number[])).toThrow();
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

  test("ConeService.surfaceArea() should compute valid surface area", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 0, 3, 4]);
    const slant = Math.sqrt(3 * 3 + 4 * 4);
    const expected = Math.PI * 3 * slant + Math.PI * 9;

    expect(ConeService.surfaceArea(cone)).toBeCloseTo(expected);
  });

  test("ConeService.volumeSliceRatio() should return null when plane does not cut cone interior", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 10, 5, 10]);

    expect(ConeService.volumeSliceRatio(cone, 10)).toBeNull();
    expect(ConeService.volumeSliceRatio(cone, 20)).toBeNull();
    expect(ConeService.volumeSliceRatio(cone, 0)).toBeNull();
  });

  test("ConeService.volumeSliceRatio() should compute valid lower/upper ratio", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 0, 6, 12]);

    const ratio = ConeService.volumeSliceRatio(cone, 4);

    const t = 4 / 12;
    const k = 1 - t;
    const full = ConeService.volume(cone);
    const upper = full * k * k * k;
    const lower = full - upper;
    const expected = lower / upper;

    expect(ratio).not.toBeNull();
    expect(ratio).toBeCloseTo(expected);
  });

  test("ConeService.volumeRatioByCoordinatePlane() should work for OXY", () => {
    const cone = ConeFactory.fromNumbers([0, 0, -2, 5, 10]);

    const byPlane = ConeService.volumeRatioByCoordinatePlane(cone, "OXY");
    const byZ = ConeService.volumeSliceRatio(cone, 0);

    expect(byPlane).not.toBeNull();
    expect(byPlane).toBeCloseTo(byZ as number);
  });

  test("ConeService.volumeRatioByCoordinatePlane() should return null for OXY when plane does not cut interior", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 2, 5, 10]);

    expect(ConeService.volumeRatioByCoordinatePlane(cone, "OXY")).toBeNull();
  });

  test("ConeService.volumeRatioByCoordinatePlane() should return 1 for OYZ when axis lies in plane", () => {
    const cone = ConeFactory.fromNumbers([0, 2, 0, 5, 10]);

    expect(ConeService.volumeRatioByCoordinatePlane(cone, "OYZ")).toBeCloseTo(1);
  });

  test("ConeService.volumeRatioByCoordinatePlane() should compute ratio for shifted OYZ cut", () => {
    const cone = ConeFactory.fromNumbers([2, 0, 0, 5, 10]);

    const ratio = ConeService.volumeRatioByCoordinatePlane(cone, "OYZ");
    const expected = (5 + 2) / (5 - 2);

    expect(ratio).not.toBeNull();
    expect(ratio).toBeCloseTo(expected);
  });

  test("ConeService.volumeRatioByCoordinatePlane() should return null for OYZ when plane does not intersect cone", () => {
    const cone = ConeFactory.fromNumbers([5, 0, 0, 5, 10]);

    expect(ConeService.volumeRatioByCoordinatePlane(cone, "OYZ")).toBeNull();
  });

  test("ConeService.volumeRatioByCoordinatePlane() should return 1 for OXZ when axis lies in plane", () => {
    const cone = ConeFactory.fromNumbers([2, 0, 0, 5, 10]);

    expect(ConeService.volumeRatioByCoordinatePlane(cone, "OXZ")).toBeCloseTo(1);
  });

  test("ConeService.volumeRatioByCoordinatePlane() should compute ratio for shifted OXZ cut", () => {
    const cone = ConeFactory.fromNumbers([0, 2, 0, 5, 10]);

    const ratio = ConeService.volumeRatioByCoordinatePlane(cone, "OXZ");
    const expected = (5 + 2) / (5 - 2);

    expect(ratio).not.toBeNull();
    expect(ratio).toBeCloseTo(expected);
  });

  test("ConeService.volumeRatioByCoordinatePlane() should return null for OXZ when plane does not intersect cone", () => {
    const cone = ConeFactory.fromNumbers([0, -5, 0, 5, 10]);

    expect(ConeService.volumeRatioByCoordinatePlane(cone, "OXZ")).toBeNull();
  });

  test("ConeService.isBaseOnCoordinatePlane() should return true only for base on OXY", () => {
    const onPlane = ConeFactory.fromNumbers([10, 20, 0, 4, 5]);
    const abovePlane = ConeFactory.fromNumbers([10, 20, 3, 4, 5]);

    expect(ConeService.isBaseOnCoordinatePlane(onPlane)).toBe(true);
    expect(ConeService.isBaseOnCoordinatePlane(abovePlane)).toBe(false);
  });

  test("ConeService.randomPointInside() should generate valid point inside cone", () => {
    const cone = ConeFactory.fromNumbers([0, 0, 0, 5, 10]);

    for (let i = 0; i < 20; i += 1) {
      const p = ConeService.randomPointInside(cone);

      expect(p.z).toBeGreaterThanOrEqual(cone.center.z);
      expect(p.z).toBeLessThanOrEqual(cone.center.z + cone.height);

      const h = p.z - cone.center.z;
      const maxRadiusAtHeight = cone.radius * (1 - h / cone.height);

      const dx = p.x - cone.center.x;
      const dy = p.y - cone.center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      expect(distance).toBeLessThanOrEqual(maxRadiusAtHeight + 1e-10);
    }
  });

  test("ConeService.filterByMinVolume() should filter cones correctly", () => {
    const c1 = ConeFactory.fromNumbers([0, 0, 0, 1, 3]);
    const c2 = ConeFactory.fromNumbers([0, 0, 0, 2, 3]);
    const c3 = ConeFactory.fromNumbers([0, 0, 0, 3, 3]);

    const min = ConeService.volume(c2);
    const filtered = ConeService.filterByMinVolume([c1, c2, c3], min);

    expect(filtered).toEqual([c2, c3]);
    expect(filtered).toHaveLength(2);
  });

  test("ConeService.sortByVolume() should sort cones ascending", () => {
    const c1 = ConeFactory.fromNumbers([0, 0, 0, 3, 3]);
    const c2 = ConeFactory.fromNumbers([0, 0, 0, 1, 3]);
    const c3 = ConeFactory.fromNumbers([0, 0, 0, 2, 3]);

    const sorted = ConeService.sortByVolume([c1, c2, c3]);

    expect(sorted).toEqual([c2, c3, c1]);
    expect(ConeService.volume(sorted[0])).toBeLessThan(ConeService.volume(sorted[2]));
  });

  test("ConeService.maxVolume() should return cone with maximum volume", () => {
    const c1 = ConeFactory.fromNumbers([0, 0, 0, 1, 3]);
    const c2 = ConeFactory.fromNumbers([0, 0, 0, 2, 3]);
    const c3 = ConeFactory.fromNumbers([0, 0, 0, 3, 3]);

    expect(ConeService.maxVolume([c1, c2, c3])).toBe(c3);
  });

  test("ConeService.maxVolume() should return null for empty array", () => {
    expect(ConeService.maxVolume([])).toBeNull();
  });

  test("ConeService.minVolume() should return cone with minimum volume", () => {
    const c1 = ConeFactory.fromNumbers([0, 0, 0, 1, 3]);
    const c2 = ConeFactory.fromNumbers([0, 0, 0, 2, 3]);
    const c3 = ConeFactory.fromNumbers([0, 0, 0, 3, 3]);

    expect(ConeService.minVolume([c1, c2, c3])).toBe(c1);
  });

  test("ConeService.minVolume() should return null for empty array", () => {
    expect(ConeService.minVolume([])).toBeNull();
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

  test("ConeService.totalVolume should throw when input is not array", () => {
    expect(() => ConeService.totalVolume(null as unknown as ConeModel[])).toThrow();
  });

  test("ConeService.maxVolume should return cone with largest volume", () => {
    const cones = ConeService.loadFromFile(filePath);
    const max = ConeService.maxVolume(cones);

    expect(max).not.toBeNull();

    const largest = Math.max(...cones.map((c) => ConeService.volume(c)));
    expect(ConeService.volume(max as ConeModel)).toBeCloseTo(largest);
  });

  test("ConeService.minVolume should return cone with smallest volume", () => {
    const cones = ConeService.loadFromFile(filePath);
    const min = ConeService.minVolume(cones);

    expect(min).not.toBeNull();

    const smallest = Math.min(...cones.map((c) => ConeService.volume(c)));
    expect(ConeService.volume(min as ConeModel)).toBeCloseTo(smallest);
  });
});