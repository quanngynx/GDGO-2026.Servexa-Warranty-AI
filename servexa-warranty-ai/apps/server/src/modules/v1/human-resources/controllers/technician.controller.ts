import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { ITechnicianService } from '../interfaces/technician-service.interface'
import { TechnicianService } from '../services/technician.service'
import {
  createTechnicianSchema,
  findAllTechniciansSchema,
  findTechnicianByIdSchema,
  replaceTechnicianSchema,
  updateTechnicianSchema,
} from '../validations'

export class TechnicianController {
  errorHandler: ErrorHandler

  constructor(private readonly technicianService: ITechnicianService = new TechnicianService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching technicians', {
        ...getRequestInfo(req, 'TechnicianController.findAll'),
      })
      const query = findAllTechniciansSchema.parse(req.query)
      const result = await this.technicianService.findAll(query)
      new SuccessResponse({ message: 'Technicians fetched successfully', metadata: result }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching technician', {
        ...getRequestInfo(req, 'TechnicianController.findOneById'),
      })
      const { technicianProfileId } = findTechnicianByIdSchema.parse(req.params)
      const result = await this.technicianService.findOneById(technicianProfileId)
      new SuccessResponse({ message: 'Technician fetched successfully', metadata: result }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating technician', {
        ...getRequestInfo(req, 'TechnicianController.create'),
      })
      const body = createTechnicianSchema.parse(req.body)
      const result = await this.technicianService.create(body)
      new SuccessResponse({ message: 'Technician created successfully', status: 201, metadata: result }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing technician', {
        ...getRequestInfo(req, 'TechnicianController.replace'),
      })
      const { technicianProfileId } = findTechnicianByIdSchema.parse(req.params)
      const body = replaceTechnicianSchema.parse(req.body)
      const result = await this.technicianService.update(technicianProfileId, body)
      new SuccessResponse({ message: 'Technician updated successfully', metadata: result }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating technician', {
        ...getRequestInfo(req, 'TechnicianController.update'),
      })
      const { technicianProfileId } = findTechnicianByIdSchema.parse(req.params)
      const body = updateTechnicianSchema.parse(req.body)
      const result = await this.technicianService.update(technicianProfileId, body)
      new SuccessResponse({ message: 'Technician updated successfully', metadata: result }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting technician', {
        ...getRequestInfo(req, 'TechnicianController.delete'),
      })
      const { technicianProfileId } = findTechnicianByIdSchema.parse(req.params)
      const result = await this.technicianService.delete(technicianProfileId)
      new SuccessResponse({ message: 'Technician deleted successfully', metadata: result }).send(res)
    })(req, res, next)
  }
}
