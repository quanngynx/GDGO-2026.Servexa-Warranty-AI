import { Router, type IRouter } from 'express'

import { RoutePermissions } from '@/core/constants/route-permissions'
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from '@/middlewares/authz.middleware'

import { AscCenterController } from '../controllers/asc-center.controller'
import { AscCenterRepository } from '../repositories/asc-center.repository'
import { AscCenterService } from '../services/asc-center.service'

const P = RoutePermissions.ascCenter
const read = requireRoutePermissions([P.read])
const write = requireRoutePermissions([P.write])

const ascCenterRoute: IRouter = Router()

const ascCenterRepository = new AscCenterRepository()
const ascCenterService = new AscCenterService(ascCenterRepository)
const ascCenterController = new AscCenterController(ascCenterService)

ascCenterRoute.use(...authenticatedWithPermissions)

ascCenterRoute.get('/', read, ascCenterController.findAll)
ascCenterRoute.get('/:ascCenterId', read, ascCenterController.findOneById)
ascCenterRoute.post('/', write, ascCenterController.create)
ascCenterRoute.put('/:ascCenterId', write, ascCenterController.replace)
ascCenterRoute.patch('/:ascCenterId', write, ascCenterController.update)
ascCenterRoute.delete('/:ascCenterId', write, ascCenterController.delete)

export default ascCenterRoute
