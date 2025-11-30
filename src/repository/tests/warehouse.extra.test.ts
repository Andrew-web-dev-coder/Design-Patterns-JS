// src/repository/warehouse.extra.test.ts
import { Warehouse } from "../warehouse";
import { Shape } from "../../shapes/shape";

class OtherShape extends Shape {
    constructor() {
        super({
            kind: "unknown",
            dimension: "2D",
            name: "other",
            id: "other-1",
        });
    }
}

class DummyShape extends Shape {
    constructor() {
        super({
            kind: "unknown",
            dimension: "2D",
            name: "dummy",
            id: "dummy-1",
        });
    }
}

describe("Warehouse — additional coverage", () => {
    beforeEach(() => {
        Warehouse.getInstance().clear();
    });

    test("ignores unsupported shapes (neither rectangle nor cone)", () => {
        const wh = Warehouse.getInstance();
        const shape = new OtherShape();

        // вручную вызываем — так работает Observer
        wh.onItemAdded(shape);

        expect(wh.getMetrics("other-1")).toBeUndefined();
    });

    test("onItemRemoved always deletes metrics", () => {
        const wh = Warehouse.getInstance();
        const shape = new DummyShape();

        // заранее кладём что-то в storage
        (wh as any).storage.set(shape.id, { area: 123 });

        wh.onItemRemoved(shape); // должна выполниться строка с delete (56)

        expect(wh.getMetrics(shape.id)).toBeUndefined();
    });
});
