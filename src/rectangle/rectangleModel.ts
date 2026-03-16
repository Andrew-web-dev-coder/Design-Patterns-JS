import { Shape } from "../shapes/shape";
import { Point2D } from "../geometry/point2D";

export type RectangleModelParams = {
  points: Point2D[];
  id?: string;
  name?: string;
};

export class RectangleModel extends Shape {
  private _points: Point2D[];

  constructor(params: RectangleModelParams) {
    super({
      kind: "rectangle",
      dimension: "2D",
      id: params.id,
      name: params.name,
    });

    this._points = [...params.points];
  }

  public get points(): ReadonlyArray<Point2D> {
    return this._points;
  }

  public setPoints(points: Point2D[]): void {
    this._points = [...points];
    this.notify();
  }

  public setPoint(index: number, point: Point2D): void {
    if (index < 0 || index >= this._points.length) {
      throw new Error(`Point index out of range: ${index}`);
    }

    this._points[index] = point;
    this.notify();
  }
}