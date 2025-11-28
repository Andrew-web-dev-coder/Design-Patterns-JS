// src/repository/shapeRepository.ts

import { Shape } from "../shapes/shape";
import { Specification } from "./specification";

/**
 * Comparator для сортировки в репозитории.
 */
export interface Comparator<T> {
    compare(a: T, b: T): number;
}

/**
 * Наблюдатель за репозиторием (Observer pattern).
 * Warehouse будет реализовывать этот интерфейс.
 */
export interface RepositoryObserver<T> {
    onItemAdded(item: T): void;
    onItemUpdated(item: T): void;
    onItemRemoved(item: T): void;
}

/**
 * Repository pattern для фигур (Shape и наследников).
 * Хранит все созданные объекты и предоставляет
 * поиск, сортировку и базовый CRUD.
 */
export class ShapeRepository<T extends Shape> {
    private readonly items: Map<string, T> = new Map();

    private readonly observers: RepositoryObserver<T>[] = [];

    /**
     * Зарегистрировать наблюдателя (например, Warehouse).
     */
    public addObserver(observer: RepositoryObserver<T>): void {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    /**
     * Отписать наблюдателя.
     */
    public removeObserver(observer: RepositoryObserver<T>): void {
        const index = this.observers.indexOf(observer);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }

    private notifyAdded(item: T): void {
        this.observers.forEach((o) => o.onItemAdded(item));
    }

    private notifyUpdated(item: T): void {
        this.observers.forEach((o) => o.onItemUpdated(item));
    }

    private notifyRemoved(item: T): void {
        this.observers.forEach((o) => o.onItemRemoved(item));
    }

    /**
     * Добавить фигуру в репозиторий.
     */
    public add(item: T): void {
        this.items.set(item.id, item);
        this.notifyAdded(item);
    }

    /**
     * Получить фигуру по id.
     */
    public getById(id: string): T | undefined {
        return this.items.get(id);
    }

    /**
     * Удалить фигуру по id.
     */
    public remove(id: string): void {
        const existing = this.items.get(id);
        if (!existing) {
            return;
        }

        this.items.delete(id);
        this.notifyRemoved(existing);
    }

    /**
     * Обновить фигуру. Вариант без мутаций:
     * передаём новый объект, репозиторий заменяет ссылку.
     *
     * Важно: Warehouse пересчитает значения через Observer.
     */
    public replace(oldId: string, newItem: T): void {
        const existing = this.items.get(oldId);
        if (!existing) {
            throw new Error(`ShapeRepository: item with id=${oldId} not found`);
        }

        this.items.set(newItem.id, newItem);

        // если id изменился — удаляем старый ключ
        if (newItem.id !== oldId) {
            this.items.delete(oldId);
            this.notifyRemoved(existing);
            this.notifyAdded(newItem);
        } else {
            this.notifyUpdated(newItem);
        }
    }

    /**
     * Вернуть все элементы.
     */
    public getAll(): T[] {
        return Array.from(this.items.values());
    }

    /**
     * Поиск по спецификации.
     * Примеры:
     *  - поиск по id/имени
     *  - поиск по координатам
     *  - поиск по диапазону площади/объёма (через PredicateSpecification)
     */
    public query(specification?: Specification<T>): T[] {
        if (!specification) {
            return this.getAll();
        }

        return this.getAll().filter((item) => specification.isSatisfiedBy(item));
    }

    /**
     * Сортировка с помощью Comparator.
     */
    public sorted(comparator: Comparator<T>): T[] {
        const array = this.getAll().slice();
        array.sort((a, b) => comparator.compare(a, b));
        return array;
    }

    /**
     * Утилита для быстрого создания компаратора по любому числовому ключу.
     */
    public static numberComparator<T>(
        selector: (item: T) => number,
    ): Comparator<T> {
        return {
            compare(a: T, b: T): number {
                return selector(a) - selector(b);
            },
        };
    }
}
