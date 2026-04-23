import { Router, type IRouter } from 'express'

import categoryRoute from './category.route'
import modelRoute from './model.route'
import accessoryRoute from './accessory.route'

const routeProductCatalogV1: IRouter = Router()

routeProductCatalogV1.use('/categories', categoryRoute)
routeProductCatalogV1.use('/models', modelRoute)
routeProductCatalogV1.use('/accessories', accessoryRoute)

export default routeProductCatalogV1
