import { Shape } from "../shapes/shape";

/** Rectangle model — сущность прямоугольника (ось-ориентированный прямоугольник) */
export class RectangleModel extends Shape {
    public readonly x: number;
    public readonly y: number;
    public readonly width: number;
    public readonly height: number;

    constructor(x: number, y: number, width: number, height: number) {
        super({
            kind: "rectangle",
            dimension: "2D",
        });

        if (width <= 0 || height <= 0) {
            throw new Error("Rectangle: width and height must be positive numbers");
        }

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    /** Площадь прямоугольника */
    public area(): number {
        return this.width * this.height;
    }

    /** Периметр прямоугольника */
    public perimeter(): number {
        return 2 * (this.width + this.height);
    }

    /** Диагональ прямоугольника */
    public diagonal(): number {
        return Math.sqrt(this.width ** 2 + this.height ** 2);
    }

    /**
     * Касается ли прямоугольник хотя бы одной из осей (X или Y).
     * Учитываем, что прямоугольник ось-ориентирован: [x; x+width], [y; y+height].
     */
    public touchesAxis(): boolean {
        const xMin = this.x;
        const xMax = this.x + this.width;
        const yMin = this.y;
        const yMax = this.y + this.height;

        // Пересекает ось X, если диапазон по Y содержит 0
        const touchesX = yMin <= 0 && yMax >= 0;
        // Пересекает ось Y, если диапазон по X содержит 0
        const touchesY = xMin <= 0 && xMax >= 0;

        return touchesX || touchesY;
    }
}
