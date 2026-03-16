import { ShapeParameters } from "./shapeParameters";

export class Warehouse {
  private static instance: Warehouse | null = null;

  private readonly storage: Map<string, ShapeParameters>;

  private constructor() {
    this.storage = new Map<string, ShapeParameters>();
  }

  public static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }

    return Warehouse.instance;
  }

  public set(shapeId: string, parameters: ShapeParameters): void {
    this.storage.set(shapeId, parameters);
  }

  public get(shapeId: string): ShapeParameters | null {
    return this.storage.get(shapeId) ?? null;
  }

  public remove(shapeId: string): boolean {
    return this.storage.delete(shapeId);
  }

  public has(shapeId: string): boolean {
    return this.storage.has(shapeId);
  }

  public clear(): void {
    this.storage.clear();
  }

  public getAll(): Map<string, ShapeParameters> {
    return new Map(this.storage);
  }
}