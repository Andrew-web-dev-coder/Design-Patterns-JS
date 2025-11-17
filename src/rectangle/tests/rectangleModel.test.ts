import { RectangleModel } from "../rectangleModel";

// Мокаем Shape, чтобы покрыть super()
jest.mock("../../shapes/shape", () => {
    return {
        Shape: class MockShape {
            constructor() {}
        }
    };
});

describe("RectangleModel FULL COVERAGE", () => {

    test("constructor sets fields correctly", () => {
        const r = new RectangleModel(1, 2, 3, 4);
        expect(r.x).toBe(1);
        expect(r.y).toBe(2);
        expect(r.width).toBe(3);
        expect(r.height).toBe(4);
    });

    test("constructor throws for non-positive width", () => {
        expect(() => new RectangleModel(0, 0, 0, 5)).toThrow();
    });

    test("constructor throws for non-positive height", () => {
        expect(() => new RectangleModel(0, 0, 5, 0)).toThrow();
    });

    test("area returns width * height", () => {
        const r = new RectangleModel(0, 0, 3, 4);
        expect(r.area()).toBe(12);
    });

    test("perimeter returns 2*(w + h)", () => {
        const r = new RectangleModel(0, 0, 3, 4);
        expect(r.perimeter()).toBe(14);
    });

    test("diagonal returns sqrt(w^2 + h^2)", () => {
        const r = new RectangleModel(0, 0, 3, 4);
        expect(r.diagonal()).toBe(5);
    });

    // -------- touchesAxis FULL BRANCH COVERAGE ----------

    test("touchesAxis: touches X only", () => {
        const r = new RectangleModel(10, -5, 5, 10);
        expect(r.touchesAxis()).toBe(true);
    });

    test("touchesAxis: touches Y only", () => {
        const r = new RectangleModel(-5, 10, 10, 5);
        expect(r.touchesAxis()).toBe(true);
    });

    test("touchesAxis: touches BOTH axes", () => {
        const r = new RectangleModel(-5, -5, 10, 10);
        expect(r.touchesAxis()).toBe(true);
    });

    test("touchesAxis: touches NONE", () => {
        const r = new RectangleModel(5, 5, 10, 10);
        expect(r.touchesAxis()).toBe(false);
    });

});
