import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import logger from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import { PermissionCatalogService } from '../services/permission-catalog.service'
import {
  createPermissionSchema,
  findAllPermissionsSchema,
  findPermissionByIdSchema,
  updatePermissionSchema,
} from '../validations/permission'

export class PermissionCatalogController {
  errorHandler: ErrorHandler

  constructor(
    private readonly permissionCatalogService: PermissionCatalogService = new PermissionCatalogService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching permissions', {
        ...getRequestInfo(req, 'PermissionCatalogController.findAll'),
      })

      const query = findAllPermissionsSchema.parse(req.query)
      const result = await this.permissionCatalogService.findAll(query)

      new SuccessResponse({
        message: 'Permissions fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching permission', {
        ...getRequestInfo(req, 'PermissionCatalogController.findOneById'),
      })

      const { permissionId } = findPermissionByIdSchema.parse(req.params)
      const result = await this.permissionCatalogService.findOneById(permissionId)

      new SuccessResponse({
        message: 'Permission fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating permission', {
        ...getRequestInfo(req, 'PermissionCatalogController.create'),
      })

      const body = createPermissionSchema.parse(req.body)
      const result = await this.permissionCatalogService.create(body)

      new SuccessResponse({
        message: 'Permission created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating permission', {
        ...getRequestInfo(req, 'PermissionCatalogController.update'),
      })

      const { permissionId } = findPermissionByIdSchema.parse(req.params)
      const body = updatePermissionSchema.parse(req.body)
      const result = await this.permissionCatalogService.update(permissionId, body)

      new SuccessResponse({
        message: 'Permission updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting permission', {
        ...getRequestInfo(req, 'PermissionCatalogController.delete'),
      })

      const { permissionId } = findPermissionByIdSchema.parse(req.params)
      const result = await this.permissionCatalogService.delete(permissionId)

      new SuccessResponse({
        message: 'Permission deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}

export default new PermissionCatalogController()
