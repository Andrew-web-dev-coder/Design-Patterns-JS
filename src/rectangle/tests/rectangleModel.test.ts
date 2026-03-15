import { RectangleModel } from "../rectangleModel";
import { Point2D } from "../../geometry/point2D";

describe("RectangleModel (entity, no business logic)", () => {
  test("constructor sets fields + Shape metadata", () => {
    const pts = [
      new Point2D(0, 0),
      new Point2D(10, 0),
      new Point2D(10, 20),
      new Point2D(0, 20),
    ];

    const r = new RectangleModel({ points: pts });

    expect(r.points).toHaveLength(4);
    expect(r.kind).toBe("rectangle");
    expect(r.dimension).toBe("2D");
    expect(typeof r.id).toBe("string");
    expect(r.name).toBe("rectangle");
  });
});