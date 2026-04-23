import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware, requireRoles } from '@/middlewares'

import { AccessoryController } from '../controllers/accessory.controller'
import { AccessoryRepository } from '../repositories/accessory.repository'
import { AccessoryService } from '../services/accessory.service'

const accessoryRoute: IRouter = Router()

const accessoryRepository = new AccessoryRepository()
const accessoryService = new AccessoryService(accessoryRepository)
const accessoryController = new AccessoryController(accessoryService)

accessoryRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]))

accessoryRoute.get('/', accessoryController.findAll)
accessoryRoute.get('/total-warehouse/:totalWarehouseId/accessories', accessoryController.findAllFromTotalWarehouse)
accessoryRoute.get('/asc-center/:ascCenterId/accessories', accessoryController.findAllFromAscCenter)
accessoryRoute.get('/:accessoryId', accessoryController.findOneById)

accessoryRoute.post('/total-warehouse/:totalWarehouseId/accessories', accessoryController.createFromTotalWarehouse)
accessoryRoute.post('/asc-center/:ascCenterId/accessories', accessoryController.createFromAscCenter)
accessoryRoute.post('/', accessoryController.create)

accessoryRoute.put(
  '/total-warehouse/:totalWarehouseId/accessories/:accessoryId',
  accessoryController.replaceFromTotalWarehouse,
)
accessoryRoute.put('/asc-center/:ascCenterId/accessories/:accessoryId', accessoryController.replaceFromAscCenter)
accessoryRoute.put('/:accessoryId', accessoryController.replace)

accessoryRoute.patch(
  '/total-warehouse/:totalWarehouseId/accessories/:accessoryId',
  accessoryController.updateFromTotalWarehouse,
)
accessoryRoute.patch('/asc-center/:ascCenterId/accessories/:accessoryId', accessoryController.updateFromAscCenter)
accessoryRoute.patch('/:accessoryId', accessoryController.update)

accessoryRoute.delete(
  '/total-warehouse/:totalWarehouseId/accessories/:accessoryId',
  accessoryController.deleteFromTotalWarehouse,
)
accessoryRoute.delete('/asc-center/:ascCenterId/accessories/:accessoryId', accessoryController.deleteFromAscCenter)
accessoryRoute.delete('/:accessoryId', accessoryController.delete)

export default accessoryRoute
