//import { NotAuthorizeError } from './error-handler';
import HTTP_STATUS from 'http-status-codes';

export interface IErrorResponse {
  statusCode: number;
  message: string;
  status: string;
  seralizeErrors(): IError;
}

export interface IError {
  statusCode: number;
  message: string;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;

  constructor(message: string) {
    super(message);
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

export class JoinValidationError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(public message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST;
  status = 'error';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizeError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}

export class FileToLargeError extends CustomError {
  statusCode = HTTP_STATUS.REQUEST_TOO_LONG;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}
