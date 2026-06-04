import { Router, type IRouter } from 'express'

import { authenticatedWithPermissions } from '@/middlewares/authz.middleware'

import { AccessoryController } from '../controllers/accessory.controller'
import { AccessoryRepository } from '../repositories/accessory.repository'
import { AccessoryService } from '../services/accessory.service'
import { catalogRead, catalogWrite } from '../use-cases/permission.uc'

const accessoryRoute: IRouter = Router()

const accessoryRepository = new AccessoryRepository()
const accessoryService = new AccessoryService(accessoryRepository)
const accessoryController = new AccessoryController(accessoryService)

accessoryRoute.use(...authenticatedWithPermissions)

accessoryRoute.get('/', catalogRead, accessoryController.findAll)
accessoryRoute.get('/total-warehouse/:totalWarehouseId/accessories', catalogRead, accessoryController.findAllFromTotalWarehouse)
accessoryRoute.get('/asc-center/:ascCenterId/accessories', catalogRead, accessoryController.findAllFromAscCenter)
accessoryRoute.get('/:accessoryId', catalogRead, accessoryController.findOneById)
accessoryRoute.post('/total-warehouse/:totalWarehouseId/accessories', catalogWrite, accessoryController.createFromTotalWarehouse)
accessoryRoute.post('/asc-center/:ascCenterId/accessories', catalogWrite, accessoryController.createFromAscCenter)
accessoryRoute.post('/', catalogWrite, accessoryController.create)
accessoryRoute.put('/total-warehouse/:totalWarehouseId/accessories/:accessoryId', catalogWrite, accessoryController.replaceFromTotalWarehouse)
accessoryRoute.put('/asc-center/:ascCenterId/accessories/:accessoryId', catalogWrite, accessoryController.replaceFromAscCenter)
accessoryRoute.put('/:accessoryId', catalogWrite, accessoryController.replace)
accessoryRoute.patch('/total-warehouse/:totalWarehouseId/accessories/:accessoryId', catalogWrite, accessoryController.updateFromTotalWarehouse)
accessoryRoute.patch('/asc-center/:ascCenterId/accessories/:accessoryId', catalogWrite, accessoryController.updateFromAscCenter)
accessoryRoute.patch('/:accessoryId', catalogWrite, accessoryController.update)
accessoryRoute.delete('/total-warehouse/:totalWarehouseId/accessories/:accessoryId', catalogWrite, accessoryController.deleteFromTotalWarehouse)
accessoryRoute.delete('/asc-center/:ascCenterId/accessories/:accessoryId', catalogWrite, accessoryController.deleteFromAscCenter)
accessoryRoute.delete('/:accessoryId', catalogWrite, accessoryController.delete)

export default accessoryRoute
