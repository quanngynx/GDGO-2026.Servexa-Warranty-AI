import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { IAscCenterService } from '../interfaces/asc-center.interface'
import { AscCenterService } from '../services/asc-center.service'
import {
  createAscCenterSchema,
  findAllAscCentersSchema,
  findAscCenterByIdSchema,
  replaceAscCenterSchema,
  updateAscCenterSchema,
} from '../validations'

export class AscCenterController {
  errorHandler: ErrorHandler

  constructor(private readonly ascCenterService: IAscCenterService = new AscCenterService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching ASC centers', {
        ...getRequestInfo(req, 'AscCenterController.findAll'),
      })

      const query = findAllAscCentersSchema.parse(req.query)
      const result = await this.ascCenterService.findAll(query)

      new SuccessResponse({
        message: 'ASC centers fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching ASC center', {
        ...getRequestInfo(req, 'AscCenterController.findOneById'),
      })

      const { ascCenterId } = findAscCenterByIdSchema.parse(req.params)
      const result = await this.ascCenterService.findOneById(ascCenterId)

      new SuccessResponse({
        message: 'ASC center fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating ASC center', {
        ...getRequestInfo(req, 'AscCenterController.create'),
      })

      const body = createAscCenterSchema.parse(req.body)
      const result = await this.ascCenterService.create(body)

      new SuccessResponse({
        message: 'ASC center created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing ASC center', {
        ...getRequestInfo(req, 'AscCenterController.replace'),
      })

      const { ascCenterId } = findAscCenterByIdSchema.parse(req.params)
      const body = replaceAscCenterSchema.parse(req.body)
      const result = await this.ascCenterService.update(ascCenterId, body)

      new SuccessResponse({
        message: 'ASC center updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating ASC center', {
        ...getRequestInfo(req, 'AscCenterController.update'),
      })

      const { ascCenterId } = findAscCenterByIdSchema.parse(req.params)
      const body = updateAscCenterSchema.parse(req.body)
      const result = await this.ascCenterService.update(ascCenterId, body)

      new SuccessResponse({
        message: 'ASC center updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting ASC center', {
        ...getRequestInfo(req, 'AscCenterController.delete'),
      })

      const { ascCenterId } = findAscCenterByIdSchema.parse(req.params)
      const result = await this.ascCenterService.delete(ascCenterId)

      new SuccessResponse({
        message: 'ASC center deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}
