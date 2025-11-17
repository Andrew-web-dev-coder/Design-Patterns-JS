export class ReadParametersError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ReadParametersError";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ReadParametersError);
        }
    }
}
