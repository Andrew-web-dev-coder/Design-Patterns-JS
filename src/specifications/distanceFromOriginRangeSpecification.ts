import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { Specification } from "./specification";

export class DistanceFromOriginRangeSpecification implements Specification<Shape> {
  private readonly min: number;
  private readonly max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  public isSatisfiedBy(item: Shape): boolean {
    const distance = this.extractDistance(item);

    if (distance === null) {
      return false;
    }

    return distance >= this.min && distance <= this.max;
  }

  private extractDistance(item: Shape): number | null {
    if (item instanceof RectangleModel) {
      const firstPoint = item.points[0];

      if (!firstPoint) {
        return null;
      }

      return Math.sqrt(firstPoint.x ** 2 + firstPoint.y ** 2);
    }

    if (item instanceof ConeModel) {
      const { x, y, z } = item.center;
      return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
    }

    return null;
  }
}