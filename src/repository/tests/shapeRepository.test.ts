// src/repository/shapeRepository.test.ts

import { Shape } from "../../shapes/shape";
import {
    ShapeRepository,
    Comparator,
} from "../shapeRepository";
import {
    PredicateSpecification,
    AndSpecification,
} from "../specification";

class TestShape extends Shape {
    public readonly value: number;

    constructor(value: number) {
        // имя задаём сразу в конструкторе базового класса
        super({
            kind: "test",
            dimension: "2D",
            name: `test-${value}`,
        });
        this.value = value;
    }
}

describe("ShapeRepository — basic CRUD / specifications / sorting", () => {
    test("add() and getById()", () => {
        const repo = new ShapeRepository<TestShape>();

        const s1 = new TestShape(10);
        const s2 = new TestShape(20);

        repo.add(s1);
        repo.add(s2);

        expect(repo.getById(s1.id)).toBe(s1);
        expect(repo.getById(s2.id)).toBe(s2);
    });

    test("remove() deletes item", () => {
        const repo = new ShapeRepository<TestShape>();
        const s1 = new TestShape(10);

        repo.add(s1);
        expect(repo.getById(s1.id)).toBeDefined();

        repo.remove(s1.id);
        expect(repo.getById(s1.id)).toBeUndefined();
    });

    test("replace() updates item and keeps repository consistent", () => {
        const repo = new ShapeRepository<TestShape>();

        const original = new TestShape(10);
        repo.add(original);

        const updated = new TestShape(99);
        repo.replace(original.id, updated);

        expect(repo.getById(updated.id)).toBe(updated);
        expect(repo.getAll()).toHaveLength(1);
    });

    test("query() with PredicateSpecification and AndSpecification", () => {
        const repo = new ShapeRepository<TestShape>();

        const s1 = new TestShape(5);
        const s2 = new TestShape(15);
        const s3 = new TestShape(30);

        repo.add(s1);
        repo.add(s2);
        repo.add(s3);

        const greaterThan10 = new PredicateSpecification<TestShape>(
            (s) => s.value > 10,
        );
        const lessThan30 = new PredicateSpecification<TestShape>(
            (s) => s.value < 30,
        );

        const spec = new AndSpecification<TestShape>(
            greaterThan10,
            lessThan30,
        );

        const result = repo.query(spec).map((s) => s.value);
        expect(result).toEqual([15]);
    });

    test("sorted() works with numeric comparator", () => {
        const repo = new ShapeRepository<TestShape>();

        const s1 = new TestShape(30);
        const s2 = new TestShape(10);
        const s3 = new TestShape(20);

        repo.add(s1);
        repo.add(s2);
        repo.add(s3);

        const comparator: Comparator<TestShape> =
            ShapeRepository.numberComparator((s) => s.value);

        const result = repo.sorted(comparator).map((s) => s.value);
        expect(result).toEqual([10, 20, 30]);
    });
});
