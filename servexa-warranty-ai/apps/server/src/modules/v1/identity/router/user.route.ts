import { Router, type IRouter } from 'express'

import { authenticateMiddleware } from '@/middlewares'

import userController from '../controllers/user.controller'

const userRoute: IRouter = Router()

userRoute.use(authenticateMiddleware)

userRoute.get('/', userController.findAll)
userRoute.get('/:userId', userController.findOneById)
userRoute.post('/', userController.createUser)
userRoute.patch('/:userId', userController.updateUser)
userRoute.delete('/:userId', userController.deleteUser)
userRoute.patch('/:userId/restore', userController.restoreUser)

export default userRoute
