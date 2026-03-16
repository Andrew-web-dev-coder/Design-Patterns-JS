import { Shape } from "../shapes/shape";
import { Specification } from "./specification";

export class ShapeNameSpecification implements Specification<Shape> {
  private readonly expectedName: string;

  constructor(expectedName: string) {
    this.expectedName = expectedName;
  }

  public isSatisfiedBy(item: Shape): boolean {
    return item.name === this.expectedName;
  }
}