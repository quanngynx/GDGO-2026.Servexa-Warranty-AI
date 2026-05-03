import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware } from '@/middlewares'

import { TechnicianController } from '../controllers/technician.controller'
import { TechnicianRepository } from '../repositories/technician.repository'
import { TechnicianService } from '../services/technician.service'

const technicianRoute: IRouter = Router()

const technicianRepository = new TechnicianRepository()
const technicianService = new TechnicianService(technicianRepository)
const technicianController = new TechnicianController(technicianService)

technicianRoute.use(authenticateMiddleware)

technicianRoute.get('/', technicianController.findAll)
technicianRoute.get('/:technicianProfileId', technicianController.findOneById)
technicianRoute.post('/', technicianController.create)
technicianRoute.put('/:technicianProfileId', technicianController.replace)
technicianRoute.patch('/:technicianProfileId', technicianController.update)
technicianRoute.delete('/:technicianProfileId', technicianController.delete)

export default technicianRoute
