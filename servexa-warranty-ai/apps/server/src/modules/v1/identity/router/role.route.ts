import { Router, type IRouter } from 'express'

import { authenticateMiddleware} from '@/middlewares'

import roleController from '../controllers/role.controller'

const roleRoute: IRouter = Router()

roleRoute.use(authenticateMiddleware)

/**
 * Get all roles
 * @route GET /v1/identity/roles
 * @access Private
 * @returns {Promise<void>}
 */
roleRoute.get('/', roleController.findAllRoles)
/**
 * Get role tree
 * @route GET /v1/identity/roles/tree
 * @access Private
 * @returns {Promise<void>}
 */
roleRoute.get('/tree', roleController.getRoleTree)
/**
 * Get a role by ID
 * @route GET /v1/identity/roles/:roleId
 * @access Private
 * @returns {Promise<void>}
 */
roleRoute.get('/:roleId', roleController.findOneById)
/**
 * Get parents by role ID
 * @route GET /v1/identity/roles/parent/:roleId
 * @access Private
 * @returns {Promise<void>}
 */
roleRoute.get('/parent/:roleId', roleController.findParentsByRoleId)
/**
 * Get children by role ID
 * @route GET /v1/identity/roles/children/:roleId
 * @access Private
 * @returns {Promise<void>}
 */
roleRoute.get('/children/:roleId', roleController.findChildrenByRoleId)
/**
 * Create a role
 * @route POST /v1/identity/roles
 * @access Private
 * @returns {Promise<void>}
 */
roleRoute.post('/', roleController.createRole)
/**
 * Add parent to role
 * @route POST /v1/identity/roles/:roleId/parent/:parentRoleId
 * @access Private
 * @returns {Promise<void>}
 */
roleRoute.post('/:roleId/parent/:parentRoleId', roleController.addParentToRole)
/**
 * Delete parent from role
 * @route DELETE /v1/identity/roles/:roleId/parent/:parentRoleId
 * @access Private
 * @returns {Promise<void>}
 */
roleRoute.delete('/:roleId/parent/:parentRoleId', roleController.deleteParentFromRole)

export default roleRoute
