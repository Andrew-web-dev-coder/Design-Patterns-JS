import { Shape } from "../shapes/shape";
import { Point2D } from "../geometry/point2D";

export class RectangleModel extends Shape {
  public readonly points: ReadonlyArray<Point2D>;

  constructor(params: { id: string; points: Point2D[]; name?: string }) {
    super({
      id: params.id,
      kind: "rectangle",
      dimension: "2D",
      name: params.name,
    });

    this.points = params.points;
  }
}