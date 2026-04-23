import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { ITotalWarehouseService } from '../interfaces/total-warehouse.interface'
import { TotalWarehouseService } from '../services/total-warehouse.service'
import {
  createTotalWarehouseSchema,
  findAllTotalWarehousesSchema,
  findTotalWarehouseByIdSchema,
  replaceTotalWarehouseSchema,
  updateTotalWarehouseSchema,
} from '../validations'

export class TotalWarehouseController {
  errorHandler: ErrorHandler

  constructor(private readonly totalWarehouseService: ITotalWarehouseService = new TotalWarehouseService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching total warehouses', {
        ...getRequestInfo(req, 'TotalWarehouseController.findAll'),
      })

      const query = findAllTotalWarehousesSchema.parse(req.query)
      const result = await this.totalWarehouseService.findAll(query)

      new SuccessResponse({
        message: 'Total warehouses fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching total warehouse', {
        ...getRequestInfo(req, 'TotalWarehouseController.findOneById'),
      })

      const { totalWarehouseId } = findTotalWarehouseByIdSchema.parse(req.params)
      const result = await this.totalWarehouseService.findOneById(totalWarehouseId)

      new SuccessResponse({
        message: 'Total warehouse fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating total warehouse', {
        ...getRequestInfo(req, 'TotalWarehouseController.create'),
      })

      const body = createTotalWarehouseSchema.parse(req.body)
      const result = await this.totalWarehouseService.create(body, req.user.email)

      new SuccessResponse({
        message: 'Total warehouse created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing total warehouse', {
        ...getRequestInfo(req, 'TotalWarehouseController.replace'),
      })

      const { totalWarehouseId } = findTotalWarehouseByIdSchema.parse(req.params)
      const body = replaceTotalWarehouseSchema.parse(req.body)
      const result = await this.totalWarehouseService.update(totalWarehouseId, body, req.user.email)

      new SuccessResponse({
        message: 'Total warehouse updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating total warehouse', {
        ...getRequestInfo(req, 'TotalWarehouseController.update'),
      })

      const { totalWarehouseId } = findTotalWarehouseByIdSchema.parse(req.params)
      const body = updateTotalWarehouseSchema.parse(req.body)
      const result = await this.totalWarehouseService.update(totalWarehouseId, body, req.user.email)

      new SuccessResponse({
        message: 'Total warehouse updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting total warehouse', {
        ...getRequestInfo(req, 'TotalWarehouseController.delete'),
      })

      const { totalWarehouseId } = findTotalWarehouseByIdSchema.parse(req.params)
      const result = await this.totalWarehouseService.delete(totalWarehouseId)

      new SuccessResponse({
        message: 'Total warehouse deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}
