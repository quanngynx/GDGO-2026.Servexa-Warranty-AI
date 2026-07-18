import { Router, type IRouter, type Request, type Response, type NextFunction } from 'express'

import { authenticatedWithPermissions } from '@/middlewares/authz.middleware'
import { multerMemoryUpload } from '@/core/file-storage/multer'

import { AccessoryController } from '../controllers/accessory.controller'
import { AccessoryRepository } from '../repositories/accessory.repository'
import { AccessoryService } from '../services/accessory.service'
import { catalogRead, catalogWrite } from '../use-cases/permission.uc'

const accessoryRoute: IRouter = Router()

const accessoryRepository = new AccessoryRepository()
const accessoryService = new AccessoryService(accessoryRepository)
const accessoryController = new AccessoryController(accessoryService)

const uploadFields = multerMemoryUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 },
])

const uploadAccessoryImage = (req: Request, res: Response, next: NextFunction) => {
  uploadFields(req, res, (err) => {
    if (err) return next(err)
    if (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }
      req.file = files.image?.[0] || files.file?.[0]
    }
    next()
  })
}

accessoryRoute.use(...authenticatedWithPermissions)

/**
 * Get all accessories
 * @route GET /v1/product-catalog/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.get('/', catalogRead, accessoryController.findAll)
/**
 * Get all accessories from a total warehouse
 * @route GET /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.get('/total-warehouse/:totalWarehouseId/accessories', catalogRead, accessoryController.findAllFromTotalWarehouse)
/**
 * Get all accessories from an ASC center
 * @route GET /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.get('/asc-center/:ascCenterId/accessories', catalogRead, accessoryController.findAllFromAscCenter)
/**
 * Get an accessory by ID
 * @route GET /v1/product-catalog/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.get('/:accessoryId', catalogRead, accessoryController.findOneById)
/**
 * Create an accessory from a total warehouse
 * @route POST /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.post('/total-warehouse/:totalWarehouseId/accessories', catalogWrite, uploadAccessoryImage, accessoryController.createFromTotalWarehouse)
/**
 * Create an accessory from an ASC center
 * @route POST /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.post('/asc-center/:ascCenterId/accessories', catalogWrite, uploadAccessoryImage, accessoryController.createFromAscCenter)
/**
 * Create an accessory
 * @route POST /v1/product-catalog/accessories
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.post('/', catalogWrite, uploadAccessoryImage, accessoryController.create)
/**
 * Replace an accessory from a total warehouse
 * @route PUT /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.put('/total-warehouse/:totalWarehouseId/accessories/:accessoryId', catalogWrite, uploadAccessoryImage, accessoryController.replaceFromTotalWarehouse)
/**
 * Replace an accessory from an ASC center
 * @route PUT /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.put('/asc-center/:ascCenterId/accessories/:accessoryId', catalogWrite, uploadAccessoryImage, accessoryController.replaceFromAscCenter)
/**
 * Replace an accessory
 * @route PUT /v1/product-catalog/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.put('/:accessoryId', catalogWrite, uploadAccessoryImage, accessoryController.replace)
/**
 * Update an accessory from a total warehouse
 * @route PATCH /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.patch('/total-warehouse/:totalWarehouseId/accessories/:accessoryId', catalogWrite, uploadAccessoryImage, accessoryController.updateFromTotalWarehouse)
/**
 * Update an accessory from an ASC center
 * @route PATCH /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.patch('/asc-center/:ascCenterId/accessories/:accessoryId', catalogWrite, uploadAccessoryImage, accessoryController.updateFromAscCenter)
/**
 * Update an accessory
 * @route PATCH /v1/product-catalog/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.patch('/:accessoryId', catalogWrite, uploadAccessoryImage, accessoryController.update)
/**
 * Delete an accessory from a total warehouse
 * @route DELETE /v1/product-catalog/accessories/total-warehouse/:totalWarehouseId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.delete('/total-warehouse/:totalWarehouseId/accessories/:accessoryId', catalogWrite, accessoryController.deleteFromTotalWarehouse)
/**
 * Delete an accessory from an ASC center
 * @route DELETE /v1/product-catalog/accessories/asc-center/:ascCenterId/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.delete('/asc-center/:ascCenterId/accessories/:accessoryId', catalogWrite, accessoryController.deleteFromAscCenter)
/**
 * Delete an accessory
 * @route DELETE /v1/product-catalog/accessories/:accessoryId
 * @access Private
 * @returns {Promise<void>}
 */
accessoryRoute.delete('/:accessoryId', catalogWrite, accessoryController.delete)

export default accessoryRoute

