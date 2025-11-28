import { Warehouse } from "../warehouse";
import { Shape } from "../../shapes/shape";

class UnknownShape extends Shape {
    constructor() {
        super({ kind: "unknown", dimension: "2D" });
    }
}

describe("Warehouse — unknown shapes", () => {
    test("removes metrics when unknown shape is added", () => {
        const wh = Warehouse.getInstance();
        wh.clear();

        const fake = new UnknownShape();
        wh.onItemAdded(fake);   // попадёт в ветку else

        expect(wh.getMetrics(fake.id)).toBeUndefined();
    });
});
