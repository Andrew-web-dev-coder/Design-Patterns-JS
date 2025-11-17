// point3D.ts
export class Point3D {
    public readonly x: number;
    public readonly y: number;
    public readonly z: number;

    constructor(x: number, y: number, z: number) {
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) {
            throw new Error("Point3D coordinates must be finite numbers");
        }

        this.x = x;
        this.y = y;
        this.z = z;
    }

    /** Distance to another 3D point */
    public distanceTo(other: Point3D): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    /** 3D vector to another point */
    public vectorTo(other: Point3D): { x: number; y: number; z: number } {
        return {
            x: other.x - this.x,
            y: other.y - this.y,
            z: other.z - this.z,
        };
    }
}
