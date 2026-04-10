import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { logger } from '@/core/logging/logging.config'
import { SuccessResponse } from '@/utils/success-response'

import {
  createUserSchema,
  findAllUsersSchema,
  findUserByIdSchema,
  updateUserSchema,
} from '../validations'
import { UserService } from '../services/user.service'

class UserController {
  errorHandler: ErrorHandler
  private userService: UserService

  constructor() {
    this.errorHandler = ErrorHandler.getInstance()
    this.userService = new UserService()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching users', {
        ...getRequestInfo(req, 'UserController.findAll'),
      })

      const query = findAllUsersSchema.parse(req.query)
      const result = await this.userService.findAll(query)

      new SuccessResponse({
        message: 'Users fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching user details', {
        ...getRequestInfo(req, 'UserController.findOneById'),
      })

      const { userId } = findUserByIdSchema.parse(req.params)
      const result = await this.userService.findOneById(userId)

      new SuccessResponse({
        message: 'User fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating user', {
        ...getRequestInfo(req, 'UserController.createUser'),
      })

      const body = createUserSchema.parse(req.body)
      const result = await this.userService.createUser(body)

      new SuccessResponse({
        message: 'User created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating user', {
        ...getRequestInfo(req, 'UserController.updateUser'),
      })

      const { userId } = findUserByIdSchema.parse(req.params)
      const body = updateUserSchema.parse(req.body)
      const result = await this.userService.updateUser(userId, body)

      new SuccessResponse({
        message: 'User updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Soft deleting user', {
        ...getRequestInfo(req, 'UserController.deleteUser'),
      })

      const { userId } = findUserByIdSchema.parse(req.params)
      const result = await this.userService.deleteUser(userId)

      new SuccessResponse({
        message: 'User deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  restoreUser = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Restoring user', {
        ...getRequestInfo(req, 'UserController.restoreUser'),
      })

      const { userId } = findUserByIdSchema.parse(req.params)
      const result = await this.userService.restoreUser(userId)

      new SuccessResponse({
        message: 'User restored successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}

export default new UserController()
