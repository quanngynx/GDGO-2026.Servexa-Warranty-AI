import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { IAccessoryService } from '../interfaces/accessory-service.interface'
import { AccessoryService } from '../services/accessory.service'
import {
  createAccessorySchema,
  createAscAccessoryStockSchema,
  createTotalWarehouseStockSchema,
  findAccessoriesFromAscCenterSchema,
  findAccessoriesFromTotalWarehouseSchema,
  findAccessoryByIdSchema,
  findAccessoryStockByAscCenterSchema,
  findAccessoryStockByTotalWarehouseSchema,
  findAllAccessoriesSchema,
  findAllAccessoryStocksSchema,
  replaceAccessorySchema,
  replaceAscAccessoryStockSchema,
  replaceTotalWarehouseStockSchema,
  updateAccessorySchema,
  updateAscAccessoryStockSchema,
  updateTotalWarehouseStockSchema,
} from '../validations'

export class AccessoryController {
  errorHandler: ErrorHandler

  constructor(private readonly accessoryService: IAccessoryService = new AccessoryService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching accessories', {
        ...getRequestInfo(req, 'AccessoryController.findAll'),
      })

      const query = findAllAccessoriesSchema.parse(req.query)
      const result = await this.accessoryService.findAll(query)

      new SuccessResponse({
        message: 'Total warehouse accessories fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findAllFromTotalWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching accessories from total warehouse', {
        ...getRequestInfo(req, 'AccessoryController.findAllFromTotalWarehouse'),
      })

      const params = findAccessoriesFromTotalWarehouseSchema.parse(req.params)
      const query = findAllAccessoryStocksSchema.parse(req.query)
      const result = await this.accessoryService.findAllFromTotalWarehouse({ ...params, ...query })

      new SuccessResponse({
        message: 'ASC center accessories fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  createFromTotalWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating accessory stock from total warehouse', {
        ...getRequestInfo(req, 'AccessoryController.createFromTotalWarehouse'),
      })

      const params = findAccessoriesFromTotalWarehouseSchema.parse(req.params)
      const body = createTotalWarehouseStockSchema.parse(req.body)
      const result = await this.accessoryService.createFromTotalWarehouse(params, body)

      new SuccessResponse({
        message: 'Total warehouse stock created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replaceFromTotalWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing accessory stock from total warehouse', {
        ...getRequestInfo(req, 'AccessoryController.replaceFromTotalWarehouse'),
      })

      const params = findAccessoryStockByTotalWarehouseSchema.parse(req.params)
      const body = replaceTotalWarehouseStockSchema.parse(req.body)
      const result = await this.accessoryService.replaceFromTotalWarehouse(params, body)

      new SuccessResponse({
        message: 'Total warehouse stock replaced successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  updateFromTotalWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating accessory stock from total warehouse', {
        ...getRequestInfo(req, 'AccessoryController.updateFromTotalWarehouse'),
      })

      const params = findAccessoryStockByTotalWarehouseSchema.parse(req.params)
      const body = updateTotalWarehouseStockSchema.parse(req.body)
      const result = await this.accessoryService.updateFromTotalWarehouse(params, body)

      new SuccessResponse({
        message: 'Total warehouse stock updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  deleteFromTotalWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting accessory stock from total warehouse', {
        ...getRequestInfo(req, 'AccessoryController.deleteFromTotalWarehouse'),
      })

      const params = findAccessoryStockByTotalWarehouseSchema.parse(req.params)
      const result = await this.accessoryService.deleteFromTotalWarehouse(params)

      new SuccessResponse({
        message: 'Total warehouse stock deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  createFromAscCenter = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating accessory stock from ASC center', {
        ...getRequestInfo(req, 'AccessoryController.createFromAscCenter'),
      })

      const params = findAccessoriesFromAscCenterSchema.parse(req.params)
      const body = createAscAccessoryStockSchema.parse(req.body)
      const result = await this.accessoryService.createFromAscCenter(params, body)

      new SuccessResponse({
        message: 'ASC center stock created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replaceFromAscCenter = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing accessory stock from ASC center', {
        ...getRequestInfo(req, 'AccessoryController.replaceFromAscCenter'),
      })

      const params = findAccessoryStockByAscCenterSchema.parse(req.params)
      const body = replaceAscAccessoryStockSchema.parse(req.body)
      const result = await this.accessoryService.replaceFromAscCenter(params, body)

      new SuccessResponse({
        message: 'ASC center stock replaced successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  updateFromAscCenter = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating accessory stock from ASC center', {
        ...getRequestInfo(req, 'AccessoryController.updateFromAscCenter'),
      })

      const params = findAccessoryStockByAscCenterSchema.parse(req.params)
      const body = updateAscAccessoryStockSchema.parse(req.body)
      const result = await this.accessoryService.updateFromAscCenter(params, body)

      new SuccessResponse({
        message: 'ASC center stock updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  deleteFromAscCenter = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting accessory stock from ASC center', {
        ...getRequestInfo(req, 'AccessoryController.deleteFromAscCenter'),
      })

      const params = findAccessoryStockByAscCenterSchema.parse(req.params)
      const result = await this.accessoryService.deleteFromAscCenter(params)

      new SuccessResponse({
        message: 'ASC center stock deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findAllFromAscCenter = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching accessories from ASC center', {
        ...getRequestInfo(req, 'AccessoryController.findAllFromAscCenter'),
      })

      const params = findAccessoriesFromAscCenterSchema.parse(req.params)
      const query = findAllAccessoryStocksSchema.parse(req.query)
      const result = await this.accessoryService.findAllFromAscCenter({ ...params, ...query })

      new SuccessResponse({
        message: 'Accessories fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching accessory', {
        ...getRequestInfo(req, 'AccessoryController.findOneById'),
      })

      const { accessoryId } = findAccessoryByIdSchema.parse(req.params)
      const result = await this.accessoryService.findOneById(accessoryId)

      new SuccessResponse({
        message: 'Accessory fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating accessory', {
        ...getRequestInfo(req, 'AccessoryController.create'),
      })

      const body = createAccessorySchema.parse(req.body)
      const result = await this.accessoryService.create(body)

      new SuccessResponse({
        message: 'Accessory created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing accessory', {
        ...getRequestInfo(req, 'AccessoryController.replace'),
      })

      const { accessoryId } = findAccessoryByIdSchema.parse(req.params)
      const body = replaceAccessorySchema.parse(req.body)
      const result = await this.accessoryService.update(accessoryId, body)

      new SuccessResponse({
        message: 'Accessory replaced successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating accessory', {
        ...getRequestInfo(req, 'AccessoryController.update'),
      })

      const { accessoryId } = findAccessoryByIdSchema.parse(req.params)
      const body = updateAccessorySchema.parse(req.body)
      const result = await this.accessoryService.update(accessoryId, body)

      new SuccessResponse({
        message: 'Accessory updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting accessory', {
        ...getRequestInfo(req, 'AccessoryController.delete'),
      })

      const { accessoryId } = findAccessoryByIdSchema.parse(req.params)
      const result = await this.accessoryService.delete(accessoryId)

      new SuccessResponse({
        message: 'Accessory deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}
