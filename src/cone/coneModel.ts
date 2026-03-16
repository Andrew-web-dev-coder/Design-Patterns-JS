import { Shape } from "../shapes/shape";
import { Point3D } from "../geometry/point3D";

export type ConeModelParams = {
  center: Point3D;
  radius: number;
  height: number;
  id?: string;
  name?: string;
};

export class ConeModel extends Shape {
  private _center: Point3D;
  private _radius: number;
  private _height: number;

  constructor(params: ConeModelParams) {
    super({
      kind: "cone",
      dimension: "3D",
      id: params.id,
      name: params.name,
    });

    this._center = params.center;
    this._radius = params.radius;
    this._height = params.height;
  }

  public get center(): Point3D {
    return this._center;
  }

  public get radius(): number {
    return this._radius;
  }

  public get height(): number {
    return this._height;
  }

  public setCenter(center: Point3D): void {
    this._center = center;
    this.notify();
  }

  public setRadius(radius: number): void {
    this._radius = radius;
    this.notify();
  }

  public setHeight(height: number): void {
    this._height = height;
    this.notify();
  }
}