import { Shape } from "../../shapes/shape";
import { ShapeRepository } from "../shapeRepository";

class DummyShape extends Shape {
    constructor(id: string = "dummy-1") {
        super({
            kind: "unknown",
            dimension: "2D",
            id,
            name: "dummy",
        });
    }
}

describe("ShapeRepository — additional coverage", () => {
    test("remove() with non-existing id does nothing", () => {
        const repo = new ShapeRepository<DummyShape>();
        repo.remove("no-such-id"); // просто покрываем ветку
        expect(repo.getAll()).toHaveLength(0);
    });

    test("replace() throws when old id does not exist", () => {
        const repo = new ShapeRepository<DummyShape>();
        const item = new DummyShape("x");

        expect(() => repo.replace("missing", item))
            .toThrow("ShapeRepository: item with id=missing not found");
    });

    test("replace() when newItem.id === oldId triggers notifyUpdated()", () => {
        const repo = new ShapeRepository<DummyShape>();
        const s1 = new DummyShape("same");
        const s2 = new DummyShape("same"); // тот же id → ветка notifyUpdated

        repo.add(s1);

        // мок наблюдателя
        const observer = {
            onItemAdded: jest.fn(),
            onItemUpdated: jest.fn(),
            onItemRemoved: jest.fn(),
        };

        repo.addObserver(observer);
        repo.replace("same", s2);

        expect(observer.onItemUpdated).toHaveBeenCalledTimes(1);
        expect(observer.onItemRemoved).not.toHaveBeenCalled();
        expect(observer.onItemAdded).not.toHaveBeenCalled();
    });

    test("replace() when new id differs triggers remove+add", () => {
        const repo = new ShapeRepository<DummyShape>();
        const s1 = new DummyShape("old");
        const s2 = new DummyShape("new"); // новый id → ветка notifyRemoved + notifyAdded

        repo.add(s1);

        const observer = {
            onItemAdded: jest.fn(),
            onItemUpdated: jest.fn(),
            onItemRemoved: jest.fn(),
        };

        repo.addObserver(observer);
        repo.replace("old", s2);

        expect(observer.onItemRemoved).toHaveBeenCalledTimes(1);
        expect(observer.onItemAdded).toHaveBeenCalledTimes(1);
        expect(observer.onItemUpdated).not.toHaveBeenCalled();
    });
});
