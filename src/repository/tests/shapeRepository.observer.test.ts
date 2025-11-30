// src/repository/shapeRepository.observer.test.ts
import { ShapeRepository } from "../shapeRepository";
import { Shape } from "../../shapes/shape";

// простой мок Shape
class TestShape extends Shape {
    constructor(public readonly value: number) {
        super({ kind: "rectangle", dimension: "2D", name: `t${value}` });
    }
}

describe("ShapeRepository — observer notifications", () => {
    test("calls onItemAdded observer", () => {
        const repo = new ShapeRepository<TestShape>();

        const added: TestShape[] = [];
        const observer = {
            onItemAdded: (item: TestShape) => added.push(item),
            onItemUpdated: () => {},
            onItemRemoved: () => {},
        };

        repo.addObserver(observer);

        const s = new TestShape(1);
        repo.add(s);

        // покрываем notifyAdded + ветку с НЕпустым списком наблюдателей (46-48)
        expect(added).toEqual([s]);
    });

    test("does not add the same observer twice", () => {
        const repo = new ShapeRepository<TestShape>();

        const observer = {
            onItemAdded: () => {},
            onItemUpdated: () => {},
            onItemRemoved: () => {},
        };

        repo.addObserver(observer);
        repo.addObserver(observer); // вторая регистрация должна быть проигнорирована

        // если бы observer добавился дважды, onItemAdded вызвался бы 2 раза
        const s = new TestShape(1);
        const spy = jest.spyOn(observer, "onItemAdded");
        repo.add(s);

        expect(spy).toHaveBeenCalledTimes(1);
    });

    test("calls onItemRemoved observer", () => {
        const repo = new ShapeRepository<TestShape>();

        const removed: TestShape[] = [];
        const observer = {
            onItemAdded: () => {},
            onItemUpdated: () => {},
            onItemRemoved: (item: TestShape) => removed.push(item),
        };

        repo.addObserver(observer);

        const s = new TestShape(10);
        repo.add(s);
        repo.remove(s.id);

        expect(removed).toEqual([s]);
    });

    test("removeObserver actually unsubscribes", () => {
        const repo = new ShapeRepository<TestShape>();

        const removed: TestShape[] = [];
        const observer = {
            onItemAdded: () => {},
            onItemUpdated: () => {},
            onItemRemoved: (item: TestShape) => removed.push(item),
        };

        repo.addObserver(observer);
        repo.removeObserver(observer); // ветка index >= 0 в removeObserver
        repo.removeObserver(observer); // ветка index < 0, просто ничего не делает

        const s = new TestShape(42);
        repo.add(s);
        repo.remove(s.id);

        // если бы наблюдатель остался, массив был бы не пустой
        expect(removed).toEqual([]);
    });

    test("calls onItemUpdated when ID stays same", () => {
        const repo = new ShapeRepository<TestShape>();

        const updated: TestShape[] = [];
        const observer = {
            onItemAdded: () => {},
            onItemRemoved: () => {},
            onItemUpdated: (item: TestShape) => updated.push(item),
        };

        repo.addObserver(observer);

        const original = new TestShape(5);
        repo.add(original);

        // создаём новый объект, но с тем же id → ветка notifyUpdated (else-ветка в replace)
        const replacement = new TestShape(77);
        (replacement as any).id = original.id;

        repo.replace(original.id, replacement);

        expect(updated).toEqual([replacement]);
    });
});
