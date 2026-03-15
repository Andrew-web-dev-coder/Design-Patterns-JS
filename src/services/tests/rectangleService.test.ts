import { readFileSync } from "node:fs";

import { RectangleService } from "../rectangleService";
import { RectangleFactory } from "../../factories/rectangleFactory";
import { RectangleModel } from "../../rectangle/rectangleModel";
import { Point2D } from "../../geometry/point2D";
import { FileReadError } from "../../common/errors/FileReadError";
import { ReadParametersError } from "../../common/errors/ReadParametersError";
import { Logger } from "../../common/logging/logger";

jest.mock("node:fs", () => ({
  readFileSync: jest.fn(),
}));

describe("RectangleService (variant A: diagonal points)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("loadFromFile loads valid rectangles", () => {
    (readFileSync as unknown as jest.Mock).mockReturnValue("0 0 10 5\n1 1 3 4\n");

    const result = RectangleService.loadFromFile("file.txt");

    expect(result).toHaveLength(2);
    expect(result[0].kind).toBe("rectangle");
    expect(result[0].dimension).toBe("2D");
    expect(result[0].points).toHaveLength(4);
  });

  test("loadFromFile skips invalid lines and logs error", () => {
    const errSpy = jest.spyOn(Logger, "error").mockImplementation(() => {});
    (readFileSync as unknown as jest.Mock).mockReturnValue("0 0 10 5\nBAD LINE\n1 1 3 4\n");

    const result = RectangleService.loadFromFile("file.txt");

    expect(result).toHaveLength(2);
    expect(errSpy).toHaveBeenCalledTimes(1);
  });

  test("loadFromFile throws FileReadError when fs.readFileSync fails", () => {
    (readFileSync as unknown as jest.Mock).mockImplementation(() => {
      throw new Error("fail");
    });

    expect(() => RectangleService.loadFromFile("bad.txt")).toThrow(FileReadError);
  });

  test("totalArea calculates correct sum", () => {
    const r1 = RectangleFactory.fromNumbers([0, 0, 2, 3]);
    const r2 = RectangleFactory.fromNumbers([0, 0, 1, 4]);

    expect(RectangleService.totalArea([r1, r2])).toBe(10);
  });

  test("totalArea throws ReadParametersError when argument is not array", () => {
    expect(() => RectangleService.totalArea(null as unknown as never)).toThrow(ReadParametersError);
  });

  test("area calculates rectangle area", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 10, 5]);
    expect(RectangleService.area(rect)).toBe(50);
  });

  test("perimeter calculates rectangle perimeter", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 10, 5]);
    expect(RectangleService.perimeter(rect)).toBe(30);
  });

  test("diagonal calculates rectangle diagonal", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 3, 4]);
    expect(RectangleService.diagonal(rect)).toBe(5);
  });

  test("touchesAxis returns true when rectangle crosses X axis", () => {
    const rect = RectangleFactory.fromNumbers([5, -1, 7, 2]);
    expect(RectangleService.touchesAxis(rect)).toBe(true);
  });

  test("touchesAxis returns true when rectangle crosses Y axis", () => {
    const rect = RectangleFactory.fromNumbers([-2, 5, 3, 7]);
    expect(RectangleService.touchesAxis(rect)).toBe(true);
  });

  test("touchesAxis returns true when rectangle crosses both axes", () => {
    const rect = RectangleFactory.fromNumbers([-2, -3, 4, 5]);
    expect(RectangleService.touchesAxis(rect)).toBe(true);
  });

  test("touchesAxis returns false when rectangle touches neither axis", () => {
    const rect = RectangleFactory.fromNumbers([5, 5, 7, 7]);
    expect(RectangleService.touchesAxis(rect)).toBe(false);
  });

  test("findTouchingAxis returns only axis-touching rectangles", () => {
    const touches = RectangleFactory.fromNumbers([0, -1, 2, 2]);
    const notTouches = RectangleFactory.fromNumbers([5, 5, 7, 7]);

    const res = RectangleService.findTouchingAxis([touches, notTouches]);

    expect(res).toEqual([touches]);
    expect(res.length).toBe(1);
  });

  test("findLargest returns null for empty array", () => {
    expect(RectangleService.findLargest([])).toBeNull();
  });

  test("findLargest returns rectangle with max area", () => {
    const a = RectangleFactory.fromNumbers([0, 0, 2, 2]);
    const b = RectangleFactory.fromNumbers([0, 0, 3, 3]);
    const c = RectangleFactory.fromNumbers([0, 0, 1, 10]);

    expect(RectangleService.findLargest([a, b, c])).toBe(c);
  });

  test("sortByArea sorts rectangles by area ASC", () => {
    const a = RectangleFactory.fromNumbers([0, 0, 2, 2]);
    const b = RectangleFactory.fromNumbers([0, 0, 3, 3]);
    const c = RectangleFactory.fromNumbers([0, 0, 1, 10]);

    const sorted = RectangleService.sortByArea([c, a, b]);
    expect(sorted).toEqual([a, b, c]);
  });

  test("maxArea returns null for empty array", () => {
    expect(RectangleService.maxArea([])).toBeNull();
  });

  test("maxArea returns rectangle with max area", () => {
    const a = RectangleFactory.fromNumbers([0, 0, 2, 2]);
    const b = RectangleFactory.fromNumbers([0, 0, 3, 3]);

    expect(RectangleService.maxArea([a, b])).toBe(b);
  });

  test("minArea returns null for empty array", () => {
    expect(RectangleService.minArea([])).toBeNull();
  });

  test("minArea returns rectangle with smallest area", () => {
    const a = RectangleFactory.fromNumbers([0, 0, 2, 2]);
    const b = RectangleFactory.fromNumbers([0, 0, 3, 3]);

    expect(RectangleService.minArea([a, b])).toBe(a);
  });

  test("findTouchingAxis throws when input is not an array", () => {
    expect(() => RectangleService.findTouchingAxis(null as unknown as never)).toThrow(ReadParametersError);
  });

  test("findLargest throws when input is not an array", () => {
    expect(() => RectangleService.findLargest(null as unknown as never)).toThrow(ReadParametersError);
  });

  test("maxArea throws when input is not an array", () => {
    expect(() => RectangleService.maxArea(null as unknown as never)).toThrow(ReadParametersError);
  });

  test("minArea throws when input is not an array", () => {
    expect(() => RectangleService.minArea(null as unknown as never)).toThrow(ReadParametersError);
  });
});

