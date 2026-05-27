import { Router, type IRouter } from 'express'
import multer from 'multer'

// import { Roles } from '@/enums/roles'
import { authenticateMiddleware } from '@/middlewares'

import { ModelController } from '../controllers/model.controller'
import { CategoryRepository } from '../repositories/category.repository'
import { ModelRepository } from '../repositories/model.repository'
import { ModelExcelService } from '../services/model-excel.service'
import { ModelService } from '../services/model.service'

const upload = multer({ storage: multer.memoryStorage() })
const modelRoute: IRouter = Router()

const categoryRepository = new CategoryRepository()
const modelRepository = new ModelRepository()
const modelService = new ModelService(modelRepository, categoryRepository)
const modelExcelService = new ModelExcelService(modelRepository, categoryRepository)
const modelController = new ModelController(modelService, modelExcelService)

modelRoute.use(authenticateMiddleware)

/**
 * Get all models
 * @route GET /v1/product-catalog/models
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.get('/', modelController.findAll)
/**
 * Export models
 * @route GET /v1/product-catalog/models/export
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.get('/export', modelController.exportExcel)
/**
 * Get a model by ID
 * @route GET /v1/product-catalog/models/:modelId
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.get('/:modelId', modelController.findOneById)
/**
 * Import models
 * @route POST /v1/product-catalog/models/import
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.post('/import', upload.single('file'), modelController.importExcel)
/**
 * Create a model
 * @route POST /v1/product-catalog/models
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.post('/', modelController.create)
/**
 * Replace a model
 * @route PUT /v1/product-catalog/models/:modelId
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.put('/:modelId', modelController.replace)
/**
 * Update a model
 * @route PATCH /v1/product-catalog/models/:modelId
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.patch('/:modelId', modelController.update)
/**
 * Delete a model
 * @route DELETE /v1/product-catalog/models/:modelId
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.delete('/:modelId', modelController.softDelete)

/**
 * Restore a model
 * @route PATCH /v1/product-catalog/models/:modelId/restore
 * @access Private
 * @returns {Promise<void>}
 */
modelRoute.patch('/:modelId/restore', modelController.restore)

export default modelRoute
