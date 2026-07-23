import type { NextFunction, Request, Response } from 'express'

import { allowedMimes } from '@/core/constants/file.constant'
import { HTTP_RESPONSE_CODE } from '@/core/constants/http.constant'
import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { createOperationalError } from '@/middlewares/error-middleware'
import { SuccessResponse } from '@/utils/success-response'

import type { IModelExcelService } from '../interfaces/model-excel-service.interface'
import type { IModelService } from '../interfaces/model-service.interface'
import { ModelExcelService } from '../services/model-excel.service'
import { ModelService } from '../services/model.service'
import {
  createModelSchema,
  findAllModelsSchema,
  findModelByIdSchema,
  replaceModelSchema,
  updateModelSchema,
} from '../validations'

const MODELS_EXPORT_FILENAME = 'models.xlsx'
const EXCEL_MIME = allowedMimes[7] ?? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

export class ModelController {
  errorHandler: ErrorHandler

  constructor(
    private readonly modelService: IModelService = new ModelService(),
    private readonly excelService: IModelExcelService = new ModelExcelService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching models', {
        ...getRequestInfo(req, 'ModelController.findAll'),
      })

      const query = findAllModelsSchema.parse(req.query)
      const result = await this.modelService.findAll(query)

      new SuccessResponse({
        message: 'Models fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching model', {
        ...getRequestInfo(req, 'ModelController.findOneById'),
      })

      const { modelId } = findModelByIdSchema.parse(req.params)
      const result = await this.modelService.findOneById(modelId)

      new SuccessResponse({
        message: 'Model fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating model', {
        ...getRequestInfo(req, 'ModelController.create'),
      })

      const body = createModelSchema.parse(req.body)
      const result = await this.modelService.create(body)

      new SuccessResponse({
        message: 'Model created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing model', {
        ...getRequestInfo(req, 'ModelController.replace'),
      })

      const { modelId } = findModelByIdSchema.parse(req.params)
      const body = replaceModelSchema.parse(req.body)
      const result = await this.modelService.update(modelId, body)

      new SuccessResponse({
        message: 'Model updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating model', {
        ...getRequestInfo(req, 'ModelController.update'),
      })

      const { modelId } = findModelByIdSchema.parse(req.params)
      const body = updateModelSchema.parse(req.body)
      const result = await this.modelService.update(modelId, body)

      new SuccessResponse({
        message: 'Model updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Soft deleting model', {
        ...getRequestInfo(req, 'ModelController.softDelete'),
      })

      const { modelId } = findModelByIdSchema.parse(req.params)
      const result = await this.modelService.softDelete(modelId)

      new SuccessResponse({
        message: 'Model deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  restore = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Restoring model', {
        ...getRequestInfo(req, 'ModelController.restore'),
      })

      const { modelId } = findModelByIdSchema.parse(req.params)
      const result = await this.modelService.restore(modelId)

      new SuccessResponse({
        message: 'Model restored successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  exportExcel = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Exporting models', {
        ...getRequestInfo(req, 'ModelController.exportExcel'),
      })

      const workbook = await this.excelService.buildExportWorkbook()

      res.setHeader('Content-Type', EXCEL_MIME)
      res.setHeader('Content-Disposition', `attachment; filename="${MODELS_EXPORT_FILENAME}"`)

      await workbook.xlsx.write(res)
      res.end()
    })(req, res, next)
  }

  downloadImportTemplate = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Downloading model import template', {
        ...getRequestInfo(req, 'ModelController.downloadImportTemplate'),
      })

      const workbook = await this.excelService.buildTemplateWorkbook()

      res.setHeader('Content-Type', EXCEL_MIME)
      res.setHeader('Content-Disposition', 'attachment; filename="models-import-template.xlsx"')

      await workbook.xlsx.write(res)
      res.end()
    })(req, res, next)
  }

  triggerExport = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Triggering export', {
        ...getRequestInfo(req, 'ModelController.triggerExport'),
      })

      const userId = req.user?.id
      if (!userId) {
        throw createOperationalError('Unauthorized', HTTP_RESPONSE_CODE.UNAUTHORIZED)
      }

      // Create a pending job
      const job = await import('@/core/infra/prisma').then(m => m.default.productExportJob.create({
        data: {
          requestedBy: userId,
          snapshotAt: new Date(),
          status: 'pending',
        }
      }))

      // Push to Redis Stream
      const redis = await import('@/core/infra/ioredis/redis-bootstrap').then(m => m.getBootstrapRedis())
      if (redis) {
        const client = redis.getClient()
        await client.xadd('product:export:jobs', '*', 'jobId', job.id)
      } else {
        logger.warn('Redis not available, export job will be picked up by reconciliation task')
      }

      new SuccessResponse({
        message: 'Export job queued successfully',
        status: 202,
        metadata: job,
      }).send(res)
    })(req, res, next)
  }

  listExports = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      const userId = req.user?.id
      if (!userId) {
        throw createOperationalError('Unauthorized', HTTP_RESPONSE_CODE.UNAUTHORIZED)
      }

      const jobs = await import('@/core/infra/prisma').then(m => m.default.productExportJob.findMany({
        where: { requestedBy: userId },
        orderBy: { createdAt: 'desc' },
        take: 50, // Keep it to latest 50 for MVP
      }))

      new SuccessResponse({
        message: 'Export jobs retrieved',
        metadata: jobs,
      }).send(res)
    })(req, res, next)
  }

  getExport = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      const { id } = req.params
      const job = await import('@/core/infra/prisma').then(m => m.default.productExportJob.findUnique({
        where: { id: id as string },
      }))

      if (!job) {
        throw createOperationalError('Job not found', HTTP_RESPONSE_CODE.NOT_FOUND)
      }

      // Prevent HTTP 304 caching so polling always receives fresh status
      res.set('Cache-Control', 'no-store')

      new SuccessResponse({
        message: 'Export job retrieved',
        metadata: job,
      }).send(res)
    })(req, res, next)
  }

  cancelExport = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      const id = req.params.id as string
      const userId = req.user?.id

      if (!userId) {
        throw createOperationalError('Unauthorized', HTTP_RESPONSE_CODE.UNAUTHORIZED)
      }

      const prisma = (await import('@/core/infra/prisma')).default
      const job = await prisma.productExportJob.findUnique({
        where: { id },
      })

      if (!job) {
        throw createOperationalError('Job not found', HTTP_RESPONSE_CODE.NOT_FOUND)
      }
      if (job.requestedBy !== userId) {
        throw createOperationalError('Forbidden', HTTP_RESPONSE_CODE.FORBIDDEN)
      }

      if (job.status === 'completed' || job.status === 'failed') {
        throw createOperationalError('Cannot cancel a finished job', HTTP_RESPONSE_CODE.BAD_REQUEST)
      }

      const updatedJob = await prisma.productExportJob.update({
        where: { id },
        data: { status: 'cancelled' },
      })

      new SuccessResponse({
        message: 'Export job cancelled',
        metadata: updatedJob,
      }).send(res)
    })(req, res, next)
  }

  importExcel = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Importing models', {
        ...getRequestInfo(req, 'ModelController.importExcel'),
      })

      const file = req.file
      if (!file?.buffer) {
        throw createOperationalError('Missing file', HTTP_RESPONSE_CODE.BAD_REQUEST)
      }

      const result = await this.excelService.importExcel(file.buffer)

      new SuccessResponse({
        message: 'Import completed',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}
