import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware } from '@/middlewares'

import { EmployeeController } from '../controllers/employee.controller'
import { EmployeeRepository } from '../repositories/employee.repository'
import { EmployeeService } from '../services/employee.service'

const employeeRoute: IRouter = Router()

const employeeRepository = new EmployeeRepository()
const employeeService = new EmployeeService(employeeRepository)
const employeeController = new EmployeeController(employeeService)

employeeRoute.use(authenticateMiddleware)

employeeRoute.get('/', employeeController.findAll)
employeeRoute.get('/:employeeId', employeeController.findOneById)
employeeRoute.post('/', employeeController.create)
employeeRoute.put('/:employeeId', employeeController.replace)
employeeRoute.patch('/:employeeId', employeeController.update)
employeeRoute.patch('/:employeeId/link-user', employeeController.linkUser)
employeeRoute.delete('/:employeeId', employeeController.delete)

export default employeeRoute
