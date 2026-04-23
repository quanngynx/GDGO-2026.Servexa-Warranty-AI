import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { ICustomerService } from '../interfaces/customer-service.interface'
import { CustomerService } from '../services/customer.service'
import {
  createCustomerSchema,
  findAllCustomersSchema,
  findCustomerByIdSchema,
  replaceCustomerSchema,
  updateCustomerSchema,
} from '../validations'

export class CustomerController {
  errorHandler: ErrorHandler

  constructor(private readonly customerService: ICustomerService = new CustomerService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching customers', {
        ...getRequestInfo(req, 'CustomerController.findAll'),
      })
      const query = findAllCustomersSchema.parse(req.query)
      const result = await this.customerService.findAll(query)
      new SuccessResponse({ message: 'Customers fetched successfully', metadata: result }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching customer', {
        ...getRequestInfo(req, 'CustomerController.findOneById'),
      })
      const { customerId } = findCustomerByIdSchema.parse(req.params)
      const result = await this.customerService.findOneById(customerId)
      new SuccessResponse({ message: 'Customer fetched successfully', metadata: result }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating customer', {
        ...getRequestInfo(req, 'CustomerController.create'),
      })
      const body = createCustomerSchema.parse(req.body)
      const result = await this.customerService.create(body)
      new SuccessResponse({ message: 'Customer created successfully', status: 201, metadata: result }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing customer', {
        ...getRequestInfo(req, 'CustomerController.replace'),
      })
      const { customerId } = findCustomerByIdSchema.parse(req.params)
      const body = replaceCustomerSchema.parse(req.body)
      const result = await this.customerService.update(customerId, body)
      new SuccessResponse({ message: 'Customer updated successfully', metadata: result }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating customer', {
        ...getRequestInfo(req, 'CustomerController.update'),
      })
      const { customerId } = findCustomerByIdSchema.parse(req.params)
      const body = updateCustomerSchema.parse(req.body)
      const result = await this.customerService.update(customerId, body)
      new SuccessResponse({ message: 'Customer updated successfully', metadata: result }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting customer', {
        ...getRequestInfo(req, 'CustomerController.delete'),
      })
      const { customerId } = findCustomerByIdSchema.parse(req.params)
      const result = await this.customerService.delete(customerId)
      new SuccessResponse({ message: 'Customer deleted successfully', metadata: result }).send(res)
    })(req, res, next)
  }
}
