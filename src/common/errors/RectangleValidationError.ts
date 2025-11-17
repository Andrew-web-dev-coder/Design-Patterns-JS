export class RectangleValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "RectangleValidationError";
    }
}
