import { Shape } from "../shapes/shape";
import { Point3D } from "../geometry/point3D";

export type ConeModelParams = {
  center: Point3D;
  radius: number;
  height: number;
  id?: string;
  name?: string;
};

function genId(kind: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const stamp = Date.now().toString(36);
  return `${kind}-${stamp}-${rand}`;
}

export class ConeModel extends Shape {
  public readonly center: Point3D;
  public readonly radius: number;
  public readonly height: number;

  constructor(params: ConeModelParams) {
    super({
      kind: "cone",
      dimension: "3D",
      id: params.id ?? genId("cone"),
      name: params.name,
    });

    this.center = params.center;
    this.radius = params.radius;
    this.height = params.height;
  }
}