import { Router, type IRouter } from 'express'

// import { Roles } from '@/enums/roles'
import { authenticateMiddleware } from '@/middlewares'

import { EmployeeController } from '../controllers/employee.controller'
import { EmployeeRepository } from '../repositories/employee.repository'
import { EmployeeService } from '../services/employee.service'

const employeeRoute: IRouter = Router()

const employeeRepository = new EmployeeRepository()
const employeeService = new EmployeeService(employeeRepository)
const employeeController = new EmployeeController(employeeService)

employeeRoute.use(authenticateMiddleware)

/**
 * Get all employees
 * @route GET /v1/human-resources/employees
 * @access Private
 * @returns {Promise<void>}
 */
employeeRoute.get('/', employeeController.findAll)
/**
 * Get an employee by ID
 * @route GET /v1/human-resources/employees/:employeeId
 * @access Private
 * @returns {Promise<void>}
 */
employeeRoute.get('/:employeeId', employeeController.findOneById)
/**
 * Create an employee
 * @route POST /v1/human-resources/employees
 * @access Private
 * @returns {Promise<void>}
 */
employeeRoute.post('/', employeeController.create)
/**
 * Replace an employee
 * @route PUT /v1/human-resources/employees/:employeeId
 * @access Private
 * @returns {Promise<void>}
 */
employeeRoute.put('/:employeeId', employeeController.replace)
/**
 * Update an employee
 * @route PATCH /v1/human-resources/employees/:employeeId
 * @access Private
 * @returns {Promise<void>}
 */
employeeRoute.patch('/:employeeId', employeeController.update)
/**
 * Link an employee user
 * @route PATCH /v1/human-resources/employees/:employeeId/link-user
 * @access Private
 * @returns {Promise<void>}
 */
employeeRoute.patch('/:employeeId/link-user', employeeController.linkUser)
/**
 * Delete an employee
 * @route DELETE /v1/human-resources/employees/:employeeId
 * @access Private
 * @returns {Promise<void>}
 */
employeeRoute.delete('/:employeeId', employeeController.delete)

export default employeeRoute
