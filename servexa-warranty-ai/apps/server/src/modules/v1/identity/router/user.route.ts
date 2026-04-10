import { Router, type IRouter } from 'express'

import { authenticateMiddleware, requireRoles } from '@/middlewares'
import { Roles } from '@/enums/roles'

import userController from '../controllers/user.controller'

const userRoute: IRouter = Router()

userRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]))

userRoute.get('/', userController.findAll)
userRoute.get('/:userId', userController.findOneById)
userRoute.post('/', userController.createUser)
userRoute.patch('/:userId', userController.updateUser)
userRoute.delete('/:userId', userController.deleteUser)
userRoute.patch('/:userId/restore', userController.restoreUser)

export default userRoute
