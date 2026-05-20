import { Router, type IRouter } from 'express'

import { authenticateMiddleware } from '@/middlewares'

import permissionController from '../controllers/permission.controller'

const permissionRoute: IRouter = Router()

permissionRoute.use(authenticateMiddleware)

permissionRoute.post('/check', permissionController.checkPermission)

export default permissionRoute
