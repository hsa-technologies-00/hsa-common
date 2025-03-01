import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { TooManyRequestsException } from '../errors/api-error';
import { getEnvVariable, parseEnvVariableInt } from '../utils/env-variable';

// Retrieve and validate environment variables
const RATE_LIMIT_WINDOW_MS = parseEnvVariableInt(getEnvVariable('RATE_LIMIT_WINDOW_MS'));
const RATE_LIMIT_MAX = parseEnvVariableInt(getEnvVariable('RATE_LIMIT_MAX'));

// Global rate limit middleware
const globalRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS, // Time window in milliseconds
  max: RATE_LIMIT_MAX, // Maximum number of requests
  message: 'Too many requests from this IP, please try again later.',
  handler: (req: Request, res: Response, next: NextFunction) => {
    next(new TooManyRequestsException());
  },
});

export { globalRateLimiter };
