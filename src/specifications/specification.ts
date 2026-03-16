export interface Specification<T> {
  isSatisfiedBy(item: T): boolean;
}