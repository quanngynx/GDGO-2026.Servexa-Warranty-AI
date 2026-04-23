import { Router, type IRouter } from 'express'

import categoryRoute from './category.route'
import modelRoute from './model.route'
import accessoryRoute from './accessory.route'
import totalWarehouseRoute from './total-warehouse.route'

const routeProductCatalogV1: IRouter = Router()

routeProductCatalogV1.use('/categories', categoryRoute)
routeProductCatalogV1.use('/models', modelRoute)
routeProductCatalogV1.use('/accessories', accessoryRoute)
routeProductCatalogV1.use('/total-warehouses', totalWarehouseRoute)

export default routeProductCatalogV1
