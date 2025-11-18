import { Shape } from "../shapes/shape";
import { Point3D } from "../geometry/point3D";


export class ConeModel extends Shape {
    public readonly center: Point3D;
    public readonly radius: number;
    public readonly height: number;

    constructor(center: Point3D, radius: number, height: number) {
        super({
            kind: "cone",
            dimension: "3D",
        });

        if (radius <= 0 || height <= 0) {
            throw new Error("ConeModel: radius and height must be positive numbers");
        }

        this.center = center;
        this.radius = radius;
        this.height = height;
    }

   
    public volume(): number {
        return (Math.PI * this.radius * this.radius * this.height) / 3;
    }

    
    public baseArea(): number {
        return Math.PI * this.radius * this.radius;
    }

    
    public surfaceArea(): number {
        const slant = Math.sqrt(this.radius * this.radius + this.height * this.height);
        const lateralArea = Math.PI * this.radius * slant;
        const base = this.baseArea();
        return lateralArea + base;
    }

    
    public volumeSliceRatio(planeZ: number): number | null {
        const baseZ = this.center.z;
        const topZ = this.center.z + this.height;

        if (planeZ <= baseZ || planeZ >= topZ) {
            return null; 
        }

        
        const cutHeight = topZ - planeZ;
        const h = this.height;

        
        const upperVolume = (Math.PI * this.radius * this.radius * cutHeight) / 3;

        
        const lowerVolume = this.volume() - upperVolume;

        return lowerVolume / upperVolume;
    }

    
    public isBaseOnCoordinatePlane(): boolean {
        return (
            this.center.z === 0 ||
            this.center.x === 0 ||
            this.center.y === 0
        );
    }

   
    public randomPointInside(): Point3D {
        const r = this.radius * Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        const h = Math.random() * this.height;

        const x = this.center.x + r * Math.cos(theta);
        const y = this.center.y + r * Math.sin(theta);
        const z = this.center.z + h;

        return new Point3D(x, y, z);
    }
}
