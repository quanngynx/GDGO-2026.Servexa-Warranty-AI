import { Router, type IRouter } from 'express'

import ascCenterRouteV1 from './asc-center.route'
import ascStocktakeRoute from './asc-stocktake.route'
import paymentRoute from './payment.route'
import repairCaseRoute from './repair-case.route'

const ascCenterRoute: IRouter = Router()

ascCenterRoute.use('/repair-cases', repairCaseRoute)
ascCenterRoute.use('/payments', paymentRoute)
ascCenterRoute.use('/asc-stocktakes', ascStocktakeRoute)
ascCenterRoute.use('/', ascCenterRouteV1)

export default ascCenterRoute
