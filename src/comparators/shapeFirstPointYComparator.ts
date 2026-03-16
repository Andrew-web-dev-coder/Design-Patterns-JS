import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { Comparator } from "./comparator";

export class ShapeFirstPointYComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    return this.extractY(a) - this.extractY(b);
  }

  private extractY(shape: Shape): number {
    if (shape instanceof RectangleModel) {
      return shape.points[0]?.y ?? Number.POSITIVE_INFINITY;
    }

    if (shape instanceof ConeModel) {
      return shape.center.y;
    }

    return Number.POSITIVE_INFINITY;
  }
}