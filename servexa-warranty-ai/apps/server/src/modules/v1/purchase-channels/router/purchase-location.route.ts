import { Router, type IRouter } from 'express'

import { authenticateMiddleware} from '@/middlewares'

import { PurchaseLocationController } from '../controllers/purchase-location.controller'
import { PurchaseLocationGroupRepository } from '../repositories/purchase-location-group.repository'
import { PurchaseLocationRepository } from '../repositories/purchase-location.repository'
import { PurchaseLocationService } from '../services/purchase-location.service'

const purchaseLocationRoute: IRouter = Router()

const purchaseLocationGroupRepository = new PurchaseLocationGroupRepository()
const purchaseLocationRepository = new PurchaseLocationRepository()
const purchaseLocationService = new PurchaseLocationService(purchaseLocationRepository, purchaseLocationGroupRepository)
const purchaseLocationController = new PurchaseLocationController(purchaseLocationService)

purchaseLocationRoute.use(authenticateMiddleware)

/**
 * Get all purchase locations
 * @route GET /v1/purchase-channels/purchase-locations
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationRoute.get('/', purchaseLocationController.findAll)
/**
 * Get a purchase location by ID
 * @route GET /v1/purchase-channels/purchase-locations/:locationId
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationRoute.get('/:locationId', purchaseLocationController.findOneById)
/**
 * Create a purchase location
 * @route POST /v1/purchase-channels/purchase-locations
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationRoute.post('/', purchaseLocationController.create)
/**
 * Replace a purchase location
 * @route PUT /v1/purchase-channels/purchase-locations/:locationId
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationRoute.put('/:locationId', purchaseLocationController.replace)
/**
 * Update a purchase location
 * @route PATCH /v1/purchase-channels/purchase-locations/:locationId
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationRoute.patch('/:locationId', purchaseLocationController.update)
/**
 * Delete a purchase location
 * @route DELETE /v1/purchase-channels/purchase-locations/:locationId
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationRoute.delete('/:locationId', purchaseLocationController.delete)

export default purchaseLocationRoute
