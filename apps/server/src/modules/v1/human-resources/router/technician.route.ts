import { Router, type IRouter } from 'express'

// import { Roles } from '@/enums/roles'
import { authenticateMiddleware } from '@/middlewares'

import { TechnicianController } from '../controllers/technician.controller'
import { TechnicianRepository } from '../repositories/technician.repository'
import { TechnicianService } from '../services/technician.service'

const technicianRoute: IRouter = Router()

const technicianRepository = new TechnicianRepository()
const technicianService = new TechnicianService(technicianRepository)
const technicianController = new TechnicianController(technicianService)

technicianRoute.use(authenticateMiddleware)

/**
 * Get all technicians
 * @route GET /v1/human-resources/technicians
 * @access Private
 * @returns {Promise<void>}
 */
technicianRoute.get('/', technicianController.findAll)
/**
 * Get a technician by ID
 * @route GET /v1/human-resources/technicians/:technicianProfileId
 * @access Private
 * @returns {Promise<void>}
 */
technicianRoute.get('/:technicianProfileId', technicianController.findOneById)
/**
 * Create a technician
 * @route POST /v1/human-resources/technicians
 * @access Private
 * @returns {Promise<void>}
 */
technicianRoute.post('/', technicianController.create)
/**
 * Replace a technician
 * @route PUT /v1/human-resources/technicians/:technicianProfileId
 * @access Private
 * @returns {Promise<void>}
 */
technicianRoute.put('/:technicianProfileId', technicianController.replace)
/**
 * Update a technician
 * @route PATCH /v1/human-resources/technicians/:technicianProfileId
 * @access Private
 * @returns {Promise<void>}
 */
technicianRoute.patch('/:technicianProfileId', technicianController.update)
/**
 * Delete a technician
 * @route DELETE /v1/human-resources/technicians/:technicianProfileId
 * @access Private
 * @returns {Promise<void>}
 */
technicianRoute.delete('/:technicianProfileId', technicianController.delete)

export default technicianRoute
