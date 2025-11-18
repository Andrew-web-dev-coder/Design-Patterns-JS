
export class Point2D {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            throw new Error("Point2D coordinates must be finite numbers");
        }

        this.x = x;
        this.y = y;
    }

    
    public distanceTo(other: Point2D): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    
    public vectorTo(other: Point2D): { x: number; y: number } {
        return {
            x: other.x - this.x,
            y: other.y - this.y,
        };
    }
}
