import { Router, type IRouter } from 'express'

import { authenticateMiddleware } from '@/middlewares'

import userController from '../controllers/user.controller'

const userRoute: IRouter = Router()

userRoute.use(authenticateMiddleware)

/**
 * Get all users
 * @route GET /v1/identity/users
 * @access Private
 * @returns {Promise<void>}
 */
userRoute.get('/', userController.findAll)
/**
 * Get a user by ID
 * @route GET /v1/identity/users/:userId
 * @access Private
 * @returns {Promise<void>}
 */
userRoute.get('/:userId', userController.findOneById)
/**
 * Create a user
 * @route POST /v1/identity/users
 * @access Private
 * @returns {Promise<void>}
 */
userRoute.post('/', userController.createUser)
/**
 * Update a user
 * @route PATCH /v1/identity/users/:userId
 * @access Private
 * @returns {Promise<void>}
 */
userRoute.patch('/:userId', userController.updateUser)
/**
 * Delete a user
 * @route DELETE /v1/identity/users/:userId
 * @access Private
 * @returns {Promise<void>}
 */
userRoute.delete('/:userId', userController.deleteUser)
/**
 * Restore a user
 * @route PATCH /v1/identity/users/:userId/restore
 * @access Private
 * @returns {Promise<void>}
 */
userRoute.patch('/:userId/restore', userController.restoreUser)

export default userRoute
