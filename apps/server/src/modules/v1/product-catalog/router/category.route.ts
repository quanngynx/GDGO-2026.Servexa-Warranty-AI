import { Router, type IRouter } from 'express'

import { authenticateMiddleware } from '@/middlewares'

import { CategoryController } from '../controllers/category.controller'
import { CategoryRepository } from '../repositories/category.repository'
import { CategoryService } from '../services/category.service'

const categoryRoute: IRouter = Router()

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository)
const categoryController = new CategoryController(categoryService)

categoryRoute.use(authenticateMiddleware)

/**
 * Get all categories
 * @route GET /v1/product-catalog/categories
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.get('/', categoryController.findAll)
/**
 * Get a category by ID
 * @route GET /v1/product-catalog/categories/:categoryId
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.get('/:categoryId', categoryController.findOneById)
/**
 * Create a category
 * @route POST /v1/product-catalog/categories
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.post('/', categoryController.create)
/**
 * Replace a category
 * @route PUT /v1/product-catalog/categories/:categoryId
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.put('/:categoryId', categoryController.replace)
/**
 * Update a category
 * @route PATCH /v1/product-catalog/categories/:categoryId
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.patch('/:categoryId', categoryController.update)
/**
 * Delete a category
 * @route DELETE /v1/product-catalog/categories/:categoryId
 * @access Private
 * @returns {Promise<void>}
 */
categoryRoute.delete('/:categoryId', categoryController.delete)

export default categoryRoute
