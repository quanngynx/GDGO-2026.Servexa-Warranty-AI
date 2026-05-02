import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware} from '@/middlewares'

import { AscCenterController } from '../controllers/asc-center.controller'
import { AscCenterRepository } from '../repositories/asc-center.repository'
import { AscCenterService } from '../services/asc-center.service'

const ascCenterRoute: IRouter = Router()

const ascCenterRepository = new AscCenterRepository()
const ascCenterService = new AscCenterService(ascCenterRepository)
const ascCenterController = new AscCenterController(ascCenterService)

ascCenterRoute.use(authenticateMiddleware)

ascCenterRoute.get('/', ascCenterController.findAll)
ascCenterRoute.get('/:ascCenterId', ascCenterController.findOneById)
ascCenterRoute.post('/', ascCenterController.create)
ascCenterRoute.put('/:ascCenterId', ascCenterController.replace)
ascCenterRoute.patch('/:ascCenterId', ascCenterController.update)
ascCenterRoute.delete('/:ascCenterId', ascCenterController.delete)

export default ascCenterRoute
