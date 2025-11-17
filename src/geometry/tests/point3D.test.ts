import { Point3D } from "../point3D";

describe("Point3D tests", () => {
    test("should create a Point3D with valid coordinates", () => {
        const p = new Point3D(1, 2, 3);

        expect(p.x).toBe(1);
        expect(p.y).toBe(2);
        expect(p.z).toBe(3);
    });

    test("should throw error for non-finite coordinates", () => {
        const invalidValues = [Infinity, -Infinity, NaN];

        invalidValues.forEach(value => {
            expect(() => new Point3D(value, 1, 1)).toThrow(
                "Point3D coordinates must be finite numbers"
            );
            expect(() => new Point3D(1, value, 1)).toThrow(
                "Point3D coordinates must be finite numbers"
            );
            expect(() => new Point3D(1, 1, value)).toThrow(
                "Point3D coordinates must be finite numbers"
            );
        });
    });

    test("distanceTo() should calculate correct 3D distance", () => {
        const p1 = new Point3D(0, 0, 0);
        const p2 = new Point3D(3, 4, 12);

        // sqrt(9 + 16 + 144) = sqrt(169) = 13
        expect(p1.distanceTo(p2)).toBe(13);
    });

    test("vectorTo() should return correct 3D vector", () => {
        const p1 = new Point3D(1, 2, 3);
        const p2 = new Point3D(4, 6, 10);

        expect(p1.vectorTo(p2)).toEqual({
            x: 3,
            y: 4,
            z: 7,
        });
    });
});
