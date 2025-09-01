// Importing HTTP status codes (like 400, 404, 500) from a clean constants package
import HTTP_STATUS from 'http-status-codes';

/**
 * Interface describing the structure of an error response
 * (what the client will receive when an error occurs).
 */
export interface IErrorResponse {
  statusCode: number;     // HTTP status code (e.g., 400, 404, 500)
  message: string;        // Short explanation of the error
  status: string;         // 'error' or 'fail'
  seralizeErrors(): IError; // Method to serialize error details into IError
}

/**
 * Interface for the final formatted error that gets sent back to clients.
 * This is the "cleaned-up" version of the error object.
 */
export interface IError {
  statusCode: number;
  message: string;
  status: string;
}

/**
 * Abstract base class for all custom errors.
 * All your specific errors (e.g., NotFoundError, BadRequestError)
 * will extend this class.
 *
 * Why? → Centralized error handling & consistent response format.
 */
export abstract class CustomError extends Error {
  abstract statusCode: number; // Each error must define its HTTP status code
  abstract status: string;     // Each error must define its status ('error')

  constructor(message: string) {
    super(message);
  }

  /**
   * Standardized method to convert any custom error
   * into a JSON object that matches IError.
   * (This makes sure all errors follow the same format.)
   */
  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

// =====================
// 📌 Specific Error Types
// =====================

/**
 * Validation error when user input is invalid
 * (e.g., missing fields, wrong email format).
 */
export class JoinValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST; // 400
  status = 'error';

  constructor(public message: string) {
    super(message);
  }
}

/**
 * Generic bad request error (400).
 * Used when client sends invalid or malformed data.
 */
export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

/**
 * Not found error (404).
 * Used when a requested resource does not exist.
 */
export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

/**
 * Unauthorized error (401).
 * Used when a user tries to access a protected resource
 * without proper authentication.
 */
export class NotAuthorizeError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

/**
 * File too large error (413).
 * Used when file uploads exceed allowed size limits.
 */
export class FileToLargeError extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

/**
 * Server error (503).
 * Used when the server is unavailable or something goes wrong internally.
 */
export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}
