import { Router, type IRouter } from 'express'

import accessoryRequestRouteV1 from './accessory-request.route'
import accessoryRetailVoucherRouteV1 from './accessory-retail-voucher.route'
import accessorySupplyVoucherRouteV1 from './accessory-supply-voucher.route'
import ascCenterRouteV1 from './asc-center.route'
import ascStocktakeRouteV1 from './asc-stocktake.route'
import paymentRouteV1 from './payment.route'
import repairCaseRouteV1 from './repair-case.route'

const ascCenterRoute: IRouter = Router()

ascCenterRoute.use('/accessory-requests', accessoryRequestRouteV1)
ascCenterRoute.use('/accessory-retail-vouchers', accessoryRetailVoucherRouteV1)
ascCenterRoute.use('/accessory-supply-vouchers', accessorySupplyVoucherRouteV1)
ascCenterRoute.use('/asc-centers', ascCenterRouteV1)
ascCenterRoute.use('/asc-stocktakes', ascStocktakeRouteV1)
ascCenterRoute.use('/payments', paymentRouteV1)
ascCenterRoute.use('/repair-cases', repairCaseRouteV1)

export default ascCenterRoute
