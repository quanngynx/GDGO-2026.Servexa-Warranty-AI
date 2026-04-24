import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware, requireRoles } from '@/middlewares'

import { PurchaseLocationGroupController } from '../controllers/purchase-location-group.controller'
import { PurchaseLocationGroupRepository } from '../repositories/purchase-location-group.repository'
import { PurchaseLocationGroupService } from '../services/purchase-location-group.service'

const purchaseLocationGroupRoute: IRouter = Router()

const purchaseLocationGroupRepository = new PurchaseLocationGroupRepository()
const purchaseLocationGroupService = new PurchaseLocationGroupService(purchaseLocationGroupRepository)
const purchaseLocationGroupController = new PurchaseLocationGroupController(purchaseLocationGroupService)

purchaseLocationGroupRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]))

purchaseLocationGroupRoute.get('/', purchaseLocationGroupController.findAll)
purchaseLocationGroupRoute.get('/:groupId', purchaseLocationGroupController.findOneById)
purchaseLocationGroupRoute.post('/', purchaseLocationGroupController.create)
purchaseLocationGroupRoute.put('/:groupId', purchaseLocationGroupController.replace)
purchaseLocationGroupRoute.patch('/:groupId', purchaseLocationGroupController.update)
purchaseLocationGroupRoute.delete('/:groupId', purchaseLocationGroupController.delete)

export default purchaseLocationGroupRoute
