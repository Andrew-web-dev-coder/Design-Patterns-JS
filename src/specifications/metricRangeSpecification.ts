import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { RectangleService } from "../services/rectangleService";
import { ConeService } from "../services/coneService";
import { Specification } from "./specification";

export type ShapeMetric =
  | "area"
  | "perimeter"
  | "surfaceArea"
  | "volume";

export class MetricRangeSpecification implements Specification<Shape> {
  private readonly metric: ShapeMetric;
  private readonly min: number;
  private readonly max: number;

  constructor(metric: ShapeMetric, min: number, max: number) {
    this.metric = metric;
    this.min = min;
    this.max = max;
  }

  public isSatisfiedBy(item: Shape): boolean {
    const value = this.extractMetric(item);

    if (value === null) {
      return false;
    }

    return value >= this.min && value <= this.max;
  }

  private extractMetric(item: Shape): number | null {
    if (item instanceof RectangleModel) {
      if (this.metric === "area") {
        return RectangleService.area(item);
      }

      if (this.metric === "perimeter") {
        return RectangleService.perimeter(item);
      }

      return null;
    }

    if (item instanceof ConeModel) {
      if (this.metric === "volume") {
        return ConeService.volume(item);
      }

      if (this.metric === "surfaceArea") {
        return ConeService.surfaceArea(item);
      }

      return null;
    }

    return null;
  }
}