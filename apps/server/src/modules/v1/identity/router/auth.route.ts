import { Router, type IRouter } from 'express'

import authController from '../controllers/auth.controller'
import {
  authenticateMiddleware,
  refreshAuthenticateMiddleware,
} from '@/middlewares'

const authRoute: IRouter = Router()

/**
 * Login
 * @route POST /v1/identity/auth/login
 * @access Public
 * @returns {Promise<void>}
 */
authRoute.post('/login', authController.login)
/**
 * Logout
 * @route POST /v1/identity/auth/logout
 * @access Private
 * @returns {Promise<void>}
 */
authRoute.post('/logout', refreshAuthenticateMiddleware, authController.logout)
/**
 * Get current user information
 * @route GET /v1/identity/auth/me
 * @access Private
 * @returns {Promise<void>}
 */
authRoute.get('/me', authenticateMiddleware, authController.extractInfoFromToken)
/**
 * Refresh token
 * @route POST /v1/identity/auth/refresh
 * @access Private
 * @returns {Promise<void>}
 */
authRoute.post(
  '/refresh',
  refreshAuthenticateMiddleware,
  authController.handleRefreshToken,
)

export default authRoute