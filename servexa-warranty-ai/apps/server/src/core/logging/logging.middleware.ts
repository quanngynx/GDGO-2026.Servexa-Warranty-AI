import { NextFunction, Request, Response } from 'express';

import { logger } from './logging.config';

/**
 * Winston-based logging middleware for Express
 * Logs all HTTP requests with detailed information
 */
export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const { method, url, ip, headers } = req;

  // Log request start
  logger.http(`HTTP Request Started`, {
    method,
    url,
    ip: ip || req.socket.remoteAddress,
    userAgent: headers['user-agent'],
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || generateRequestId(),
  });

  // Override res.end to capture response using a bound original and typed wrapper to match overloads
  const originalEnd = res.end.bind(res) as Response['end'];
  const originalEnd1 = originalEnd as (cb?: () => void) => Response;
  const originalEnd2 = originalEnd as (chunk: unknown, cb?: () => void) => Response;
  const originalEnd3 = originalEnd as (chunk: unknown, encoding: BufferEncoding, cb?: () => void) => Response;

  function end(this: Response, cb?: () => void): Response;
  function end(this: Response, chunk: unknown, cb?: () => void): Response;
  function end(this: Response, chunk: unknown, encoding: BufferEncoding, cb?: () => void): Response;
  function end(this: Response, chunk?: unknown, encodingOrCb?: BufferEncoding | (() => void), cb?: () => void): Response {
    const executionTime = Date.now() - startTime;
    const { statusCode } = res;

    // Log response completion
    logger.http(`HTTP Request Completed`, {
      method,
      url,
      statusCode,
      executionTime: `${executionTime}ms`,
      ip: ip || req.socket.remoteAddress,
      userAgent: headers['user-agent'],
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || generateRequestId(),
    });

    // Call original end method according to overload used
    if (typeof chunk === 'undefined' && typeof encodingOrCb === 'function') {
      return originalEnd1(encodingOrCb);
    }
    if (typeof encodingOrCb === 'function') {
      return originalEnd2(chunk, encodingOrCb);
    }
    if (typeof chunk !== 'undefined' && typeof encodingOrCb === 'string') {
      return originalEnd3(chunk, encodingOrCb, cb);
    }
    return originalEnd1(cb);
  }

  (res).end = end as Response['end'];

  next();
}

/**
 * Error logging middleware
 * Should be placed after all other middleware
 */
export function errorLoggerMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { method, url, ip, headers } = req;

  logger.error(`HTTP Request Error`, {
    method,
    url,
    ip: ip || req.socket.remoteAddress,
    userAgent: headers['user-agent'],
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || generateRequestId(),
  });

  next(error);
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add request ID to headers if not present
 */
export function addRequestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.headers['x-request-id']) {
    req.headers['x-request-id'] = generateRequestId();
  }
  res.setHeader('x-request-id', req.headers['x-request-id']);
  next();
}

export default {
  loggerMiddleware,
  errorLoggerMiddleware,
  addRequestIdMiddleware,
};
