// src/repository/warehouse.ts

import { Shape } from "../shapes/shape";
import { RectangleModel } from "../rectangle/rectangleModel";
import { ConeModel } from "../cone/coneModel";
import { RepositoryObserver } from "./shapeRepository";

export interface ShapeMetrics {
    area?: number;
    perimeter?: number;
    volume?: number;
    surfaceArea?: number;
    baseArea?: number;
}

export class Warehouse implements RepositoryObserver<Shape> {
    private static instance: Warehouse | null = null;

    /** тесты специально лезут сюда через (w as any).storage */
    private readonly storage = new Map<string, ShapeMetrics>();

    private constructor() {}

    public static getInstance(): Warehouse {
        if (!this.instance) {
            this.instance = new Warehouse();
        }
        return this.instance;
    }

    public getMetrics(id: string): ShapeMetrics | undefined {
        return this.storage.get(id);
    }

    public clear(): void {
        this.storage.clear();
    }

    /** Observer API */
    public onItemAdded(item: Shape): void {
        this.recalculate(item);
    }

    public onItemUpdated(item: Shape): void {
        this.recalculate(item);
    }

    public onItemRemoved(item: Shape): void {
        this.storage.delete(item.id);
    }

    /** перерасчёт */
    private recalculate(item: Shape): void {
        if (item instanceof RectangleModel) {
            this.storage.set(item.id, {
                area: item.area(),
                perimeter: item.perimeter()
            });
            return;
        }

        if (item instanceof ConeModel) {
            this.storage.set(item.id, {
                volume: item.volume(),
                baseArea: item.baseArea(),
                surfaceArea: item.surfaceArea()
            });
            return;
        }

        // unknown → remove (покрывается warehouse.unknownShape + extra)
        this.storage.delete(item.id);
    }
}
