import { Router, type IRouter } from 'express'
import { AccessoryRequestController } from '../controllers/accessory-request.controller'
import { authenticateMiddleware } from '@/middlewares/authenticate.middleware'

const router: IRouter = Router()
const controller = new AccessoryRequestController()

router.use(authenticateMiddleware)

/**
 * Get all accessory requests
 * @route GET /v1/asc-center/accessory-requests
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/', controller.findAll)
/**
 * Get an accessory request by ID
 * @route GET /v1/asc-center/accessory-requests/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/:id', controller.findOneById)

/**
 * Create an accessory request
 * @route POST /v1/asc-center/accessory-requests
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/', controller.create)
/**
 * Add items to an accessory request
 * @route POST /v1/asc-center/accessory-requests/:id/items
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/:id/items', controller.addItem)
/**
 * Submit an accessory request
 * @route POST /v1/asc-center/accessory-requests/:id/submit
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/:id/submit', controller.submit)
/**
 * Approve an accessory request
 * @route POST /v1/asc-center/accessory-requests/:id/approve
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/:id/approve', controller.approve)
/**
 * Reject an accessory request
 * @route POST /v1/asc-center/accessory-requests/:id/reject
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/:id/reject', controller.reject)
/**
 * Recall an accessory request
 * @route POST /v1/asc-center/accessory-requests/:id/recall
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/:id/recall', controller.recall)

/**
 * Update an accessory request
 * @route PATCH /v1/asc-center/accessory-requests/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.patch('/:id', controller.update)
/**
 * Update an item in an accessory request
 * @route PATCH /v1/asc-center/accessory-requests/:id/items/:itemId
 * @access Private
 * @returns {Promise<void>}
 */
router.patch('/:id/items/:itemId', controller.updateItem)
/**
 * Delete an accessory request
 * @route DELETE /v1/asc-center/accessory-requests/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.delete('/:id', controller.delete)
/**
 * Delete an item in an accessory request
 * @route DELETE /v1/asc-center/accessory-requests/:id/items/:itemId
 * @access Private
 * @returns {Promise<void>}
 */
router.delete('/:id/items/:itemId', controller.removeItem)

export default router
