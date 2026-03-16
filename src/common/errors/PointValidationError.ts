export class PointValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PointValidationError";
  }
}