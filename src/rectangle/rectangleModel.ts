import { Shape } from "../shapes/shape";

export type Point2D = { x: number; y: number };

export class RectangleModel extends Shape {
  public readonly points: ReadonlyArray<Point2D>;

  constructor(points: Point2D[]) {
    super({
      kind: "rectangle",
      dimension: "2D",
    });

    if (points.length !== 4) {
      throw new Error("Rectangle: must have exactly 4 points");
    }

    this.points = points;
  }

  private bounds() {
    const xs = this.points.map((p) => p.x);
    const ys = this.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    return { minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY };
  }

  public area(): number {
    const { width, height } = this.bounds();
    return width * height;
  }

  public perimeter(): number {
    const { width, height } = this.bounds();
    return 2 * (width + height);
  }

  public diagonal(): number {
    const { width, height } = this.bounds();
    return Math.sqrt(width ** 2 + height ** 2);
  }

  public touchesAxis(): boolean {
    const { minX, maxX, minY, maxY } = this.bounds();
    const touchesX = minY <= 0 && maxY >= 0; // пересекает ось X
    const touchesY = minX <= 0 && maxX >= 0; // пересекает ось Y
    return touchesX || touchesY;
  }
}
