import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware, requireRoles } from '@/middlewares'

import { CustomerController } from '../controllers/customer.controller'
import { CustomerRepository } from '../repositories/customer.repository'
import { CustomerService } from '../services/customer.service'

const customerRoute: IRouter = Router()

const customerRepository = new CustomerRepository()
const customerService = new CustomerService(customerRepository)
const customerController = new CustomerController(customerService)

customerRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]))

customerRoute.get('/', customerController.findAll)
customerRoute.get('/:customerId', customerController.findOneById)
customerRoute.post('/', customerController.create)
customerRoute.put('/:customerId', customerController.replace)
customerRoute.patch('/:customerId', customerController.update)
customerRoute.delete('/:customerId', customerController.delete)

export default customerRoute
