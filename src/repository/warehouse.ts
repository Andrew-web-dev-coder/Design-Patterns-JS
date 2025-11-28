// src/repository/warehouse.ts

import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { RepositoryObserver } from "./shapeRepository";

/**
 * Набор вычисленных параметров для фигуры.
 * Для прямоугольника используем area/perimeter,
 * для конуса — volume/surfaceArea/baseArea.
 */
export interface ShapeMetrics {
    area?: number;
    perimeter?: number;
    volume?: number;
    surfaceArea?: number;
    baseArea?: number;
}

/**
 * Warehouse — Singleton + Observer.
 * Хранит вычисленные параметры фигур и
 * автоматически пересчитывает их при изменениях
 * в репозитории (add/replace/remove).
 */
export class Warehouse implements RepositoryObserver<Shape> {
    private static instance: Warehouse | null = null;

    private readonly storage: Map<string, ShapeMetrics> = new Map();

    private constructor() {}

    public static getInstance(): Warehouse {
        if (!Warehouse.instance) {
            Warehouse.instance = new Warehouse();
        }
        return Warehouse.instance;
    }

    public getMetrics(id: string): ShapeMetrics | undefined {
        return this.storage.get(id);
    }

    public clear(): void {
        this.storage.clear();
    }

    // ───────────────────── Observer API ─────────────────────

    public onItemAdded(item: Shape): void {
        this.recalculate(item);
    }

    public onItemUpdated(item: Shape): void {
        this.recalculate(item);
    }

    public onItemRemoved(item: Shape): void {
        this.storage.delete(item.id);
    }

    // ───────────────────── Internal helpers ─────────────────────

    private recalculate(item: Shape): void {
        if (item instanceof RectangleModel) {
            this.storage.set(item.id, {
                area: item.area(),
                perimeter: item.perimeter(),
            });
        } else if (item instanceof ConeModel) {
            this.storage.set(item.id, {
                volume: item.volume(),
                baseArea: item.baseArea(),
                surfaceArea: item.surfaceArea(),
            });
        } else {
            // на всякий случай очищаем запись,
            // чтобы не хранить устаревшие значения
            this.storage.delete(item.id);
        }
    }
}
