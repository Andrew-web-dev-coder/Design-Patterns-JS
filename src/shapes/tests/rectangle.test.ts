import { Rectangle } from "../rectangle";
import { Point2D } from "../../geometry/point2D";

describe("Rectangle class", () => {
    const A = new Point2D(0, 0);
    const B = new Point2D(4, 0);
    const C = new Point2D(4, 3);
    const D = new Point2D(0, 3);

    test("should create a valid rectangle", () => {
        const r = new Rectangle(A, B, C, D);

        expect(r.a).toBe(A);
        expect(r.b).toBe(B);
        expect(r.c).toBe(C);
        expect(r.d).toBe(D);
    });

    test("should throw error for invalid rectangle (non-orthogonal points)", () => {
        const p1 = new Point2D(0, 0);
        const p2 = new Point2D(1, 1);
        const p3 = new Point2D(2, 1);
        const p4 = new Point2D(2, 0);

        expect(() => new Rectangle(p1, p2, p3, p4)).toThrow(
            "Provided points do not form a valid rectangle"
        );
    });

    test("should compute correct width", () => {
        const r = new Rectangle(A, B, C, D);
        expect(r.width()).toBe(4);
    });

    test("should compute correct height", () => {
        const r = new Rectangle(A, B, C, D);
        expect(r.height()).toBe(3);
    });

    test("should compute correct area", () => {
        const r = new Rectangle(A, B, C, D);
        expect(r.area()).toBe(12);
    });

    test("should compute correct perimeter", () => {
        const r = new Rectangle(A, B, C, D);
        expect(r.perimeter()).toBe(2 * (4 + 3)); // 14
    });

    test("touchesAxis returns true when any point is on axis", () => {
        const r = new Rectangle(A, B, C, D); // A is (0,0)
        expect(r.touchesAxis()).toBe(true);
    });

    test("touchesAxis returns false when no point is on axis", () => {
        const A2 = new Point2D(1, 1);
        const B2 = new Point2D(5, 1);
        const C2 = new Point2D(5, 4);
        const D2 = new Point2D(1, 4);

        const r = new Rectangle(A2, B2, C2, D2);
        expect(r.touchesAxis()).toBe(false);
    });

    test("should detect another invalid rectangle (opposite sides mismatch)", () => {
        
        const p1 = new Point2D(0, 0);
        const p2 = new Point2D(4, 0);
        const p3 = new Point2D(5, 3); 
        const p4 = new Point2D(0, 3);

        expect(() => new Rectangle(p1, p2, p3, p4)).toThrow();
    });
});
