export type ShapeDimension = "2D" | "3D";
export type ShapeKind = "rectangle" | "cone" | "unknown";

export abstract class Shape {
  public readonly id: string;
  public readonly name: string;
  public readonly kind: ShapeKind;
  public readonly dimension: ShapeDimension;

  protected constructor(options: {
    id: string;
    kind: ShapeKind;
    dimension: ShapeDimension;
    name?: string;
  }) {
    this.id = options.id;
    this.kind = options.kind;
    this.dimension = options.dimension;
    this.name = options.name ?? options.kind;
  }
}