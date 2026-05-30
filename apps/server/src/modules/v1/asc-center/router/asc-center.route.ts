import { Router, type IRouter } from 'express'

import { authenticateMiddleware} from '@/middlewares'

import { AscCenterController } from '../controllers/asc-center.controller'
import { AscCenterRepository } from '../repositories/asc-center.repository'
import { AscCenterService } from '../services/asc-center.service'

const ascCenterRoute: IRouter = Router()

const ascCenterRepository = new AscCenterRepository()
const ascCenterService = new AscCenterService(ascCenterRepository)
const ascCenterController = new AscCenterController(ascCenterService)

ascCenterRoute.use(authenticateMiddleware)

/**
 * Get all ASC centers
 * @route GET /v1/asc-center/asc-centers
 * @access Private
 * @returns {Promise<void>}
 */
ascCenterRoute.get('/', ascCenterController.findAll)
/**
 * Get an ASC center by ID
 * @route GET /v1/asc-center/asc-centers/:ascCenterId
 * @access Private
 * @returns {Promise<void>}
 */
ascCenterRoute.get('/:ascCenterId', ascCenterController.findOneById)
/**
 * Create an ASC center
 * @route POST /v1/asc-center/asc-centers
 * @access Private
 * @returns {Promise<void>}
 */
ascCenterRoute.post('/', ascCenterController.create)
/**
 * Replace an ASC center
 * @route PUT /v1/asc-center/asc-centers/:ascCenterId
 * @access Private
 * @returns {Promise<void>}
 */
ascCenterRoute.put('/:ascCenterId', ascCenterController.replace)
/**
 * Update an ASC center
 * @route PATCH /v1/asc-center/asc-centers/:ascCenterId
 * @access Private
 * @returns {Promise<void>}
 */
ascCenterRoute.patch('/:ascCenterId', ascCenterController.update)
/**
 * Delete an ASC center
 * @route DELETE /v1/asc-center/asc-centers/:ascCenterId
 * @access Private
 * @returns {Promise<void>}
 */
ascCenterRoute.delete('/:ascCenterId', ascCenterController.delete)

export default ascCenterRoute
