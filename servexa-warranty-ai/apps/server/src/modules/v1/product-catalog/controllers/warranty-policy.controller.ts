import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { IWarrantyPolicyService } from '../interfaces/warranty-policy-service.interface'
import { WarrantyPolicyService } from '../services/warranty-policy.service'
import {
  createWarrantyPolicySchema,
  findAllWarrantyPoliciesSchema,
  findWarrantyPolicyByIdSchema,
  replaceWarrantyPolicySchema,
  resolveWarrantyPolicySchema,
  updateWarrantyPolicySchema,
} from '../validations'

export class WarrantyPolicyController {
  errorHandler: ErrorHandler

  constructor(private readonly warrantyPolicyService: IWarrantyPolicyService = new WarrantyPolicyService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching warranty policies', {
        ...getRequestInfo(req, 'WarrantyPolicyController.findAll'),
      })

      const query = findAllWarrantyPoliciesSchema.parse(req.query)
      const result = await this.warrantyPolicyService.findAll(query)

      new SuccessResponse({
        message: 'Warranty policies fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching warranty policy', {
        ...getRequestInfo(req, 'WarrantyPolicyController.findOneById'),
      })

      const { warrantyPolicyId } = findWarrantyPolicyByIdSchema.parse(req.params)
      const result = await this.warrantyPolicyService.findOneById(warrantyPolicyId)

      new SuccessResponse({
        message: 'Warranty policy fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating warranty policy', {
        ...getRequestInfo(req, 'WarrantyPolicyController.create'),
      })

      const body = createWarrantyPolicySchema.parse(req.body)
      const result = await this.warrantyPolicyService.create(body)

      new SuccessResponse({
        message: 'Warranty policy created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing warranty policy', {
        ...getRequestInfo(req, 'WarrantyPolicyController.replace'),
      })

      const { warrantyPolicyId } = findWarrantyPolicyByIdSchema.parse(req.params)
      const body = replaceWarrantyPolicySchema.parse(req.body)
      const result = await this.warrantyPolicyService.update(warrantyPolicyId, body)

      new SuccessResponse({
        message: 'Warranty policy updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating warranty policy', {
        ...getRequestInfo(req, 'WarrantyPolicyController.update'),
      })

      const { warrantyPolicyId } = findWarrantyPolicyByIdSchema.parse(req.params)
      const body = updateWarrantyPolicySchema.parse(req.body)
      const result = await this.warrantyPolicyService.update(warrantyPolicyId, body)

      new SuccessResponse({
        message: 'Warranty policy updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting warranty policy', {
        ...getRequestInfo(req, 'WarrantyPolicyController.delete'),
      })

      const { warrantyPolicyId } = findWarrantyPolicyByIdSchema.parse(req.params)
      const result = await this.warrantyPolicyService.delete(warrantyPolicyId)

      new SuccessResponse({
        message: 'Warranty policy deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  resolve = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Resolving warranty policy', {
        ...getRequestInfo(req, 'WarrantyPolicyController.resolve'),
      })

      const query = resolveWarrantyPolicySchema.parse(req.query)
      const result = await this.warrantyPolicyService.resolve(query)

      new SuccessResponse({
        message: 'Warranty policy resolved successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}
