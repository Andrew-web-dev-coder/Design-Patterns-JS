import { ShapeRepository } from "../shapeRepository";
import { Shape } from "../../shapes/shape";

class TestShape extends Shape {
    constructor(id: string, public readonly value: number) {
        super({ kind: "unknown", dimension: "2D", id, name: `shape-${value}` });
    }
}

describe("ShapeRepository — full coverage", () => {

    test("removeObserver actually removes it", () => {
        const repo = new ShapeRepository<TestShape>();

        const events: string[] = [];

        const observer = {
            onItemAdded: () => events.push("add"),
            onItemUpdated: () => events.push("update"),
            onItemRemoved: () => events.push("remove"),
        };

        repo.addObserver(observer);
        repo.removeObserver(observer);

        const shape = new TestShape("id1", 10);
        repo.add(shape);

        expect(events).toEqual([]); // observer уже удалён
    });

    test("replace throws when oldId not found", () => {
        const repo = new ShapeRepository<TestShape>();
        const newItem = new TestShape("new", 1);

        expect(() => repo.replace("missing", newItem)).toThrow();
    });

    test("replace triggers notifyUpdated when id remains the same", () => {
        const repo = new ShapeRepository<TestShape>();

        const old = new TestShape("same", 10);
        repo.add(old);

        const events: string[] = [];
        const observer = {
            onItemAdded: () => events.push("add"),
            onItemUpdated: () => events.push("update"),
            onItemRemoved: () => events.push("remove"),
        };

        repo.addObserver(observer);

        const updated = new TestShape("same", 20);
        repo.replace("same", updated);

        expect(events).toContain("update");
        expect(events).not.toContain("remove");
    });

    test("sorted handles equal and negative comparator results", () => {
        const repo = new ShapeRepository<TestShape>();

        const s1 = new TestShape("1", 10);
        const s2 = new TestShape("2", 10); // equal
        const s3 = new TestShape("3", -5); // negative

        repo.add(s1);
        repo.add(s2);
        repo.add(s3);

        const comp = ShapeRepository.numberComparator<TestShape>((s) => s.value);

        const result = repo.sorted(comp).map((s) => s.value);
        expect(result).toEqual([-5, 10, 10]);
    });
});
