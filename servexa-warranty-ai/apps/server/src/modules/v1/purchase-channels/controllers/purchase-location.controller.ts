import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { IPurchaseLocationService } from '../interfaces/purchase-location-service.interface'
import { PurchaseLocationService } from '../services/purchase-location.service'
import {
  createPurchaseLocationSchema,
  findAllPurchaseLocationsSchema,
  findPurchaseLocationByIdSchema,
  replacePurchaseLocationSchema,
  updatePurchaseLocationSchema,
} from '../validations'

export class PurchaseLocationController {
  private readonly errorHandler: ErrorHandler

  constructor(private readonly purchaseLocationService: IPurchaseLocationService = new PurchaseLocationService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching purchase locations', {
        ...getRequestInfo(req, 'PurchaseLocationController.findAll'),
      })
      const query = findAllPurchaseLocationsSchema.parse(req.query)
      const result = await this.purchaseLocationService.findAll(query)
      new SuccessResponse({
        message: 'Purchase locations fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching purchase location', {
        ...getRequestInfo(req, 'PurchaseLocationController.findOneById'),
      })
      const { locationId } = findPurchaseLocationByIdSchema.parse(req.params)
      const result = await this.purchaseLocationService.findOneById(locationId)
      new SuccessResponse({
        message: 'Purchase location fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating purchase location', {
        ...getRequestInfo(req, 'PurchaseLocationController.create'),
      })
      const body = createPurchaseLocationSchema.parse(req.body)
      const result = await this.purchaseLocationService.create(body, req.user.id)
      new SuccessResponse({
        message: 'Purchase location created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing purchase location', {
        ...getRequestInfo(req, 'PurchaseLocationController.replace'),
      })
      const { locationId } = findPurchaseLocationByIdSchema.parse(req.params)
      const body = replacePurchaseLocationSchema.parse(req.body)
      const result = await this.purchaseLocationService.update(locationId, body, req.user.id)
      new SuccessResponse({
        message: 'Purchase location replaced successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating purchase location', {
        ...getRequestInfo(req, 'PurchaseLocationController.update'),
      })
      const { locationId } = findPurchaseLocationByIdSchema.parse(req.params)
      const body = updatePurchaseLocationSchema.parse(req.body)
      const result = await this.purchaseLocationService.update(locationId, body, req.user.id)
      new SuccessResponse({
        message: 'Purchase location updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting purchase location', {
        ...getRequestInfo(req, 'PurchaseLocationController.delete'),
      })
      const { locationId } = findPurchaseLocationByIdSchema.parse(req.params)
      const result = await this.purchaseLocationService.delete(locationId, req.user.id)
      new SuccessResponse({
        message: 'Purchase location deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}
