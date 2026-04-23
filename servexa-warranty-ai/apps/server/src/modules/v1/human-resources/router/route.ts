import { Router, type IRouter } from 'express'

import customerRoute from './customer.route'
import employeeRoute from './employee.route'
import technicianRoute from './technician.route'

const routeHumanResourcesV1: IRouter = Router()

routeHumanResourcesV1.use('/customers', customerRoute)
routeHumanResourcesV1.use('/employees', employeeRoute)
routeHumanResourcesV1.use('/technicians', technicianRoute)

export default routeHumanResourcesV1
