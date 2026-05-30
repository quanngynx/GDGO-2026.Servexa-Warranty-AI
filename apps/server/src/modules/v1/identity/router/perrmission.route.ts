import { Router, type IRouter } from 'express'

import { authenticateMiddleware } from '@/middlewares'

import permissionController from '../controllers/permission.controller'
import permissionCatalogController from '../controllers/permission-catalog.controller'

const permissionRoute: IRouter = Router()

permissionRoute.use(authenticateMiddleware)

/**
 * Check permission
 * @route POST /v1/identity/permissions/check
 * @access Private
 * @returns {Promise<void>}
 */
permissionRoute.post('/check', permissionController.checkPermission)
/**
 * Get all permission catalogs
 * @route GET /v1/identity/permissions
 * @access Private
 * @returns {Promise<void>}
 */
permissionRoute.get('/', permissionCatalogController.findAll)
/**
 * Get a permission catalog by ID
 * @route GET /v1/identity/permissions/:permissionId
 * @access Private
 * @returns {Promise<void>}
 */
permissionRoute.get('/:permissionId', permissionCatalogController.findOneById)
/**
 * Create a permission catalog
 * @route POST /v1/identity/permissions
 * @access Private
 * @returns {Promise<void>}
 */
permissionRoute.post('/', permissionCatalogController.create)
/**
 * Update a permission catalog
 * @route PATCH /v1/identity/permissions/:permissionId
 * @access Private
 * @returns {Promise<void>}
 */
permissionRoute.patch('/:permissionId', permissionCatalogController.update)
/**
 * Delete a permission catalog
 * @route DELETE /v1/identity/permissions/:permissionId
 * @access Private
 * @returns {Promise<void>}
 */
permissionRoute.delete('/:permissionId', permissionCatalogController.delete)

export default permissionRoute
