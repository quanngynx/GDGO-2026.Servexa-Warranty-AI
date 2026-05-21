import { Router, type IRouter } from 'express'

import { authenticateMiddleware} from '@/middlewares'

import { PurchaseLocationGroupController } from '../controllers/purchase-location-group.controller'
import { PurchaseLocationGroupRepository } from '../repositories/purchase-location-group.repository'
import { PurchaseLocationGroupService } from '../services/purchase-location-group.service'

const purchaseLocationGroupRoute: IRouter = Router()

const purchaseLocationGroupRepository = new PurchaseLocationGroupRepository()
const purchaseLocationGroupService = new PurchaseLocationGroupService(purchaseLocationGroupRepository)
const purchaseLocationGroupController = new PurchaseLocationGroupController(purchaseLocationGroupService)

purchaseLocationGroupRoute.use(authenticateMiddleware)

/**
 * Get all purchase location groups
 * @route GET /v1/purchase-channels/purchase-location-groups
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationGroupRoute.get('/', purchaseLocationGroupController.findAll)
/**
 * Get a purchase location group by ID
 * @route GET /v1/purchase-channels/purchase-location-groups/:groupId
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationGroupRoute.get('/:groupId', purchaseLocationGroupController.findOneById)
/**
 * Create a purchase location group
 * @route POST /v1/purchase-channels/purchase-location-groups
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationGroupRoute.post('/', purchaseLocationGroupController.create)
/**
 * Replace a purchase location group
 * @route PUT /v1/purchase-channels/purchase-location-groups/:groupId
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationGroupRoute.put('/:groupId', purchaseLocationGroupController.replace)
/**
 * Update a purchase location group
 * @route PATCH /v1/purchase-channels/purchase-location-groups/:groupId
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationGroupRoute.patch('/:groupId', purchaseLocationGroupController.update)
/**
 * Delete a purchase location group
 * @route DELETE /v1/purchase-channels/purchase-location-groups/:groupId
 * @access Private
 * @returns {Promise<void>}
 */
purchaseLocationGroupRoute.delete('/:groupId', purchaseLocationGroupController.delete)

export default purchaseLocationGroupRoute
