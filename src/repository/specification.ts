// src/repository/specification.ts

/**
 * Базовый интерфейс спецификации поиска (Specification pattern).
 */
export interface Specification<T> {
    isSatisfiedBy(item: T): boolean;
}

/**
 * Универсальная спецификация на основе произвольного предиката.
 * Удобно использовать для произвольных фильтров
 * (по координатам, диапазонам, статусам и т.д.).
 */
export class PredicateSpecification<T> implements Specification<T> {
    private readonly predicate: (item: T) => boolean;

    constructor(predicate: (item: T) => boolean) {
        this.predicate = predicate;
    }

    public isSatisfiedBy(item: T): boolean {
        return this.predicate(item);
    }
}

/**
 * Логическое И двух спецификаций.
 */
export class AndSpecification<T> implements Specification<T> {
    constructor(
        private readonly left: Specification<T>,
        private readonly right: Specification<T>,
    ) {}

    public isSatisfiedBy(item: T): boolean {
        return this.left.isSatisfiedBy(item) && this.right.isSatisfiedBy(item);
    }
}

/**
 * Логическое ИЛИ двух спецификаций.
 */
export class OrSpecification<T> implements Specification<T> {
    constructor(
        private readonly left: Specification<T>,
        private readonly right: Specification<T>,
    ) {}

    public isSatisfiedBy(item: T): boolean {
        return this.left.isSatisfiedBy(item) || this.right.isSatisfiedBy(item);
    }
}

/**
 * Логическое НЕ спецификации.
 */
export class NotSpecification<T> implements Specification<T> {
    constructor(private readonly inner: Specification<T>) {}

    public isSatisfiedBy(item: T): boolean {
        return !this.inner.isSatisfiedBy(item);
    }
}
