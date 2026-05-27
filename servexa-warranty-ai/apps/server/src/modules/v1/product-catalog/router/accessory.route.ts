import { Router, type IRouter } from 'express'

import { authenticateMiddleware } from '@/middlewares'

import { AccessoryController } from '../controllers/accessory.controller'
import { AccessoryRepository } from '../repositories/accessory.repository'
import { AccessoryService } from '../services/accessory.service'

const accessoryRoute: IRouter = Router()

const accessoryRepository = new AccessoryRepository()
const accessoryService = new AccessoryService(accessoryRepository)
const accessoryController = new AccessoryController(accessoryService)

accessoryRoute.use(authenticateMiddleware)

/**
 * Get all accessories
 * @route GET /v1/product-catalog/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.get('/', accessoryController.findAll)
/**
 * Get all accessories from total warehouse
 * @route GET /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.get('/', accessoryController.findAllFromTotalWarehouse)
/**
 * Get all accessories from ASC center
 * @route GET /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.get('/asc-center/:ascCenterId/accessories', accessoryController.findAllFromAscCenter)
/**
 * Get an accessory by ID
 * @route GET /v1/product-catalog/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.get('/:accessoryId', accessoryController.findOneById)
/**
 * Create an accessory from total warehouse
 * @route POST /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.post('/total-warehouse/:totalWarehouseId/accessories', accessoryController.createFromTotalWarehouse)
/**
 * Create an accessory from ASC center
 * @route POST /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.post('/asc-center/:ascCenterId/accessories', accessoryController.createFromAscCenter)
/**
 * Create an accessory
 * @route POST /v1/product-catalog/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.post('/', accessoryController.create)

/**
 * Replace an accessory from total warehouse
 * @route PUT /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.put(
  '/total-warehouse/:totalWarehouseId/accessories/:accessoryId',
  accessoryController.replaceFromTotalWarehouse,
)
/**
 * Replace an accessory from ASC center
 * @route PUT /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.put('/asc-center/:ascCenterId/accessories/:accessoryId', accessoryController.replaceFromAscCenter)
/**
 * Replace an accessory
 * @route PUT /v1/product-catalog/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.put('/:accessoryId', accessoryController.replace)

/**
 * Update an accessory from total warehouse
 * @route PATCH /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.patch(
  '/total-warehouse/:totalWarehouseId/accessories/:accessoryId',
  accessoryController.updateFromTotalWarehouse,
)
/**
 * Update an accessory from ASC center
 * @route PATCH /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.patch('/asc-center/:ascCenterId/accessories/:accessoryId', accessoryController.updateFromAscCenter)
/**
 * Update an accessory
 * @route PATCH /v1/product-catalog/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.patch('/:accessoryId', accessoryController.update)

/**
 * Delete an accessory from total warehouse
 * @route DELETE /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.delete(
  '/total-warehouse/:totalWarehouseId/accessories/:accessoryId',
  accessoryController.deleteFromTotalWarehouse,
)
/**
 * Delete an accessory from ASC center
 * @route DELETE /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.delete('/asc-center/:ascCenterId/accessories/:accessoryId', accessoryController.deleteFromAscCenter)
/**
 * Delete an accessory
 * @route DELETE /v1/product-catalog/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.delete('/:accessoryId', accessoryController.delete)

export default accessoryRoute
