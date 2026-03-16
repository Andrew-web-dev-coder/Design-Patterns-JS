import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { Comparator } from "./comparator";

export class ShapeFirstPointZComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    return this.extractZ(a) - this.extractZ(b);
  }

  private extractZ(shape: Shape): number {
    if (shape instanceof RectangleModel) {
      return 0;
    }

    if (shape instanceof ConeModel) {
      return shape.center.z;
    }

    return Number.POSITIVE_INFINITY;
  }
}