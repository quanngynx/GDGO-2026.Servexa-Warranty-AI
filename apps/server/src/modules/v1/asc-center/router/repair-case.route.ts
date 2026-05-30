import { Router, type IRouter } from 'express'
import multer from 'multer'
import fs from 'fs'

import { authenticateMiddleware } from '@/middlewares/authenticate.middleware'

import { RepairCaseController } from '../controllers/repair-case.controller'

// Ensure upload directory exists
const uploadDir = 'uploads/repair-cases'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
const multerUpload = multer({ dest: uploadDir })

const router: IRouter = Router()
const controller = new RepairCaseController()

router.use(authenticateMiddleware)

// Static segments MUST go before /:id routes
/**
 * Export fixing
 * @route GET /v1/asc-center/repair-cases/exports/fixing
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/exports/fixing', controller.exportFixing)
/**
 * Export waiting parts
 * @route GET /v1/asc-center/repair-cases/exports/waiting-parts
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/exports/waiting-parts', controller.exportWaitingParts)
/**
 * Export exchange in progress
 * @route GET /v1/asc-center/repair-cases/exports/exchange-in-progress
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/exports/exchange-in-progress', controller.exportExchangeInProgress)
/**
 * Export repeated huyphieu
 * @route GET /v1/asc-center/repair-cases/exports/repeated-huyphieu
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/exports/repeated-huyphieu', controller.exportRepeatedHuyphieu)

router.get('/waiting-accessories', controller.findWaitingAccessories)
/**
 * Get all repair cases
 * @route GET /v1/asc-center/repair-cases
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/', controller.findAll)

/**
 * Create a repair case
 * @route POST /v1/asc-center/repair-cases
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/', controller.create)

// /:id segments
/**
 * Get a repair case by ID
 * @route GET /v1/asc-center/repair-cases/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/:id', controller.findOneById)

/**
 * Get status history for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/status-history
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/:id/status-history', controller.findStatusHistory)
/**
 * Get field history for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/field-history
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/:id/field-history', controller.findFieldHistory)
/**
 * Get accessory requests for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/accessory-requests
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/:id/accessory-requests', controller.findAccessoryRequests)
/**
 * Get images for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/images
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/:id/images', controller.findImages)
/**
 * Download an image for a repair case
 * @route GET /v1/asc-center/repair-cases/:id/images/:imageId/download
 * @access Private
 * @returns {Promise<void>}
 */
router.get('/:id/images/:imageId/download', controller.downloadImage)

/**
 * Grant accessories to a repair case
 * @route POST /v1/asc-center/repair-cases/:id/accessories
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/:id/accessories', controller.grantAccessories)
/**
 * Add images to a repair case
 * @route POST /v1/asc-center/repair-cases/:id/images
 * @access Private
 * @returns {Promise<void>}
 */
router.post('/:id/images', multerUpload.array('files', 10), controller.addImages)

/**
 * Replace a repair case
 * @route PUT /v1/asc-center/repair-cases/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.put('/:id', controller.replace)

/**
 * Update a repair case
 * @route PATCH /v1/asc-center/repair-cases/:id
 * @access Private
 * @returns {Promise<void>}
 */
router.patch('/:id', controller.update)

/**
 * Revoke an accessory from a repair case
 * @route DELETE /v1/asc-center/repair-cases/:id/accessories/:accessoryRowId
 * @access Private
 * @returns {Promise<void>}
 */
router.delete('/:id/accessories/:accessoryRowId', controller.revokeAccessory)

/**
 * Delete an image from a repair case
 * @route DELETE /v1/asc-center/repair-cases/:id/images/:imageId
 * @access Private
 * @returns {Promise<void>}
 */
router.delete('/:id/images/:imageId', controller.deleteImage)

export default router
