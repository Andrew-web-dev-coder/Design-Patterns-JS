export class ShapeValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ShapeValidationError";
    }
}
