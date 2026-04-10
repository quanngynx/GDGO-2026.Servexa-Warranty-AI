import type { NextFunction,Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid'

/**
 * Request context middleware that adds request tracking and timing
 */
export const requestContextMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  // Generate or use existing request ID
  req.requestId = req.headers['x-request-id'] as string ||
                          req.headers['x-correlation-id'] as string ||
                          uuidv4()

  // Set start time for performance tracking
  req.startTime = Date.now()

  // Set response headers
  ;res.setHeader('X-Request-ID', req.requestId)
  ;res.setHeader('X-Response-Time', '0ms')

  // Override res.end to calculate response time
  const originalEnd = res.end.bind(res) as Response['end']
  ;res.end = function(chunk?: unknown, encoding?: unknown, cb?: () => void) {
    const responseTime = Date.now() - req.startTime
    ;res.setHeader('X-Response-Time', `${responseTime}ms`)

    // Handle different overloads of res.end
    if (typeof encoding === 'function') {
      return originalEnd(chunk, encoding as () => void)
    } else if (typeof cb === 'function' && typeof encoding === 'string') {
      return originalEnd(chunk, encoding as BufferEncoding, cb)
    } else if (typeof encoding === 'string') {
      return originalEnd(chunk, encoding as BufferEncoding)
    } else {
      return originalEnd(chunk)
    }
  }

  next()
}

/**
 * User context middleware that extracts user information from JWT
 */
export const userContextMiddleware = (req: Request, res: Response, next: NextFunction): void => {

  // This would typically extract user info from JWT token
  // For now, we'll check if user info is already available from auth middleware
  if (!req.user && req.headers.authorization) {
    // In a real implementation, you would decode the JWT here
    // and set req.user with the decoded information
    try {
      // Placeholder for JWT decoding logic
      // const token = req.headers.authorization.replace('Bearer ', '')
      // const decoded = jwt.verify(token, process.env.JWT_SECRET)
      // req.user = decoded.user
    } catch {
      // Token is invalid, but we don't throw here
      // Let the auth middleware handle authentication
    }
  }

  next()
}

/**
 * Logging middleware that logs request/response information
 */
export const requestLoggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const method = req.method
  const url = req.url
  const ip = req.ip
  const headers = req.headers
  const userAgent = headers['user-agent'] || 'unknown'
  const userId = req.user?.id ?? 'anonymous'

  // Log request
  console.log(`[${req.requestId}] ${method} ${url} - ${ip} - ${userAgent} - User: ${userId}`)

  // Override res.end to log response
  const originalEnd = res.end.bind(res) as Response['end']
  ;res.end = function(chunk?: unknown, encoding?: unknown, cb?: () => void) {
    const responseTime = Date.now() - req.startTime
    const statusCode = res.statusCode

    // Log response
    console.log(`[${req.requestId}] ${method} ${url} - ${statusCode} - ${responseTime}ms`)

    // Handle different overloads of res.end
    if (typeof encoding === 'function') {
      return originalEnd(chunk, encoding as unknown as () => void)
    } else if (typeof cb === 'function' && typeof encoding === 'string') {
      return originalEnd(chunk, encoding as BufferEncoding, cb)
    } else if (typeof encoding === 'string') {
      return originalEnd(chunk, encoding as BufferEncoding)
    } else {
      return originalEnd(chunk)
    }
  }

  next()
}
