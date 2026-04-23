import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware, requireRoles } from '@/middlewares'

import { TotalWarehouseController } from '../controllers/total-warehouse.controller'
import { TotalWarehouseRepository } from '../repositories/total-warehouse.repository'
import { TotalWarehouseService } from '../services/total-warehouse.service'

const totalWarehouseRoute: IRouter = Router()

const totalWarehouseRepository = new TotalWarehouseRepository()
const totalWarehouseService = new TotalWarehouseService(totalWarehouseRepository)
const totalWarehouseController = new TotalWarehouseController(totalWarehouseService)

totalWarehouseRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]))

totalWarehouseRoute.get('/', totalWarehouseController.findAll)
totalWarehouseRoute.get('/:totalWarehouseId', totalWarehouseController.findOneById)
totalWarehouseRoute.post('/', totalWarehouseController.create)
totalWarehouseRoute.put('/:totalWarehouseId', totalWarehouseController.replace)
totalWarehouseRoute.patch('/:totalWarehouseId', totalWarehouseController.update)
totalWarehouseRoute.delete('/:totalWarehouseId', totalWarehouseController.delete)

export default totalWarehouseRoute
