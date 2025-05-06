export class AppError extends Error {
  statusCode: number;
  errorCode?: string;
  details?: string;

  constructor(message: string, statusCode: number = 500, errorCode?: string, details?: string) {
    super(message);
    this.name = this.constructor.name; // Set the error name to the class name
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    // Capture stack trace for Node.js environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
