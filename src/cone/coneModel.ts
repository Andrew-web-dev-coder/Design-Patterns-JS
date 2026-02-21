import { Shape } from "../shapes/shape";
import { Point3D } from "../geometry/point3D";

export class ConeModel extends Shape {
  public readonly center: Point3D;
  public readonly radius: number;
  public readonly height: number;

  constructor(params: {
    id: string;
    center: Point3D;
    radius: number;
    height: number;
    name?: string;
  }) {
    super({
      id: params.id,
      name: params.name,
      kind: "cone",
      dimension: "3D",
    });

    this.center = params.center;
    this.radius = params.radius;
    this.height = params.height;
  }
}