describe("RectangleService methods required by task", () => {
  test("isRectangle returns true for a valid axis-aligned rectangle", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 10, 5]);
    expect(RectangleService.isRectangle(rect)).toBe(true);
  });

  test("isRectangle returns false when points count is not 4", () => {
    const badRect = {
      points: [new Point2D(0, 0), new Point2D(1, 1), new Point2D(2, 2)],
    } as unknown as RectangleModel;

    expect(RectangleService.isRectangle(badRect)).toBe(false);
  });

  test("isRectangle returns false for null-like input", () => {
    expect(RectangleService.isRectangle(null as unknown as RectangleModel)).toBe(false);
  });

  test("isRectangle returns false when there are not exactly 2 unique X values", () => {
    const badRect = {
      points: [
        new Point2D(1, 0),
        new Point2D(1, 2),
        new Point2D(1, 4),
        new Point2D(3, 1),
      ],
    } as unknown as RectangleModel;

    expect(RectangleService.isRectangle(badRect)).toBe(false);
  });

  test("isRectangle returns false when there are not exactly 2 unique Y values", () => {
    const badRect = {
      points: [
        new Point2D(0, 1),
        new Point2D(2, 1),
        new Point2D(4, 1),
        new Point2D(1, 3),
      ],
    } as unknown as RectangleModel;

    expect(RectangleService.isRectangle(badRect)).toBe(false);
  });

  test("isRectangle returns false when width is zero", () => {
    const badRect = {
      points: [
        new Point2D(2, 1),
        new Point2D(2, 1),
        new Point2D(2, 3),
        new Point2D(2, 3),
      ],
    } as unknown as RectangleModel;

    expect(RectangleService.isRectangle(badRect)).toBe(false);
  });

  test("isRectangle returns false when one expected corner is missing", () => {
    const badRect = {
      points: [
        new Point2D(0, 0),
        new Point2D(10, 0),
        new Point2D(10, 5),
        new Point2D(10, 5),
      ],
    } as unknown as RectangleModel;

    expect(RectangleService.isRectangle(badRect)).toBe(false);
  });

  test("isConvex returns true for a valid rectangle", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 10, 5]);
    expect(RectangleService.isConvex(rect)).toBe(true);
  });

  test("isConvex returns false for invalid rectangle", () => {
    const badRect = {
      points: [new Point2D(0, 0), new Point2D(1, 1), new Point2D(2, 2)],
    } as unknown as RectangleModel;

    expect(RectangleService.isConvex(badRect)).toBe(false);
  });

  test("isSquare returns true for square", () => {
    const square = RectangleFactory.fromNumbers([0, 0, 5, 5]);
    expect(RectangleService.isSquare(square)).toBe(true);
  });

  test("isSquare returns false for non-square rectangle", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 10, 5]);
    expect(RectangleService.isSquare(rect)).toBe(false);
  });

  test("isSquare returns false for invalid rectangle", () => {
    const badRect = {
      points: [new Point2D(0, 0), new Point2D(1, 1), new Point2D(2, 2)],
    } as unknown as RectangleModel;

    expect(RectangleService.isSquare(badRect)).toBe(false);
  });

  test("isRhombus returns true for square", () => {
    const square = RectangleFactory.fromNumbers([0, 0, 4, 4]);
    expect(RectangleService.isRhombus(square)).toBe(true);
  });

  test("isRhombus returns false for non-square rectangle", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 8, 4]);
    expect(RectangleService.isRhombus(rect)).toBe(false);
  });

  test("isTrapezoid returns false for valid rectangle in strict definition", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 10, 5]);
    expect(RectangleService.isTrapezoid(rect)).toBe(false);
  });

  test("isTrapezoid returns false for invalid rectangle", () => {
    const badRect = {
      points: [new Point2D(0, 0), new Point2D(1, 1), new Point2D(2, 2)],
    } as unknown as RectangleModel;

    expect(RectangleService.isTrapezoid(badRect)).toBe(false);
  });
});