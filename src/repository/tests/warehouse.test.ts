// src/repository/tests/warehouse.test.ts

import { Warehouse } from "../warehouse";
import { RectangleModel } from "../../rectangle/rectangleModel";
import { ConeModel } from "../../cone/coneModel";
import { ShapeRepository } from "../shapeRepository";
import { Point3D } from "../../geometry/point3D";

describe("Warehouse — integration with ShapeRepository (Observer + Singleton)", () => {
    beforeEach(() => {
        // чистим singleton перед каждым тестом
        Warehouse.getInstance().clear();
    });

    test("stores area & perimeter for RectangleModel", () => {
        const repo = new ShapeRepository<RectangleModel>();
        const warehouse = Warehouse.getInstance();

        repo.addObserver(warehouse);

        const rect = new RectangleModel(0, 0, 4, 3); // ширина 4, высота 3
        repo.add(rect);

        const metrics = warehouse.getMetrics(rect.id);
        expect(metrics).toBeDefined();
        expect(metrics?.area).toBe(rect.area());
        expect(metrics?.perimeter).toBe(rect.perimeter());
    });

    test("stores volume & surfaceArea for ConeModel", () => {
        const repo = new ShapeRepository<ConeModel>();
        const warehouse = Warehouse.getInstance();

        repo.addObserver(warehouse);

        const cone = new ConeModel(
            new Point3D(0, 0, 0),
            2,
            5,
        );

        repo.add(cone);

        const metrics = warehouse.getMetrics(cone.id);
        expect(metrics).toBeDefined();
        expect(metrics?.volume).toBeCloseTo(cone.volume());
        expect(metrics?.surfaceArea).toBeCloseTo(cone.surfaceArea());
        expect(metrics?.baseArea).toBeCloseTo(cone.baseArea());
    });

    test("removes metrics when shape is removed from repository", () => {
        const repo = new ShapeRepository<RectangleModel>();
        const warehouse = Warehouse.getInstance();

        repo.addObserver(warehouse);

        const rect = new RectangleModel(0, 0, 2, 2);
        repo.add(rect);

        expect(warehouse.getMetrics(rect.id)).toBeDefined();

        repo.remove(rect.id);
        expect(warehouse.getMetrics(rect.id)).toBeUndefined();
    });
});
