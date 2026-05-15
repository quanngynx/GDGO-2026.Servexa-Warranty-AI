import { Router, type IRouter } from 'express'

import { authenticateMiddleware} from '@/middlewares'

import { PurchaseLocationController } from '../controllers/purchase-location.controller'
import { PurchaseLocationGroupRepository } from '../repositories/purchase-location-group.repository'
import { PurchaseLocationRepository } from '../repositories/purchase-location.repository'
import { PurchaseLocationService } from '../services/purchase-location.service'

const purchaseLocationRoute: IRouter = Router()

const purchaseLocationGroupRepository = new PurchaseLocationGroupRepository()
const purchaseLocationRepository = new PurchaseLocationRepository()
const purchaseLocationService = new PurchaseLocationService(purchaseLocationRepository, purchaseLocationGroupRepository)
const purchaseLocationController = new PurchaseLocationController(purchaseLocationService)

purchaseLocationRoute.use(authenticateMiddleware)

purchaseLocationRoute.get('/', purchaseLocationController.findAll)
purchaseLocationRoute.get('/:locationId', purchaseLocationController.findOneById)
purchaseLocationRoute.post('/', purchaseLocationController.create)
purchaseLocationRoute.put('/:locationId', purchaseLocationController.replace)
purchaseLocationRoute.patch('/:locationId', purchaseLocationController.update)
purchaseLocationRoute.delete('/:locationId', purchaseLocationController.delete)

export default purchaseLocationRoute
