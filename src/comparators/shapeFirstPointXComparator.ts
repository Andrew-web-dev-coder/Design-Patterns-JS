import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { Comparator } from "./comparator";

export class ShapeFirstPointXComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    return this.extractX(a) - this.extractX(b);
  }

  private extractX(shape: Shape): number {
    if (shape instanceof RectangleModel) {
      return shape.points[0]?.x ?? Number.POSITIVE_INFINITY;
    }

    if (shape instanceof ConeModel) {
      return shape.center.x;
    }

    return Number.POSITIVE_INFINITY;
  }
}