import { Shape } from "../shapes/shape";
import { Specification } from "./specification";

export class ShapeIdSpecification implements Specification<Shape> {
  private readonly expectedId: string;

  constructor(expectedId: string) {
    this.expectedId = expectedId;
  }

  public isSatisfiedBy(item: Shape): boolean {
    return item.id === this.expectedId;
  }
}