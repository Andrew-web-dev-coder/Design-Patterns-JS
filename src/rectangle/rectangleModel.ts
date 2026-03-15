import { Shape } from "../shapes/shape";
import { Point2D } from "../geometry/point2D";

export type RectangleModelParams = {
  points: Point2D[];
  id?: string;
  name?: string;
};

function genId(kind: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const stamp = Date.now().toString(36);
  return `${kind}-${stamp}-${rand}`;
}

export class RectangleModel extends Shape {
  public readonly points: ReadonlyArray<Point2D>;

  constructor(params: RectangleModelParams) {
    super({
      kind: "rectangle",
      dimension: "2D",
      id: params.id ?? genId("rectangle"),
      name: params.name,
    });

    this.points = params.points;
  }
}