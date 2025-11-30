// src/repository/shapeRepository.ts

import { Shape } from "../shapes/shape";
import { Specification } from "./specification";

/** Comparator для сортировки */
export interface Comparator<T> {
    compare(a: T, b: T): number;
}

/** Наблюдатель репозитория */
export interface RepositoryObserver<T> {
    onItemAdded(item: T): void;
    onItemUpdated(item: T): void;
    onItemRemoved(item: T): void;
}

export class ShapeRepository<T extends Shape> {
    private readonly items = new Map<string, T>();
    private readonly observers: RepositoryObserver<T>[] = [];

    /** Добавление наблюдателя */
    public addObserver(observer: RepositoryObserver<T>): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    /** Удаление наблюдателя */
    public removeObserver(observer: RepositoryObserver<T>): void {
        const idx = this.observers.indexOf(observer);
        if (idx !== -1) {
            this.observers.splice(idx, 1);
        }
    }

    private notifyAdded(item: T): void {
        this.observers.forEach(o => o.onItemAdded(item));
    }

    private notifyUpdated(item: T): void {
        this.observers.forEach(o => o.onItemUpdated(item));
    }

    private notifyRemoved(item: T): void {
        this.observers.forEach(o => o.onItemRemoved(item));
    }

    /** Добавить */
    public add(item: T): void {
        this.items.set(item.id, item);
        this.notifyAdded(item);
    }

    /** Получить */
    public getById(id: string): T | undefined {
        return this.items.get(id);
    }

    /** Удалить */
    public remove(id: string): void {
        const existing = this.items.get(id);
        if (!existing) return;

        this.items.delete(id);
        this.notifyRemoved(existing);
    }

    /** Заменить */
    public replace(oldId: string, newItem: T): void {
        const existing = this.items.get(oldId);
        if (!existing) {
            throw new Error(`ShapeRepository: item with id=${oldId} not found`);
        }

        const sameId = newItem.id === oldId;

        this.items.set(newItem.id, newItem);

        if (sameId) {
            this.notifyUpdated(newItem);
        } else {
            this.items.delete(oldId);
            this.notifyRemoved(existing);
            this.notifyAdded(newItem);
        }
    }

    /** Все элементы */
    public getAll(): T[] {
        return [...this.items.values()];
    }

    /** Поиск */
    public query(spec?: Specification<T>): T[] {
        if (!spec) return this.getAll();
        return this.getAll().filter(item => spec.isSatisfiedBy(item));
    }

    /** Сортировка */
    public sorted(comp: Comparator<T>): T[] {
        return this.getAll().sort((a, b) => comp.compare(a, b));
    }

    /** Числовой comparator */
    public static numberComparator<T>(
        selector: (item: T) => number
    ): Comparator<T> {
        return {
            compare(a, b) {
                return selector(a) - selector(b);
            }
        };
    }
}
