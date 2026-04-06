import type { Request, Response, NextFunction } from "express"
import { logger } from "@/core/logging/logging.config"
import { HTTP_RESPONSE_CODE } from "@/core/constants/http.constant"
import { ErrorType } from "@/core/constants/common.constant"
import { parseStackTrace } from "@/utils/parse-stack-trace"

// Enhanced error types
export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
  errorType?: ErrorType
  timestamp?: string
  requestId?: string
  userId?: string
  metadata?: Record<string, unknown>
}

// Export individual values for use in other files
export const { OPERATIONAL, PROGRAMMER, SYSTEM, NETWORK, SECURITY } = ErrorType

// Enhanced error classes
export class OperationalError extends Error implements AppError {
  public readonly statusCode: number
  public readonly isOperational = true
  public readonly errorType = ErrorType.OPERATIONAL
  public readonly timestamp: string
  public readonly requestId?: string
  public readonly userId?: string
  public readonly metadata?: Record<string, unknown>

  constructor(
    message: string,
    statusCode = HTTP_RESPONSE_CODE.BAD_REQUEST,
    requestId?: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ) {
    super(message)
    this.statusCode = statusCode
    this.timestamp = new Date().toISOString()
    this.requestId = requestId
    this.userId = userId
    this.metadata = metadata
  }
}

export class ProgrammerError extends Error implements AppError {
  public readonly statusCode = HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR
  public readonly isOperational = false
  public readonly errorType = ErrorType.PROGRAMMER
  public readonly timestamp: string
  public readonly requestId?: string
  public readonly userId?: string
  public readonly metadata?: Record<string, unknown>

  constructor(
    message: string,
    requestId?: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ) {
    super(message)
    this.timestamp = new Date().toISOString()
    this.requestId = requestId
    this.userId = userId
    this.metadata = metadata
  }
}

export class SystemError extends Error implements AppError {
  public readonly statusCode: number
  public readonly isOperational = false
  public readonly errorType = ErrorType.SYSTEM
  public readonly timestamp: string
  public readonly requestId?: string
  public readonly userId?: string
  public readonly metadata?: Record<string, unknown>

  constructor(
    message: string,
    statusCode = HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
    requestId?: string,
    userId?: string,
    metadata?: Record<string, unknown>
  ) {
    super(message)
    this.statusCode = statusCode
    this.timestamp = new Date().toISOString()
    this.requestId = requestId
    this.userId = userId
    this.metadata = metadata
  }
}

// Enhanced error logging
const logError = (error: AppError, req: Request) => {
  const logData = {
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? parseStackTrace(error.stack) : error.stack,
      statusCode: error.statusCode,
      errorType: error.errorType,
      isOperational: error.isOperational,
      timestamp: error.timestamp || new Date().toISOString()
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip || req.socket?.remoteAddress,
      userAgent: req.get('User-Agent'),
      requestId: error.requestId || req.headers['x-request-id'] || 'unknown',
      userId: error.userId || (req as Request & { user?: { id: string } }).user?.id || 'anonymous'
    },
    metadata: error.metadata || {}
  }

  // Log based on error type and operational status
  if (error.isOperational) {
    logger.warn('Operational Error', logData)
  } else {
    logger.error('System/Programmer Error', logData)
  }
}

// Main error handler
export const errorHandler = (error: AppError, req: Request, res: Response, next: NextFunction) => {
  // Ensure error has required properties
  if (!error.statusCode) {
    error.statusCode = HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR
  }
  if (!error.errorType) {
    error.errorType = error.isOperational ? ErrorType.OPERATIONAL : ErrorType.PROGRAMMER
  }
  if (!error.timestamp) {
    error.timestamp = new Date().toISOString()
  }

  // Log the error
  logError(error, req)

  // Prepare response
  const status = "error"
  const statusCode = error.statusCode
  const message = error.message || "Internal Server Error"

  // Build response object
  const response: Record<string, unknown> = {
    status,
    message,
    timestamp: error.timestamp,
    requestId: error.requestId || req.headers['x-request-id'] || 'unknown'
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = parseStackTrace(error.stack)
    response.errorType = error.errorType
    response.metadata = error.metadata
  }

  // Add error code for operational errors
  if (error.isOperational && error.metadata?.code) {
    response.code = error.metadata.code
  }

  res.status(statusCode).json(response)
}

// Factory functions for creating errors
export const createOperationalError = (
  message: string,
  statusCode = HTTP_RESPONSE_CODE.BAD_REQUEST,
  requestId?: string,
  userId?: string,
  metadata?: Record<string, unknown>
): OperationalError => {
  return new OperationalError(message, statusCode, requestId, userId, metadata)
}

export const createProgrammerError = (
  message: string,
  requestId?: string,
  userId?: string,
  metadata?: Record<string, unknown>
): ProgrammerError => {
  return new ProgrammerError(message, requestId, userId, metadata)
}

export const createSystemError = (
  message: string,
  statusCode = HTTP_RESPONSE_CODE.INTERNAL_SERVER_ERROR,
  requestId?: string,
  userId?: string,
  metadata?: Record<string, unknown>
): SystemError => {
  return new SystemError(message, statusCode, requestId, userId, metadata)
}

// Legacy function for backward compatibility
export const createError = (message: string, statusCode = 500): AppError => {
  const error: AppError = new Error(message)
  error.statusCode = statusCode
  error.isOperational = true
  error.errorType = ErrorType.OPERATIONAL
  error.timestamp = new Date().toISOString()
  return error
}
