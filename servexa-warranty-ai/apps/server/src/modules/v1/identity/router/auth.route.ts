import { Router, type IRouter } from 'express'

import authController from '../controllers/auth.controller'
import {
  authenticateMiddleware,
  refreshAuthenticateMiddleware,
} from '@/middlewares'

const authRoute: IRouter = Router()

authRoute.post('/login', authController.login)
authRoute.post('/logout', refreshAuthenticateMiddleware, authController.logout)
authRoute.get('/me', authenticateMiddleware, authController.extractInfoFromToken)
authRoute.post(
  '/refresh',
  refreshAuthenticateMiddleware,
  authController.handleRefreshToken,
)

export default authRoute