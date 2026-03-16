import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { Specification } from "./specification";

export class FirstQuadrantSpecification implements Specification<Shape> {
  public isSatisfiedBy(item: Shape): boolean {
    if (item instanceof RectangleModel) {
      return item.points.every((point) => point.x > 0 && point.y > 0);
    }

    if (item instanceof ConeModel) {
      return item.center.x > 0 && item.center.y > 0;
    }

    return false;
  }
}