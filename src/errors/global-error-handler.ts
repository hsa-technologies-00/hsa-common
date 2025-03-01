import { Request, Response, NextFunction } from 'express';
import { MongoServerError } from 'mongodb';
import { logger } from '../logger';
import { BadRequestException } from './api-error';
import { getEnvVariable } from '../utils/env-variable';

interface ErrorWithStatus extends Error {
  httpStatusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
}

const handleDatabaseError = (error: MongoServerError) => {
  if (error.code === 11000) {
    const value = error.message.match(/dup key: \{ (.+?) \}/);
    const message = value
      ? `Duplicate field value: ${value[1]}. Please use another value!`
      : 'Duplicate field value found. Please use another value!';

    return new BadRequestException(message);
  }
};

const sendErrorDev = (err: ErrorWithStatus, req: Request, res: Response): void => {
  logger.error(err.message);

  res.status(err.httpStatusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err: ErrorWithStatus, req: Request, res: Response): void => {
  if (err.isOperational) {
    res.status(err.httpStatusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
    });
  } else {
    // Log unknown errors
    logger.error(err);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const globalErrorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction): void => {
  err.httpStatusCode = err.httpStatusCode || 500;
  err.status = err.status || 'error';

  if (err instanceof MongoServerError) {
    const dbError = handleDatabaseError(err);

    if (dbError) err = dbError;
  }

  if (getEnvVariable('NODE_ENV') === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err, message: err.message, name: err.name };

    sendErrorProd(error, req, res);
  }
};

export { globalErrorHandler };
