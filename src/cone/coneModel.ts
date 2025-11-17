import { Shape } from "../shapes/shape";
import { Point3D } from "../geometry/point3D";

/**
 * ConeModel — класс геометрического конуса.
 * Содержит:
 *  - volume()
 *  - baseArea()
 *  - surfaceArea()
 *  - volumeSliceRatio()
 *  - isBaseOnCoordinatePlane()
 */
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

    /** Объём конуса */
    public volume(): number {
        return (Math.PI * this.radius * this.radius * this.height) / 3;
    }

    /** Площадь основания */
    public baseArea(): number {
        return Math.PI * this.radius * this.radius;
    }

    /** Полная площадь поверхности (боковая + основание) */
    public surfaceArea(): number {
        const slant = Math.sqrt(this.radius * this.radius + this.height * this.height);
        const lateralArea = Math.PI * this.radius * slant;
        const base = this.baseArea();
        return lateralArea + base;
    }

    /**
     * Отношение объёмов двух частей конуса,
     * если рассечь его плоскостью Z=0, Z=center.z или Z=center.z+height.
     *
     * Если плоскость НЕ пересекает конус — возвращаем null.
     * Если проходит строго по основанию — возвращаем 0.
     */
    public volumeSliceRatio(planeZ: number): number | null {
        const baseZ = this.center.z;
        const topZ = this.center.z + this.height;

        if (planeZ <= baseZ || planeZ >= topZ) {
            return null; // не пересекает тело конуса
        }

        // расстояние от вершины (top) до плоскости
        const cutHeight = topZ - planeZ;
        const h = this.height;

        // объём верхней меньше части (усечённый конус до вершины)
        const upperVolume = (Math.PI * this.radius * this.radius * cutHeight) / 3;

        // оставшаяся нижняя часть
        const lowerVolume = this.volume() - upperVolume;

        return lowerVolume / upperVolume;
    }

    /**
     * Проверка — лежит ли основание на одной из координатных плоскостей:
     * XY → center.z == 0
     * XZ → center.y == 0
     * YZ → center.x == 0
     */
    public isBaseOnCoordinatePlane(): boolean {
        return (
            this.center.z === 0 ||
            this.center.x === 0 ||
            this.center.y === 0
        );
    }

    /** Генерация случайной точки внутри конуса */
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
