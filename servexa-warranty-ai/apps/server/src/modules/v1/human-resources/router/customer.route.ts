import { Router, type IRouter } from 'express'

// import { Roles } from '@/enums/roles'
import { authenticateMiddleware } from '@/middlewares'

import { CustomerController } from '../controllers/customer.controller'
import { CustomerRepository } from '../repositories/customer.repository'
import { CustomerService } from '../services/customer.service'

const customerRoute: IRouter = Router()

const customerRepository = new CustomerRepository()
const customerService = new CustomerService(customerRepository)
const customerController = new CustomerController(customerService)

customerRoute.use(authenticateMiddleware)

/**
 * Get all customers
 * @route GET /v1/human-resources/customers
 * @access Private
 * @returns {Promise<void>}
 */
customerRoute.get('/', customerController.findAll)
/**
 * Get a customer by ID
 * @route GET /v1/human-resources/customers/:customerId
 * @access Private
 * @returns {Promise<void>}
 */
customerRoute.get('/:customerId', customerController.findOneById)
/**
 * Create a customer
 * @route POST /v1/human-resources/customers
 * @access Private
 * @returns {Promise<void>}
 */
customerRoute.post('/', customerController.create)
/**
 * Replace a customer
 * @route PUT /v1/human-resources/customers/:customerId
 * @access Private
 * @returns {Promise<void>}
 */
customerRoute.put('/:customerId', customerController.replace)
/**
 * Update a customer
 * @route PATCH /v1/human-resources/customers/:customerId
 * @access Private
 * @returns {Promise<void>}
 */
customerRoute.patch('/:customerId', customerController.update)
/**
 * Delete a customer
 * @route DELETE /v1/human-resources/customers/:customerId
 * @access Private
 * @returns {Promise<void>}
 */
customerRoute.delete('/:customerId', customerController.delete)

export default customerRoute
