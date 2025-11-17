import { Point2D } from "../../geometry/point2D";
import { Rectangle } from "../rectangle";

describe("Rectangle extra geometry tests", () => {
    test("isConvex() should always return true", () => {
        const r = new Rectangle(
            new Point2D(0, 0),
            new Point2D(4, 0),
            new Point2D(4, 3),
            new Point2D(0, 3)
        );

        expect(r.isConvex()).toBe(true);
    });

    test("isSquare() should detect square correctly", () => {
        const square = new Rectangle(
            new Point2D(0, 0),
            new Point2D(5, 0),
            new Point2D(5, 5),
            new Point2D(0, 5)
        );

        expect(square.isSquare()).toBe(true);

        const notSquare = new Rectangle(
            new Point2D(0, 0),
            new Point2D(6, 0),
            new Point2D(6, 3),
            new Point2D(0, 3)
        );

        expect(notSquare.isSquare()).toBe(false);
    });

    test("isRhombus() should detect rhombus correctly (true only for squares)", () => {
        const square = new Rectangle(
            new Point2D(0, 0),
            new Point2D(4, 0),
            new Point2D(4, 4),
            new Point2D(0, 4)
        );

        expect(square.isRhombus()).toBe(true);

        const rect = new Rectangle(
            new Point2D(0, 0),
            new Point2D(6, 0),
            new Point2D(6, 3),
            new Point2D(0, 3)
        );

        expect(rect.isRhombus()).toBe(false);
    });

    test("isTrapezoid() should always return true for rectangles", () => {
        const rect = new Rectangle(
            new Point2D(1, 1),
            new Point2D(5, 1),
            new Point2D(5, 3),
            new Point2D(1, 3)
        );

        expect(rect.isTrapezoid()).toBe(true);
    });
});
