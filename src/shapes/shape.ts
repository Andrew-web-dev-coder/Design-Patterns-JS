import { Observer } from "../observers/observer";
import { Subject } from "../observers/subject";

export type ShapeDimension = "2D" | "3D";
export type ShapeKind = "rectangle" | "cone" | "unknown";

export abstract class Shape implements Subject {
  public readonly id: string;
  public readonly kind: ShapeKind;
  public readonly dimension: ShapeDimension;

  protected _name: string;
  private readonly observers: Observer[] = [];

  protected constructor(options: {
    kind: ShapeKind;
    dimension: ShapeDimension;
    name?: string;
    id?: string;
  }) {
    this.kind = options.kind;
    this.dimension = options.dimension;
    this._name = options.name ?? options.kind;
    this.id = options.id ?? Shape.generateId(options.kind);
  }

  public get name(): string {
    return this._name;
  }

  public setName(name: string): void {
    this._name = name;
    this.notify();
  }

  public attach(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);

    if (index >= 0) {
      this.observers.splice(index, 1);
    }
  }

  public notify(): void {
    this.observers.forEach((observer) => observer.update(this));
  }

  public static generateId(kind: ShapeKind): string {
    const rand = Math.random().toString(36).slice(2, 8);
    const stamp = Date.now().toString(36);
    return `${kind}-${stamp}-${rand}`;
  }
}