import {
    PredicateSpecification,
    OrSpecification,
    NotSpecification,
} from "../specification";

class Box {
    constructor(public readonly v: number) {}
}

describe("Extra specification tests", () => {
    test("OrSpecification returns true if either spec is satisfied", () => {
        const greater10 = new PredicateSpecification<Box>(b => b.v > 10);
        const less5 = new PredicateSpecification<Box>(b => b.v < 5);

        const spec = new OrSpecification(greater10, less5);

        expect(spec.isSatisfiedBy(new Box(20))).toBe(true); // >10
        expect(spec.isSatisfiedBy(new Box(3))).toBe(true);  // <5
        expect(spec.isSatisfiedBy(new Box(7))).toBe(false); // neither
    });

    test("NotSpecification negates inner spec", () => {
        const isEven = new PredicateSpecification<Box>(b => b.v % 2 === 0);
        const notEven = new NotSpecification(isEven);

        expect(notEven.isSatisfiedBy(new Box(2))).toBe(false);
        expect(notEven.isSatisfiedBy(new Box(3))).toBe(true);
    });
});
