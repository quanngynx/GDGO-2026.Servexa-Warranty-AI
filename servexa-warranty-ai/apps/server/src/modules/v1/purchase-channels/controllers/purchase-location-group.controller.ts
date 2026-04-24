import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { IPurchaseLocationGroupService } from '../interfaces/purchase-location-group-service.interface'
import { PurchaseLocationGroupService } from '../services/purchase-location-group.service'
import {
  createPurchaseLocationGroupSchema,
  findAllPurchaseLocationGroupsSchema,
  findPurchaseLocationGroupByIdSchema,
  replacePurchaseLocationGroupSchema,
  updatePurchaseLocationGroupSchema,
} from '../validations'

export class PurchaseLocationGroupController {
  private readonly errorHandler: ErrorHandler

  constructor(private readonly purchaseLocationGroupService: IPurchaseLocationGroupService = new PurchaseLocationGroupService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching purchase location groups', {
        ...getRequestInfo(req, 'PurchaseLocationGroupController.findAll'),
      })
      const query = findAllPurchaseLocationGroupsSchema.parse(req.query)
      const result = await this.purchaseLocationGroupService.findAll(query)
      new SuccessResponse({
        message: 'Purchase location groups fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching purchase location group', {
        ...getRequestInfo(req, 'PurchaseLocationGroupController.findOneById'),
      })
      const { groupId } = findPurchaseLocationGroupByIdSchema.parse(req.params)
      const result = await this.purchaseLocationGroupService.findOneById(groupId)
      new SuccessResponse({
        message: 'Purchase location group fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating purchase location group', {
        ...getRequestInfo(req, 'PurchaseLocationGroupController.create'),
      })
      const body = createPurchaseLocationGroupSchema.parse(req.body)
      const result = await this.purchaseLocationGroupService.create(body, req.user.id)
      new SuccessResponse({
        message: 'Purchase location group created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing purchase location group', {
        ...getRequestInfo(req, 'PurchaseLocationGroupController.replace'),
      })
      const { groupId } = findPurchaseLocationGroupByIdSchema.parse(req.params)
      const body = replacePurchaseLocationGroupSchema.parse(req.body)
      const result = await this.purchaseLocationGroupService.update(groupId, body, req.user.id)
      new SuccessResponse({
        message: 'Purchase location group replaced successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating purchase location group', {
        ...getRequestInfo(req, 'PurchaseLocationGroupController.update'),
      })
      const { groupId } = findPurchaseLocationGroupByIdSchema.parse(req.params)
      const body = updatePurchaseLocationGroupSchema.parse(req.body)
      const result = await this.purchaseLocationGroupService.update(groupId, body, req.user.id)
      new SuccessResponse({
        message: 'Purchase location group updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting purchase location group', {
        ...getRequestInfo(req, 'PurchaseLocationGroupController.delete'),
      })
      const { groupId } = findPurchaseLocationGroupByIdSchema.parse(req.params)
      const result = await this.purchaseLocationGroupService.delete(groupId, req.user.id)
      new SuccessResponse({
        message: 'Purchase location group deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}
