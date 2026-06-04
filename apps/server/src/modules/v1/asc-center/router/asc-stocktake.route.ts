import { Router, type IRouter } from 'express'

import { RoutePermissions } from '@/core/constants/route-permissions'
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from '@/middlewares/authz.middleware'
import { AscStocktakeController } from '../controllers/asc-stocktake.controller'

const P = RoutePermissions.stocktake
const read = requireRoutePermissions([P.read])
const write = requireRoutePermissions([P.write])

const router: IRouter = Router()
const controller = new AscStocktakeController()

router.use(...authenticatedWithPermissions)

router.get('/asc-centers/:ascCenterId/accessories', read, controller.findAccessoriesForStocktake)
router.get('/asc-centers/:ascCenterId/stock-levels', read, controller.findStockLevels)
router.get('/asc-centers/:ascCenterId', read, controller.findHistoryByCenter)
router.get('/:id', read, controller.findOneById)
router.post('/', write, controller.create)

export default router
