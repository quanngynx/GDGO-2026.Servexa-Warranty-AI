import type { NextFunction, Request, Response } from 'express'

import { ErrorHandler } from '@/core/helpers/error-handling.helper'
import { logger } from '@/core/logging/logging.config'
import { getRequestInfo } from '@/core/logging/logging.utils'
import { SuccessResponse } from '@/utils/success-response'

import type { ICategoryService } from '../interfaces/category-service.interface'
import { CategoryService } from '../services/category.service'
import {
  createCategorySchema,
  findAllCategoriesSchema,
  findCategoryByIdSchema,
  replaceCategorySchema,
  updateCategorySchema,
} from '../validations'

export class CategoryController {
  errorHandler: ErrorHandler

  constructor(private readonly categoryService: ICategoryService = new CategoryService()) {
    this.errorHandler = ErrorHandler.getInstance()
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching categories', {
        ...getRequestInfo(req, 'CategoryController.findAll'),
      })

      const query = findAllCategoriesSchema.parse(req.query)
      const result = await this.categoryService.findAll(query)

      new SuccessResponse({
        message: 'Categories fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching category', {
        ...getRequestInfo(req, 'CategoryController.findOneById'),
      })

      const { categoryId } = findCategoryByIdSchema.parse(req.params)
      const result = await this.categoryService.findOneById(categoryId)

      new SuccessResponse({
        message: 'Category fetched successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Creating category', {
        ...getRequestInfo(req, 'CategoryController.create'),
      })

      const body = createCategorySchema.parse(req.body)
      const result = await this.categoryService.create(body)

      new SuccessResponse({
        message: 'Category created successfully',
        status: 201,
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Replacing category', {
        ...getRequestInfo(req, 'CategoryController.replace'),
      })

      const { categoryId } = findCategoryByIdSchema.parse(req.params)
      const body = replaceCategorySchema.parse(req.body)
      const result = await this.categoryService.update(categoryId, body)

      new SuccessResponse({
        message: 'Category updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Updating category', {
        ...getRequestInfo(req, 'CategoryController.update'),
      })

      const { categoryId } = findCategoryByIdSchema.parse(req.params)
      const body = updateCategorySchema.parse(req.body)
      const result = await this.categoryService.update(categoryId, body)

      new SuccessResponse({
        message: 'Category updated successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Deleting category', {
        ...getRequestInfo(req, 'CategoryController.delete'),
      })

      const { categoryId } = findCategoryByIdSchema.parse(req.params)
      const result = await this.categoryService.delete(categoryId)

      new SuccessResponse({
        message: 'Category deleted successfully',
        metadata: result,
      }).send(res)
    })(req, res, next)
  }
}
