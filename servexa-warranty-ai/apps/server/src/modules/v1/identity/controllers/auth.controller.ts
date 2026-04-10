import {
  type NextFunction,
  type Request,
  type Response,
} from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'

import { AuthService } from '../services/auth.service'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { currentUserQuerySchema, requestAuthLoginSchema } from '../validations'
import { SuccessResponse } from '@/utils/success-response'
import { AUTHORIZATION, REFRESH_TOKEN } from '@/core/constants/headers'
import { requireHeader } from '@/utils/require-header'
import { createOperationalError } from '@/middlewares/error-middleware'

class AuthController {
  errorHandler: ErrorHandler
  private authService: AuthService

  constructor() {
    this.errorHandler = ErrorHandler.getInstance()
    this.authService = new AuthService()
  }

  extractInfoFromToken = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Getting current user information', {
        ...getRequestInfo(req, 'AuthController.extractInfoFromToken'),
      })

      const userData = currentUserQuerySchema.parse(req.user)

      new SuccessResponse({
        message: 'Current user information',
        metadata: userData,
      }).send(res)
    })(req, res, next)
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Logging in user', {
        ...getRequestInfo(req, 'AuthController.login'),
      })

      const userAgent = req.headers['user-agent'] || 'unknown'
      const ipAddress = req.ip || '0.0.0.0'
      const payload = requestAuthLoginSchema.parse(req.body)

      const result = await this.authService.login(payload, userAgent, ipAddress)

      new SuccessResponse({
        message: 'Login successfully!',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  logout = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Logging out user', {
        ...getRequestInfo(req, 'AuthController.logout'),
      })

      const accessToken = requireHeader(req, AUTHORIZATION)
      const { id: userId, keyStoreId } = req.refresh

      if (!userId || !keyStoreId || !accessToken) {
        throw createOperationalError(
          'Authentication required',
          HTTP_RESPONSE_CODE.UNAUTHORIZED,
        )
      }

      const result = await this.authService.logout({
        userId,
        keyStoreId,
        accessToken,
      })

      new SuccessResponse({
        message: 'Logout successfully!',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Refreshing token', {
        ...getRequestInfo(req, 'AuthController.handleRefreshToken'),
      })

      const refreshToken = requireHeader(req, REFRESH_TOKEN)
      const result = await this.authService.handleRefreshToken({
        keyStoreId: req.refresh.keyStoreId,
        userId: req.refresh.id,
        email: req.refresh.email,
        refreshToken,
        userAgent: req.headers['user-agent'] || 'unknown',
        ipAddress: req.ip || '0.0.0.0',
      })

      new SuccessResponse({
        message: 'Refresh token successfully!',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}

export default new AuthController()