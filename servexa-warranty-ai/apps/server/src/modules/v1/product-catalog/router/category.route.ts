import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware, requireRoles } from '@/middlewares'

import { CategoryController } from '../controllers/category.controller'
import { CategoryRepository } from '../repositories/category.repository'
import { CategoryService } from '../services/category.service'

const categoryRoute: IRouter = Router()

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository)
const categoryController = new CategoryController(categoryService)

categoryRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]))

categoryRoute.get('/', categoryController.findAll)
categoryRoute.get('/:categoryId', categoryController.findOneById)
categoryRoute.post('/', categoryController.create)
categoryRoute.put('/:categoryId', categoryController.replace)
categoryRoute.patch('/:categoryId', categoryController.update)
categoryRoute.delete('/:categoryId', categoryController.delete)

export default categoryRoute
