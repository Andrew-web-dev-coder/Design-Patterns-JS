import { ConeModel } from "../coneModel";
import { Point3D } from "../../geometry/point3D";

describe("ConeModel (entity, no business logic)", () => {
  test("constructor sets fields + Shape metadata", () => {
    const center = new Point3D(1, 2, 3);

    const cone = new ConeModel({
      center,
      radius: 5,
      height: 10,
    });

    expect(cone.center).toBe(center);
    expect(cone.radius).toBe(5);
    expect(cone.height).toBe(10);

    expect(cone.kind).toBe("cone");
    expect(cone.dimension).toBe("3D");
    expect(typeof cone.id).toBe("string");
    expect(cone.name).toBe("cone");
  });
});