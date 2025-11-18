export type ShapeDimension = "2D" | "3D";

export type ShapeKind = "rectangle" | "cone" | "unknown";


export abstract class Shape {
    public readonly id: string;
    public readonly name: string;
    public readonly kind: ShapeKind;
    public readonly dimension: ShapeDimension;

    protected constructor(options: {
        kind: ShapeKind;
        dimension: ShapeDimension;
        name?: string;
        id?: string;
    }) {
        this.kind = options.kind;
        this.dimension = options.dimension;
        this.name = options.name ?? options.kind;
        this.id = options.id ?? Shape.generateId(options.kind);
    }

    
    private static generateId(kind: ShapeKind): string {
        const rand = Math.random().toString(36).slice(2, 8);
        const stamp = Date.now().toString(36);
        return `${kind}-${stamp}-${rand}`;
    }
}
