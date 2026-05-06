import { Router, type IRouter } from 'express'

import { authenticateMiddleware} from '@/middlewares'
import { Roles } from '@/enums/roles'

import roleController from '../controllers/role.controller'

const roleRoute: IRouter = Router()

roleRoute.use(authenticateMiddleware)

roleRoute.get('/', roleController.findAllRoles)
roleRoute.get('/tree', roleController.getRoleTree)
roleRoute.get('/:roleId', roleController.findOneById)
roleRoute.get('/parent/:roleId', roleController.findParentsByRoleId)
roleRoute.get('/children/:roleId', roleController.findChildrenByRoleId)
roleRoute.post('/', roleController.createRole)
roleRoute.post('/:roleId/parent/:parentRoleId', roleController.addParentToRole)
roleRoute.delete('/:roleId/parent/:parentRoleId', roleController.deleteParentFromRole)

export default roleRoute
