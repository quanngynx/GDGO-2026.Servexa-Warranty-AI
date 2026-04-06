import util from 'node:util';

import type { ErrorRequestHandler,NextFunction, Request, RequestHandler, Response } from 'express'
import { Server } from 'http'

import { ErrorType } from '@/core/constants/common.constant'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { logger } from '@/core/logging/logging.config'
import { parseStackTrace } from '@/utils/parse-stack-trace';
import { BusinessException, SystemException } from './exception.helper'

/**
 * Enhanced error handler for uncaught exceptions and Express error middleware
 */
export class ErrorHandler {
  private static instance: ErrorHandler
  private server: Server | null = null
  private isShuttingDown = false

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * Initialize process-level error handlers and shutdown signals
   */
  public initialize(server?: Server): void {
    this.server = server || null

    process.on('uncaughtException', (error: Error) => this.handleUncaughtException(error))
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => this.handleUnhandledRejection(reason, promise))
    process.on('SIGTERM', () => this.handleSigTerm())
    process.on('SIGINT', () => this.handleSigInt())
    process.on('warning', (warning: Error) => this.handleWarning(warning))
  }

  /** Handle uncaught exceptions */
  private handleUncaughtException(error: Error): void {
    logger.error('Uncaught Exception', {
      error: {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? parseStackTrace(error.stack) : error.stack,
        errorType: ErrorType.SYSTEM,
        timestamp: new Date().toISOString()
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform
      }
    })

    this.gracefulShutdown('uncaughtException')
  }

  /** Handle unhandled promise rejections */
  private handleUnhandledRejection(reason: unknown, promise: Promise<unknown>): void {
    const errorMessage = () => {
      if (reason instanceof Error) return `${reason.name}: ${reason.message}`
      if (typeof reason === 'symbol') return reason.description ? `Symbol(${reason.description})` : 'Symbol()'
      if (typeof reason === 'function') return `[function ${reason.name || 'anonymous'}]`
      return util.inspect(reason, { depth: null, compact: false })
    }

    logger.error('Unhandled Promise Rejection', {
      error: {
        message: errorMessage(),
        reason: reason instanceof Error
          ? { name: reason.name, message: reason.message, stack: process.env.NODE_ENV === "development" ? parseStackTrace(reason.stack) : reason.stack }
          : reason,
        promise: promise,
        errorType: ErrorType.SYSTEM,
        timestamp: new Date().toISOString()
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        memory: process.memoryUsage()
      }
    })

    if (process.env.NODE_ENV === 'development') {
      this.gracefulShutdown('unhandledRejection')
    }
  }

  /** Handle SIGTERM */
  private handleSigTerm(): void {
    logger.info('SIGTERM received, starting graceful shutdown')
    this.gracefulShutdown('SIGTERM')
  }

  /** Handle SIGINT */
  private handleSigInt(): void {
    logger.info('SIGINT received, starting graceful shutdown')
    this.gracefulShutdown('SIGINT')
  }

  /** Handle process warnings */
  private handleWarning(warning: Error): void {
    logger.warn('Process Warning', {
      warning: {
        name: warning.name,
        message: warning.message,
        stack: process.env.NODE_ENV === "development" ? parseStackTrace(warning.stack) : warning.stack,
        timestamp: new Date().toISOString()
      },
      process: {
        pid: process.pid,
        uptime: process.uptime()
      }
    })
  }

  /** Graceful shutdown process */
  private gracefulShutdown(signal: string): void {
    if (this.isShuttingDown) {
      logger.warn('Shutdown already in progress, forcing exit')
      process.exit(1)
    }

    this.isShuttingDown = true
    logger.info(`Graceful shutdown initiated by ${signal}`)

    const shutdownTimeout = setTimeout(() => {
      logger.error('Forced shutdown due to timeout')
      process.exit(1)
    }, 10000)

    if (this.server) {
      this.server.close((err) => {
        clearTimeout(shutdownTimeout)

        if (err) {
          logger.error('Error during server shutdown', { error: err })
          process.exit(1)
        }

        logger.info('Server closed successfully')
        process.exit(0)
      })
    } else {
      clearTimeout(shutdownTimeout)
      logger.info('No server to close, exiting')
      process.exit(0)
    }
  }

  /** Create a request ID middleware */
  public static requestIdMiddleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      const requestId = (req.headers['x-request-id'] as string) ||
                       (req.headers['x-correlation-id'] as string) ||
                       `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      ;req.requestId = requestId
      res.setHeader('X-Request-ID', requestId)
      next()
    }
  }

  /** Create an async error wrapper for route handlers */
  public asyncHandler(fn: RequestHandler) {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(fn(req, res, next)).catch(next)
    }
  }

  /** Express error handling middleware that formats Business/System exceptions */
  public static expressErrorHandler(): ErrorRequestHandler {
    return (
      err: unknown,
      req: Request,
      res: Response & { locals: { isApiNotError?: boolean } },
      next: NextFunction
    ) => {
      const isApiNotError: boolean = res.locals.isApiNotError ?? false
      if (isApiNotError) {
        return next(err)
      }

      const unknownError = new SystemException('Unknown error')
      try {
        if (!err) {
          return next()
        }

        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('Content-Type', 'application/json; charset=utf-8')

        if (err instanceof SystemException || err instanceof BusinessException) {
          const error = err.toObject()
          return res.status(Number(error.statusCode)).json(error)
        }

        if (err instanceof Error) {
          logger.error('[errorHandler]: Unexpected System Error', { error: err })
          const error = new SystemException(err.message, err).toObject()
          return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json(error)
        }

        logger.error('[errorHandler]: Unknown error', { error: util.inspect(err, { depth: null, compact: false }) })
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json(unknownError.toObject())
      } catch (error: unknown) {
        const serialized = error instanceof Error
          ? { name: error.name, message: error.message, stack: process.env.NODE_ENV === "development" ? parseStackTrace(error.stack) : error.stack }
          : util.inspect(error, { depth: null, compact: false })
        logger.error('[errorHandler]: Error when handling error', { error: serialized })
        return res.status(HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR).json(unknownError.toObject())
      }
    }
  }
}

// Singleton instance (for process-level handlers)
export const errorHandler = ErrorHandler.getInstance()
