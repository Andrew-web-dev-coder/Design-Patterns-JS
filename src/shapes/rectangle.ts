import { Point2D } from "../geometry/point2D";

export class Rectangle {
    public readonly a: Point2D;
    public readonly b: Point2D;
    public readonly c: Point2D;
    public readonly d: Point2D;

    constructor(a: Point2D, b: Point2D, c: Point2D, d: Point2D) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;

        if (!this.isRectangle()) {
            throw new Error("Provided points do not form a valid rectangle");
        }
    }

    
    private vec(p1: Point2D, p2: Point2D) {
        return { x: p2.x - p1.x, y: p2.y - p1.y };
    }

    
    private dot(v1: { x: number; y: number }, v2: { x: number; y: number }) {
        return v1.x * v2.x + v1.y * v2.y;
    }

   
    private len(v: { x: number; y: number }) {
        return Math.sqrt(v.x * v.x + v.y * v.y);
    }

    
    private isRectangle(): boolean {
        const AB = this.vec(this.a, this.b);
        const BC = this.vec(this.b, this.c);
        const CD = this.vec(this.c, this.d);
        const DA = this.vec(this.d, this.a);

        const isRight =
            Math.abs(this.dot(AB, BC)) < 1e-9 &&
            Math.abs(this.dot(BC, CD)) < 1e-9 &&
            Math.abs(this.dot(CD, DA)) < 1e-9 &&
            Math.abs(this.dot(DA, AB)) < 1e-9;

        const lengths = [
            this.len(AB),
            this.len(BC),
            this.len(CD),
            this.len(DA),
        ];

        
        const parallelOK =
            Math.abs(lengths[0] - lengths[2]) < 1e-9 &&
            Math.abs(lengths[1] - lengths[3]) < 1e-9;

        return isRight && parallelOK;
    }

   
    public width(): number {
        return this.a.distanceTo(this.b);
    }

    public height(): number {
        return this.b.distanceTo(this.c);
    }

 
    public area(): number {
        return this.width() * this.height();
    }

    
    public perimeter(): number {
        return 2 * (this.width() + this.height());
    }

    
    public touchesAxis(): boolean {
        const points = [this.a, this.b, this.c, this.d];
        return points.some(p => p.x === 0 || p.y === 0);
    }

   
    public isConvex(): boolean {
        return true; 
    }

    
    public isSquare(): boolean {
        const w = this.width();
        const h = this.height();
        return Math.abs(w - h) < 1e-9;
    }

   
    public isRhombus(): boolean {
        
        const AB = this.a.distanceTo(this.b);
        const BC = this.b.distanceTo(this.c);
        const CD = this.c.distanceTo(this.d);
        const DA = this.d.distanceTo(this.a);

        return (
            Math.abs(AB - BC) < 1e-9 &&
            Math.abs(BC - CD) < 1e-9 &&
            Math.abs(CD - DA) < 1e-9
        );
    }

 
    public isTrapezoid(): boolean {
        return true;
    }
}
