export class ConeValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConeValidationError";
    }
}
