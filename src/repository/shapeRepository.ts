import { Shape } from "../shapes/shape";
import { Specification } from "../specifications/specification";
import { Comparator } from "../comparators/comparator";
import { WarehouseInitializer } from "../warehouse/warehouseInitializer";
import { Warehouse } from "../warehouse/warehouse";
import { WarehouseObserver } from "../warehouse/warehouseObserver";

export class ShapeRepository {
  private static instance: ShapeRepository | null = null;

  private readonly shapes: Map<string, Shape>;
  private readonly warehouseObserver: WarehouseObserver;

  private constructor() {
    this.shapes = new Map<string, Shape>();
    this.warehouseObserver = new WarehouseObserver();
  }

  public static getInstance(): ShapeRepository {
    if (!ShapeRepository.instance) {
      ShapeRepository.instance = new ShapeRepository();
    }

    return ShapeRepository.instance;
  }

  public add(shape: Shape): void {
    this.shapes.set(shape.id, shape);
    shape.attach(this.warehouseObserver);
    WarehouseInitializer.saveShapeParameters(shape);
  }

  public addMany(shapes: Shape[]): void {
    shapes.forEach((shape) => this.add(shape));
  }

  public removeById(id: string): boolean {
    const shape = this.shapes.get(id);

    if (shape) {
      shape.detach(this.warehouseObserver);
    }

    const removed = this.shapes.delete(id);

    if (removed) {
      Warehouse.getInstance().remove(id);
    }

    return removed;
  }

  public getById(id: string): Shape | null {
    return this.shapes.get(id) ?? null;
  }

  public getAll(): Shape[] {
    return Array.from(this.shapes.values());
  }

  public has(id: string): boolean {
    return this.shapes.has(id);
  }

  public count(): number {
    return this.shapes.size;
  }

  public clear(): void {
    this.shapes.forEach((shape) => shape.detach(this.warehouseObserver));
    this.shapes.clear();
    Warehouse.getInstance().clear();
  }

  public findBySpecification(specification: Specification<Shape>): Shape[] {
    return this.getAll().filter((shape) => specification.isSatisfiedBy(shape));
  }

  public findOneBySpecification(specification: Specification<Shape>): Shape | null {
    return this.getAll().find((shape) => specification.isSatisfiedBy(shape)) ?? null;
  }

  public sort(comparator: Comparator<Shape>): Shape[] {
    return this.getAll().sort((a, b) => comparator.compare(a, b));
  }
}