import { Point2D } from "../point2D";

describe("Point2D tests", () => {

    
    test("should create a point with valid finite coordinates", () => {
        const p = new Point2D(3, 4);
        expect(p.x).toBe(3);
        expect(p.y).toBe(4);
    });

    test("should throw error if x is not a finite number", () => {
        expect(() => new Point2D(NaN, 5)).toThrow("Point2D coordinates must be finite numbers");
        expect(() => new Point2D(Infinity, 5)).toThrow("Point2D coordinates must be finite numbers");
        expect(() => new Point2D("a" as any, 5)).toThrow();
    });

    test("should throw error if y is not a finite number", () => {
        expect(() => new Point2D(5, NaN)).toThrow("Point2D coordinates must be finite numbers");
        expect(() => new Point2D(5, Infinity)).toThrow("Point2D coordinates must be finite numbers");
        expect(() => new Point2D(5, "b" as any)).toThrow();
    });

    
    test("distanceTo should compute Euclidean distance", () => {
        const p1 = new Point2D(0, 0);
        const p2 = new Point2D(3, 4);

        expect(p1.distanceTo(p2)).toBe(5); 
    });

    test("distanceTo should return 0 for same point", () => {
        const p = new Point2D(7, 9);
        expect(p.distanceTo(p)).toBe(0);
    });

    
    test("vectorTo should compute vector difference", () => {
        const p1 = new Point2D(1, 2);
        const p2 = new Point2D(4, 10);

        const v = p1.vectorTo(p2);

        expect(v.x).toBe(3);
        expect(v.y).toBe(8);
    });

    test("vectorTo should return zero vector when same point", () => {
        const p = new Point2D(5, 5);

        const v = p.vectorTo(p);

        expect(v.x).toBe(0);
        expect(v.y).toBe(0);
    });
});
