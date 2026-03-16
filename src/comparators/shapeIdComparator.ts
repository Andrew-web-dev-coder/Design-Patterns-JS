import { Shape } from "../shapes/shape";
import { Comparator } from "./comparator";

export class ShapeIdComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    return a.id.localeCompare(b.id);
  }
}