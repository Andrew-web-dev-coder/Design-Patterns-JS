import { RectangleFactory } from "../rectangleFactory";
import { RectangleModel } from "../../rectangle/rectangleModel";
import { RectangleValidationError } from "../../common/errors/RectangleValidationError";

describe("RectangleFactory (variant A: diagonal points)", () => {
  test("fromNumbers should create RectangleModel with 4 points", () => {
    const rect = RectangleFactory.fromNumbers([0, 0, 10, 5]);

    expect(rect).toBeInstanceOf(RectangleModel);
    expect(rect.kind).toBe("rectangle");
    expect(rect.dimension).toBe("2D");
    expect(rect.points).toHaveLength(4);

    // вершины из диагонали: (x1,y1), (x2,y1), (x2,y2), (x1,y2)
    expect(rect.points[0].x).toBe(0);
    expect(rect.points[0].y).toBe(0);

    expect(rect.points[1].x).toBe(10);
    expect(rect.points[1].y).toBe(0);

    expect(rect.points[2].x).toBe(10);
    expect(rect.points[2].y).toBe(5);

    expect(rect.points[3].x).toBe(0);
    expect(rect.points[3].y).toBe(5);
  });

  test("fromNumbers should throw on invalid input", () => {
    expect(() => RectangleFactory.fromNumbers([0, 0, 0, 0])).toThrow(
      RectangleValidationError
    );
    expect(() => RectangleFactory.fromNumbers([1, 2, 3] as any)).toThrow(
      RectangleValidationError
    );
  });

  test("fromTextLine should create RectangleModel from valid line", () => {
    const rect = RectangleFactory.fromTextLine("0 0 10 5");
    expect(rect).toBeInstanceOf(RectangleModel);
    expect(rect?.points).toHaveLength(4);
  });

  test("fromTextLine should return null on invalid line", () => {
    const rect = RectangleFactory.fromTextLine("bad line");
    expect(rect).toBeNull();
  });
});