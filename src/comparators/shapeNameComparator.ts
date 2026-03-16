import { Shape } from "../shapes/shape";
import { Comparator } from "./comparator";

export class ShapeNameComparator implements Comparator<Shape> {
  public compare(a: Shape, b: Shape): number {
    return a.name.localeCompare(b.name);
  }
}