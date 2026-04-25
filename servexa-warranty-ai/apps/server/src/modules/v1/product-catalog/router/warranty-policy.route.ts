import { Router, type IRouter } from 'express'

import { Roles } from '@/enums/roles'
import { authenticateMiddleware, requireRoles } from '@/middlewares'

import { WarrantyPolicyController } from '../controllers/warranty-policy.controller'
import { CategoryRepository } from '../repositories/category.repository'
import { ModelRepository } from '../repositories/model.repository'
import { WarrantyPolicyRepository } from '../repositories/warranty-policy.repository'
import { WarrantyPolicyService } from '../services/warranty-policy.service'

const warrantyPolicyRoute: IRouter = Router()

const warrantyPolicyRepository = new WarrantyPolicyRepository()
const categoryRepository = new CategoryRepository()
const modelRepository = new ModelRepository()
const warrantyPolicyService = new WarrantyPolicyService(
  warrantyPolicyRepository,
  categoryRepository,
  modelRepository,
)
const warrantyPolicyController = new WarrantyPolicyController(warrantyPolicyService)

warrantyPolicyRoute.use(authenticateMiddleware, requireRoles([Roles.ADMIN]))

warrantyPolicyRoute.get('/', warrantyPolicyController.findAll)
warrantyPolicyRoute.post('/', warrantyPolicyController.create)

// /resolve must be registered before /:warrantyPolicyId to prevent it being captured as an ID parameter
warrantyPolicyRoute.get('/resolve', warrantyPolicyController.resolve)

warrantyPolicyRoute.get('/:warrantyPolicyId', warrantyPolicyController.findOneById)
warrantyPolicyRoute.put('/:warrantyPolicyId', warrantyPolicyController.replace)
warrantyPolicyRoute.patch('/:warrantyPolicyId', warrantyPolicyController.update)
warrantyPolicyRoute.delete('/:warrantyPolicyId', warrantyPolicyController.delete)

export default warrantyPolicyRoute
