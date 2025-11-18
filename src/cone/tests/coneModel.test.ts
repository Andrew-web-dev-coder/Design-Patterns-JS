import { ConeModel } from "../coneModel";
import { Point3D } from "../../geometry/point3D";

describe("ConeModel FULL COVERAGE", () => {

    
    test("constructor sets fields + Shape metadata", () => {
        const c = new Point3D(1, 2, 3);
        const cone = new ConeModel(c, 5, 10);

        expect(cone.center).toBe(c);
        expect(cone.radius).toBe(5);
        expect(cone.height).toBe(10);

        expect(cone.kind).toBe("cone");
        expect(cone.dimension).toBe("3D");
        expect(typeof cone.id).toBe("string");
        expect(cone.name).toBe("cone");
    });

    test("constructor throws on invalid radius/height", () => {
        const c = new Point3D(0, 0, 0);

        expect(() => new ConeModel(c, 0, 10)).toThrow();
        expect(() => new ConeModel(c, 5, 0)).toThrow();
        expect(() => new ConeModel(c, -1, 10)).toThrow();
        expect(() => new ConeModel(c, 5, -1)).toThrow();
    });

    

    test("volume() computes correct value", () => {
        const cone = new ConeModel(new Point3D(0, 0, 0), 3, 9);
        const expected = (Math.PI * 9 * 9) / 3;
        expect(cone.volume()).toBeCloseTo(expected);
    });

    test("baseArea() computes πr²", () => {
        const cone = new ConeModel(new Point3D(0, 0, 0), 4, 20);
        expect(cone.baseArea()).toBeCloseTo(Math.PI * 16);
    });

    
    test("surfaceArea() computes base + lateral area", () => {
        const cone = new ConeModel(new Point3D(0, 0, 0), 3, 4);

        const slant = Math.sqrt(3 * 3 + 4 * 4);
        const expected = Math.PI * 3 * slant + Math.PI * 9;

        expect(cone.surfaceArea()).toBeCloseTo(expected);
    });

    
    test("volumeSliceRatio() returns null if plane doesn't intersect cone", () => {
        const cone = new ConeModel(new Point3D(0, 0, 10), 5, 10);

        expect(cone.volumeSliceRatio(0)).toBeNull();     
        expect(cone.volumeSliceRatio(10)).toBeNull();    
        expect(cone.volumeSliceRatio(20)).toBeNull();    
    });

    test("volumeSliceRatio() computes correct lower/upper ratio", () => {
        const cone = new ConeModel(new Point3D(0, 0, 0), 6, 12);

        
        const ratio = cone.volumeSliceRatio(4);
        expect(typeof ratio).toBe("number");

       
        const cutHeight = 12 - 4; // 8
        const upperVolume = (Math.PI * 36 * cutHeight) / 3;
        const totalVolume = cone.volume();
        const lowerVolume = totalVolume - upperVolume;

        expect(ratio).toBeCloseTo(lowerVolume / upperVolume);
    });

    
    test("isBaseOnCoordinatePlane() returns true only when center touches XY/XZ/YZ plane", () => {
        expect(new ConeModel(new Point3D(0, 5, 5), 3, 10).isBaseOnCoordinatePlane()).toBe(true); // YZ
        expect(new ConeModel(new Point3D(5, 0, 5), 3, 10).isBaseOnCoordinatePlane()).toBe(true); // XZ
        expect(new ConeModel(new Point3D(5, 5, 0), 3, 10).isBaseOnCoordinatePlane()).toBe(true); // XY

        expect(new ConeModel(new Point3D(1, 2, 3), 3, 10).isBaseOnCoordinatePlane()).toBe(false);
    });

    
    test("randomPointInside() returns a valid internal point", () => {
        const cone = new ConeModel(new Point3D(10, -5, 3), 7, 12);
        const p = cone.randomPointInside();

        expect(p.z).toBeGreaterThanOrEqual(3);
        expect(p.z).toBeLessThanOrEqual(15);

        const dx = p.x - cone.center.x;
        const dy = p.y - cone.center.y;
        expect(dx * dx + dy * dy).toBeLessThanOrEqual(49);
    });
});
